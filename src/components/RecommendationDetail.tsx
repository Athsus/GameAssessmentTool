import React, { useState, useEffect } from 'react';
import styles from './RecommendationDetail.module.css';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../supabaseClient';
import ImageUrlInput from './ImageUrlInput';
import ProductForm from './ProductForm';
import { getFormConfigByCode } from '../services/formConfigs';

export interface RecommendationProduct {
  id: string;
  code: string;
  name: string;
  description: string | null;
  price_range?: string;
  website: string;
  image_url: string | null;
  category?: string;
  subcategory?: string;
}

// 为了兼容旧的接口
export interface Recommendation {
  id: string;
  code: string;
  category: string;
  subcategory: string;
  product: string;
  website: string;
  description: string | null;
  image_url: string | null;
}

interface RecommendationDetailProps {
  recommendations?: Recommendation[];
  onClose: (() => void) | ((code: string) => void);
  activeCodes?: Set<string>;
}

const RecommendationDetail: React.FC<RecommendationDetailProps> = ({
  recommendations = [],
  onClose,
  activeCodes = new Set(),
}) => {
  const { items, addItem, removeItem } = useCart();
  const [showImageUrlInput, setShowImageUrlInput] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [recommendationsState, setRecommendations] = useState(recommendations);
  // 存储每个代码的展开/折叠状态
  const [expandedCodes, setExpandedCodes] = useState<Record<string, boolean>>({});
  const [showAddForm, setShowAddForm] = useState<string | null>(null);

  // 使用 useEffect 监听 recommendations 属性的变化
  useEffect(() => {
    setRecommendations(recommendations);
    
    // 更新展开状态，确保新的代码也被展开
    const initialExpandState: Record<string, boolean> = { ...expandedCodes };
    recommendations.forEach(rec => {
      if (initialExpandState[rec.code] === undefined) {
        initialExpandState[rec.code] = true; // 默认展开新的代码
      }
    });
    setExpandedCodes(initialExpandState);
  }, [recommendations]);

  // 检查项目是否已被选中
  const isItemSelected = (id: string) => {
    return items.some(item => item.id === id);
  };

  // 处理图片URL更新
  const handleUpdateImageUrl = async (id: string, tableName: string, newUrl: string) => {
    if (!newUrl.trim()) {
      setUpdateMessage('Please enter a valid URL');
      return;
    }

    setIsUpdating(true);
    
    try {
      // 确定要更新的表名
      const table = tableName || 'keyboard_recommendations';
      
      const { error } = await supabase
        .from(table)
        .update({ image_url: newUrl })
        .eq('id', id);
        
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      setUpdateMessage('Image URL updated successfully!');
      
      // 更新本地状态，这样用户不需要刷新页面就能看到更新
      const updatedRecommendations = recommendationsState.map(rec => {
        if (rec.id === id) {
          return { ...rec, image_url: newUrl };
        }
        return rec;
      });
      
      // 如果有onRecommendationsUpdate函数，调用它
      if (window.location.pathname.includes('keyboard-assessment')) {
        // 通知KeyboardAssessment组件更新
        const event = new CustomEvent('recommendationsUpdated', { 
          detail: { recommendations: updatedRecommendations } 
        });
        window.dispatchEvent(event);
      }
      
      // 更新本地状态
      setRecommendations(updatedRecommendations);
      
      // 3秒后关闭消息
      setTimeout(() => {
        setUpdateMessage('');
      }, 3000);

      // 关闭输入框
      setShowImageUrlInput(null);
      
    } catch (error) {
      console.error('Error updating image URL:', error);
      setUpdateMessage('Failed to update image URL');
    } finally {
      setIsUpdating(false);
    }
  };

  // 处理项目选择/取消选择
  const handleItemToggle = (item: Recommendation) => {
    // 如果正在编辑图片URL，不要切换选择状态
    if (showImageUrlInput === item.id) {
      return;
    }
    
    if (isItemSelected(item.id)) {
      removeItem(item.id);
    } else {
      addItem({
        id: item.id,
        code: item.code,
        product: item.product,
        description: item.description,
        website: item.website,
        image_url: item.image_url
      });
    }
  };

  // 切换收缩状态
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // 切换特定代码的展开/折叠状态
  const toggleCodeExpand = (code: string) => {
    setExpandedCodes(prev => ({
      ...prev,
      [code]: !prev[code]
    }));
  };

  // 按代码分组推荐
  const groupedRecommendations = recommendationsState.reduce((groups, rec) => {
    if (!groups[rec.code]) {
      groups[rec.code] = [];
    }
    groups[rec.code].push(rec);
    return groups;
  }, {} as Record<string, Recommendation[]>);

  // 获取代码对应的用户友好标题
  const getCodeTitle = (code: string, recs: Recommendation[]): string => {
    // First check if we have a stored label for this code
    const labelMap = JSON.parse(sessionStorage.getItem('checkboxLabels') || '{}');
    if (labelMap[code]) {
      return labelMap[code];
    }
    
    // 从KeyboardAssessment组件中获取代码映射
    const codeToTitleMap: Record<string, string> = {
      '1.1': 'Ergonomic Keyboards',
      '1.2': 'Split Keyboards',
      '1.3': 'Gaming Keyboards',
      '1.4': 'Compact Keyboards',
      '1.5': 'Ergonomic Mouse',
      '1.6': 'Gaming Mouse',
      '2.1': 'Alternative Input Devices',
      '2.2': 'Key Guard/Mouse Guard',
      '2.3': 'Trackball Mouse',
      '3.1': 'Low-Force Keyboards',
      '3.2': 'Low-Force Mouse',
      '4.1': 'Large-Key Keyboards',
      '4.2': 'Braille Keyboards',
      '5.1': 'Head/Mouth Stick Keyboard',
      '5.2': 'Wearable Keyboards',
      '5.3': 'Head Mouse',
      '6.3': 'Eye-Tracking Mouse',
      // 从SensoryAssessment组件中获取代码映射
      '1.1.1': 'Text',
      '1.1.2': 'Colour',
      '1.1.3': 'Magnifier',
      '1.1.4': 'Night Mode',
      '1.1.5': 'Narrator',
      '1.1.6': 'Copilot',
      '1.1.7': 'Haptic Feedback',
      '1.1.8': 'Audio-Driven Gameplay',
      '1.1.9': 'Text-to-Speech',
      '1.2.1': 'Colour-blind Modes',
      '1.2.2': 'High Contrast',
      '3.3.1': 'Pressure Sensitivity Button',
      '3.3.2': 'Designed Lab',
      '2.1.2': 'Low-Force Buttons',
      'AS-1': 'Adaptive Switches'
    };

    // Then try the predefined mappings
    if (codeToTitleMap[code]) {
      return codeToTitleMap[code];
    }
    
    // 如果映射中没有，尝试从推荐中获取类别或子类别
    if (recs.length > 0) {
      if (recs[0].subcategory) return recs[0].subcategory;
      if (recs[0].category) return recs[0].category;
    }
    
    // 最后的后备选项是代码本身
    return `Code ${code}`;
  };

  // 首先，在组件内部添加一个函数来处理空列表的情况
  const handleEmptyCodeGroup = (code: string) => {
    // 从 sessionStorage 获取标签
    const labelMap = JSON.parse(sessionStorage.getItem('checkboxLabels') || '{}');
    const title = labelMap[code] || `Code ${code}`;
    
    return (
      <div key={code} className={styles.codeGroup}>
        <div className={styles.codeHeader}>
          <div 
            className={styles.codeTitle}
            onClick={() => toggleCodeExpand(code)}
          >
            <h4>{title}</h4>
            <span>{expandedCodes[code] ? '▲' : '▼'}</span>
          </div>
          <div className={styles.codeActions}>
            <button 
              className={styles.addItemButton}
              onClick={() => handleAddItem(code)}
              aria-label="Add new item"
            >
              +
            </button>
            <button 
              className={styles.removeCodeButton}
              onClick={() => {
                if (typeof onClose === 'function') {
                  onClose(code);
                }
              }}
              aria-label="Remove this group"
            >
              ✕
            </button>
          </div>
        </div>
        
        {expandedCodes[code] && (
          <div className={styles.emptyCodeMessage}>
            No items available. Click the + button to add a new item.
          </div>
        )}
      </div>
    );
  };

  // 添加处理添加新项目的函数
  const handleAddItem = (code: string) => {
    setShowAddForm(code);
  };

  // 处理表单成功提交
  const handleFormSuccess = () => {
    // 关闭表单
    setShowAddForm(null);
    
    // 触发事件通知父组件刷新数据
    const event = new CustomEvent('recommendationsUpdated', { 
      detail: { refreshData: true } 
    });
    window.dispatchEvent(event);
  };

  // 获取所有活跃的代码，包括没有项目的代码
  const allActiveCodes = new Set([
    ...Object.keys(groupedRecommendations),
    ...Array.from(activeCodes)
  ]);

  return (
    <div className={`${styles.detailContainer} ${isCollapsed ? styles.collapsed : ''}`}>
      {/* 收缩按钮 */}
      <button 
        className={styles.collapseButton}
        onClick={toggleCollapse}
      >
        {isCollapsed ? '>' : '<'}
      </button>
      
      {/* 展开状态下显示的内容 */}
      <div className={styles.detailContent}>
        <div className={styles.header}>
          <h3>Products & Resources</h3>
        </div>
        
        {/* 渲染所有代码组 */}
        {Array.from(allActiveCodes).map(code => {
          const recs = groupedRecommendations[code] || [];
          
          if (recs.length === 0) {
            return handleEmptyCodeGroup(code);
          }
          
          return (
            <div key={code} className={styles.codeGroup}>
              <div className={styles.codeHeader}>
                <div 
                  className={styles.codeTitle}
                  onClick={() => toggleCodeExpand(code)}
                >
                  <h4>{getCodeTitle(code, recs)}</h4>
                  <span>{expandedCodes[code] ? '▲' : '▼'}</span>
                </div>
                <div className={styles.codeActions}>
                  <button 
                    className={styles.addItemButton}
                    onClick={() => handleAddItem(code)}
                    aria-label="Add new item"
                  >
                    +
                  </button>
                  <button 
                    className={styles.removeCodeButton}
                    onClick={() => {
                      if (typeof onClose === 'function') {
                        onClose(code);
                      }
                    }}
                    aria-label="Remove this group"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              {expandedCodes[code] && (
                <div className={styles.codeRecommendations}>
                  {recs.map((rec) => (
                    <div 
                      key={rec.id} 
                      className={`${styles.recommendationItem} ${isItemSelected(rec.id) ? styles.selected : ''}`}
                      onClick={() => handleItemToggle(rec)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={styles.imageContainer}>
                        {rec.image_url ? (
                          <img src={rec.image_url} alt={rec.product} />
                        ) : (
                          <div className={styles.noImage}>No Image</div>
                        )}
                        <button 
                          className={styles.editImageButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowImageUrlInput(rec.id);
                            setImageUrl(rec.image_url || '');
                          }}
                        >
                          {rec.image_url ? '✏️' : '+'}
                        </button>
                      </div>
                      <div className={styles.content}>
                        <h4>{rec.product}</h4>
                        {rec.description && (
                          <p className={styles.description}>{rec.description}</p>
                        )}
                        {rec.website && (
                          <a 
                            href={rec.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={styles.link}
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Details
                          </a>
                        )}
                        <div className={styles.selectionStatus}>
                          {isItemSelected(rec.id) ? 'Selected ✓' : 'Click to select'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        
        {/* Render the ImageUrlInput outside of the item loop to prevent event bubbling issues */}
        {showImageUrlInput && (
          <ImageUrlInput
            initialUrl={imageUrl}
            onSave={(newUrl) => {
              const rec = recommendationsState.find(r => r.id === showImageUrlInput);
              if (rec) {
                const tableName = rec.code.startsWith('6.3') ? 'severe_impairment_alter' : 'keyboard_recommendations';
                handleUpdateImageUrl(rec.id, tableName, newUrl);
              }
            }}
            onCancel={() => {
              setShowImageUrlInput(null);
            }}
            sourceTable={recommendationsState.find(r => r.id === showImageUrlInput)?.code.startsWith('6.3') 
              ? 'severe_impairment_alter' 
              : recommendationsState.find(r => r.id === showImageUrlInput)?.code.startsWith('5') 
                ? 'sensory_recommendations'
                : 'keyboard_recommendations'
            }
            rowId={showImageUrlInput}
          />
        )}
        
        {updateMessage && (
          <div className={styles.updateMessage}>
            {updateMessage}
          </div>
        )}
        
        {isUpdating && <div className={styles.loadingIndicator}>Updating...</div>}
      </div>
      
      {/* Add form modal */}
      {showAddForm && (
        <ProductForm
          config={getFormConfigByCode(showAddForm)}
          code={showAddForm}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowAddForm(null)}
        />
      )}
    </div>
  );
};

export default RecommendationDetail; 