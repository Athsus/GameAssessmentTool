import React, { useState } from 'react';
import BackButton from './BackButton';
import styles from './KeyboardAssessment.module.css';
import RecommendationDetail from './RecommendationDetail';
import { supabase } from '../supabaseClient';
import { Recommendation } from './RecommendationDetail';

const KeyboardAssessment: React.FC = () => {
  const [isROMImpaired, setIsROMImpaired] = useState(false);
  // 存储每个 checkbox 的选中状态
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  // 存储活跃的 codes（用于查询）
  const [activeCodes, setActiveCodes] = useState<Set<string>>(new Set());
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  // 定义代码映射关系
  const codeMapping: Record<string, { code: string, table: string }> = {
    'ergonomicKeyboards': { code: '1.1', table: 'keyboard_recommendations' },
    'splitKeyboards': { code: '1.2', table: 'keyboard_recommendations' },
    'gamingKeyboards': { code: '1.3', table: 'keyboard_recommendations' },
    'compactKeyboards': { code: '1.4', table: 'keyboard_recommendations' },
    'ergonomicMouse': { code: '1.5', table: 'keyboard_recommendations' },
    'gamingMouse': { code: '1.6', table: 'keyboard_recommendations' },
    'alternativeInput': { code: '2.1', table: 'keyboard_recommendations' },
    'keyGuard': { code: '2.2', table: 'keyboard_recommendations' },
    'trackballMouse': { code: '2.3', table: 'keyboard_recommendations' },
    'lowForceKeyboards': { code: '3.1', table: 'keyboard_recommendations' },
    'lowForceMouse': { code: '3.2', table: 'keyboard_recommendations' },
    'largeKeyKeyboards': { code: '4.1', table: 'keyboard_recommendations' },
    'brailleKeyboards': { code: '4.2', table: 'keyboard_recommendations' },
    'headMouthStick': { code: '5.1', table: 'keyboard_recommendations' },
    'wearableKeyboards': { code: '5.2', table: 'keyboard_recommendations' },
    'headMouse': { code: '5.3', table: 'keyboard_recommendations' },
    'eyeTracking': { code: '6.3', table: 'severe_impairment_alter' }
  };

  // 获取推荐内容的函数
  const fetchRecommendations = async () => {
    try {
      // 按表分组查询
      const keyboardCodes = Array.from(activeCodes).filter(code => 
        Object.values(codeMapping).some(mapping => 
          mapping.code === code && mapping.table === 'keyboard_recommendations'
        )
      );
      
      const severeCodes = Array.from(activeCodes).filter(code => 
        Object.values(codeMapping).some(mapping => 
          mapping.code === code && mapping.table === 'severe_impairment_alter'
        )
      );

      let newRecommendations: Recommendation[] = [];

      // 查询keyboard_recommendations表
      if (keyboardCodes.length > 0) {
        const { data: keyboardData, error: keyboardError } = await supabase
          .from('keyboard_recommendations')
          .select('*')
          .in('code', keyboardCodes);

        if (keyboardError) throw keyboardError;
        
        if (keyboardData) {
          const formattedData = keyboardData.map(item => ({
            id: item.id,
            code: item.code,
            category: item.category || '',
            subcategory: item.subcategory || '',
            product: item.product || '',
            website: item.website || '',
            description: item.subcategory || null,
            image_url: item.image_url || null
          }));
          
          newRecommendations = [...newRecommendations, ...formattedData];
        }
      }

      // 查询severe_impairment_alter表
      if (severeCodes.length > 0) {
        const { data: severeData, error: severeError } = await supabase
          .from('severe_impairment_alter')
          .select('*')
          .in('code', severeCodes);

        if (severeError) throw severeError;
        
        if (severeData) {
          const formattedData = severeData.map(item => ({
            id: item.id,
            code: item.code,
            category: item.category || '',
            subcategory: item.subcategory || '',
            product: item.product || '',
            website: item.website || '',
            description: item.subcategory || null,
            image_url: item.image_url || null
          }));
          
          newRecommendations = [...newRecommendations, ...formattedData];
        }
      }

      // 关键修改：追加新推荐，而不是替换
      setRecommendations(prevRecs => {
        // 创建一个ID集合，用于检查重复
        const existingIds = new Set(prevRecs.map(rec => rec.id));
        
        // 过滤掉已存在的推荐
        const uniqueNewRecs = newRecommendations.filter(rec => !existingIds.has(rec.id));
        
        
        // 返回合并后的数组
        const result = [...prevRecs, ...uniqueNewRecs];
        return result;
      });
    } catch (err) {
      console.error(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // 处理复选框点击
  const handleCheckboxClick = (id: string) => {
    // 检查是否正在取消选择
    const isRemoving = checkedItems.has(id);
    
    // 更新选中状态
    setCheckedItems(prev => {
      const newChecked = new Set(prev);
      if (isRemoving) {
        newChecked.delete(id);
      } else {
        newChecked.add(id);
      }
      return newChecked;
    });
    
    // 如果是取消选择，直接调用 handleRemoveCode
    if (isRemoving) {
      const mapping = codeMapping[id];
      if (mapping) {
        handleRemoveCode(mapping.code);
      }
    }
  };

  // 使用 useEffect 来管理 activeCodes
  React.useEffect(() => {
    // 收集所有被选中的 checkbox 对应的 codes
    const newActiveCodes = new Set<string>();
    checkedItems.forEach(checkboxId => {
      const mapping = codeMapping[checkboxId];
      if (mapping) {
        newActiveCodes.add(mapping.code);
      }
    });
    
    setActiveCodes(newActiveCodes);
  }, [checkedItems]);

  // 检查选项是否被选中
  const isOptionSelected = (id: string) => {
    return checkedItems.has(id);
  };

  // 当活跃的 codes 改变时，重新获取数据
  React.useEffect(() => {
    if (activeCodes.size > 0) {
      fetchRecommendations();
    } else {
      setRecommendations([]);
    }
  }, [activeCodes]);

  // 从推荐面板移除一个 code
  const handleRemoveCode = (code: string) => {
    // 找到所有引用这个 code 的 checkbox
    const relatedCheckboxes = Object.entries(codeMapping)
      .filter(([_, mapping]) => mapping.code === code)
      .map(([key]) => key);

    // 取消选中所有相关的 checkbox
    setCheckedItems(prev => {
      const newChecked = new Set(prev);
      relatedCheckboxes.forEach(id => newChecked.delete(id));
      return newChecked;
    });

    // 从活跃 codes 中移除
    setActiveCodes(prev => {
      const newCodes = new Set(prev);
      newCodes.delete(code);
      return newCodes;
    });

    // 从推荐列表中移除相关代码的项目
    setRecommendations(prevRecs => prevRecs.filter(rec => rec.code !== code));
  };

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
            <li>
              For clients with full function in one hand and limited or no function in the other hand, refer to the Database: {' '}
              <span 
                className={styles.clickableLink}
                onClick={() => {
                  // 检查是否已经选中
                  if (!checkedItems.has('gamingKeyboards')) {
                    // 如果没有选中，则添加到选中项并触发获取
                    handleCheckboxClick('gamingKeyboards');
                  }
                }}
              >
                One-hand Gaming Keyboards
              </span> section.
            </li>
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
                    <input 
                      type="checkbox" 
                      id="ergonomicKeyboards" 
                      checked={isOptionSelected('ergonomicKeyboards')}
                      onChange={() => handleCheckboxClick('ergonomicKeyboards')}
                    />
                    <label htmlFor="ergonomicKeyboards">Ergonomic Keyboards</label>
                  </div>
                  <div className={styles.checkItem}>
                    <input 
                      type="checkbox" 
                      id="splitKeyboards" 
                      checked={isOptionSelected('splitKeyboards')}
                      onChange={() => handleCheckboxClick('splitKeyboards')}
                    />
                    <label htmlFor="splitKeyboards">Split Keyboards</label>
                  </div>
                  <div className={styles.checkItem}>
                    <input 
                      type="checkbox" 
                      id="gamingKeyboards" 
                      checked={isOptionSelected('gamingKeyboards')}
                      onChange={() => handleCheckboxClick('gamingKeyboards')}
                    />
                    <label htmlFor="gamingKeyboards">Gaming Keyboards</label>
                  </div>
                  <div className={styles.checkItem}>
                    <input 
                      type="checkbox" 
                      id="compactKeyboards" 
                      checked={isOptionSelected('compactKeyboards')}
                      onChange={() => handleCheckboxClick('compactKeyboards')}
                    />
                    <label htmlFor="compactKeyboards">Compact Keyboards</label>
                  </div>
                  <div className={styles.checkItem}>
                    <input 
                      type="checkbox" 
                      id="ergonomicMouse" 
                      checked={isOptionSelected('ergonomicMouse')}
                      onChange={() => handleCheckboxClick('ergonomicMouse')}
                    />
                    <label htmlFor="ergonomicMouse">Ergonomic Mouse</label>
                  </div>
                  <div className={styles.checkItem}>
                    <input 
                      type="checkbox" 
                      id="gamingMouse" 
                      checked={isOptionSelected('gamingMouse')}
                      onChange={() => handleCheckboxClick('gamingMouse')}
                    />
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
                  <input 
                    type="checkbox" 
                    id="alternativeInput" 
                    checked={isOptionSelected('alternativeInput')}
                    onChange={() => handleCheckboxClick('alternativeInput')}
                  />
                  <label htmlFor="alternativeInput">Alternative Input Devices</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="keyGuard" 
                    checked={isOptionSelected('keyGuard')}
                    onChange={() => handleCheckboxClick('keyGuard')}
                  />
                  <label htmlFor="keyGuard">Key guard/Mouse Guard</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="trackballMouse" 
                    checked={isOptionSelected('trackballMouse')}
                    onChange={() => handleCheckboxClick('trackballMouse')}
                  />
                  <label htmlFor="trackballMouse">Trackball Mouse</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="largeKeyKeyboards" 
                    checked={isOptionSelected('largeKeyKeyboards')}
                    onChange={() => handleCheckboxClick('largeKeyKeyboards')}
                  />
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
                  <input 
                    type="checkbox" 
                    id="lowForceKeyboards" 
                    checked={isOptionSelected('lowForceKeyboards')}
                    onChange={() => handleCheckboxClick('lowForceKeyboards')}
                  />
                  <label htmlFor="lowForceKeyboards">Low-Force Keyboards</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="lowForceMouse" 
                    checked={isOptionSelected('lowForceMouse')}
                    onChange={() => handleCheckboxClick('lowForceMouse')}
                  />
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
                  <input 
                    type="checkbox" 
                    id="largeKeyKeyboards" 
                    checked={isOptionSelected('largeKeyKeyboards')}
                    onChange={() => handleCheckboxClick('largeKeyKeyboards')}
                  />
                  <label htmlFor="largeKeyKeyboardsVision">Large-Key Keyboards</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="brailleKeyboards" 
                    checked={isOptionSelected('brailleKeyboards')}
                    onChange={() => handleCheckboxClick('brailleKeyboards')}
                  />
                  <label htmlFor="brailleKeyboards">Braille Keyboards</label>
                </div>
              </div>
            </div>

            {/* Severe Functional Impairments Section */}
            <div className={styles.subsection}>
              <h3>5. Severe functional impairments</h3>
              <div className={styles.recommendations}>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="headMouthStick" 
                    checked={isOptionSelected('headMouthStick')}
                    onChange={() => handleCheckboxClick('headMouthStick')}
                  />
                  <label htmlFor="headMouthStick">Head/Mouth Stick Keyboard</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="wearableKeyboards" 
                    checked={isOptionSelected('wearableKeyboards')}
                    onChange={() => handleCheckboxClick('wearableKeyboards')}
                  />
                  <label htmlFor="wearableKeyboards">Wearable keyboards</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="headMouse" 
                    checked={isOptionSelected('headMouse')}
                    onChange={() => handleCheckboxClick('headMouse')}
                  />
                  <label htmlFor="headMouse">Head mouse</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="eyeTracking" 
                    checked={isOptionSelected('eyeTracking')}
                    onChange={() => handleCheckboxClick('eyeTracking')}
                  />
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
        <RecommendationDetail
          recommendations={recommendations}
          onClose={handleRemoveCode}
        />
      )}
    </div>
  );
};

export default KeyboardAssessment; 