import React from 'react';
import styles from './RecommendationDetail.module.css';
// import { useEffect, useState } from 'react';
// import { supabase } from '../supabaseClient';
import { useCart } from '../contexts/CartContext';

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
  // 支持两种传参方式
  product?: RecommendationProduct;
  recommendations?: Recommendation[];
  onClose: (() => void) | ((code: string) => void);
  onAddToCart?: () => void;
}

const RecommendationDetail: React.FC<RecommendationDetailProps> = ({
  product,
  recommendations,
  onClose,
  onAddToCart,
}) => {
  const { items, addItem } = useCart();

  // 检查项目是否已被选中
  const isItemSelected = (id: string) => {
    return items.some(item => item.id === id);
  };

  // 如果是新版本的单个产品展示
  if (product) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <button 
            className={styles.closeButton} 
            onClick={() => onClose(product.code)}
          >
            ×
          </button>
          
          <div className={styles.content}>
            {product.image_url && (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className={styles.productImage}
              />
            )}
            
            <div className={styles.details}>
              <h2>{product.name}</h2>
              {product.category && <p className={styles.category}>{product.category}</p>}
              {product.subcategory && (
                <p className={styles.subcategory}>{product.subcategory}</p>
              )}
              {product.description && (
                <p className={styles.description}>{product.description}</p>
              )}
              {product.price_range && (
                <p className={styles.price}>Price Range: {product.price_range}</p>
              )}
              
              <div className={styles.actions}>
                <a 
                  href={product.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.websiteLink}
                >
                  Visit Website
                </a>
                {onAddToCart && (
                  <button 
                    onClick={onAddToCart}
                    className={styles.addToCartButton}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 如果是旧版本的多产品列表展示
  if (recommendations) {
    return (
      <div className={styles.detailContainer}>
        <div className={styles.header}>
          <h3>Products & Resources</h3>
        </div>
        
        <div className={styles.recommendationsList}>
          {recommendations.map((rec) => (
            <div 
              key={rec.id} 
              className={`${styles.recommendationItem} ${isItemSelected(rec.id) ? styles.selected : ''}`}
              onClick={() => addItem({
                id: rec.id,
                code: rec.code,
                product: rec.product,
                description: rec.description,
                website: rec.website,
                image_url: rec.image_url
              })}
              role="button"
              tabIndex={0}
            >
              {rec.image_url && (
                <div className={styles.imageContainer}>
                  <img src={rec.image_url} alt={rec.product} />
                </div>
              )}
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
                  >
                    View Details
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default RecommendationDetail; 