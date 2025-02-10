import React, { useState } from 'react';
import BackButton from './BackButton';
import styles from './KeyboardAssessment.module.css';
import RecommendationDetail from './RecommendationDetail';
import { useRecommendations } from '../hooks/useRecommendations';

const KeyboardAssessment: React.FC = () => {
  const [isROMImpaired, setIsROMImpaired] = useState(false);

  // 先定义代码映射函数
  const getKeyboardRecommendationCode = (checkboxId: string): string => {
    const codeMap: { [key: string]: string } = {
      'ergonomicKeyboards': '1.1',
      'splitKeyboards': '1.2',
      'gamingKeyboards': '1.3',
      'compactKeyboards': '1.4',
      'ergonomicMouse': '2.1',
      'gamingMouse': '2.2',
      'alternativeInput': '3.1',
      'keyGuard': '3.2',
      'trackballMouse': '3.3',
      'largeKeyKeyboards': '3.4',
      'lowForceKeyboards': '4.1',
      'lowForceMouse': '4.2',
      'brailleKeyboards': '5.1',
      'headMouthStick': '6.1',
      'wearableKeyboards': '6.2',
      'headMouse': '6.3',
      'eyeTracking': '6.4'
    };
    return codeMap[checkboxId] || '';
  };

  // 然后再使用这个函数
  const {
    recommendations,
    selectedProduct,
    handleCheckboxChange,
    handleProductClick,
    handleAddToCart,
    handleCloseDetail
  } = useRecommendations({ 
    tableName: 'keyboard_recommendations',
    getCode: getKeyboardRecommendationCode
  });

  const handleROMChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsROMImpaired(event.target.value === 'impaired');
  };

  return (
    <div className={styles.container}>
      <BackButton />
      <div className={styles.mainContent}>
        <h1 className={styles.title}>Keyboard and Mouse Functional Needs Assessment</h1>
        <p className={styles.description}>
          Based on the assessment results, please check the suitable functional needs and corresponding
          keyboard types for each functional limitation.
        </p>

        <div className={styles.databaseNote}>
          <h3>Database: Keyboard and Mouse</h3>
          <ul>
            <li>For clients with severe motor impairments, proceed directly to the Database: 5 Severe Motor Impairment Keyboards section.</li>
            <li>For clients with full function in one hand and limited or no function in the other hand, refer to the Databse: 1.3 One-hand Gamming Keyboards section.</li>
          </ul>
        </div>

        <div className={styles.assessmentTable}>
          {/* Upper Limb Section */}
          <div className={styles.section}>
            <h2>Upper Limb</h2>
            <div className={styles.subsection}>
              <h3>1. Range of Motion (ROM)</h3>
              <div className={styles.formGroup}>
                <div className={styles.radioGroup}>
                  <label>
                    <input 
                      type="radio" 
                      name="romStatus" 
                      value="unimpaired" 
                      onChange={handleROMChange}
                    />
                    Unimpaired
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="romStatus" 
                      value="impaired" 
                      onChange={handleROMChange}
                    />
                    Impaired
                  </label>
                </div>

                <div className={`${styles.affectedParts} ${!isROMImpaired && styles.disabled}`}>
                  <p>If "impaired" is selected, indicate the affected part(s)</p>
                  <div className={styles.partsGrid}>
                    <div className={styles.partGroup}>
                      <label>Hands</label>
                      <div className={styles.sidePicker}>
                        <label>
                          <input 
                            type="checkbox" 
                            disabled={!isROMImpaired}
                            name="hands-left" 
                          /> L
                        </label>
                        <label>
                          <input 
                            type="checkbox" 
                            disabled={!isROMImpaired}
                            name="hands-right" 
                          /> R
                        </label>
                      </div>
                    </div>
                    <div className={styles.partGroup}>
                      <label>Wrists</label>
                      <div className={styles.sidePicker}>
                        <label>
                          <input 
                            type="checkbox" 
                            disabled={!isROMImpaired}
                            name="wrists-left" 
                          /> L
                        </label>
                        <label>
                          <input 
                            type="checkbox" 
                            disabled={!isROMImpaired}
                            name="wrists-right" 
                          /> R
                        </label>
                      </div>
                    </div>
                    <div className={styles.partGroup}>
                      <label>Elbow</label>
                      <div className={styles.sidePicker}>
                        <label>
                          <input 
                            type="checkbox" 
                            disabled={!isROMImpaired}
                            name="elbow-left" 
                          /> L
                        </label>
                        <label>
                          <input 
                            type="checkbox" 
                            disabled={!isROMImpaired}
                            name="elbow-right" 
                          /> R
                        </label>
                      </div>
                    </div>
                    <div className={styles.partGroup}>
                      <label>Shoulders</label>
                      <div className={styles.sidePicker}>
                        <label>
                          <input 
                            type="checkbox" 
                            disabled={!isROMImpaired}
                            name="shoulders-left" 
                          /> L
                        </label>
                        <label>
                          <input 
                            type="checkbox" 
                            disabled={!isROMImpaired}
                            name="shoulders-right" 
                          /> R
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.recommendations}>
                  <div className={styles.checkItem}>
                    <input type="checkbox" id="ergonomicKeyboards" onChange={handleCheckboxChange} />
                    <label htmlFor="ergonomicKeyboards">Ergonomic Keyboards</label>
                  </div>
                  <div className={styles.checkItem}>
                    <input type="checkbox" id="splitKeyboards" onChange={handleCheckboxChange} />
                    <label htmlFor="splitKeyboards">Split Keyboards</label>
                  </div>
                  <div className={styles.checkItem}>
                    <input type="checkbox" id="gamingKeyboards" onChange={handleCheckboxChange} />
                    <label htmlFor="gamingKeyboards">Gaming Keyboards</label>
                  </div>
                  <div className={styles.checkItem}>
                    <input type="checkbox" id="compactKeyboards" onChange={handleCheckboxChange} />
                    <label htmlFor="compactKeyboards">Compact Keyboards</label>
                  </div>
                  <div className={styles.checkItem}>
                    <input type="checkbox" id="ergonomicMouse" onChange={handleCheckboxChange} />
                    <label htmlFor="ergonomicMouse">Ergonomic Mouse</label>
                  </div>
                  <div className={styles.checkItem}>
                    <input type="checkbox" id="gamingMouse" onChange={handleCheckboxChange} />
                    <label htmlFor="gamingMouse">Gaming Mouse</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Fine Motor Control Section */}
            <div className={styles.subsection}>
              <h3>2. Fine Motor Control</h3>
              <p className={styles.subtitle}>(Precise key presses/precise mouse movements or clicks/ Tremors)</p>
              <div className={styles.radioGroup}>
                <label>
                  <input type="radio" name="motorControl" value="unimpaired" />
                  Unimpaired
                </label>
                <label>
                  <input type="radio" name="motorControl" value="impaired" />
                  Impaired
                </label>
              </div>
              <div className={styles.recommendations}>
                <div className={styles.checkItem}>
                  <input type="checkbox" id="alternativeInput" onChange={handleCheckboxChange} />
                  <label htmlFor="alternativeInput">Alternative Input Devices</label>
                </div>
                <div className={styles.checkItem}>
                  <input type="checkbox" id="keyGuard" onChange={handleCheckboxChange} />
                  <label htmlFor="keyGuard">Key guard/Mouse Guard</label>
                </div>
                <div className={styles.checkItem}>
                  <input type="checkbox" id="trackballMouse" onChange={handleCheckboxChange} />
                  <label htmlFor="trackballMouse">Trackball Mouse</label>
                </div>
                <div className={styles.checkItem}>
                  <input type="checkbox" id="largeKeyKeyboards" onChange={handleCheckboxChange} />
                  <label htmlFor="largeKeyKeyboards">Large-Key Keyboards</label>
                </div>
              </div>
            </div>

            {/* Finger Strength Section */}
            <div className={styles.subsection}>
              <h3>3. Finger Strength</h3>
              <div className={styles.radioGroup}>
                <label>
                  <input type="radio" name="fingerStrength" value="unimpaired" />
                  Unimpaired
                </label>
                <label>
                  <input type="radio" name="fingerStrength" value="impaired" />
                  Impaired
                </label>
              </div>
              <div className={styles.recommendations}>
                <div className={styles.checkItem}>
                  <input type="checkbox" id="lowForceKeyboards" onChange={handleCheckboxChange} />
                  <label htmlFor="lowForceKeyboards">Low-Force Keyboards</label>
                </div>
                <div className={styles.checkItem}>
                  <input type="checkbox" id="lowForceMouse" onChange={handleCheckboxChange} />
                  <label htmlFor="lowForceMouse">Low-Force Mouse</label>
                </div>
              </div>
            </div>

            {/* Vision Section */}
            <div className={styles.subsection}>
              <h3>4. Vision</h3>
              <div className={styles.radioGroup}>
                <label>
                  <input type="radio" name="vision" value="unimpaired" />
                  Unimpaired
                </label>
                <label>
                  <input type="radio" name="vision" value="impaired" />
                  Impaired
                </label>
              </div>
              <div className={styles.recommendations}>
                <div className={styles.checkItem}>
                  <input type="checkbox" id="largeKeyKeyboardsVision" onChange={handleCheckboxChange} />
                  <label htmlFor="largeKeyKeyboardsVision">Large-Key Keyboards</label>
                </div>
                <div className={styles.checkItem}>
                  <input type="checkbox" id="brailleKeyboards" onChange={handleCheckboxChange} />
                  <label htmlFor="brailleKeyboards">Braille Keyboards</label>
                </div>
              </div>
            </div>

            {/* Severe Functional Impairments Section */}
            <div className={styles.subsection}>
              <h3>5. Severe functional impairments</h3>
              <div className={styles.recommendations}>
                <div className={styles.checkItem}>
                  <input type="checkbox" id="headMouthStick" onChange={handleCheckboxChange} />
                  <label htmlFor="headMouthStick">Head/Mouth Stick Keyboard</label>
                </div>
                <div className={styles.checkItem}>
                  <input type="checkbox" id="wearableKeyboards" onChange={handleCheckboxChange} />
                  <label htmlFor="wearableKeyboards">Wearable keyboards</label>
                </div>
                <div className={styles.checkItem}>
                  <input type="checkbox" id="headMouse" onChange={handleCheckboxChange} />
                  <label htmlFor="headMouse">Head mouse</label>
                </div>
                <div className={styles.checkItem}>
                  <input type="checkbox" id="eyeTracking" onChange={handleCheckboxChange} />
                  <label htmlFor="eyeTracking">Eye-Tracking Mouse (Database: Severe Impairments alter -- 6.3 Eye Gaze)</label>
                </div>
              </div>
            </div>

            {/* Others Section */}
            <div className={styles.subsection}>
              <h3>Others</h3>
              <div className={styles.formGroup}>
                <textarea 
                  className={styles.textarea} 
                  placeholder="Additional notes or observations..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 推荐产品部分 */}
      {recommendations.length > 0 && (
        <div className={`${styles.recommendationsSection} ${
          recommendations.length > 0 ? styles.visible : ''
        }`}>
          <h2>Recommended Products</h2>
          <div className={styles.recommendationsList}>
            {recommendations.map(product => (
              <div 
                key={product.id} 
                className={styles.recommendationItem}
                onClick={() => handleProductClick(product)}
              >
                {product.image_url && (
                  <img src={product.image_url} alt={product.product} />
                )}
                <h3>{product.product}</h3>
                <p>{product.price_range}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 产品详情弹窗 */}
      {selectedProduct && (
        <RecommendationDetail
          product={{
            id: selectedProduct.id,
            code: selectedProduct.code,
            name: selectedProduct.product,
            description: selectedProduct.subcategory,
            price_range: selectedProduct.price_range,
            website: selectedProduct.website,
            image_url: selectedProduct.image_url
          }}
          onClose={handleCloseDetail}
          onAddToCart={() => handleAddToCart(selectedProduct)}
        />
      )}
    </div>
  );
};

export default KeyboardAssessment; 