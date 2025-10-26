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
          <li><Link to="/tours/all">Du lịch</Link></li>
          <li><Link to="/hotels/all">Khách sạn</Link></li>
          <li><Link to="/flights">Vé máy bay</Link></li>
          <li><Link to="/combos">Combo & Ưu đãi</Link></li>
        </ul>
      </nav>
      <div className={styles.actions}>
        <button className={styles.loginBtn}>Đăng nhập</button>
        <button className={styles.registerBtn}>Đăng ký</button>
      </div>
    </header>
  );
}

export default Header;