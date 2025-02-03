import React from 'react';
import styles from './RecommendationDetail.module.css';
// import { useEffect, useState } from 'react';
// import { supabase } from '../supabaseClient';
import { useCart } from '../contexts/CartContext';

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
  recommendations: Recommendation[];
  onClose: (code: string) => void;
}

const RecommendationDetail: React.FC<RecommendationDetailProps> = ({
  recommendations
}) => {
  const { items, addItem } = useCart();

  // 检查项目是否已被选中
  const isItemSelected = (id: string) => {
    return items.some(item => item.id === id);
  };

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
            onClick={() => addItem(rec)}
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
};

export default RecommendationDetail; 