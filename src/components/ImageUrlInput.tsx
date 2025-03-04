import React, { useState } from 'react';
import styles from './ImageUrlInput.module.css';
import { supabase } from '../supabaseClient';

interface ImageUrlInputProps {
  initialUrl: string;
  onSave: (url: string) => void;
  onCancel: () => void;
  sourceTable: string;
  rowId: string;
}

const ImageUrlInput: React.FC<ImageUrlInputProps> = ({ 
  initialUrl, 
  onSave, 
  onCancel,
  sourceTable,
  rowId
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [activeTab, setActiveTab] = useState('url'); // 'url' or 'file'
  const [debugInfo, setDebugInfo] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'url') {
      onSave(url);
    } else if (file) {
      await handleFileUpload();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(selectedFile.type)) {
        setUploadError('Please select a valid image file (JPEG, PNG, GIF, WEBP)');
        return;
      }
      
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setUploadError('File size must be less than 5MB');
        return;
      }
      
      setFile(selectedFile);
      setUploadError('');
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setDebugInfo('');
    
    try {
      // Use hardcoded "images" bucket (plural form)
      const bucketName = 'images';
      
      setDebugInfo(`Using bucket: ${bucketName}`);
      
      // Get file extension
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      
      // Create a unique filename using timestamp to avoid collisions
      const timestamp = new Date().getTime();
      const fileName = `Picture_${timestamp}.${fileExt}`;
      
      // Upload directly to root of the bucket without subfolder
      const filePath = fileName;
      
      setDebugInfo(prev => `${prev}\nUploading to path: ${filePath}`);
      
      // Upload the file
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        throw error;
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      // Call onSave with the new URL
      if (publicUrlData && publicUrlData.publicUrl) {
        onSave(publicUrlData.publicUrl);
      } else {
        throw new Error('Failed to get public URL for uploaded file');
      }

      // Save the URL to the database
      if (sourceTable) {
        await saveImageUrlToDatabase(sourceTable, rowId, publicUrlData.publicUrl);
      }else{
        console.log('No database table provided');
      }

    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };


  const saveImageUrlToDatabase = async (tableName: string, rowId: string, imageUrl: string) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .update({ image_url: imageUrl })
        .eq('id', rowId);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error saving image URL:', error);
      return { success: false, error };
    }
  };

  const checkPermissions = async () => {
    setDebugInfo('Checking permissions...');
    
    try {
      // 1. Check authentication status
      const { data: { session } } = await supabase.auth.getSession();
      const authStatus = !!session ? 'Logged in' : 'Not logged in';
      
      // 2. Test storage permissions
      const { data, error } = await supabase.storage
        .from('images')
        .list('', { limit: 1 });
        
      const storageStatus = error ? 
        `Storage access failed: ${error.message}` : 
        `Storage access successful, found ${data.length} files`;
        
      setDebugInfo(`Auth status: ${authStatus}\nStorage status: ${storageStatus}`);
    } catch (error) {
      setDebugInfo(`Permission check failed: ${error}`);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Update Image</h3>
        
        <div className={styles.tabs}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'url' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('url')}
            type="button"
          >
            Enter URL
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'file' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('file')}
            type="button"
          >
            Upload File
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {activeTab === 'url' && (
            <div className={styles.formGroup}>
              <label htmlFor="imageUrl">Image URL:</label>
              <input
                type="text"
                id="imageUrl"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter image URL"
                className={styles.input}
              />
              
              {url && (
                <div className={styles.preview}>
                  <p>Preview:</p>
                  <img 
                    src={url} 
                    alt="Preview" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'placeholder-image.png';
                      (e.target as HTMLImageElement).classList.add(styles.errorImage);
                    }}
                  />
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'file' && (
            <div className={styles.formGroup}>
              <button 
                type="button" 
                onClick={checkPermissions}
                className={styles.checkPermissionButton}
              >
                Check Upload Permissions
              </button>
              
              <label htmlFor="imageFile">Select Image File:</label>
              <input
                type="file"
                id="imageFile"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
              
              {uploadError && (
                <div className={styles.errorMessage}>
                  {uploadError}
                </div>
              )}
              
              {isUploading && (
                <div className={styles.progressContainer}>
                  <div 
                    className={styles.progressBar} 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                  <span>{uploadProgress}%</span>
                </div>
              )}
              
              {file && !uploadError && (
                <div className={styles.preview}>
                  <p>Preview:</p>
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt="Preview" 
                    className={styles.previewImage}
                  />
                </div>
              )}
              
              {debugInfo && (
                <div className={styles.debugInfo}>
                  <pre>{debugInfo}</pre>
                </div>
              )}
            </div>
          )}
          
          <div className={styles.buttonGroup}>
            <button type="button" onClick={onCancel} className={styles.cancelButton}>
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.saveButton}
              disabled={isUploading || (activeTab === 'file' && !file)}
            >
              {isUploading ? 'Uploading...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImageUrlInput; 