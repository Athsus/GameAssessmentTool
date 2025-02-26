import React, { useState } from 'react';
import styles from './ImageUrlInput.module.css';
import { supabase } from '../supabaseClient';

interface ImageUrlInputProps {
  initialUrl: string;
  onSave: (url: string) => void;
  onCancel: () => void;
  sourceTable: string;
}

const ImageUrlInput: React.FC<ImageUrlInputProps> = ({ 
  initialUrl, 
  onSave, 
  onCancel,
  sourceTable 
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

  // List all available buckets for debugging
  const listBuckets = async () => {
    try {
      const { data, error } = await supabase.storage.listBuckets();
      if (error) {
        setDebugInfo(`Error listing buckets: ${error.message}`);
        return [];
      }
      
      const bucketNames = data.map(bucket => bucket.name);
      setDebugInfo(`Available buckets: ${bucketNames.join(', ')}`);
      return bucketNames;
    } catch (error) {
      setDebugInfo(`Exception listing buckets: ${error}`);
      return [];
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setDebugInfo('');
    
    try {
      // List available buckets first
      const buckets = await listBuckets();
      if (buckets.length === 0) {
        throw new Error('No storage buckets available');
      }
      
      // Use the first available bucket instead of hardcoding "bucket"
      const bucketName = buckets[0];
      
      // Determine the folder based on the source table
      let folder = 'images/KMA';
      if (sourceTable === 'sensory_recommendation') {
        folder = 'images/SFI';
      } else if (sourceTable === 'severe_impairment_alter') {
        folder = 'images/SIA';
      }
      
      setDebugInfo(prev => `${prev}\nUsing bucket: ${bucketName}, folder: ${folder}`);
      
      // Check if folder exists, create if not
      const { error: folderCheckError } = await supabase.storage
        .from(bucketName)
        .list(folder.split('/')[0]);
        
      if (folderCheckError) {
        setDebugInfo(prev => `${prev}\nError checking folder: ${folderCheckError.message}`);
      }
      
      // Get the file count to determine the new filename
      const { data: existingFiles, error: countError } = await supabase.storage
        .from(bucketName)
        .list(folder);
      
      if (countError) {
        setDebugInfo(prev => `${prev}\nError listing files: ${countError.message}`);
        // If we can't list files, we'll just use a timestamp as the filename
        const timestamp = new Date().getTime();
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `Picture_${timestamp}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;
        
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
        
        if (publicUrlData && publicUrlData.publicUrl) {
          onSave(publicUrlData.publicUrl);
        } else {
          throw new Error('Failed to get public URL for uploaded file');
        }
        
        return;
      }
      
      // Calculate the next file number
      const fileCount = existingFiles ? existingFiles.length + 1 : 1;
      setDebugInfo(prev => `${prev}\nExisting files count: ${fileCount}`);
      
      // Get file extension
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      
      // Create the filename
      const fileName = `Picture${fileCount}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;
      
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
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
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
              <div className={styles.underConstruction}>
                <p>🚧 File upload feature is currently under construction 🚧</p>
                <p>Please use the URL option instead.</p>
              </div>
              
              <label htmlFor="imageFile">Select Image File:</label>
              <input
                type="file"
                id="imageFile"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.fileInput}
                disabled
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