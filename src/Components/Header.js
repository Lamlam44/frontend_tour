import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../Assets/CSS/ComponentsCSS/Header.module.css';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Check if user is admin
  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home page after logout
    setDropdownOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">YourLogo</Link>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li><Link to="/tours">Du lịch</Link></li>
          <li><Link to="/promotions">Khuyến mãi</Link></li>
          <li><Link to="/contact">Liên hệ</Link></li>
        </ul>
      </nav>
      <div className={styles.actions}>
        {isAuthenticated ? (
          <div
            className={styles.profileContainer}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <div className={styles.profileIcon}>
              {/* Simple user icon placeholder */}
              <span>{user?.username?.charAt(0).toUpperCase() || 'P'}</span>
            </div>
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Link to="/profile" className={styles.dropdownItem}>Hồ sơ</Link >
                {isAdmin && (
                  <Link to="/admin/dashboard" className={styles.dropdownItem}>
                    Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className={styles.dropdownItem}>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login">
              <button className={styles.loginBtn}>Đăng nhập</button>
            </Link>
            <Link to="/register">
              <button className={styles.registerBtn}>Đăng ký</button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;