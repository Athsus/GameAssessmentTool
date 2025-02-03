import React from 'react';
import styles from './PhysicalLimitation.module.css';

const PhysicalLimitation: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Functional Limitations Assessment</h2>
        <div className={styles.database}>
          <span>Specific Related Database:</span>
          <label>
            <input type="checkbox" /> Adaptive Switches - see database Adaptive Switches
          </label>
          <label>
            <input type="checkbox" /> Adaptive Controller -- see database Adaptive Controller
          </label>
        </div>
      </div>

      <table className={styles.assessmentTable}>
        <thead>
          <tr>
            <th>Physical</th>
            <th></th>
            <th></th>
            <th>Recommend Products Database</th>
          </tr>
        </thead>
        <tbody>
          {/* Range of Motion Section */}
          <tr>
            <td rowSpan={2}>1. Range of Motion (ROM) Limitations</td>
            <td>
              <div>
                <div>Hands ROM</div>
                <div className={styles.checkboxGroup}>
                  <label><input type="checkbox" /> Unimpaired</label>
                  <label><input type="checkbox" /> Impaired</label>
                </div>
                <div className={styles.note}>
                  If "Impaired" is selected, proceed to the sub-items
                </div>
              </div>
            </td>
            <td>
              <div>
                <div>1.1 Thumb</div>
                <div className={styles.sideBySide}>
                  <label>L <input type="checkbox" /></label>
                  <label>R <input type="checkbox" /></label>
                </div>
                <div>1.2 Other Fingers</div>
                <div className={styles.fingersList}>
                  <div>
                    <span>Index Finger</span>
                    <div className={styles.sideBySide}>
                      <label>L <input type="checkbox" /></label>
                      <label>R <input type="checkbox" /></label>
                    </div>
                  </div>
                  {/* ... other fingers ... */}
                </div>
              </div>
            </td>
            <td>
              <div className={styles.recommendations}>
                <div>* Database: Physical Functional Limitations</div>
                <div className={styles.recommendList}>
                  <label>
                    <input type="checkbox" /> 1.1.1 Thumbstick Extenders/ Customizable Thumbsticks
                  </label>
                  <label>
                    <input type="checkbox" /> 1.2.1 Adjustable trigger lengths
                  </label>
                  {/* ... other recommendations ... */}
                </div>
              </div>
            </td>
          </tr>
          {/* ... other sections ... */}
        </tbody>
      </table>
    </div>
  );
};

export default PhysicalLimitation; 