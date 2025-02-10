import React from "react";
import BackButton from "./components/BackButton";
import ExportButton from "./components/ExportButton";
import './index.css';
import './form.css';

const GEFPT: React.FC = () => {
  // 获取今天的日期，格式化为 YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <BackButton />
      <ExportButton
        title="GEFPT"
        contentId="gefpt-content"
        filename="gefpt-assessment.pdf"
      />
      <div className="form-container">
        <div id="gefpt-content" className="form-box">
          {/* Header */}
          <h1 className="form-title">
            Gaming Executive Function Performance Test (GEFPT)
          </h1>

          {/* Description */}
          <div className="form-group">
            <p>
              <strong>The Gaming Executive Function Performance Test (GEFPT)</strong>{" "}
              is designed to evaluate key cognitive functions crucial for video
              gaming, including:
            </p>
            <ul>
              <li>Motor planning</li>
              <li>Reading comprehension</li>
              <li>Working memory</li>
              <li>Processing speed</li>
              <li>Executive function</li>
            </ul>
            <p>
              This tool helps identify areas of strength and areas for improvement
              in gaming performance. Please ensure that clients are provided with
              clear instructions and allowed to progress at their own pace.
            </p>
            <p>
              <strong>Key:</strong> Full Function (F) | Partial Function (P) |
              Absent Function (A)
            </p>
          </div>

          {/* Client Info Section */}
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">
                Client Name <span className="required">*</span>
              </label>
              <input className="form-input" type="text" required />
            </div>
            <div className="form-field">
              <label className="form-label">
                Date <span className="required">*</span>
              </label>
              <input 
                type="date" 
                className="form-input" 
                defaultValue={today}
              />
            </div>
            <div className="form-field">
              <label className="form-label">
                Time Required for Task <span className="required">*</span>
              </label>
              <div className="duration-input">
                <input 
                  className="form-input duration-field" 
                  type="number" 
                  min="0"
                  placeholder="Hours"
                  required 
                />
                <span className="duration-separator">:</span>
                <input 
                  className="form-input duration-field" 
                  type="number" 
                  min="0"
                  max="59"
                  placeholder="Minutes"
                  required 
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <table className="form-table">
            <thead>
              <tr>
                <th className="form-table-main-header" colSpan={5}>Component</th>
              </tr>
              <tr className="form-table-header">
                <th className="form-table-header-cell">Task</th>
                <th className="form-table-header-cell">F</th>
                <th className="form-table-header-cell">P</th>
                <th className="form-table-header-cell">A</th>
                <th className="form-table-header-cell">Comments</th>
              </tr>
            </thead>
            <tbody>
              {/* Initiation Section */}
              <tr className="form-table-section">
                <td colSpan={5}>Initiation</td>
              </tr>
              <tr>
                <td className="form-table-cell">Begin task when asked to begin</td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell">
                  <textarea className="form-input" rows={3}></textarea>
                </td>
              </tr>
              <tr>
                <td className="form-table-cell">Open or reengage with the Game independently, without external prompt.</td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell">
                  <textarea className="form-input" rows={3}></textarea>
                </td>
              </tr>
              <tr>
                <td className="form-table-cell">Exit the game and return to the main menu or close the application.</td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell">
                  <textarea className="form-input" rows={3}></textarea>
                </td>
              </tr>

              {/* Reading Comprehension Section */}
              <tr className="form-table-section">
                <td colSpan={5}>Reading Comprehension</td>
              </tr>
              <tr>
                <td className="form-table-cell">Able to understand and follow written in-game instructions.</td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell">
                  <textarea className="form-input" rows={3}></textarea>
                </td>
              </tr>

              {/* Motor Planning Section */}
              <tr className="form-table-section">
                <td colSpan={5}>Motor Planning</td>
              </tr>
              <tr>
                <td className="form-table-cell">Able to design a control layout tailored to the physical requirements.</td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell">
                  <textarea className="form-input" rows={3}></textarea>
                </td>
              </tr>

              {/* Working Memory Section */}
              <tr className="form-table-section">
                <td colSpan={5}>Working Memory</td>
              </tr>
              <tr>
                <td className="form-table-cell">Able to replicate a demonstrated process from memory.</td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell">
                  <textarea className="form-input" rows={3}></textarea>
                </td>
              </tr>
              <tr>
                <td className="form-table-cell">Able to reset controls to their default settings without referring to the original layout.</td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell">
                  <textarea className="form-input" rows={3}></textarea>
                </td>
              </tr>

              {/* Organization Section */}
              <tr className="form-table-section">
                <td colSpan={5}>Organization</td>
              </tr>
              <tr>
                <td className="form-table-cell">Approach tasks, such as changing multiple settings (e.g., volume, controls, display), in a structured and organized manner.</td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell">
                  <textarea className="form-input" rows={3}></textarea>
                </td>
              </tr>

              {/* Execution of Complex Tasks Section */}
              <tr className="form-table-section">
                <td colSpan={5}>Execution of Complex Tasks</td>
              </tr>
              <tr>
                <td className="form-table-cell">Able to follow Multi-step Instructions to modify settings</td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell">
                  <textarea className="form-input" rows={3}></textarea>
                </td>
              </tr>
              <tr>
                <td className="form-table-cell">Able to remap buttons based on specific requirements</td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell checkbox-cell">
                  <input type="checkbox" className="checkbox-input" />
                </td>
                <td className="form-table-cell">
                  <textarea className="form-input" rows={3}></textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GEFPT;
