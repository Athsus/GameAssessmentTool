import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../components/App.module.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const assessments = [
    {
      id: 'initial',
      title: 'Initial Assessment',
      description: 'Basic information collection before starting the tests',
      path: '/initial-assessment'
    },
    {
      id: 'sensory',
      title: 'Sensory Accessibility',
      description: 'Evaluate suitable functional requirements and recommendations for each limitation',
      path: '/sensory-assessment'
    },
    {
      id: 'keyboard',
      title: 'Keyboard & Mouse Assessment',
      description: 'Evaluate functional needs and corresponding keyboard types for limitations',
      path: '/keyboard-assessment',
      status: 'under-construction'
    },
    {
      id: 'physical',
      title: 'Physical Functional Limitations',
      description: 'Assess physical limitations and recommend suitable gaming equipment',
      path: '/physical-limitation',
      status: 'under-construction'
    },
    {
      id: 'gefpt',
      title: 'GEFPT',
      description: 'Gaming Executive Function Performance Test',
      path: '/gefpt'
    }
    // {
    //   id: 'future1',
    //   title: 'Coming Soon',
    //   description: 'More assessments will be added',
    //   path: ''
    // },
    // {
    //   id: 'future2',
    //   title: 'Coming Soon',
    //   description: 'More assessments will be added',
    //   path: ''
    // }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.assessmentContainer}>
        <h1 className={styles.assessmentTitle}>Gaming Assessment Tools</h1>
        <div className={styles.assessmentGrid}>
          {assessments.map((assessment) => (
            <div 
              key={assessment.id} 
              className={`${styles.assessmentCard} ${!assessment.path ? styles.disabled : ''}`}
            >
              <h2 className={styles.cardTitle}>{assessment.title}</h2>
              <p className={styles.cardDescription}>{assessment.description}</p>
              {assessment.status === 'under-construction' && (
                <p className={styles.underConstruction}>🚧 Under Construction</p>
              )}
              {assessment.path && (
                <button 
                  className={styles.assessmentButton}
                  onClick={() => navigate(assessment.path)}
                >
                  Start Assessment
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 