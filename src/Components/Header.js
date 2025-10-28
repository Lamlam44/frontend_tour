import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Assets/CSS/ComponentsCSS/Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">YourLogo</Link>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li><Link to="/tours">Du lịch</Link></li>
          <li><Link to="/hotels">Khách sạn</Link></li>
          <li><Link to="/flights">Vé máy bay</Link></li>
          <li><Link to="/promotions">Khuyến mãi</Link></li>
        </ul>
      </nav>
      <div className={styles.actions}>
        <Link to="/login">
          <button className={styles.loginBtn}>Đăng nhập</button>
        </Link>
        <Link to="/register">
          <button className={styles.registerBtn}>Đăng ký</button>
        </Link>
      </div>
    </header>
  );
}

export default Header;