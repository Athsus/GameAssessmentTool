import React, { useState } from 'react';
import styles from './Cart.module.css';
import { useCart } from '../contexts/CartContext';

const Cart: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem } = useCart();

  return (
    <div className={styles.cartContainer}>
      {/* 购物车按钮 */}
      <button 
        className={styles.cartButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        Selected Items ({items.length})
      </button>

      {/* 购物车面板 */}
      {isOpen && (
        <div className={styles.cartPanel}>
          <div className={styles.cartHeader}>
            <h3>Selected Items</h3>
            <button 
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          
          <div className={styles.cartItems}>
            {items.length === 0 ? (
              <p className={styles.emptyCart}>No items selected</p>
            ) : (
              items.map(item => (
                <div key={item.id} className={styles.cartItem}>
                  {item.image_url && (
                    <img 
                      src={item.image_url} 
                      alt={item.product} 
                      className={styles.itemImage}
                    />
                  )}
                  <div className={styles.itemInfo}>
                    <h4>{item.product}</h4>
                    {item.description && (
                      <p className={styles.itemDescription}>{item.description}</p>
                    )}
                    {item.website && (
                      <a 
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.itemLink}
                      >
                        View Details
                      </a>
                    )}
                  </div>
                  <button 
                    className={styles.removeButton}
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart; 