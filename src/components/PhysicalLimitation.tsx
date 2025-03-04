import React, { useState, useEffect } from 'react';
import BackButton from './BackButton';
import styles from './PhysicalLimitation.module.css';
import RecommendationDetail from './RecommendationDetail';
import { supabase } from '../supabaseClient';
import { Recommendation } from './RecommendationDetail';
import ExportButton from './ExportButton';

const PhysicalLimitation: React.FC = () => {
  const [isROMImpaired, setIsROMImpaired] = useState(false);
  const [isStrengthImpaired, setIsStrengthImpaired] = useState(false);
  const [_isDexterityImpaired, setIsDexterityImpaired] = useState(false);
  const [_isMultifunctionalImpaired, setIsMultifunctionalImpaired] = useState(false);
  
  // Store checkbox selection states
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  // Store active codes (for queries)
  const [activeCodes, setActiveCodes] = useState<Set<string>>(new Set());
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  // Define code mapping relationships
  const codeMapping: Record<string, { code: string, table: string }> = {
    'thumbstickExtenders': { code: '1.1.1', table: 'physical_recommendations' },
    'adjustableTrigger': { code: '1.2.1', table: 'physical_recommendations' },
    'flightJoystick': { code: '1.2.2', table: 'physical_recommendations' },
    'gyroscopicControllers': { code: '1.2.3', table: 'physical_recommendations' },
    'paddleAttachments': { code: '1.2.4', table: 'physical_recommendations' },
    'customizableJoysticks': { code: '1.2.5', table: 'physical_recommendations' },
    'controllerMounts': { code: '1.3.1', table: 'physical_recommendations' },
    'adaptiveController': { code: 'AC', table: 'adaptive_controller' },
    'adaptiveSwitches': { code: 'AS', table: 'adaptive_switches' },
    'adjustableTensionThumbsticks': { code: '2.1.1', table: 'physical_recommendations' },
    'lowForceButtons': { code: '2.1.2', table: 'physical_recommendations' },
    'buttonRemapping': { code: 'BR', table: 'adaptive_controller' },
    'oneHandConsoleController': { code: '6.1', table: 'severe_impairment_alter' },
    'quadStick': { code: '6.2', table: 'severe_impairment_alter' },
    'eyeTracking': { code: '6.3', table: 'severe_impairment_alter' }
  };

  // Function to fetch recommendations
  const fetchRecommendations = async () => {
    try {
      // Group queries by table
      const physicalCodes = Array.from(activeCodes).filter(code => 
        Object.values(codeMapping).some(mapping => 
          mapping.code === code && mapping.table === 'physical_recommendations'
        )
      );
      
      const adaptiveControllerCodes = Array.from(activeCodes).filter(code => 
        Object.values(codeMapping).some(mapping => 
          mapping.code === code && mapping.table === 'adaptive_controller'
        )
      );
      
      const adaptiveSwitchesCodes = Array.from(activeCodes).filter(code => 
        Object.values(codeMapping).some(mapping => 
          mapping.code === code && mapping.table === 'adaptive_switches'
        )
      );
      
      const severeCodes = Array.from(activeCodes).filter(code => 
        Object.values(codeMapping).some(mapping => 
          mapping.code === code && mapping.table === 'severe_impairment_alter'
        )
      );

      let newRecommendations: Recommendation[] = [];

      // Query physical_recommendations table
      if (physicalCodes.length > 0) {
        const { data: physicalData, error: physicalError } = await supabase
          .from('physical_recommendations')
          .select('*')
          .in('code', physicalCodes);

        if (physicalError) throw physicalError;
        
        if (physicalData) {
          const formattedData = physicalData.map(item => ({
            id: item.id,
            code: item.code,
            category: item.product || item.category || '',
            subcategory: item.subcategory || '',
            product: item.product || '',
            website: item.website || '',
            description: item.description || item.subcategory || null,
            image_url: item.image_url || null
          }));
          
          newRecommendations = [...newRecommendations, ...formattedData];
        }
      }

      // Query adaptive_controller table - get entire table
      if (adaptiveControllerCodes.length > 0) {
        const { data: controllerData, error: controllerError } = await supabase
          .from('adaptive_controllers')
          .select('*');

        if (controllerError) throw controllerError;
        
        if (controllerData) {
          const formattedData = controllerData.map(item => ({
            id: item.id,
            code: 'AC', // Using fixed code for all items
            category: 'Adaptive Controller',
            subcategory: item.category || '',
            product: item.product || '',
            website: item.website || '',
            description: item.category || null,
            image_url: item.image || null
          }));
          
          newRecommendations = [...newRecommendations, ...formattedData];
        }
      }

      // Query adaptive_switches table - get entire table
      if (adaptiveSwitchesCodes.length > 0) {
        const { data: switchesData, error: switchesError } = await supabase
          .from('adaptive_switches')
          .select('*');

        if (switchesError) throw switchesError;
        
        if (switchesData) {
          const formattedData = switchesData.map(item => ({
            id: item.id,
            code: 'AS', // Using fixed code for all items
            category: 'Adaptive Switches',
            subcategory: item.category || '',
            product: item.product || '',
            website: item.website || '',
            description: item.category || null,
            image_url: item.image || null
          }));
          
          newRecommendations = [...newRecommendations, ...formattedData];
        }
      }

      // Query severe_impairment_alter table
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
            category: item.product || item.category || '',  // Use product name as primary title
            subcategory: item.subcategory || '',
            product: item.product || '',
            website: item.website || '',
            description: item.description || item.subcategory || null,
            image_url: item.image_url || null
          }));
          
          newRecommendations = [...newRecommendations, ...formattedData];
        }
      }

      // Append new recommendations rather than replacing
      setRecommendations(prevRecs => {
        // Create a set of IDs to check for duplicates
        const existingIds = new Set(prevRecs.map(rec => rec.id));
        
        // Filter out existing recommendations
        const uniqueNewRecs = newRecommendations.filter(rec => !existingIds.has(rec.id));
        
        // Return merged array
        return [...prevRecs, ...uniqueNewRecs];
      });
    } catch (err) {
      console.error(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Handle checkbox click
  const handleCheckboxClick = (id: string, label?: string) => {
    // Check if deselecting
    const isRemoving = checkedItems.has(id);
    
    // Update selection state
    setCheckedItems(prev => {
      const newChecked = new Set(prev);
      if (isRemoving) {
        newChecked.delete(id);
      } else {
        newChecked.add(id);
      }
      return newChecked;
    });
    
    // Store the label for this checkbox if provided
    if (label && !isRemoving) {
      const mapping = codeMapping[id];
      if (mapping) {
        // Store in sessionStorage
        const labelMap = JSON.parse(sessionStorage.getItem('checkboxLabels') || '{}');
        labelMap[mapping.code] = label;
        sessionStorage.setItem('checkboxLabels', JSON.stringify(labelMap));
      }
    }
    
    // If deselecting, call handleRemoveCode
    if (isRemoving) {
      const mapping = codeMapping[id];
      if (mapping) {
        handleRemoveCode(mapping.code);
      }
    }
  };

  // Use useEffect to manage activeCodes
  useEffect(() => {
    // Collect all codes from selected checkboxes
    const newActiveCodes = new Set<string>();
    checkedItems.forEach(checkboxId => {
      const mapping = codeMapping[checkboxId];
      if (mapping) {
        newActiveCodes.add(mapping.code);
      }
    });
    
    setActiveCodes(newActiveCodes);
  }, [checkedItems]);

  // Check if option is selected
  const isOptionSelected = (id: string) => {
    return checkedItems.has(id);
  };

  // When active codes change, fetch new data
  useEffect(() => {
    if (activeCodes.size > 0) {
      fetchRecommendations();
    } else {
      setRecommendations([]);
    }
  }, [activeCodes]);

  // Remove a code from recommendation panel
  const handleRemoveCode = (code: string) => {
    // Find all checkboxes referencing this code
    const relatedCheckboxes = Object.entries(codeMapping)
      .filter(([_, mapping]) => mapping.code === code)
      .map(([key]) => key);

    // Uncheck all related checkboxes
    setCheckedItems(prev => {
      const newChecked = new Set(prev);
      relatedCheckboxes.forEach(id => newChecked.delete(id));
      return newChecked;
    });

    // Remove from active codes
    setActiveCodes(prev => {
      const newCodes = new Set(prev);
      newCodes.delete(code);
      return newCodes;
    });

    // Remove related items from recommendations list
    setRecommendations(prevRecs => prevRecs.filter(rec => rec.code !== code));
  };

  const handleROMChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsROMImpaired(event.target.value === 'impaired');
  };

  const handleStrengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsStrengthImpaired(event.target.value === 'impaired');
  };

  const handleDexterityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDexterityImpaired(event.target.value === 'impaired');
  };

  const handleMultifunctionalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsMultifunctionalImpaired(event.target.value === 'impaired');
  };

  return (
    <div className={styles.container} id="physical-limitation-content">
      <div className={styles.header}>
        <BackButton />
        <ExportButton 
          title="Physical Assessment"
          contentId="physical-limitation-content"
          formType="physical"
        />
      </div>
      
      <h1 className={styles.title}>Physical Limitation Assessment</h1>
      
      <div className={styles.mainContent}>
        <div className={styles.databaseNote}>
          <h3>Specific Related Database:</h3>
          <div className={styles.checkItem}>
            <input 
              type="checkbox" 
              id="adaptiveSwitches" 
              checked={isOptionSelected('adaptiveSwitches')}
              onChange={() => handleCheckboxClick('adaptiveSwitches', 'Adaptive Switches - see database Adaptive Switches')}
            />
            <label htmlFor="adaptiveSwitches">Adaptive Switches - see database Adaptive Switches</label>
          </div>
          <div className={styles.checkItem}>
            <input 
              type="checkbox" 
              id="adaptiveController" 
              checked={isOptionSelected('adaptiveController')}
              onChange={() => handleCheckboxClick('adaptiveController', 'Adaptive Controller -- see database Adaptive Controller')}
            />
            <label htmlFor="adaptiveController">Adaptive Controller -- see database Adaptive Controller</label>
          </div>
        </div>

        <div className={styles.assessmentTable}>
          {/* Physical Section Header */}
          <div className={styles.tableHeader}>
            <div className={styles.headerCell}>Physical</div>
            <div className={styles.headerCell}></div>
            <div className={styles.headerCell}></div>
            <div className={styles.headerCell}>Recommend Products Database</div>
      </div>

          {/* Range of Motion Section */}
          <div className={styles.tableRow}>
            <div className={styles.labelCell}>
              <h3>1. Range of Motion (ROM) Limitations</h3>
            </div>
            <div className={styles.contentCell}>
              <h4>Hands ROM</h4>
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
              <div className={styles.note}>
                If "impaired" is selected, proceed to the sub-items
              </div>
            </div>
            <div className={styles.contentCell}>
              <div className={styles.fingerSection}>
                <h4>1.1 Thumb</h4>
                <div className={styles.sideBySide}>
                  <label>L <input type="checkbox" disabled={!isROMImpaired} /></label>
                  <label>R <input type="checkbox" disabled={!isROMImpaired} /></label>
                </div>
                
                <h4>1.2 Other Fingers</h4>
                <div className={styles.fingersList}>
                  <div className={styles.fingerItem}>
                    <span>Index finger</span>
                    <div className={styles.sideBySide}>
                      <label>L <input type="checkbox" disabled={!isROMImpaired} /></label>
                      <label>R <input type="checkbox" disabled={!isROMImpaired} /></label>
                    </div>
                  </div>
                  <div className={styles.fingerItem}>
                    <span>Middle Finger</span>
                    <div className={styles.sideBySide}>
                      <label>L <input type="checkbox" disabled={!isROMImpaired} /></label>
                      <label>R <input type="checkbox" disabled={!isROMImpaired} /></label>
                    </div>
                  </div>
                  <div className={styles.fingerItem}>
                    <span>Ring Finger</span>
                    <div className={styles.sideBySide}>
                      <label>L <input type="checkbox" disabled={!isROMImpaired} /></label>
                      <label>R <input type="checkbox" disabled={!isROMImpaired} /></label>
                    </div>
                  </div>
                  <div className={styles.fingerItem}>
                    <span>Little Finger</span>
                    <div className={styles.sideBySide}>
                      <label>L <input type="checkbox" disabled={!isROMImpaired} /></label>
                      <label>R <input type="checkbox" disabled={!isROMImpaired} /></label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.recommendationsCell}>
              <div className={styles.databaseTitle}>* Database: Physical Functional Limitations</div>
              <div className={styles.recommendList}>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="thumbstickExtenders" 
                    checked={isOptionSelected('thumbstickExtenders')}
                    onChange={() => handleCheckboxClick('thumbstickExtenders', '1.1.1 Thumbstick Extenders/ Customizable Thumbsticks')}
                  />
                  <label htmlFor="thumbstickExtenders">1.1.1 Thumbstick Extenders/ Customizable Thumbsticks</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="adjustableTrigger" 
                    checked={isOptionSelected('adjustableTrigger')}
                    onChange={() => handleCheckboxClick('adjustableTrigger', '1.2.1 Adjustable trigger lengths')}
                  />
                  <label htmlFor="adjustableTrigger">1.2.1 Adjustable trigger lengths</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="flightJoystick" 
                    checked={isOptionSelected('flightJoystick')}
                    onChange={() => handleCheckboxClick('flightJoystick', '1.2.2 Flight Joystick')}
                  />
                  <label htmlFor="flightJoystick">1.2.2 Flight Joystick</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="gyroscopicControllers" 
                    checked={isOptionSelected('gyroscopicControllers')}
                    onChange={() => handleCheckboxClick('gyroscopicControllers', '1.2.3 Gyroscopic Controllers (Motion-Sensitive)')}
                  />
                  <label htmlFor="gyroscopicControllers">1.2.3 Gyroscopic Controllers (Motion-Sensitive)</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="paddleAttachments" 
                    checked={isOptionSelected('paddleAttachments')}
                    onChange={() => handleCheckboxClick('paddleAttachments', '1.2.4 Paddle Attachments (Elite Controllers Only)')}
                  />
                  <label htmlFor="paddleAttachments">1.2.4 Paddle Attachments (Elite Controllers Only)</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="customizableJoysticks" 
                    checked={isOptionSelected('customizableJoysticks')}
                    onChange={() => handleCheckboxClick('customizableJoysticks', '1.2.5 Customizable Joysticks/D-Pads')}
                  />
                  <label htmlFor="customizableJoysticks">1.2.5 Customizable Joysticks/D-Pads</label>
                </div>
              </div>
            </div>
          </div>

          {/* ROM Additional Section */}
          <div className={styles.tableRow}>
            <div className={styles.labelCell}></div>
            <div className={styles.contentCell}>
              <h4>1.3 ROM</h4>
              <div className={styles.radioGroup}>
                <label>
                  <input type="radio" name="romAdditional" value="unimpaired" />
                  Unimpaired
                </label>
                <label>
                  <input type="radio" name="romAdditional" value="impaired" />
                  Impaired
                </label>
              </div>
              <div className={styles.note}>
                If "impaired" is selected, indicate the affected part(s)
              </div>
            </div>
            <div className={styles.contentCell}>
              <div className={styles.jointsList}>
                <div className={styles.jointItem}>
                  <span>Wrist</span>
                  <div className={styles.sideBySide}>
                    <label>L <input type="checkbox" /></label>
                    <label>R <input type="checkbox" /></label>
                  </div>
                </div>
                <div className={styles.jointItem}>
                  <span>Elbow</span>
                  <div className={styles.sideBySide}>
                    <label>L <input type="checkbox" /></label>
                    <label>R <input type="checkbox" /></label>
                  </div>
                </div>
                <div className={styles.jointItem}>
                  <span>Shoulder</span>
                <div className={styles.sideBySide}>
                  <label>L <input type="checkbox" /></label>
                  <label>R <input type="checkbox" /></label>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.recommendationsCell}>
              <div className={styles.recommendList}>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="controllerMounts" 
                    checked={isOptionSelected('controllerMounts')}
                    onChange={() => handleCheckboxClick('controllerMounts', '1.3.1 Controller Mounts')}
                  />
                  <label htmlFor="controllerMounts">1.3.1 Controller Mounts</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="adaptiveController2" 
                    checked={isOptionSelected('adaptiveController')}
                    onChange={() => handleCheckboxClick('adaptiveController', 'Adaptive Controller')}
                  />
                  <label htmlFor="adaptiveController2">Adaptive Controller</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="adaptiveSwitches2" 
                    checked={isOptionSelected('adaptiveSwitches')}
                    onChange={() => handleCheckboxClick('adaptiveSwitches', 'Adaptive Switches')}
                  />
                  <label htmlFor="adaptiveSwitches2">Adaptive Switches</label>
                </div>
              </div>
            </div>
          </div>

          {/* Strength Limitations Section */}
          <div className={styles.tableRow}>
            <div className={styles.labelCell}>
              <h3>2. Strength Limitations</h3>
            </div>
            <div className={styles.contentCell}>
              <h4>Hand strength</h4>
              <div className={styles.radioGroup}>
                <label>
                  <input 
                    type="radio" 
                    name="strengthStatus" 
                    value="unimpaired" 
                    onChange={handleStrengthChange}
                  />
                  Unimpaired
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="strengthStatus" 
                    value="impaired" 
                    onChange={handleStrengthChange}
                  />
                  Impaired
                </label>
              </div>
              <div className={styles.note}>
                If "impaired" is selected, indicate the affected part(s)
              </div>
            </div>
            <div className={styles.contentCell}>
              <div className={styles.fingerSection}>
                <h4>2.1 Thumb</h4>
                <div className={styles.sideBySide}>
                  <label>L <input type="checkbox" disabled={!isStrengthImpaired} /></label>
                  <label>R <input type="checkbox" disabled={!isStrengthImpaired} /></label>
                </div>
                
                <h4>2.2 Other Fingers</h4>
                <div className={styles.fingersList}>
                  <div className={styles.fingerItem}>
                    <span>Index Finger</span>
                    <div className={styles.sideBySide}>
                      <label>L <input type="checkbox" disabled={!isStrengthImpaired} /></label>
                      <label>R <input type="checkbox" disabled={!isStrengthImpaired} /></label>
                    </div>
                  </div>
                  <div className={styles.fingerItem}>
                    <span>Middle Finger</span>
                    <div className={styles.sideBySide}>
                      <label>L <input type="checkbox" disabled={!isStrengthImpaired} /></label>
                      <label>R <input type="checkbox" disabled={!isStrengthImpaired} /></label>
                    </div>
                  </div>
                  <div className={styles.fingerItem}>
                    <span>Ring Finger</span>
                    <div className={styles.sideBySide}>
                      <label>L <input type="checkbox" disabled={!isStrengthImpaired} /></label>
                      <label>R <input type="checkbox" disabled={!isStrengthImpaired} /></label>
                    </div>
                  </div>
                  <div className={styles.fingerItem}>
                    <span>Little Finger</span>
                    <div className={styles.sideBySide}>
                      <label>L <input type="checkbox" disabled={!isStrengthImpaired} /></label>
                      <label>R <input type="checkbox" disabled={!isStrengthImpaired} /></label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.recommendationsCell}>
              <div className={styles.databaseTitle}>*Database: Physical Functional Limitations</div>
              <div className={styles.recommendList}>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="adjustableTensionThumbsticks" 
                    checked={isOptionSelected('adjustableTensionThumbsticks')}
                    onChange={() => handleCheckboxClick('adjustableTensionThumbsticks', '2.1.1 Adjustable tension thumbsticks')}
                  />
                  <label htmlFor="adjustableTensionThumbsticks">2.1.1 Adjustable tension thumbsticks</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="lowForceButtons" 
                    checked={isOptionSelected('lowForceButtons')}
                    onChange={() => handleCheckboxClick('lowForceButtons', '2.1.2 Low-Force Buttons')}
                  />
                  <label htmlFor="lowForceButtons">2.1.2 Low-Force Buttons</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="paddleAttachments2" 
                    checked={isOptionSelected('paddleAttachments')}
                    onChange={() => handleCheckboxClick('paddleAttachments', '1.2.4 Paddle Attachments')}
                  />
                  <label htmlFor="paddleAttachments2">1.2.4 Paddle Attachments</label>
                </div>
              </div>
            </div>
          </div>

          {/* Other Strength Section */}
          <div className={styles.tableRow}>
            <div className={styles.labelCell}></div>
            <div className={styles.contentCell}>
              <h4>2.3 Other Strength</h4>
              <div className={styles.radioGroup}>
                <label>
                  <input type="radio" name="otherStrength" value="unimpaired" />
                  Unimpaired
                </label>
                <label>
                  <input type="radio" name="otherStrength" value="impaired" />
                  Impaired
                </label>
              </div>
              <div className={styles.note}>
                If "impaired" is selected, indicate the affected part(s)
              </div>
            </div>
            <div className={styles.contentCell}>
              <div className={styles.jointsList}>
                <div className={styles.jointItem}>
                  <span>Wrist</span>
                  <div className={styles.sideBySide}>
                    <label>L <input type="checkbox" /></label>
                    <label>R <input type="checkbox" /></label>
                  </div>
                </div>
                <div className={styles.jointItem}>
                  <span>Elbow</span>
                    <div className={styles.sideBySide}>
                      <label>L <input type="checkbox" /></label>
                      <label>R <input type="checkbox" /></label>
                    </div>
                </div>
                <div className={styles.jointItem}>
                  <span>Shoulder</span>
                  <div className={styles.sideBySide}>
                    <label>L <input type="checkbox" /></label>
                    <label>R <input type="checkbox" /></label>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.recommendationsCell}>
              <div className={styles.databaseTitle}>*Database Physical Functional Limitations Mount</div>
                <div className={styles.recommendList}>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="controllerMounts2" 
                    checked={isOptionSelected('controllerMounts')}
                    onChange={() => handleCheckboxClick('controllerMounts', '1.3.1 Controller Mounts')}
                  />
                  <label htmlFor="controllerMounts2">1.3.1 Controller Mounts</label>
                </div>
                <div className={styles.checkItem}>
                  <input type="checkbox" id="lightweightControllers" />
                  <label htmlFor="lightweightControllers">2.3.1 Lightweight Controllers</label>
                </div>
              </div>
            </div>
          </div>

          {/* Dexterity/Fine Motor Section */}
          <div className={styles.tableRow}>
            <div className={styles.labelCell}>
              <h3>3. Dexterity/Fine Motor Skill limitations/ Tremors or Involuntary Movements/ Collaboration</h3>
            </div>
            <div className={styles.contentCell}>
              <div className={styles.sideBySide}>
                <span>L)</span>
                <div className={styles.radioGroup}>
                  <label>
                    <input 
                      type="radio" 
                      name="dexterityLeft" 
                      value="unimpaired" 
                      onChange={handleDexterityChange}
                    />
                    Unimpaired
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="dexterityLeft" 
                      value="impaired" 
                      onChange={handleDexterityChange}
                    />
                    Impaired
                  </label>
                </div>
              </div>
              <div className={styles.sideBySide}>
                <span>R)</span>
                <div className={styles.radioGroup}>
                  <label>
                    <input 
                      type="radio" 
                      name="dexterityRight" 
                      value="unimpaired" 
                    />
                    Unimpaired
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="dexterityRight" 
                      value="impaired" 
                    />
                    Impaired
                  </label>
                </div>
              </div>
            </div>
            <div className={styles.contentCell}>
              {/* This cell intentionally left empty for layout purposes */}
            </div>
            <div className={styles.recommendationsCell}>
              <div className={styles.recommendList}>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="adaptiveSwitches3" 
                    checked={isOptionSelected('adaptiveSwitches')}
                    onChange={() => handleCheckboxClick('adaptiveSwitches', 'Adaptive Switches')}
                  />
                  <label htmlFor="adaptiveSwitches3">Adaptive Switches</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="adaptiveController3" 
                    checked={isOptionSelected('adaptiveController')}
                    onChange={() => handleCheckboxClick('adaptiveController', 'Adaptive Controller')}
                  />
                  <label htmlFor="adaptiveController3">Adaptive Controller</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="buttonRemapping" 
                    checked={isOptionSelected('buttonRemapping')}
                    onChange={() => handleCheckboxClick('buttonRemapping', 'Button Re-Mapping and Accessibility Features')}
                  />
                  <label htmlFor="buttonRemapping">Button Re-Mapping and Accessibility Features</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="controllerMounts3" 
                    checked={isOptionSelected('controllerMounts')}
                    onChange={() => handleCheckboxClick('controllerMounts', '1.3.1 Controller Mounts')}
                  />
                  <label htmlFor="controllerMounts3">1.3.1 Controller Mounts</label>
                </div>
              </div>
            </div>
          </div>

          {/* Multifunctional Impairment Section */}
          <div className={styles.tableRow}>
            <div className={styles.labelCell}>
              <h3>4. Multifunctional Impairment (e.g. ROM, strength limitation, dexterity)</h3>
            </div>
            <div className={styles.contentCell}>
              <div className={styles.radioGroup}>
                <label>
                  <input 
                    type="radio" 
                    name="multifunctionalStatus" 
                    value="unimpaired" 
                    onChange={handleMultifunctionalChange}
                  />
                  Unimpaired
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="multifunctionalStatus" 
                    value="impaired" 
                    onChange={handleMultifunctionalChange}
                  />
                  Impaired
                </label>
              </div>
            </div>
            <div className={styles.contentCell}>
              {/* This cell intentionally left empty for layout purposes */}
            </div>
            <div className={styles.recommendationsCell}>
              <div className={styles.recommendList}>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="adaptiveSwitches4" 
                    checked={isOptionSelected('adaptiveSwitches')}
                    onChange={() => handleCheckboxClick('adaptiveSwitches', 'Adaptive Switches')}
                  />
                  <label htmlFor="adaptiveSwitches4">Adaptive Switches</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="adaptiveController4" 
                    checked={isOptionSelected('adaptiveController')}
                    onChange={() => handleCheckboxClick('adaptiveController', 'Adaptive Controller')}
                  />
                  <label htmlFor="adaptiveController4">Adaptive Controller</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="oneHandConsoleController" 
                    checked={isOptionSelected('oneHandConsoleController')}
                    onChange={() => handleCheckboxClick('oneHandConsoleController', '6.1 One-hand Console controller (Database: Severe Impairment alter)')}
                  />
                  <label htmlFor="oneHandConsoleController">6.1 One-hand Console controller (Database: Severe Impairment alter)</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="controllerMounts4" 
                    checked={isOptionSelected('controllerMounts')}
                    onChange={() => handleCheckboxClick('controllerMounts', '1.3.1 Controller Mounts')}
                  />
                  <label htmlFor="controllerMounts4">1.3.1 Controller Mounts</label>
                </div>
              </div>
            </div>
          </div>

          {/* Severe Impairments Section */}
          <div className={styles.tableRow}>
            <div className={styles.labelCell}>
              <h3>*5. Severe Impairments alternative control:</h3>
              <p>* If the client presents with severe impairments:</p>
              <ul>
                <li>Assess the relevant functions outlined in the right column.</li>
                <li>If the client demonstrates full function or only mild impairment in this area, consider using alternative controllers.</li>
              </ul>
            </div>
            <div className={styles.contentCell}>
              <h4>5.1 Hand Function (Assess the unaffected hand)</h4>
              <div className={styles.sideBySide}>
                <label>L <input type="checkbox" /></label>
                <label>R <input type="checkbox" /></label>
              </div>
              <p className={styles.note}>*For clients with full or mild functional impairment in one hand, particularly the dominant hand.</p>
            </div>
            <div className={styles.contentCell}>
              <h4>ROM</h4>
              <div className={styles.radioGroup}>
                <label>
                  <input type="radio" name="severeROM" value="unimpaired" />
                  Unimpaired
                </label>
                <label>
                  <input type="radio" name="severeROM" value="impaired" />
                  Impaired
                </label>
              </div>
              <div className={styles.note}>
                If "impaired" is selected, indicate the affected part(s)
              </div>
              <div className={styles.checkboxList}>
                <label><input type="checkbox" /> Fingers</label>
                <label><input type="checkbox" /> Wrist</label>
                <label><input type="checkbox" /> Elbow</label>
                <label><input type="checkbox" /> Shoulder</label>
              </div>
              
              <h4>Strength</h4>
              <div className={styles.radioGroup}>
                <label>
                  <input type="radio" name="severeStrength" value="unimpaired" />
                  Unimpaired
                </label>
                <label>
                  <input type="radio" name="severeStrength" value="impaired" />
                  Impaired
                </label>
              </div>
              
              <h4>Dexterity/ Fine Motor Skill</h4>
              <div className={styles.radioGroup}>
                <label>
                  <input type="radio" name="severeDexterity" value="unimpaired" />
                  Unimpaired
                </label>
                <label>
                  <input type="radio" name="severeDexterity" value="impaired" />
                  Impaired
                </label>
              </div>
            </div>
            <div className={styles.recommendationsCell}>
              <div className={styles.databaseTitle}>*Database: Severe Impairments alter</div>
              <div className={styles.recommendList}>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="oneHandConsoleController2" 
                    checked={isOptionSelected('oneHandConsoleController')}
                    onChange={() => handleCheckboxClick('oneHandConsoleController', '6.1 One-hand Console controller')}
                  />
                  <label htmlFor="oneHandConsoleController2">6.1 One-hand Console controller</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="controllerMounts5" 
                    checked={isOptionSelected('controllerMounts')}
                    onChange={() => handleCheckboxClick('controllerMounts', '1.3.1 Controller Mounts')}
                  />
                  <label htmlFor="controllerMounts5">1.3.1 Controller Mounts</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="adaptiveSwitches5" 
                    checked={isOptionSelected('adaptiveSwitches')}
                    onChange={() => handleCheckboxClick('adaptiveSwitches', 'Adaptive Switches')}
                  />
                  <label htmlFor="adaptiveSwitches5">Adaptive Switches</label>
                </div>
              </div>
            </div>
          </div>

          {/* Mouth Controller Section */}
          <div className={styles.tableRow}>
            <div className={styles.labelCell}></div>
            <div className={styles.contentCell}>
              <h4>5.2 Mouth Controller (Observing during trial)</h4>
              <div className={styles.radioGroup}>
                <label>
                  <input type="radio" name="mouthController" value="unimpaired" />
                  Unimpaired
                </label>
                <label>
                  <input type="radio" name="mouthController" value="impaired" />
                  Impaired
                </label>
              </div>
            </div>
            <div className={styles.contentCell}>
              <div className={styles.mouthAssessment}>
                <div className={styles.mouthItem}>
                  <span>• Mouth open/ close</span>
                  <div className={styles.radioGroup}>
                    <label>
                      <input type="radio" name="mouthOpen" value="unimpaired" />
                      Unimpaired
                    </label>
                    <label>
                      <input type="radio" name="mouthOpen" value="impaired" />
                      Impaired
                    </label>
                  </div>
                </div>
                <div className={styles.mouthItem}>
                  <span>• Lip Strength and Dexterity</span>
                  <div className={styles.radioGroup}>
                    <label>
                      <input type="radio" name="lipStrength" value="unimpaired" />
                      Unimpaired
                    </label>
                    <label>
                      <input type="radio" name="lipStrength" value="impaired" />
                      Impaired
                    </label>
                  </div>
                </div>
                <div className={styles.mouthItem}>
                  <span>• Lip pucker</span>
                  <div className={styles.radioGroup}>
                    <label>
                      <input type="radio" name="lipPucker" value="unimpaired" />
                      Unimpaired
                    </label>
                    <label>
                      <input type="radio" name="lipPucker" value="impaired" />
                      Impaired
                    </label>
                  </div>
                </div>
                <div className={styles.mouthItem}>
                  <span>• Sip/ puff</span>
                  <div className={styles.radioGroup}>
                    <label>
                      <input type="radio" name="sipPuff" value="unimpaired" />
                      Unimpaired
                    </label>
                    <label>
                      <input type="radio" name="sipPuff" value="impaired" />
                      Impaired
                    </label>
                  </div>
                </div>
                <div className={styles.mouthItem}>
                  <span>• Tongue mobility</span>
                  <div className={styles.radioGroup}>
                    <label>
                      <input type="radio" name="tongueMobility" value="unimpaired" />
                      Unimpaired
                    </label>
                    <label>
                      <input type="radio" name="tongueMobility" value="impaired" />
                      Impaired
                    </label>
                  </div>
                </div>
                <div className={styles.mouthItem}>
                  <span>• Chin Extension</span>
                  <div className={styles.radioGroup}>
                    <label>
                      <input type="radio" name="chinExtension" value="unimpaired" />
                      Unimpaired
                    </label>
                    <label>
                      <input type="radio" name="chinExtension" value="impaired" />
                      Impaired
                    </label>
                  </div>
                </div>
                <div className={styles.mouthItem}>
                  <span>• Combination</span>
                  <div className={styles.radioGroup}>
                    <label>
                      <input type="radio" name="combination" value="unimpaired" />
                      Unimpaired
                    </label>
                    <label>
                      <input type="radio" name="combination" value="impaired" />
                      Impaired
                    </label>
                  </div>
                </div>
                <div className={styles.mouthItem}>
                  <span>• Neck Flexion</span>
                  <div className={styles.radioGroup}>
                    <label>
                      <input type="radio" name="neckFlexion" value="unimpaired" />
                      Unimpaired
                    </label>
                    <label>
                      <input type="radio" name="neckFlexion" value="impaired" />
                      Impaired
                    </label>
                  </div>
                </div>
                <div className={styles.mouthItem}>
                  <span>• Neck Extension</span>
                  <div className={styles.radioGroup}>
                    <label>
                      <input type="radio" name="neckExtension" value="unimpaired" />
                      Unimpaired
                    </label>
                    <label>
                      <input type="radio" name="neckExtension" value="impaired" />
                      Impaired
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.recommendationsCell}>
              <div className={styles.databaseTitle}>* Database: Severe Impairments alternative -- Mouth control</div>
              <div className={styles.recommendList}>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="quadStick" 
                    checked={isOptionSelected('quadStick')}
                    onChange={() => handleCheckboxClick('quadStick', '6.2 QuadStick')}
                  />
                  <label htmlFor="quadStick">6.2 QuadStick</label>
                </div>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="adaptiveSwitches6" 
                    checked={isOptionSelected('adaptiveSwitches')}
                    onChange={() => handleCheckboxClick('adaptiveSwitches', 'Adaptive Switches')}
                  />
                  <label htmlFor="adaptiveSwitches6">Adaptive Switches</label>
                </div>
              </div>
            </div>
          </div>

          {/* Eye Gaze Section */}
          <div className={styles.tableRow}>
            <div className={styles.labelCell}></div>
            <div className={styles.contentCell}>
              <h4>5.3 Eye Gaze</h4>
            </div>
            <div className={styles.contentCell}>
              <div className={styles.eyeAssessment}>
                <div className={styles.eyeItem}>
                  <span>• Vision</span>
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
                </div>
                <div className={styles.eyeItem}>
                  <span>• Neck Flexion</span>
                  <div className={styles.radioGroup}>
                    <label>
                      <input type="radio" name="eyeNeckFlexion" value="unimpaired" />
                      Unimpaired
                    </label>
                    <label>
                      <input type="radio" name="eyeNeckFlexion" value="impaired" />
                      Impaired
                    </label>
                  </div>
                </div>
                <div className={styles.eyeItem}>
                  <span>• Neck Extension</span>
                  <div className={styles.radioGroup}>
                    <label>
                      <input type="radio" name="eyeNeckExtension" value="unimpaired" />
                      Unimpaired
                    </label>
                    <label>
                      <input type="radio" name="eyeNeckExtension" value="impaired" />
                      Impaired
                    </label>
                  </div>
                </div>
                <div className={styles.eyeItem}>
                  <span>• Stable head positioning</span>
                  <div className={styles.radioGroup}>
                    <label>
                      <input type="radio" name="headPositioning" value="unimpaired" />
                      Unimpaired
                    </label>
                    <label>
                      <input type="radio" name="headPositioning" value="impaired" />
                      Impaired
                    </label>
                  </div>
                </div>
                <div className={styles.eyeItem}>
                  <span>• Gaze Fixation</span>
                  <div className={styles.radioGroup}>
                    <label>
                      <input type="radio" name="gazeFixation" value="unimpaired" />
                      Unimpaired
                    </label>
                    <label>
                      <input type="radio" name="gazeFixation" value="impaired" />
                      Impaired
                    </label>
                  </div>
                </div>
                <div className={styles.eyeItem}>
                  <span>• Eye Tracking</span>
                  <div className={styles.radioGroup}>
                    <label>
                      <input type="radio" name="eyeTracking" value="unimpaired" />
                      Unimpaired
                    </label>
                    <label>
                      <input type="radio" name="eyeTracking" value="impaired" />
                      Impaired
                    </label>
                  </div>
                </div>
                <div className={styles.eyeItem}>
                  <span>• Fine Motor Eye Control</span>
                  <div className={styles.radioGroup}>
                    <label>
                      <input type="radio" name="fineMotorEye" value="unimpaired" />
                      Unimpaired
                    </label>
                    <label>
                      <input type="radio" name="fineMotorEye" value="impaired" />
                      Impaired
                    </label>
                  </div>
                </div>
                <div className={styles.eyeItem}>
                  <span>• Blinking and Gaze Activation</span>
                  <div className={styles.radioGroup}>
                    <label>
                      <input type="radio" name="blinkingGaze" value="unimpaired" />
                      Unimpaired
                    </label>
                    <label>
                      <input type="radio" name="blinkingGaze" value="impaired" />
                      Impaired
                    </label>
                  </div>
                </div>
                <div className={styles.eyeItem}>
                  <span>• Eye Fatigue and Endurance: (Specify duration of fatigue onset: _____ minutes)</span>
                </div>
                <div className={styles.customizationNeeds}>
                  <p>Customization Needs:</p>
                  <textarea rows={3} className={styles.customizationTextarea}></textarea>
                </div>
              </div>
            </div>
            <div className={styles.recommendationsCell}>
              <div className={styles.databaseTitle}>* Database: Severe Impairments alternative -- Mouth control</div>
              <div className={styles.recommendList}>
                <div className={styles.checkItem}>
                  <input 
                    type="checkbox" 
                    id="eyeTracking" 
                    checked={isOptionSelected('eyeTracking')}
                    onChange={() => handleCheckboxClick('eyeTracking', '6.3 Eye tracking')}
                  />
                  <label htmlFor="eyeTracking">6.3 Eye tracking</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations panel */}
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

export default PhysicalLimitation; 