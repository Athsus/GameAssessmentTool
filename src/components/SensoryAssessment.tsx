import React, { useState, useEffect } from 'react';
import BackButton from './BackButton';
import styles from './SensoryAssessment.module.css';
import RecommendationDetail from './RecommendationDetail';
import { supabase } from '../supabaseClient';
import { Recommendation } from './RecommendationDetail';
import ExportButton from './ExportButton';

const SensoryAssessment: React.FC = () => {
  // Store checkbox selection states
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  // Store active codes (for queries)
  const [activeCodes, setActiveCodes] = useState<Set<string>>(new Set());
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  // Update code mapping to add category info for adaptive_switches
  const codeMapping: Record<string, { code: string, table: string, category?: string }> = {
    'low_vision-text': { code: '1.1.1', table: 'sensory_recommendations' },
    'low_vision-color': { code: '1.1.2', table: 'sensory_recommendations' },
    'low_vision-magnifier': { code: '1.1.3', table: 'sensory_recommendations' },
    'low_vision-night_mode': { code: '1.1.4', table: 'sensory_recommendations' },
    'low_vision-narrator': { code: '1.1.5', table: 'sensory_recommendations' },
    'low_vision-copilot': { code: '1.1.6', table: 'sensory_recommendations' },
    'low_vision-haptic_feedback': { code: '1.1.7', table: 'sensory_recommendations' },
    'low_vision-audio_driven': { code: '1.1.8', table: 'sensory_recommendations' },
    'low_vision-text_to_speech': { code: '1.1.9', table: 'sensory_recommendations' },
    'cvd-color_blind_modes': { code: '1.2.1', table: 'sensory_recommendations' },
    'cvd-high_contrast': { code: '1.2.2', table: 'sensory_recommendations' },
    'tactile-pressure_sensitivity': { code: '3.3.1', table: 'sensory_recommendations' },
    'tactile-adaptive_controller': { code: '3.3.1', table: 'sensory_recommendations' },
    'tactile-designed_lab': { code: '3.3.2', table: 'sensory_recommendations' },
    'physical-low_force_buttons': { code: '2.1.2', table: 'physical_recommendations' }, // Note: using physical_recommendations table
    'adaptive_switches-sensory': { 
      code: 'AS', 
      table: 'adaptive_switches',
      category: 'I. Sensory'  // Add category information
    },
    'audio-hearing_accessibility': { code: '2.1', table: 'sensory_recommendations' },
    'audio-visual_indicators': { code: '2.2', table: 'sensory_recommendations' },
  };

  // Function to fetch recommendations
  const fetchRecommendations = async (codes: string[]) => {
    try {
      // Group queries by table
      const physicalCodes = codes.filter(code => 
        Object.values(codeMapping).some(mapping => 
          mapping.code === code && mapping.table === 'physical_recommendations'
        )
      );
      
      const sensoryCodes = codes.filter(code => 
        Object.values(codeMapping).some(mapping => 
          mapping.code === code && mapping.table === 'sensory_recommendations'
        )
      );
      
      const adaptiveSwitchesCodes = codes.filter(code => 
        Object.values(codeMapping).some(mapping => 
          mapping.code === code && mapping.table === 'adaptive_switches'
        )
      );

      let newRecommendations: Recommendation[] = [];

      // Query sensory_recommendations table
      if (sensoryCodes.length > 0) {
        const { data: sensoryData, error: sensoryError } = await supabase
          .from('sensory_recommendations')
          .select('*')
          .in('code', sensoryCodes);

        if (sensoryError) throw sensoryError;
        if (sensoryData) {
          newRecommendations = [...newRecommendations, ...sensoryData];
        }
      }

      // Query physical_recommendations table
      if (physicalCodes.length > 0) {
        const { data: physicalData, error: physicalError } = await supabase
          .from('physical_recommendations')
          .select('*')
          .in('code', physicalCodes);

        if (physicalError) throw physicalError;
        if (physicalData) {
          newRecommendations = [...newRecommendations, ...physicalData];
        }
      }

      // Query adaptive_switches table
      if (adaptiveSwitchesCodes.length > 0) {
        const { data: switchesData, error: switchesError } = await supabase
          .from('adaptive_switches')
          .select('*')
          .eq('category', 'I. Sensory'); // Query by category instead of code

        if (switchesError) throw switchesError;
        if (switchesData) {
          const formattedData = switchesData.map(item => ({
            id: item.id,
            code: 'AS',  // Use fixed code
            category: item.category || '',
            subcategory: item.subcategory || '',
            product: item.product || '',
            website: item.website || '',
            description: item.description || null,
            image_url: item.image_url || null
          }));
          newRecommendations = [...newRecommendations, ...formattedData];
        }
      }

      setRecommendations(prevRecs => {
        const existingIds = new Set(prevRecs.map(rec => rec.id));
        const uniqueNewRecs = newRecommendations.filter(rec => !existingIds.has(rec.id));
        return [...prevRecs, ...uniqueNewRecs];
      });
    } catch (err) {
      console.error(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // 处理复选框点击 - 只处理 checkbox 状态
  const handleCheckboxClick = (category: string, feature: string, labelText?: string | null) => {
    const id = `${category}-${feature}`;
    const isSelected = isOptionSelected(category, feature);
    
    setCheckedItems(prev => {
      const newChecked = new Set(prev);
      if (isSelected) {
        newChecked.delete(id);
      } else {
        newChecked.add(id);
      }
      return newChecked;
    });
    
    // 确保 labelText 不为 null 或 undefined
    if (labelText && !isSelected) {
      const mapping = codeMapping[id];
      if (mapping) {
        const labelMap = JSON.parse(sessionStorage.getItem('checkboxLabels') || '{}');
        labelMap[mapping.code] = labelText;
        sessionStorage.setItem('checkboxLabels', JSON.stringify(labelMap));
      }
    }
  };

  // 使用 useEffect 来管理 activeCodes
  useEffect(() => {
    // 收集所有被选中的 checkbox 对应的 codes
    const newActiveCodes = new Set<string>();
    checkedItems.forEach(checkboxId => {
      const code = codeMapping[checkboxId]?.code;
      if (code) {
        newActiveCodes.add(code);
      }
    });
    
    setActiveCodes(newActiveCodes);
  }, [checkedItems]);

  // 检查选项是否被选中
  const isOptionSelected = (category: string, feature: string) => {
    const checkboxId = `${category}-${feature}`;
    return checkedItems.has(checkboxId);
  };

  // 当活跃的 codes 改变时，重新获取数据
  useEffect(() => {
    console.log('SensoryAssessment - activeCodes changed:', Array.from(activeCodes));
    if (activeCodes.size > 0) {
      fetchRecommendations(Array.from(activeCodes));
    } else {
      setRecommendations([]);
    }
  }, [activeCodes]);

  // 从推荐面板移除一个 code
  const handleRemoveCode = (code: string) => {
    // 找到所有引用这个 code 的 checkbox
    const relatedCheckboxes = Object.entries(codeMapping)
      .filter(([_, value]) => value.code === code)
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

  return (
    <div className={styles.container} id="sensory-assessment-content">
      <div className={styles.header}>
        <BackButton />
        <ExportButton 
          title="Sensory Assessment"
          contentId="sensory-assessment-content"
          formType="sensory"
        />
      </div>
      
      <h1 className={styles.title}>Sensory Accessibility Assessment</h1>
      <p className={styles.description}>
        Based on the assessment results, please evaluate the suitable functional requirements and corresponding
        recommendations for each functional limitation.
      </p>

      <p className={styles.databaseDescription}>
        Database: Sensory Accessibility Assessment
      </p>

      <div className={styles.assessmentTable}>
        {/* Visual Impairment Section */}
        <div className={styles.section}>
          <h2>Visual Impairment</h2>
          <div className={styles.subsection}>
            <h3>Low Vision/ Blind</h3>
            <div className={styles.recommendations}>
              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="text"
                  checked={isOptionSelected('low_vision', 'text')}
                  onChange={(e) => {
                    const label = e.target.nextElementSibling?.textContent || '';
                    handleCheckboxClick('low_vision', 'text', label);
                  }}
                />
                <label htmlFor="text">Text: Ensure text is clear and provides context to reduce cognitive load.</label>
              </div>
              
              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="colour"
                  checked={isOptionSelected('low_vision', 'color')}
                  onChange={(e) => {
                    const label = e.target.nextElementSibling?.textContent || '';
                    handleCheckboxClick('low_vision', 'color', label);
                  }}
                />
                <label htmlFor="colour">Colour: Use colour to emphasize information and provide additional context.</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="magnifier"
                  checked={isOptionSelected('low_vision', 'magnifier')}
                  onChange={(e) => {
                    const label = e.target.nextElementSibling?.textContent || '';
                    handleCheckboxClick('low_vision', 'magnifier', label);
                  }}
                />
                <label htmlFor="magnifier">Magnifier: Allows players to enlarge elements on the screen using a controller or keyboard.</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="nightMode"
                  checked={isOptionSelected('low_vision', 'night_mode')}
                  onChange={(e) => {
                    const label = e.target.nextElementSibling?.textContent || '';
                    handleCheckboxClick('low_vision', 'night_mode', label);
                  }}
                />
                <label htmlFor="nightMode">Night Mode: Adjusts screen brightness and colour for easier viewing at night. (helpful for people who are photosensitive)</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="narrator"
                  checked={isOptionSelected('low_vision', 'narrator')}
                  onChange={(e) => {
                    const label = e.target.nextElementSibling?.textContent || '';
                    handleCheckboxClick('low_vision', 'narrator', label);
                  }}
                />
                <label htmlFor="narrator">Narrator: A screen reader verbalizes text, buttons, and other on-screen elements.</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="copilot"
                  checked={isOptionSelected('low_vision', 'copilot')}
                  onChange={(e) => {
                    const label = e.target.nextElementSibling?.textContent || '';
                    handleCheckboxClick('low_vision', 'copilot', label);
                  }}
                />
                <label htmlFor="copilot">Copilot: Two controllers can work together as one for more accessible gameplay.</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="hapticFeedback"
                  checked={isOptionSelected('low_vision', 'haptic_feedback')}
                  onChange={(e) => {
                    const label = e.target.nextElementSibling?.textContent || '';
                    handleCheckboxClick('low_vision', 'haptic_feedback', label);
                  }}
                />
                <label htmlFor="hapticFeedback">Haptic Feedback: Uses vibration and tactile feedback to convey in-game actions and events</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="audioDriven"
                  checked={isOptionSelected('low_vision', 'audio_driven')}
                  onChange={(e) => {
                    const label = e.target.nextElementSibling?.textContent || '';
                    handleCheckboxClick('low_vision', 'audio_driven', label);
                  }}
                />
                <label htmlFor="audioDriven">Audio-Driven Gameplay: Relies on sound design and audio cues to guide players through the game.</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="textToSpeech"
                  checked={isOptionSelected('low_vision', 'text_to_speech')}
                  onChange={(e) => {
                    const label = e.target.nextElementSibling?.textContent || '';
                    handleCheckboxClick('low_vision', 'text_to_speech', label);
                  }}
                />
                <label htmlFor="textToSpeech">Text-to-Speech and Screen Readers: Converts in-game text, menus, and notifications into spoken words, helping blind players navigate game interfaces and understand story elements.</label>
              </div>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3>Colour Vision Deficiency (CVD)</h3>
            <div className={styles.recommendations}>
              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="colourBlindModes"
                  checked={isOptionSelected('cvd', 'color_blind_modes')}
                  onChange={(e) => {
                    const label = e.target.nextElementSibling?.textContent || '';
                    handleCheckboxClick('cvd', 'color_blind_modes', label);
                  }}
                />
                <label htmlFor="colourBlindModes">Colour-blind Modes: Adjust in-game colours to accommodate different types of CVD.</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="highContrast"
                  checked={isOptionSelected('cvd', 'high_contrast')}
                  onChange={(e) => {
                    const label = e.target.nextElementSibling?.textContent || '';
                    handleCheckboxClick('cvd', 'high_contrast', label);
                  }}
                />
                <label htmlFor="highContrast">High Contrast: Improves visibility by making items and text easier to differentiate.</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="cvdAudioDriven"
                  checked={isOptionSelected('low_vision', 'audio_driven')}
                  onChange={(e) => {
                    const label = e.target.nextElementSibling?.textContent || '';
                    handleCheckboxClick('low_vision', 'audio_driven', label);
                  }}
                />
                <label htmlFor="cvdAudioDriven">Audio-Driven Game-play</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="cvdTextToSpeech"
                  checked={isOptionSelected('low_vision', 'text_to_speech')}
                  onChange={(e) => {
                    const label = e.target.nextElementSibling?.textContent || '';
                    handleCheckboxClick('low_vision', 'text_to_speech', label);
                  }}
                />
                <label htmlFor="cvdTextToSpeech">Text-to-Speech and Screen Readers</label>
              </div>
            </div>
          </div>
        </div>

        {/* Audio Section */}
        <div className={styles.section}>
          <h2>Audio</h2>
          <div className={styles.recommendations}>
            <div className={styles.checkItem}>
              <input 
                type="checkbox"
                id="hearingAccessibility"
                checked={isOptionSelected('audio', 'hearing_accessibility')}
                onChange={(e) => {
                  const label = e.target.nextElementSibling?.textContent || '';
                  handleCheckboxClick('audio', 'hearing_accessibility', label);
                }}
              />
              <label htmlFor="hearingAccessibility">Hearing Accessibility</label>
            </div>

            <div className={styles.checkItem}>
              <input 
                type="checkbox"
                id="visualIndicators"
                checked={isOptionSelected('audio', 'visual_indicators')}
                onChange={(e) => {
                  const label = e.target.nextElementSibling?.textContent || '';
                  handleCheckboxClick('audio', 'visual_indicators', label);
                }}
              />
              <label htmlFor="visualIndicators">Visual Indicators for Audio Cues</label>
            </div>

            <div className={styles.checkItem}>
              <input 
                type="checkbox"
                id="audioCopilot"
                checked={isOptionSelected('low_vision', 'copilot')}
                onChange={(e) => {
                  const label = e.target.nextElementSibling?.textContent || '';
                  handleCheckboxClick('low_vision', 'copilot', label);
                }}
              />
              <label htmlFor="audioCopilot">Copilot</label>
            </div>

            <div className={styles.checkItem}>
              <input 
                type="checkbox"
                id="audioHapticFeedback"
                checked={isOptionSelected('low_vision', 'haptic_feedback')}
                onChange={(e) => {
                  const label = e.target.nextElementSibling?.textContent || '';
                  handleCheckboxClick('low_vision', 'haptic_feedback', label);
                }}
              />
              <label htmlFor="audioHapticFeedback">Haptic Feedback</label>
            </div>
          </div>
        </div>

        {/* Tactile Section */}
        <div className={styles.section}>
          <h2>Tactile</h2>
          <div className={styles.subsection}>
            <h3>Touch Pressure Sensitivity</h3>
            <div className={styles.recommendations}>
              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="pressureSensitivity"
                  checked={isOptionSelected('tactile', 'pressure_sensitivity')}
                  onChange={(e) => {
                    const label = e.target.nextElementSibling?.textContent || '';
                    handleCheckboxClick('tactile', 'pressure_sensitivity', label);
                  }}
                />
                <label htmlFor="pressureSensitivity">Pressure sensitivity button</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="lowForceButtons"
                  checked={isOptionSelected('physical', 'low_force_buttons')}
                  onChange={(e) => {
                    const label = e.target.nextElementSibling?.textContent || '';
                    handleCheckboxClick('physical', 'low_force_buttons', label);
                  }}
                />
                <label htmlFor="lowForceButtons">Low-Force Buttons (Database: Physical functional limitations)</label>
              </div>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3>Sensitivity to Vibration and Haptic Feedback</h3>
            <div className={styles.recommendations}>
              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="tactileHapticFeedback"
                  checked={isOptionSelected('low_vision', 'haptic_feedback')}
                  onChange={(e) => {
                    const label = e.target.nextElementSibling?.textContent || '';
                    handleCheckboxClick('low_vision', 'haptic_feedback', label);
                  }}
                />
                <label htmlFor="tactileHapticFeedback">Haptic Feedback</label>
              </div>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3>Texture Sensitivity</h3>
            <div className={styles.recommendations}>
              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="adaptiveController"
                  checked={isOptionSelected('tactile', 'adaptive_controller')}
                  onChange={(e) => {
                    const label = e.target.nextElementSibling?.textContent || '';
                    handleCheckboxClick('tactile', 'adaptive_controller', label);
                  }}
                />
                <label htmlFor="adaptiveController">Adaptive Controller Grip</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="designedLab"
                  checked={isOptionSelected('tactile', 'designed_lab')}
                  onChange={(e) => {
                    const label = e.target.nextElementSibling?.textContent || '';
                    handleCheckboxClick('tactile', 'designed_lab', label);
                  }}
                />
                <label htmlFor="designedLab">Designed Lab</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="adaptiveSwitches"
                  checked={isOptionSelected('adaptive_switches', 'sensory')}
                  onChange={(e) => {
                    const label = e.target.nextElementSibling?.textContent || '';
                    handleCheckboxClick('adaptive_switches', 'sensory', label);
                  }}
                />
                <label htmlFor="adaptiveSwitches">Adaptive Switches (Database: Adaptive Switches -- I. Sensory)</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 修改推荐面板显示 */}
      {(recommendations.length > 0 || activeCodes.size > 0) && (
        <RecommendationDetail
          recommendations={recommendations}
          onClose={handleRemoveCode}
          activeCodes={activeCodes}
        />
      )}
    </div>
  );
};

export default SensoryAssessment; 