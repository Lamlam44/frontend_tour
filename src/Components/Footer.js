import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Assets/CSS/ComponentsCSS/Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <p>&copy; 2025 Your Company. All rights reserved.</p>
      <div className={styles.links}>
        <Link to="/about">Về chúng tôi</Link>
        <Link to="/contact">Liên hệ</Link>
        <Link to="/privacy">Chính sách bảo mật</Link>
      </div>
    </footer>
  );
}

export default Footer;