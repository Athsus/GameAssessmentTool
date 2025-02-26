import React, { useState, useEffect } from 'react';
import BackButton from './BackButton';
import styles from './SensoryAssessment.module.css';
import RecommendationDetail from './RecommendationDetail';
import { supabase } from '../supabaseClient';
import { Recommendation } from './RecommendationDetail';

const SensoryAssessment: React.FC = () => {
  // 存储每个 checkbox 的选中状态
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  // 存储活跃的 codes（用于查询）
  const [activeCodes, setActiveCodes] = useState<Set<string>>(new Set());
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  // 定义代码映射关系
  const codeMapping: Record<string, string> = {
    'low_vision-text': '1.1.1',
    'low_vision-color': '1.1.2',
    'low_vision-magnifier': '1.1.3',
    'low_vision-night_mode': '1.1.4',
    'low_vision-narrator': '1.1.5',
    'low_vision-copilot': '1.1.6',
    'low_vision-haptic_feedback': '1.1.7',
    'low_vision-audio_driven': '1.1.8',
    'low_vision-text_to_speech': '1.1.9',
    'cvd-color_blind_modes': '1.2.1',
    'cvd-high_contrast': '1.2.2',
    'tactile-pressure_sensitivity': '3.3.1',
    'tactile-adaptive_controller': '3.3.1',
    'tactile-designed_lab': '3.3.2',
    'physical-low_force_buttons': '2.1.2',
    'adaptive_switches-sensory': 'AS-1',
  };

  // 获取推荐内容的函数
  const fetchRecommendations = async (codes: string[]) => {
    try {
      console.log('SensoryAssessment - fetching recommendations for codes:', codes);
      const { data, error } = await supabase
        .from('sensory_recommendations')
        .select('*')
        .in('code', codes);

      if (error) throw error;
      
      // 关键修改：追加新推荐，而不是替换
      setRecommendations(prevRecs => {
        // 创建一个ID集合，用于检查重复
        const existingIds = new Set(prevRecs.map(rec => rec.id));
        
        // 过滤掉已存在的推荐
        const uniqueNewRecs = (data || []).filter(rec => !existingIds.has(rec.id));
        
        console.log('SensoryAssessment - prevRecs:', prevRecs);
        console.log('SensoryAssessment - data:', data);
        console.log('SensoryAssessment - uniqueNewRecs:', uniqueNewRecs);
        
        // 返回合并后的数组
        const result = [...prevRecs, ...uniqueNewRecs];
        console.log('SensoryAssessment - result:', result);
        return result;
      });
    } catch (err) {
      console.error(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // 处理复选框点击 - 只处理 checkbox 状态
  const handleCheckboxClick = (category: string, subcategory: string) => {
    const checkboxId = `${category}-${subcategory}`;
    
    // 检查是否正在取消选择
    const isRemoving = checkedItems.has(checkboxId);
    
    // 更新选中状态
    setCheckedItems(prev => {
      const newChecked = new Set(prev);
      if (isRemoving) {
        newChecked.delete(checkboxId);
      } else {
        newChecked.add(checkboxId);
      }
      return newChecked;
    });
    
    // 如果是取消选择，直接调用 handleRemoveCode
    if (isRemoving) {
      const code = codeMapping[checkboxId];
      if (code) {
        handleRemoveCode(code);
      }
    }
  };

  // 使用 useEffect 来管理 activeCodes
  useEffect(() => {
    // 收集所有被选中的 checkbox 对应的 codes
    const newActiveCodes = new Set<string>();
    checkedItems.forEach(checkboxId => {
      const code = codeMapping[checkboxId];
      if (code) {
        newActiveCodes.add(code);
      }
    });
    
    setActiveCodes(newActiveCodes);
  }, [checkedItems]);

  // 检查选项是否被选中
  const isOptionSelected = (category: string, subcategory: string) => {
    const checkboxId = `${category}-${subcategory}`;
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
      .filter(([_, value]) => value === code)
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
    <div className={styles.container}>
      <BackButton />
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
                  onChange={() => handleCheckboxClick('low_vision', 'text')}
                />
                <label htmlFor="text">Text: Ensure text is clear and provides context to reduce cognitive load.</label>
              </div>
              
              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="colour"
                  checked={isOptionSelected('low_vision', 'color')}
                  onChange={() => handleCheckboxClick('low_vision', 'color')}
                />
                <label htmlFor="colour">Colour: Use colour to emphasize information and provide additional context.</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="magnifier"
                  checked={isOptionSelected('low_vision', 'magnifier')}
                  onChange={() => handleCheckboxClick('low_vision', 'magnifier')}
                />
                <label htmlFor="magnifier">Magnifier: Allows players to enlarge elements on the screen using a controller or keyboard.</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="nightMode"
                  checked={isOptionSelected('low_vision', 'night_mode')}
                  onChange={() => handleCheckboxClick('low_vision', 'night_mode')}
                />
                <label htmlFor="nightMode">Night Mode: Adjusts screen brightness and colour for easier viewing at night. (helpful for people who are photosensitive)</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="narrator"
                  checked={isOptionSelected('low_vision', 'narrator')}
                  onChange={() => handleCheckboxClick('low_vision', 'narrator')}
                />
                <label htmlFor="narrator">Narrator: A screen reader verbalizes text, buttons, and other on-screen elements.</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="copilot"
                  checked={isOptionSelected('low_vision', 'copilot')}
                  onChange={() => handleCheckboxClick('low_vision', 'copilot')}
                />
                <label htmlFor="copilot">Copilot: Two controllers can work together as one for more accessible gameplay.</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="hapticFeedback"
                  checked={isOptionSelected('low_vision', 'haptic_feedback')}
                  onChange={() => handleCheckboxClick('low_vision', 'haptic_feedback')}
                />
                <label htmlFor="hapticFeedback">Haptic Feedback: Uses vibration and tactile feedback to convey in-game actions and events</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="audioDriven"
                  checked={isOptionSelected('low_vision', 'audio_driven')}
                  onChange={() => handleCheckboxClick('low_vision', 'audio_driven')}
                />
                <label htmlFor="audioDriven">Audio-Driven Gameplay: Relies on sound design and audio cues to guide players through the game.</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="textToSpeech"
                  checked={isOptionSelected('low_vision', 'text_to_speech')}
                  onChange={() => handleCheckboxClick('low_vision', 'text_to_speech')}
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
                  onChange={() => handleCheckboxClick('cvd', 'color_blind_modes')}
                />
                <label htmlFor="colourBlindModes">Colour-blind Modes: Adjust in-game colours to accommodate different types of CVD.</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="highContrast"
                  checked={isOptionSelected('cvd', 'high_contrast')}
                  onChange={() => handleCheckboxClick('cvd', 'high_contrast')}
                />
                <label htmlFor="highContrast">High Contrast: Improves visibility by making items and text easier to differentiate.</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="cvdAudioDriven"
                  checked={isOptionSelected('low_vision', 'audio_driven')}
                  onChange={() => handleCheckboxClick('low_vision', 'audio_driven')}
                />
                <label htmlFor="cvdAudioDriven">Audio-Driven Game-play</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="cvdTextToSpeech"
                  checked={isOptionSelected('low_vision', 'text_to_speech')}
                  onChange={() => handleCheckboxClick('low_vision', 'text_to_speech')}
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
                onChange={() => handleCheckboxClick('audio', 'hearing_accessibility')}
              />
              <label htmlFor="hearingAccessibility">Hearing Accessibility</label>
            </div>

            <div className={styles.checkItem}>
              <input 
                type="checkbox"
                id="visualIndicators"
                checked={isOptionSelected('audio', 'visual_indicators')}
                onChange={() => handleCheckboxClick('audio', 'visual_indicators')}
              />
              <label htmlFor="visualIndicators">Visual Indicators for Audio Cues</label>
            </div>

            <div className={styles.checkItem}>
              <input 
                type="checkbox"
                id="audioCopilot"
                checked={isOptionSelected('low_vision', 'copilot')}
                onChange={() => handleCheckboxClick('low_vision', 'copilot')}
              />
              <label htmlFor="audioCopilot">Copilot</label>
            </div>

            <div className={styles.checkItem}>
              <input 
                type="checkbox"
                id="audioHapticFeedback"
                checked={isOptionSelected('low_vision', 'haptic_feedback')}
                onChange={() => handleCheckboxClick('low_vision', 'haptic_feedback')}
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
                  onChange={() => handleCheckboxClick('tactile', 'pressure_sensitivity')}
                />
                <label htmlFor="pressureSensitivity">Pressure sensitivity button</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="lowForceButtons"
                  checked={isOptionSelected('physical', 'low_force_buttons')}
                  onChange={() => handleCheckboxClick('physical', 'low_force_buttons')}
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
                  onChange={() => handleCheckboxClick('low_vision', 'haptic_feedback')}
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
                  onChange={() => handleCheckboxClick('tactile', 'adaptive_controller')}
                />
                <label htmlFor="adaptiveController">Adaptive Controller Grip</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="designedLab"
                  checked={isOptionSelected('tactile', 'designed_lab')}
                  onChange={() => handleCheckboxClick('tactile', 'designed_lab')}
                />
                <label htmlFor="designedLab">Designed Lab</label>
              </div>

              <div className={styles.checkItem}>
                <input 
                  type="checkbox"
                  id="adaptiveSwitches"
                  checked={isOptionSelected('adaptive_switches', 'sensory')}
                  onChange={() => handleCheckboxClick('adaptive_switches', 'sensory')}
                />
                <label htmlFor="adaptiveSwitches">Adaptive Switches (Database: Adaptive Switches -- I. Sensory)</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 修改推荐面板显示 */}
      {recommendations.length > 0 && (
        <RecommendationDetail
          recommendations={recommendations}
          onClose={handleRemoveCode}
        />
      )}
    </div>
  );
};

export default SensoryAssessment; 