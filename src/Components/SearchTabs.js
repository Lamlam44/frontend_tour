import React from 'react';
import styles from '../Assets/CSS/ComponentsCSS/SearchTabs.module.css';

function SearchTabs() {
  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button className={`${styles.tabBtn} ${styles.active}`}>
            🏞️ Tour du lịch
        </button>
      </div>
      <div className={styles.form}>
        <input type="text" placeholder="Bạn muốn đi đâu?" />
        <input type="date" />
        <select>
          <option value="" disabled selected>Chọn ngân sách</option>
          <option value="0-4000000">Dưới 4 triệu</option>
          <option value="4000000-8000000">4 - 8 triệu</option>
          <option value="8000000-Infinity">Trên 8 triệu</option>
        </select>
        <button>Tìm Tour</button>
      </div>
    </div>
  );
}

export default SearchTabs;