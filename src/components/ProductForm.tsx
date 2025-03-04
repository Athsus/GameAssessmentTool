import React, { useState } from 'react';
import styles from './ProductForm.module.css';
import { supabase } from '../supabaseClient';

// 定义表单字段接口
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  readOnly?: boolean; // 添加只读属性
  defaultValue?: string; // 添加默认值属性
}

// 定义表单配置接口
export interface FormConfig {
  tableName: string;
  title: string;
  fields: FormField[];
  initialValues?: Record<string, any>;
  // 添加一个函数来获取特定代码的预设值
  getPresetValues?: (code: string) => Record<string, any>;
}

interface ProductFormProps {
  config: FormConfig;
  code?: string; // 可选的代码参数，用于预填充
  onSuccess: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  config, 
  code, 
  onSuccess, 
  onCancel 
}) => {
  // 获取预设值
  const presetValues = code && config.getPresetValues 
    ? config.getPresetValues(code) 
    : {};
  
  // 初始化表单数据，合并预设值
  const initialFormData = {
    ...config.initialValues,
    ...presetValues,
    ...(code ? { code } : {})
  };

  const [formData, setFormData] = useState<Record<string, any>>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 处理输入变化
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 验证必填字段
      const requiredFields = config.fields.filter(field => field.required);
      for (const field of requiredFields) {
        if (!formData[field.name]) {
          throw new Error(`${field.label} is required`);
        }
      }

      // 提交到 Supabase
      const { error } = await supabase
        .from(config.tableName)
        .insert([formData]);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h3>{config.title}</h3>
          <button 
            className={styles.closeButton} 
            onClick={onCancel}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {success ? (
          <div className={styles.successMessage}>
            Product added successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {config.fields.map(field => (
              <div key={field.name} className={styles.formGroup}>
                <label htmlFor={field.name}>
                  {field.label}
                  {field.required && <span className={styles.required}>*</span>}
                  {field.readOnly && <span className={styles.readOnly}>(Preset)</span>}
                </label>
                
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className={styles.textarea}
                    required={field.required}
                    readOnly={field.readOnly}
                  />
                ) : field.type === 'select' ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    className={styles.select}
                    required={field.required}
                    disabled={field.readOnly}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className={`${styles.input} ${field.readOnly ? styles.readOnly : ''}`}
                    required={field.required}
                    readOnly={field.readOnly}
                  />
                )}
              </div>
            ))}

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.formActions}>
              <button 
                type="button" 
                className={styles.cancelButton} 
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductForm; 