import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleTitleClick = () => {
    navigate('/');
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.navbarTitle} onClick={handleTitleClick}>
        Gaming Assessment Tool
      </div>
      <img src={logo} alt="Logo" className={styles.navbarLogo} />
    </header>
  );
};

export default Navbar;
