import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Assets/CSS/ComponentsCSS/SearchTabs.module.css';

function SearchTabs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState('');
  const [budget, setBudget] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchQuery.trim()) {
      queryParams.append('keyword', searchQuery.trim());
    }
    if (date) {
      queryParams.append('date', date);
    }
    if (budget) {
      queryParams.append('budget', budget);
    }
    navigate(`/tours?${queryParams.toString()}`);
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
        <input 
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select 
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        >
          <option value="">Chọn ngân sách</option>
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