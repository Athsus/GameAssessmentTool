import React, { useState } from 'react';
import styles from './InitialAssessment.module.css';
import InitialAssessmentNav from './InitialAssessmentNav';

const InitialAssessment: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('basic');

  const renderSection = () => {
    switch (currentSection) {
      case 'basic':
        return <BasicInformation />;
      case 'functional':
        return <FunctionalLimitation />;
      case 'result':
        return <Result />;
      default:
        return <BasicInformation />;
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Initial Assessment Form</h1>
      <InitialAssessmentNav 
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      />
      <div className={styles.form}>
        {renderSection()}
      </div>
    </div>
  );
};

// Create separate components for each section
const BasicInformation: React.FC = () => {
  return (
    <div className={styles.section}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" required />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="address">Address</label>
        <input type="text" id="address" name="address" required />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="phone">Phone</label>
        <input type="tel" id="phone" name="phone" required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="dob">Date of Birth</label>
        <input type="date" id="dob" name="dob" required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="ndisNumber">NDIS Number</label>
        <input type="text" id="ndisNumber" name="ndisNumber" required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="ndisPlanDates">NDIS Plan Dates</label>
        <input type="text" id="ndisPlanDates" name="ndisPlanDates" required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="assessedBy">Assessed By</label>
        <input type="text" id="assessedBy" name="assessedBy" required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="date">Date</label>
        <input type="date" id="date" name="date" required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="peopleConsulted">People Consulted</label>
        <input type="text" id="peopleConsulted" name="peopleConsulted" required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="diagnoses">Diagnoses</label>
        <textarea id="diagnoses" name="diagnoses" required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="background">Background</label>
        <textarea id="background" name="background" required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="mobility">Mobility</label>
        <textarea id="mobility" name="mobility" required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="transfers">Transfers</label>
        <textarea id="transfers" name="transfers" required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="livingSituation">Living Situation</label>
        <textarea id="livingSituation" name="livingSituation" required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="fundingGoals">Funding Related Goals</label>
        <textarea id="fundingGoals" name="fundingGoals" required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="currentConcerns">Current Concerns</label>
        <textarea id="currentConcerns" name="currentConcerns" required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="strengths">Strengths/Likes</label>
        <textarea id="strengths" name="strengths" required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="supports">Supports In Use/Available</label>
        <textarea id="supports" name="supports" required />
      </div>

      {/* AT Used Section */}
      <div className={styles.formGroup} data-section="at-used">
        <label>AT Used (Consider Model, Experience)</label>
        <div className={styles.checkboxGroup}>
          <div>
            <label>
              <input type="checkbox" name="tablet" />
              Tablet
            </label>
            <input type="text" placeholder="Model" />
          </div>
          <div>
            <label>
              <input type="checkbox" name="computer" />
              Computer
            </label>
            <input type="text" placeholder="Model" />
          </div>
          <div>
            <label>
              <input type="checkbox" name="gamingConsoles" />
              Gaming Consoles
            </label>
            <input type="text" placeholder="Model" />
          </div>
          <div>
            <label>Others Devices:</label>
            <input type="text" />
          </div>
        </div>
      </div>

      {/* Access Methods */}
      <div className={styles.formGroup} data-section="access-methods">
        <label>Access Methods</label>
        <div className={styles.checkboxGroup}>
          <div>
            <label>
              <input type="checkbox" name="physicalAccess" />
              Physical Access
            </label>
            <input type="text" />
          </div>
          <div>
            <label>
              <input type="checkbox" name="voiceControl" />
              Voice Control
            </label>
            <input type="text" />
          </div>
          <div>
            <label>
              <input type="checkbox" name="sipAndPuff" />
              Sip-And-Puff Systems
            </label>
            <input type="text" />
          </div>
          <div>
            <label>
              <input type="checkbox" name="eyeGaze" />
              Eye Gaze
            </label>
            <input type="text" />
          </div>
        </div>
      </div>

      {/* Gaming History */}
      <div className={styles.formGroup} data-section="gaming-history">
        <label>Gaming History</label>
        <div className={styles.checkboxGroup}>
          <label>Previous Console Device:</label>
          <div className={styles.consoleOptions}>
            <label><input type="checkbox" name="nil" /> Nil</label>
            <label><input type="checkbox" name="xbox" /> xbox</label>
            <label><input type="checkbox" name="ps" /> PS</label>
            <label><input type="checkbox" name="nintendo" /> Nintendo</label>
            <label><input type="checkbox" name="pc" /> PC</label>
          </div>
          <div>
            <label>Others:</label>
            <input type="text" />
          </div>
          <div>
            <label>Controller:</label>
            <textarea />
          </div>
          <div>
            <label>Games:</label>
            <textarea />
          </div>
        </div>
      </div>

      {/* Current Gaming Setup */}
      <div className={styles.formGroup} data-section="current-gaming">
        <label>Current Gaming Setup</label>
        <div className={styles.formGroup}>
          <label>Gaming Duration:</label>
          <input type="text" />
        </div>
        <div className={styles.checkboxGroup}>
          <label>Console Device:</label>
          <div className={styles.consoleOptions}>
            <label><input type="checkbox" name="current-nil" /> Nil</label>
            <label><input type="checkbox" name="current-xbox" /> xbox</label>
            <label><input type="checkbox" name="current-ps" /> PS</label>
            <label><input type="checkbox" name="current-nintendo" /> Nintendo</label>
            <label><input type="checkbox" name="current-pc" /> PC</label>
          </div>
          <div>
            <label>Others:</label>
            <input type="text" />
          </div>
          <div>
            <label>Controller:</label>
            <textarea />
          </div>
          <div>
            <label>Games:</label>
            <textarea />
          </div>
          <div>
            <label>Gaming Duration:</label>
            <input type="text" />
          </div>
        </div>
      </div>

      {/* Gaming Preferences and Additional Tech Features */}
      <div className={styles.formGroup} data-section="gaming-preferences">
        <label>Gaming preferences and Additional Tech Features</label>
        <div className={styles.checkboxGroup}>
          <label>Console Device:</label>
          <div className={styles.consoleOptions}>
            <label><input type="checkbox" name="pref-nil" /> Nil</label>
            <label><input type="checkbox" name="pref-xbox" /> xbox</label>
            <label><input type="checkbox" name="pref-ps" /> PS</label>
            <label><input type="checkbox" name="pref-nintendo" /> Nintendo</label>
            <label><input type="checkbox" name="pref-pc" /> PC</label>
          </div>
          <div>
            <label>Others:</label>
            <input type="text" />
          </div>
          <div>
            <label>Controller:</label>
            <textarea />
          </div>
          <div>
            <label>Games:</label>
            <textarea />
          </div>
        </div>
      </div>

      {/* Additional Fields */}
      <div className={styles.formGroup}>
        <label htmlFor="gamingGoals">Gaming related Goals</label>
        <textarea id="gamingGoals" name="gamingGoals" required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="emergencyPlan">Personal Emergency/ And Evacuation Plan</label>
        <textarea id="emergencyPlan" name="emergencyPlan" required />
      </div>
    </div>
  );
};

