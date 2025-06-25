import React from 'react';
import styles from '../styles.module.css';
// import Logo from '../background/logo.png';
import HomePageBg from '../background/HomePageBg.jpg';
import { Link } from 'react-router-dom';


const Home = () => {

  return (
    <div className={styles.topContainer}>
      <img className={styles.Home} src={HomePageBg} alt="HomeBg" />

      {/* <img className={styles.logo} src={Logo} alt="logo" /> */}

      <div className={styles.info}>

        <h2>Image Caption Generator</h2>

        <div className={styles.getStarted}>
          <Link className={styles.btn} to="/upload">
            Get Started!
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Home;
