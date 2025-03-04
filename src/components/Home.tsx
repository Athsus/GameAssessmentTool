import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../components/App.module.css';
import Authentication from './Authentication/Authentication';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

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
      status: 'active'
    },
    {
      id: 'physical',
      title: 'Physical Functional Limitations',
      description: 'Assess physical limitations and recommend suitable gaming equipment',
      path: '/physical-limitation',
      status: 'active'
    },
    {
      id: 'gefpt',
      title: 'GEFPT',
      description: 'Gaming Executive Function Performance Test',
      path: '/gefpt',
      status: 'active'
    },
    {
      id: 'database',
      title: 'Database Management',
      description: 'Manage assessment data and user records',
      path: '/database-management',
      status: 'active',
      requiresAuth: true
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

  const handleAssessmentClick = (assessment: any) => {
    if (assessment.requiresAuth && !isAuthenticated) {
      setShowAuth(true);
    } else {
      navigate(assessment.path);
    }
  };

  const handleAuthSuccess = () => {
    login();
    setShowAuth(false);
    
    // 找到数据库管理选项并导航到它
    const dbManagement = assessments.find(a => a.id === 'database');
    if (dbManagement) {
      navigate(dbManagement.path);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.assessmentContainer}>
        <div className={styles.headerRow}>
          <h1 className={styles.assessmentTitle}>Gaming Assessment Tools</h1>
          <button 
            className={styles.adminLoginButton}
            onClick={() => setShowAuth(true)}
          >
            Admin Login
          </button>
        </div>
        
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
                  onClick={() => handleAssessmentClick(assessment)}
                >
                  Start Assessment
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {showAuth && (
        <Authentication 
          onSuccess={handleAuthSuccess}
          onCancel={() => setShowAuth(false)}
        />
      )}
    </div>
  );
};

export default Home; 