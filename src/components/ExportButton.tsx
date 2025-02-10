import React, { useState } from 'react';
import styles from './ExportButton.module.css';
import { exportToPDF } from '../utils/pdfExport';
import { exportInitialAssessment } from '../utils/initialAssessmentExport';
import logo from '../assets/stfav.ico';

interface ExportButtonProps {
  title: string;
  contentId: string;
  filename: string;
  formType?: 'gefpt' | 'initial';
}

const ExportButton: React.FC<ExportButtonProps> = ({
  title,
  contentId,
  filename,
  formType = 'gefpt'
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (formType === 'initial') {
        await exportInitialAssessment({
          title,
          logoSrc: logo,
          contentId,
          filename,
        });
      } else {
        await exportToPDF({
          title,
          logoSrc: logo,
          contentId,
          filename,
        });
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <button 
        className={styles.exportButton}
        onClick={handleExport}
        disabled={isExporting}
      >
        Export {title}
      </button>
      
      {isExporting && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingText}>Generating PDF...</div>
        </div>
      )}
    </>
  );
};

export default ExportButton; 