import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import styles from './DatabaseManagement.module.css';

interface TableRow {
  id: string;
  [key: string]: any;
}

interface CategoryOption {
  id: string;
  code?: string;
  category: string;
  subcategory?: string;
}

interface ConfirmationModalProps {
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  isVisible: boolean;
}

// New interface for the add row modal
interface AddRowModalProps {
  isVisible: boolean;
  columns: string[];
  selectedTable: string;
  onSave: (rowData: Record<string, any>) => void;
  onCancel: () => void;
}

// Add Row Modal Component
const AddRowModal: React.FC<AddRowModalProps> = ({
  isVisible,
  columns,
  selectedTable,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [imageError, setImageError] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Check if this is a table that uses the simplified category selection
  const isSimplifiedCategoryTable = () => {
    return ['keyboard_recommendations', 'sensory_recommendations', 
            'physical_recommendations', 'severe_impairment_alter'].includes(selectedTable);
  };
  
  // Determine the category table based on the selected table
  const getCategoryTableName = () => {
    const tableMappings: Record<string, string> = {
      'keyboard_recommendations': 'keyboard_recommendations_categories',
      'physical_recommendations': 'physical_recommendations_categories',
      'sensory_recommendations': 'sensory_recommendations_categories',
      'severe_impairment_alter': 'severe_impairment_alter_categories',
      'adaptive_switches': 'adaptive_switches_categories',
      'adaptive_controllers': 'adaptive_controllers_categories'
    };
    
    return tableMappings[selectedTable] || '';
  };
  
  // Fetch category options when the selected table changes
  useEffect(() => {
    const fetchCategoryOptions = async () => {
      if (!selectedTable) return;
      
      const categoryTable = getCategoryTableName();
      if (!categoryTable) return;
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from(categoryTable)
          .select('*');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Ensure all objects have string IDs to avoid type comparison issues
          const processedData = data.map(item => ({
            ...item,
            id: String(item.id)
          }));
          
          console.log(`Loaded ${processedData.length} category options:`, processedData);
          setCategoryOptions(processedData as CategoryOption[]);
        } else {
          console.warn("No data returned from category table");
          setCategoryOptions([]);
        }
      } catch (err) {
        console.error('Error fetching category options:', err);
        setCategoryOptions([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategoryOptions();
  }, [selectedTable]);
  
  // Initialize form data when columns change
  useEffect(() => {
    if (columns.length > 0) {
      const initialData: Record<string, any> = {};
      columns.forEach(col => {
        initialData[col] = '';
      });
      setFormData(initialData);
      setSelectedCategoryId('');
    }
  }, [columns]);
  
  // Handle text input changes
  const handleInputChange = (column: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [column]: value
    }));
  };
  
  // Handle category selection with improved error handling
  const handleCategorySelectionChange = (categoryId: string) => {
    if (!categoryId) {
      setSelectedCategoryId('');
      setFormData(prev => ({
        ...prev,
        code: '',
        category: '',
        subcategory: ''
      }));
      return;
    }
    
    // Ensure categoryId is a string for consistent comparison
    const stringCategoryId = String(categoryId);
    setSelectedCategoryId(stringCategoryId);
    
    console.log(`Looking for category with ID: "${stringCategoryId}" in ${categoryOptions.length} options`);
    console.log("Available category IDs:", categoryOptions.map(opt => `"${opt.id}"`));
    
    // Find the selected category option with explicit string comparison
    const selectedOption = categoryOptions.find(opt => String(opt.id) === stringCategoryId);
    
    if (selectedOption) {
      console.log("Found selected option:", selectedOption);
      
      // Create explicit string values
      const code = selectedOption.code ? String(selectedOption.code) : '';
      const category = selectedOption.category ? String(selectedOption.category) : '';
      const subcategory = selectedOption.subcategory ? String(selectedOption.subcategory) : '';
      
      // Update the form data with a new object to ensure state update
      const newFormData = {
        ...formData,
        code,
        category,
        subcategory
      };
      
      console.log("Updating form data to:", newFormData);
      setFormData(newFormData);
    } else {
      console.error(`Category with ID "${stringCategoryId}" not found in options!`);
    }
  };
  
  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setImageFile(null);
      return;
    }
    
    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setImageError('Please select an image file');
      setImageFile(null);
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image must be less than 5MB');
      setImageFile(null);
      return;
    }
    
    setImageError('');
    setImageFile(file);
  };
  
  // Upload image to Supabase storage
  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload the file to Supabase storage
      const { error } = await supabase.storage
        .from('image')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('image')
        .getPublicUrl(filePath);
        
      setUploadProgress(100);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      setImageError('Failed to upload image. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle form submission with image upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Start with current form data
    let finalFormData = { ...formData };
    
    // If there's an image to upload, process it first
    if (imageFile) {
      setIsLoading(true);
      const imageUrl = await uploadImage();
      
      if (imageUrl) {
        // Add the image URL to form data
        finalFormData = {
          ...finalFormData,
          image_url: imageUrl
        };
      } else {
        // If upload failed, show error and stop submission
        setIsLoading(false);
        return;
      }
    }
    
    // Submit the form with the image URL included
    console.log("Submitting form data with image:", finalFormData);
    onSave(finalFormData);
  };
  
  // Function to handle image removal
  const handleRemoveImage = () => {
    setImageFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Determine if a field should be shown in the form
  const shouldShowField = (column: string) => {
    // For simplified category tables, hide code/category/subcategory fields as they're set automatically
    if (isSimplifiedCategoryTable() && 
        (column === 'code' || column === 'category' || column === 'subcategory')) {
      return false;
    }
    return true;
  };
  
  // Render category selector with added safeguards
  const renderCategorySelector = () => {
    if (!isSimplifiedCategoryTable() || categoryOptions.length === 0) {
      return (
        <div className={styles.formField}>
          <label>Category Selection</label>
          <div className={styles.noCategories}>
            {isLoading ? "Loading categories..." : "No category options available"}
          </div>
        </div>
      );
    }
    
    const selectedCategory = categoryOptions.find(opt => String(opt.id) === String(selectedCategoryId));
    
    return (
      <div className={styles.formField}>
        <label htmlFor="category-selector">Select Category:</label>
        <select
          id="category-selector"
          value={selectedCategoryId}
          onChange={(e) => handleCategorySelectionChange(e.target.value)}
          className={styles.formSelect}
          disabled={isLoading}
        >
          <option value="">-- Select a Category --</option>
          {categoryOptions.map(option => (
            <option key={option.id} value={option.id}>
              {option.code ? `${option.code} - ` : ''}
              {option.category}
              {option.subcategory ? ` (${option.subcategory})` : ''}
            </option>
          ))}
        </select>
        
        {selectedCategoryId && selectedCategory && (
          <div className={styles.selectedCategoryDisplay}>
            <div className={styles.categoryField}>
              <span className={styles.categoryLabel}>Code:</span>
              <span className={styles.categoryValue}>
                {selectedCategory.code || 'N/A'}
              </span>
            </div>
            <div className={styles.categoryField}>
              <span className={styles.categoryLabel}>Category:</span>
              <span className={styles.categoryValue}>
                {selectedCategory.category || 'N/A'}
              </span>
            </div>
            <div className={styles.categoryField}>
              <span className={styles.categoryLabel}>Subcategory:</span>
              <span className={styles.categoryValue}>
                {selectedCategory.subcategory || 'N/A'}
              </span>
            </div>
            
            <div className={styles.categoryField}>
              <span className={styles.categoryLabel}>Current Form Data:</span>
              <span className={styles.categoryValue}>
                code: {formData.code || 'empty'}, 
                category: {formData.category || 'empty'}, 
                subcategory: {formData.subcategory || 'empty'}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render image upload field
  const renderImageUploadField = () => {
    return (
      <div className={styles.formField}>
        <label htmlFor="image-upload">Product Image:</label>
        <div className={styles.imageUploadContainer}>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleImageSelect}
            className={styles.fileInput}
            ref={fileInputRef}
          />
          
          {imageFile && (
            <div className={styles.selectedImagePreview}>
              <img 
                src={URL.createObjectURL(imageFile)} 
                alt="Preview" 
                className={styles.imagePreview} 
              />
              <button 
                type="button" 
                onClick={handleRemoveImage}
                className={styles.removeImageButton}
              >
                Remove
              </button>
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
          
          {imageError && (
            <div className={styles.imageError}>
              {imageError}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render appropriate form field based on column type
  const renderFormField = (column: string) => {
    // Check if field should be visible
    if (!shouldShowField(column)) {
      return null;
    }
    
    // For switches/controllers tables, use specific dropdowns
    if (['adaptive_switches', 'adaptive_controllers'].includes(selectedTable)) {
      if (column === 'category') {
        // Render category dropdown for adaptive_switches/controllers
        const uniqueCategories = [...new Set(categoryOptions.map(opt => opt.category))];
        return (
          <div key={column} className={styles.formField}>
            <label htmlFor={`new-${column}`}>{column}:</label>
            <select
              id={`new-${column}`}
              value={formData[column] || ''}
              onChange={(e) => handleInputChange(column, e.target.value)}
              className={styles.formSelect}
              disabled={isLoading}
            >
              <option value="">-- Select {column} --</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        );
      }
    }
    
    // Use text input for other fields
    return (
      <div key={column} className={styles.formField}>
        <label htmlFor={`new-${column}`}>{column}:</label>
        <input
          id={`new-${column}`}
          type="text"
          value={formData[column] || ''}
          onChange={(e) => handleInputChange(column, e.target.value)}
          className={styles.formInput}
        />
      </div>
    );
  };
  
  if (!isVisible) return null;
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>Add New Row to {selectedTable}</h3>
        
        {isLoading && !isUploading ? (
          <div className={styles.formLoading}>
            <div className={styles.spinner}></div>
            <span>Loading options...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Render category selector for simplified tables */}
            {renderCategorySelector()}
            
            {/* Add image upload field */}
            {renderImageUploadField()}
            
            <div className={styles.formFields}>
              {columns.map(column => renderFormField(column))}
            </div>
            
            <div className={styles.modalActions}>
              <button 
                type="button"
                className={styles.cancelButton} 
                onClick={onCancel}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className={styles.confirmButton}
                disabled={isUploading || isLoading}
              >
                {isUploading ? 'Uploading...' : 'Add Row'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  isVisible 
}) => {
  if (!isVisible) return null;
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>{title}</h3>
        <div className={styles.modalMessage}>{message}</div>
        <div className={styles.modalActions}>
          <button 
            className={styles.cancelButton} 
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className={styles.confirmButton} 
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const DatabaseManagement: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [editedRows, setEditedRows] = useState<Record<string, TableRow>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error' | 'info'} | null>(null);
  
  // Add Row modal state
  const [isAddRowModalVisible, setIsAddRowModalVisible] = useState(false);
  
  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isVisible: boolean;
    title: string;
    message: React.ReactNode;
    onConfirm: () => void;
  }>({
    isVisible: false,
    title: '',
    message: null,
    onConfirm: () => {}
  });

  // List of available tables
  const availableTables = [
    { name: 'keyboard_recommendations', label: 'Keyboard Recommendations' },
    { name: 'physical_recommendations', label: 'Physical Recommendations' },
    { name: 'sensory_recommendations', label: 'Sensory Recommendations' },
    { name: 'severe_impairment_alter', label: 'Severe Impairment Alternatives' },
    { name: 'adaptive_switches', label: 'Adaptive Switches' },
    { name: 'adaptive_controllers', label: 'Adaptive Controllers' }
  ];

  // Fetch data when table selection changes
  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable);
    }
  }, [selectedTable]);

  // Fetch data from the selected table and sort appropriately
  const fetchTableData = async (tableName: string) => {
    setIsLoading(true);
    setMessage({ text: 'Loading data...', type: 'info' });
    
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*');
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Extract column names from the first row
        const columnNames = Object.keys(data[0]).filter(col => col !== 'id');
        setColumns(columnNames);
        
        // Sort data based on presence of code or category column
        let sortedData = [...data];
        if (columnNames.includes('code')) {
          // Sort by code if it exists
          sortedData.sort((a, b) => {
            // Handle numeric codes with possible decimal points (like 1.1, 1.2, etc.)
            const codeA = a.code ? a.code.toString() : '';
            const codeB = b.code ? b.code.toString() : '';
            
            // Split by dots for numeric comparison
            const partsA = codeA.split('.');
            const partsB = codeB.split('.');
            
            // Compare each part numerically
            for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
              const numA = i < partsA.length ? parseInt(partsA[i], 10) : 0;
              const numB = i < partsB.length ? parseInt(partsB[i], 10) : 0;
              
              if (numA !== numB) {
                return numA - numB;
              }
            }
            
            return 0;
          });
        } else if (columnNames.includes('category')) {
          // Sort by category if code doesn't exist
          sortedData.sort((a, b) => {
            const catA = a.category ? a.category.toString().toLowerCase() : '';
            const catB = b.category ? b.category.toString().toLowerCase() : '';
            return catA.localeCompare(catB);
          });
        }
        
        setTableData(sortedData);
        setMessage(null);
      } else {
        setTableData([]);
        setColumns([]);
        setMessage({ text: 'No data found in this table', type: 'info' });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ 
        text: `Error loading data: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        type: 'error' 
      });
      setTableData([]);
      setColumns([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle table selection change
  const handleTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTable(e.target.value);
    setSelectedRows(new Set());
    setEditedRows({});
    setMessage(null);
  };

  // Handle checkbox selection
  const handleRowSelection = (id: string) => {
    setSelectedRows(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
  };

  // Handle select all rows
  const handleSelectAll = () => {
    if (selectedRows.size === tableData.length) {
      // If all are selected, unselect all
      setSelectedRows(new Set());
    } else {
      // Otherwise, select all
      setSelectedRows(new Set(tableData.map(row => row.id)));
    }
  };

  // Handle cell edit
  const handleCellEdit = (rowId: string, column: string, value: any) => {
    const row = tableData.find(r => r.id === rowId);
    if (!row) return;

    // Create a copy of the edited row if it doesn't exist yet
    if (!editedRows[rowId]) {
      editedRows[rowId] = { ...row };
    }
    
    // Update the value
    editedRows[rowId][column] = value;
    setEditedRows({ ...editedRows });
    
    // Ensure the row is selected
    if (!selectedRows.has(rowId)) {
      handleRowSelection(rowId);
    }
  };

  // Close the confirmation modal
  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isVisible: false }));
  };
  
  // Show a confirmation modal
  const showConfirmModal = (title: string, message: React.ReactNode, onConfirm: () => void) => {
    setConfirmModal({
      isVisible: true,
      title,
      message,
      onConfirm
    });
  };

  // The actual save operation after confirmation
  const performSaveChanges = async () => {
    setIsLoading(true);
    setMessage({ text: 'Saving changes...', type: 'info' });
    closeConfirmModal();
    
    try {
      const updatePromises = Array.from(selectedRows).map(async (rowId) => {
        const rowData = editedRows[rowId] || tableData.find(r => r.id === rowId);
        if (!rowData) return null;
        
        // Only update if the row has been edited
        if (editedRows[rowId]) {
          const { error } = await supabase
            .from(selectedTable)
            .update(rowData)
            .eq('id', rowId);
            
          if (error) throw error;
          return rowId;
        }
        return null;
      });
      
      await Promise.all(updatePromises);
      
      setMessage({ text: 'Changes saved successfully', type: 'success' });
      
      // Clear edited rows and refresh data
      setEditedRows({});
      fetchTableData(selectedTable);
      
    } catch (error) {
      console.error('Error updating rows:', error);
      setMessage({ 
        text: `Error updating rows: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // The actual delete operation after confirmation
  const performDeleteSelected = async () => {
    setIsLoading(true);
    setMessage({ text: 'Deleting selected rows...', type: 'info' });
    closeConfirmModal();
    
    try {
      const { error } = await supabase
        .from(selectedTable)
        .delete()
        .in('id', Array.from(selectedRows));
        
      if (error) throw error;
      
      setMessage({ text: 'Selected rows deleted successfully', type: 'success' });
      
      // Refresh data after deletion
      fetchTableData(selectedTable);
      setSelectedRows(new Set());
      setEditedRows({});
      
    } catch (error) {
      console.error('Error deleting data:', error);
      setMessage({ 
        text: `Error deleting rows: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle save changes with confirmation
  const handleSaveChanges = () => {
    if (selectedRows.size === 0) {
      setMessage({ text: 'No rows selected for update', type: 'info' });
      return;
    }

    // Generate confirmation message showing changes
    const selectedRowsCount = selectedRows.size;
    
    const renderChangeSummary = () => {
      const changedRows = Object.entries(editedRows).filter(([id]) => selectedRows.has(id));
      
      return (
        <div className={styles.changeSummary}>
          <p>You are about to update {changedRows.length} row(s) in the <strong>{selectedTable}</strong> table.</p>
          
          {changedRows.length > 0 && (
            <div className={styles.changesList}>
              {changedRows.map(([id, rowData]) => {
                const originalRow = tableData.find(r => r.id === id);
                if (!originalRow) return null;
                
                const changedFields = Object.entries(rowData)
                  .filter(([key, value]) => originalRow[key] !== value && key !== 'id');
                
                return (
                  <div key={id} className={styles.changeItem}>
                    <div className={styles.changeItemHeader}>Row ID: {id}</div>
                    <div className={styles.changeItemFields}>
                      {changedFields.map(([field, newValue]) => (
                        <div key={field} className={styles.fieldChange}>
                          <span className={styles.fieldName}>{field}:</span>
                          <span className={styles.oldValue}>{originalRow[field]}</span>
                          <span className={styles.arrow}>→</span>
                          <span className={styles.newValue}>{newValue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {changedRows.length === 0 && selectedRowsCount > 0 && (
            <p className={styles.warning}>
              No changes detected in selected rows. Nothing will be updated.
            </p>
          )}
        </div>
      );
    };
    
    showConfirmModal(
      'Confirm Save Changes',
      renderChangeSummary(),
      performSaveChanges
    );
  };

  // Handle delete selected with confirmation
  const handleDeleteSelected = () => {
    if (selectedRows.size === 0) {
      setMessage({ text: 'No rows selected for deletion', type: 'info' });
      return;
    }

    const message = (
      <div>
        <p>Are you sure you want to delete {selectedRows.size} row(s) from the <strong>{selectedTable}</strong> table?</p>
        <p className={styles.warning}>This action cannot be undone!</p>
      </div>
    );
    
    showConfirmModal(
      'Confirm Deletion',
      message,
      performDeleteSelected
    );
  };

  // Render cell with edit capability
  const renderEditableCell = (row: TableRow, column: string) => {
    const value = editedRows[row.id]?.[column] ?? row[column];
    const isEdited = editedRows[row.id]?.[column] !== undefined && editedRows[row.id]?.[column] !== row[column];
    
    // Determine input type based on value type
    const inputType = typeof value === 'number' ? 'number' : 'text';
    
    return (
      <td key={column} className={isEdited ? styles.editedCell : ''}>
        <input
          type={inputType}
          value={value === null ? '' : value}
          onChange={(e) => handleCellEdit(
            row.id, 
            column, 
            inputType === 'number' ? Number(e.target.value) : e.target.value
          )}
          className={styles.cellInput}
        />
      </td>
    );
  };

  // Handle opening the add row modal
  const handleAddRow = () => {
    if (!selectedTable) {
      setMessage({ text: 'Please select a table first', type: 'info' });
      return;
    }
    
    setIsAddRowModalVisible(true);
  };
  
  // Actually save the new row to the database
  const saveNewRow = async (rowData: Record<string, any>) => {
    setIsLoading(true);
    setMessage({ text: 'Adding new row...', type: 'info' });
    setIsAddRowModalVisible(false);
    
    console.log("Original row data to save:", rowData);
    
    try {
      // Create a sanitized copy of the data to ensure no undefined/null values for critical fields
      const sanitizedData = { ...rowData };
      
      // Ensure code, category, subcategory are strings if present
      // This is critical for the simplified category tables
      if ('code' in sanitizedData) {
        sanitizedData.code = String(sanitizedData.code || '');
      }
      if ('category' in sanitizedData) {
        sanitizedData.category = String(sanitizedData.category || '');
      }
      if ('subcategory' in sanitizedData) {
        sanitizedData.subcategory = String(sanitizedData.subcategory || '');
      }
      
      console.log("Sanitized data being sent to database:", sanitizedData);
      
      const { data, error } = await supabase
        .from(selectedTable)
        .insert([sanitizedData])
        .select();
        
      if (error) throw error;
      
      console.log("Database response after insert:", data);
      setMessage({ text: 'New row added successfully', type: 'success' });
      
      // Refresh data
      fetchTableData(selectedTable);
      
    } catch (error) {
      console.error('Error adding row:', error);
      setMessage({ 
        text: `Error adding row: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/" className={styles.backButton}>
          ← Back to Home
        </Link>
        <h1>Database Management</h1>
      </div>
      
      <div className={styles.controls}>
        <div className={styles.tableSelector}>
          <label htmlFor="tableSelect">Select Table:</label>
          <select 
            id="tableSelect" 
            value={selectedTable} 
            onChange={handleTableChange}
            className={styles.select}
          >
            <option value="">-- Select a table --</option>
            {availableTables.map(table => (
              <option key={table.name} value={table.name}>
                {table.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.actionButtons}>
          <button 
            onClick={handleAddRow} 
            disabled={!selectedTable || isLoading}
            className={styles.addButton}
          >
            Add New Row
          </button>
          <button 
            onClick={handleSaveChanges} 
            disabled={selectedRows.size === 0 || isLoading}
            className={styles.saveButton}
          >
            Save Selected Changes
          </button>
          <button 
            onClick={handleDeleteSelected} 
            disabled={selectedRows.size === 0 || isLoading}
            className={styles.deleteButton}
          >
            Delete Selected
          </button>
        </div>
      </div>
      
      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}
      
      {selectedTable && !isLoading && tableData.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th className={styles.checkboxHeader}>
                  <input 
                    type="checkbox" 
                    checked={selectedRows.size === tableData.length && tableData.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>ID</th>
                {columns.map(column => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map(row => (
                <tr 
                  key={row.id} 
                  className={selectedRows.has(row.id) ? styles.selectedRow : ''}
                >
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedRows.has(row.id)}
                      onChange={() => handleRowSelection(row.id)}
                    />
                  </td>
                  <td>{row.id}</td>
                  {columns.map(column => renderEditableCell(row, column))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {isLoading && (
        <div className={styles.loadingIndicator}>
          <div className={styles.spinner}></div>
          <span>Loading...</span>
        </div>
      )}
      
      {selectedTable && !isLoading && tableData.length === 0 && !message && (
        <div className={styles.emptyState}>
          No data available in this table. Click "Add New Row" to add data.
        </div>
      )}
      
      {/* Add Row Modal */}
      <AddRowModal
        isVisible={isAddRowModalVisible}
        columns={columns}
        selectedTable={selectedTable}
        onSave={saveNewRow}
        onCancel={() => setIsAddRowModalVisible(false)}
      />
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isVisible: false }))}
        isVisible={confirmModal.isVisible}
      />
    </div>
  );
};

export default DatabaseManagement; 