const FunctionalLimitation: React.FC = () => {
  const [isCognitiveImpaired, setIsCognitiveImpaired] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState<string | null>(null);

  const handleCognitiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCognitiveImpaired(e.target.value === 'impaired');
  };

  return (
    <div className={styles.section}>
      <h2>Functional Limitations</h2>
      
      {/* Physical Abilities Section */}
      <div className={styles.tableSection}>
        <h3 className={styles.sectionTitle}>Physical Abilities</h3>
        <div className={styles.dominantHand}>
          <span>Dominant Hand Preference</span>
          <label><input type="checkbox" name="leftHand" /> L</label>
          <label><input type="checkbox" name="rightHand" /> R</label>
        </div>
        
        <table className={styles.assessmentTable}>
          <thead>
            <tr>
              <th>Area</th>
              <th>Left</th>
              <th>Right</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {/* Physical Abilities - Upper Limb Section */}
            <tr className={styles.mainItem}>
              <td>Upper Limb</td>
              <td>
                <label><input type="checkbox" /> Full Function</label>
              </td>
              <td>
                <label><input type="checkbox" /> Full Function</label>
              </td>
              <td><input type="text" className={styles.commentInput} /></td>
            </tr>

            {/* Sub items under Upper Limb */}
            <tr className={styles.subItem}>
              <td>Shoulder</td>
              <td>
                <div className={styles.horizontalCheckboxes}>
                  <label><input type="checkbox" /> Unimpaired</label>
                  <label><input type="checkbox" /> Impaired</label>
                </div>
              </td>
              <td>
                <div className={styles.horizontalCheckboxes}>
                  <label><input type="checkbox" /> Unimpaired</label>
                  <label><input type="checkbox" /> Impaired</label>
                </div>
              </td>
              <td><input type="text" className={styles.commentInput} /></td>
            </tr>

            <tr className={styles.subItem}>
              <td>Elbow</td>
              <td>
                <div className={styles.horizontalCheckboxes}>
                  <label><input type="checkbox" /> Unimpaired</label>
                  <label><input type="checkbox" /> Impaired</label>
                </div>
              </td>
              <td>
                <div className={styles.horizontalCheckboxes}>
                  <label><input type="checkbox" /> Unimpaired</label>
                  <label><input type="checkbox" /> Impaired</label>
                </div>
              </td>
              <td><input type="text" className={styles.commentInput} /></td>
            </tr>

            <tr className={styles.subItem}>
              <td>Wrist</td>
              <td>
                <div className={styles.horizontalCheckboxes}>
                  <label><input type="checkbox" /> Unimpaired</label>
                  <label><input type="checkbox" /> Impaired</label>
                </div>
              </td>
              <td>
                <div className={styles.horizontalCheckboxes}>
                  <label><input type="checkbox" /> Unimpaired</label>
                  <label><input type="checkbox" /> Impaired</label>
                </div>
              </td>
              <td><input type="text" className={styles.commentInput} /></td>
            </tr>

            <tr className={styles.subItem}>
              <td>
                Grasp/Pinch/Finger Mobility
                <button 
                  className={styles.infoButton}
                  onClick={() => setShowTooltip(showTooltip === 'grasp' ? null : 'grasp')}
                  type="button"
                >
                  i
                </button>
                {showTooltip === 'grasp' && (
                  <div className={styles.tooltip}>
                    Observing the client's ability to hold and use the controller or keyboard
                  </div>
                )}
              </td>
              <td>
                <div className={styles.horizontalCheckboxes}>
                  <label><input type="checkbox" /> Unimpaired</label>
                  <label><input type="checkbox" /> Impaired</label>
                </div>
              </td>
              <td>
                <div className={styles.horizontalCheckboxes}>
                  <label><input type="checkbox" /> Unimpaired</label>
                  <label><input type="checkbox" /> Impaired</label>
                </div>
              </td>
              <td><input type="text" className={styles.commentInput} /></td>
            </tr>

            <tr className={styles.subItem}>
              <td>Strength and Endurance</td>
              <td>
                <div className={styles.horizontalCheckboxes}>
                  <label><input type="checkbox" /> Unimpaired</label>
                  <label><input type="checkbox" /> Impaired</label>
                </div>
              </td>
              <td>
                <div className={styles.horizontalCheckboxes}>
                  <label><input type="checkbox" /> Unimpaired</label>
                  <label><input type="checkbox" /> Impaired</label>
                </div>
              </td>
              <td><input type="text" className={styles.commentInput} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sensory Section */}
      <div className={styles.tableSection}>
        <h3 className={styles.sectionTitle}>Sensory</h3>
        <table className={styles.assessmentTable}>
          <thead>
            <tr>
              <th>Area</th>
              <th>Left</th>
              <th>Right</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {/* Sensory Section */}
            <tr className={styles.mainItem}>
              <td>Sensory</td>
              <td>
                <label><input type="checkbox" /> Full Function</label>
              </td>
              <td>
                <label><input type="checkbox" /> Full Function</label>
              </td>
              <td rowSpan={4}>
                Aid (e.g., glasses, hearing aid) / Comments
                <textarea className={styles.commentInput} />
              </td>
            </tr>

            {/* Sub items under Sensory */}
            <tr className={styles.subItem}>
              <td>Vision</td>
              <td>
                <div className={styles.horizontalCheckboxes}>
                  <label><input type="checkbox" /> Unimpaired</label>
                  <label><input type="checkbox" /> Impaired</label>
                </div>
              </td>
              <td>
                <div className={styles.horizontalCheckboxes}>
                  <label><input type="checkbox" /> Unimpaired</label>
                  <label><input type="checkbox" /> Impaired</label>
                </div>
              </td>
            </tr>
            <tr className={styles.subItem}>
              <td>Hearing</td>
              <td>
                <div className={styles.horizontalCheckboxes}>
                  <label><input type="checkbox" /> Unimpaired</label>
                  <label><input type="checkbox" /> Impaired</label>
                </div>
              </td>
              <td>
                <div className={styles.horizontalCheckboxes}>
                  <label><input type="checkbox" /> Unimpaired</label>
                  <label><input type="checkbox" /> Impaired</label>
                </div>
              </td>
            </tr>
            <tr className={styles.subItem}>
              <td>Tactile</td>
              <td>
                <div className={styles.horizontalCheckboxes}>
                  <label><input type="checkbox" /> Unimpaired</label>
                  <label><input type="checkbox" /> Impaired</label>
                </div>
              </td>
              <td>
                <div className={styles.horizontalCheckboxes}>
                  <label><input type="checkbox" /> Unimpaired</label>
                  <label><input type="checkbox" /> Impaired</label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Communication Section */}
      <div className={styles.tableSection}>
        <h3 className={styles.sectionTitle}>Communication</h3>
        <table className={styles.assessmentTable}>
          <tbody>
            <tr>
              <td>Speech Impediments</td>
              <td>
                <label><input type="checkbox" /> Unimpaired</label>
                <label><input type="checkbox" /> Impaired</label>
              </td>
            </tr>
            <tr>
              <td>Word finding</td>
              <td>
                <label><input type="checkbox" /> Unimpaired</label>
                <label><input type="checkbox" /> Impaired</label>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Cognitive Functional Section */}
      <div className={styles.tableSection}>
        <h3 className={styles.sectionTitle}>Cognitive Functional</h3>
        <div className={styles.cognitiveStatus}>
          <label>
            <input 
              type="radio" 
              name="cognitiveStatus" 
              value="unimpaired"
              onChange={handleCognitiveChange}
            /> Unimpaired
          </label>
          <label>
            <input 
              type="radio" 
              name="cognitiveStatus" 
              value="impaired"
              onChange={handleCognitiveChange}
            /> Impaired
          </label>
          <span>, if "Impaired" is selected, please refer to Section A</span>
        </div>
      </div>

      {/* Section A */}
      <div className={`${styles.tableSection} ${!isCognitiveImpaired ? styles.disabled : ''}`}>
        <h3 className={styles.sectionTitle}>Section A</h3>
        <p className={styles.subtitle}>Cognitive Functional Limitation:</p>
        <ul className={styles.bulletList}>
          <li>MoCA</li>
          <li>Human Benchmark: https://humanbenchmark.com/dashboard</li>
        </ul>

        <table className={styles.assessmentTable}>
          <thead>
            <tr>
              <th></th>
              <th>MoCA</th>
              <th>Human Benchmark</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A. Neurological injury <br/>(such as stroke or traumatic brain injury (TBI), <br/>or suspected mild cognitive impairment)</td>
              <td>
                <input type="checkbox" disabled={!isCognitiveImpaired} />
              </td>
              <td>
                <textarea 
                  className={styles.cellTextarea} 
                  disabled={!isCognitiveImpaired}
                />
              </td>
            </tr>
            <tr>
              <td>B. At risk of Dementia</td>
              <td>
                <input type="checkbox" disabled={!isCognitiveImpaired} />
              </td>
              <td>
                <textarea 
                  className={styles.cellTextarea} 
                  disabled={!isCognitiveImpaired}
                />
              </td>
            </tr>
            <tr>
              <td>C. Detect underlying cognitive deficits</td>
              <td>
                <input type="checkbox" disabled={!isCognitiveImpaired} />
              </td>
              <td>
                <textarea 
                  className={styles.cellTextarea} 
                  disabled={!isCognitiveImpaired}
                />
              </td>
            </tr>
            <tr>
              <td>D. Require a standard assessment</td>
              <td>
                <input type="checkbox" disabled={!isCognitiveImpaired} />
              </td>
              <td>
                <textarea 
                  className={styles.cellTextarea} 
                  disabled={!isCognitiveImpaired}
                />
              </td>
            </tr>
            <tr>
              <td>E. Clinical decision making</td>
              <td>
                <input type="checkbox" disabled={!isCognitiveImpaired} />
              </td>
              <td>
                <textarea 
                  className={styles.cellTextarea} 
                  disabled={!isCognitiveImpaired}
                />
              </td>
            </tr>
            <tr>
              <td>F. Focused on returning to fast-paced gaming</td>
              <td>
                <textarea 
                  className={styles.cellTextarea} 
                  disabled={!isCognitiveImpaired}
                />
              </td>
              <td>
                <input type="checkbox" disabled={!isCognitiveImpaired} />
              </td>
            </tr>
            <tr>
              <td>G. Informal self-assessment</td>
              <td>
                <textarea 
                  className={styles.cellTextarea} 
                  disabled={!isCognitiveImpaired}
                />
              </td>
              <td>
                <input type="checkbox" disabled={!isCognitiveImpaired} />
              </td>
            </tr>
            <tr>
              <td>H. Need to track specific skills over time</td>
              <td>
                <textarea 
                  className={styles.cellTextarea} 
                  disabled={!isCognitiveImpaired}
                />
              </td>
              <td>
                <input type="checkbox" disabled={!isCognitiveImpaired} />
              </td>
            </tr>
            <tr>
              <td>I. Interested in competitive gaming</td>
              <td>
                <textarea 
                  className={styles.cellTextarea} 
                  disabled={!isCognitiveImpaired}
                />
              </td>
              <td>
                <input type="checkbox" disabled={!isCognitiveImpaired} />
              </td>
            </tr>
            <tr className={styles.sectionHeader}>
              <td colSpan={3}>Game Types</td>
            </tr>
            <tr>
              <td>J. Puzzle and strategy games</td>
              <td>
                <textarea 
                  className={styles.cellTextarea} 
                  disabled={!isCognitiveImpaired}
                />
              </td>
              <td>
                <input type="checkbox" disabled={!isCognitiveImpaired} />
              </td>
            </tr>
            <tr>
              <td>K. Role-playing games (RPGs)</td>
              <td>
                <textarea 
                  className={styles.cellTextarea} 
                  disabled={!isCognitiveImpaired}
                />
              </td>
              <td>
                <input type="checkbox" disabled={!isCognitiveImpaired} />
              </td>
            </tr>
            <tr>
              <td>L. Adventure and narrative-driven games</td>
              <td>
                <textarea 
                  className={styles.cellTextarea} 
                  disabled={!isCognitiveImpaired}
                />
              </td>
              <td>
                <input type="checkbox" disabled={!isCognitiveImpaired} />
              </td>
            </tr>
            <tr>
              <td>M. Simulation games</td>
              <td>
                <textarea 
                  className={styles.cellTextarea} 
                  disabled={!isCognitiveImpaired}
                />
              </td>
              <td>
                <input type="checkbox" disabled={!isCognitiveImpaired} />
              </td>
            </tr>
            <tr>
              <td>N. Word and language games</td>
              <td>
                <textarea 
                  className={styles.cellTextarea} 
                  disabled={!isCognitiveImpaired}
                />
              </td>
              <td>
                <input type="checkbox" disabled={!isCognitiveImpaired} />
              </td>
            </tr>
            <tr>
              <td>O. First-person shooters (FPS)</td>
              <td>
                <textarea 
                  className={styles.cellTextarea} 
                  disabled={!isCognitiveImpaired}
                />
              </td>
              <td>
                <input type="checkbox" disabled={!isCognitiveImpaired} />
              </td>
            </tr>
            <tr>
              <td>P. Action games</td>
              <td>
                <textarea 
                  className={styles.cellTextarea} 
                  disabled={!isCognitiveImpaired}
                />
              </td>
              <td>
                <input type="checkbox" disabled={!isCognitiveImpaired} />
              </td>
            </tr>
            <tr>
              <td>Q. Rhythm games</td>
              <td>
                <textarea 
                  className={styles.cellTextarea} 
                  disabled={!isCognitiveImpaired}
                />
              </td>
              <td>
                <input type="checkbox" disabled={!isCognitiveImpaired} />
              </td>
            </tr>
            <tr>
              <td>R. Racing games</td>
              <td>
                <textarea 
                  className={styles.cellTextarea} 
                  disabled={!isCognitiveImpaired}
                />
              </td>
              <td>
                <input type="checkbox" disabled={!isCognitiveImpaired} />
              </td>
            </tr>
            <tr>
              <td>S. Competitive multiplayer games</td>
              <td>
                <textarea 
                  className={styles.cellTextarea} 
                  disabled={!isCognitiveImpaired}
                />
              </td>
              <td>
                <input type="checkbox" disabled={!isCognitiveImpaired} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Result: React.FC = () => {
  return (
    <div className={styles.section}>
      <h2>Recommendations / Plan for Implementation</h2>
      
      <table className={styles.recommendationTable}>
        <tbody>
          {/* Gaming Goals */}
          <tr>
            <td>Gaming related short-term goals</td>
            <td>
              <div className={styles.goalSection}>
                <div className={styles.periodSection}>
                  <label>Period:</label>
                  <textarea className={styles.periodInput} />
                </div>
                <div className={styles.goalContent}>
                  <label>Goals:</label>
                  <textarea className={styles.goalInput} />
                </div>
              </div>
            </td>
          </tr>
          
          <tr>
            <td>Gaming related long-term goals</td>
            <td>
              <div className={styles.goalSection}>
                <div className={styles.periodSection}>
                  <label>Period:</label>
                  <textarea className={styles.periodInput} />
                </div>
                <div className={styles.goalContent}>
                  <label>Goals:</label>
                  <textarea className={styles.goalInput} />
                </div>
              </div>
            </td>
          </tr>

          {/* Recommendations */}
          <tr>
            <td>Hardware recommendation</td>
            <td><textarea className={styles.recommendationInput} /></td>
          </tr>
          <tr>
            <td>Software recommendation</td>
            <td><textarea className={styles.recommendationInput} /></td>
          </tr>
          <tr>
            <td>Trial Period</td>
            <td><textarea className={styles.recommendationInput} /></td>
          </tr>
          <tr>
            <td>Client Education requirements</td>
            <td><textarea className={styles.recommendationInput} /></td>
          </tr>
          <tr>
            <td>Date for Review</td>
            <td><textarea className={styles.recommendationInput} /></td>
          </tr>

          {/* Signature Section */}
          <tr>
            <td>Name</td>
            <td><input type="text" className={styles.signatureInput} /></td>
          </tr>
          <tr>
            <td>Signature</td>
            <td><input type="text" className={styles.signatureInput} /></td>
          </tr>
          <tr>
            <td>Date</td>
            <td><input type="date" className={styles.signatureInput} /></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default InitialAssessment;