import React from 'react';
import styles from './KeyboardAssessment.module.css';

const KeyboardAssessment: React.FC = () => {
  return (
    <div className={styles.container}>
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
            <h3>Range of Motion (ROM)</h3>
            <div className={styles.formGroup}>
              <div className={styles.radioGroup}>
                <label>
                  <input type="radio" name="romStatus" value="unimpaired" />
                  Unimpaired
                </label>
                <label>
                  <input type="radio" name="romStatus" value="impaired" />
                  Impaired
                </label>
              </div>

              <div className={styles.affectedParts}>
                <p>If "impaired" is selected, indicate the affected part(s)</p>
                <div className={styles.partsGrid}>
                  <div className={styles.part}>
                    <span>Hands</span>
                    <div>
                      <label><input type="checkbox" name="handsL" /> L</label>
                      <label><input type="checkbox" name="handsR" /> R</label>
                    </div>
                  </div>
                  <div className={styles.part}>
                    <span>Wrists</span>
                    <div>
                      <label><input type="checkbox" name="wristsL" /> L</label>
                      <label><input type="checkbox" name="wristsR" /> R</label>
                    </div>
                  </div>
                  <div className={styles.part}>
                    <span>Elbow</span>
                    <div>
                      <label><input type="checkbox" name="elbowL" /> L</label>
                      <label><input type="checkbox" name="elbowR" /> R</label>
                    </div>
                  </div>
                  <div className={styles.part}>
                    <span>Shoulders</span>
                    <div>
                      <label><input type="checkbox" name="shouldersL" /> L</label>
                      <label><input type="checkbox" name="shouldersR" /> R</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.recommendations}>
                <div className={styles.checkItem}>
                  <input type="checkbox" id="ergonomicKeyboards" />
                  <label htmlFor="ergonomicKeyboards">Ergonomic Keyboards</label>
                </div>
                <div className={styles.checkItem}>
                  <input type="checkbox" id="splitKeyboards" />
                  <label htmlFor="splitKeyboards">Split Keyboards</label>
                </div>
                <div className={styles.checkItem}>
                  <input type="checkbox" id="gamingKeyboards" />
                  <label htmlFor="gamingKeyboards">Gaming Keyboards</label>
                </div>
                <div className={styles.checkItem}>
                  <input type="checkbox" id="compactKeyboards" />
                  <label htmlFor="compactKeyboards">Compact Keyboards</label>
                </div>
                <div className={styles.checkItem}>
                  <input type="checkbox" id="ergonomicMouse" />
                  <label htmlFor="ergonomicMouse">Ergonomic Mouse</label>
                </div>
                <div className={styles.checkItem}>
                  <input type="checkbox" id="gamingMouse" />
                  <label htmlFor="gamingMouse">Gaming Mouse</label>
                </div>
              </div>
            </div>
          </div>

          {/* Fine Motor Control Section */}
          <div className={styles.subsection}>
            <h3>Fine Motor Control</h3>
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
                <input type="checkbox" id="alternativeInput" />
                <label htmlFor="alternativeInput">Alternative Input Devices</label>
              </div>
              <div className={styles.checkItem}>
                <input type="checkbox" id="keyGuard" />
                <label htmlFor="keyGuard">Key guard/Mouse Guard</label>
              </div>
              <div className={styles.checkItem}>
                <input type="checkbox" id="trackballMouse" />
                <label htmlFor="trackballMouse">Trackball Mouse</label>
              </div>
              <div className={styles.checkItem}>
                <input type="checkbox" id="largeKeyKeyboards" />
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
                <input type="checkbox" id="lowForceKeyboards" />
                <label htmlFor="lowForceKeyboards">Low-Force Keyboards</label>
              </div>
              <div className={styles.checkItem}>
                <input type="checkbox" id="lowForceMouse" />
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
                <input type="checkbox" id="largeKeyKeyboardsVision" />
                <label htmlFor="largeKeyKeyboardsVision">Large-Key Keyboards</label>
              </div>
              <div className={styles.checkItem}>
                <input type="checkbox" id="brailleKeyboards" />
                <label htmlFor="brailleKeyboards">Braille Keyboards</label>
              </div>
            </div>
          </div>

          {/* Severe Functional Impairments Section */}
          <div className={styles.subsection}>
            <h3>5. Severe functional impairments</h3>
            <div className={styles.recommendations}>
              <div className={styles.checkItem}>
                <input type="checkbox" id="headMouthStick" />
                <label htmlFor="headMouthStick">Head/Mouth Stick Keyboard</label>
              </div>
              <div className={styles.checkItem}>
                <input type="checkbox" id="wearableKeyboards" />
                <label htmlFor="wearableKeyboards">Wearable keyboards</label>
              </div>
              <div className={styles.checkItem}>
                <input type="checkbox" id="headMouse" />
                <label htmlFor="headMouse">Head mouse</label>
              </div>
              <div className={styles.checkItem}>
                <input type="checkbox" id="eyeTracking" />
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
  );
};

export default KeyboardAssessment; 