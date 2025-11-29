import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Assets/CSS/ComponentsCSS/SearchTabs.module.css';

function SearchTabs() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/tours?keyword=${encodeURIComponent(searchQuery.trim())}`);
    } else {
        // Optionally navigate to the tour list page without a specific search query
        navigate('/tours');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button className={`${styles.tabBtn} ${styles.active}`}>
            🏞️ Tour du lịch
        </button>
      </div>
      <div className={styles.form}>
        <input 
          type="text" 
          placeholder="Bạn muốn đi đâu?" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <input type="date" />
        <select>
          <option value="" disabled selected>Chọn ngân sách</option>
          <option value="0-4000000">Dưới 4 triệu</option>
          <option value="4000000-8000000">4 - 8 triệu</option>
          <option value="8000000-Infinity">Trên 8 triệu</option>
        </select>
        <button onClick={handleSearch}>Tìm Tour</button>
      </div>
    </div>
  );
}

export default SearchTabs;