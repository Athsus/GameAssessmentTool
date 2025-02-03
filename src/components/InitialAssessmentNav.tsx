import React from 'react';
import styles from './InitialAssessmentNav.module.css';

interface NavItem {
  id: string;
  title: string;
}

interface InitialAssessmentNavProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const InitialAssessmentNav: React.FC<InitialAssessmentNavProps> = ({ currentSection, onSectionChange }) => {
  const sections: NavItem[] = [
    { id: 'basic', title: 'Basic Information' },
    { id: 'functional', title: 'Functional Limitation' },
    { id: 'result', title: 'Result' }
  ];

  return (
    <nav className={styles.nav}>
      {sections.map((section) => (
        <button
          key={section.id}
          className={`${styles.navButton} ${currentSection === section.id ? styles.active : ''}`}
          onClick={() => onSectionChange(section.id)}
        >
          {section.title}
        </button>
      ))}
    </nav>
  );
};

export default InitialAssessmentNav; 