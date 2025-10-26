import React, { useState } from 'react';
import styles from '../Assets/CSS/ComponentsCSS/SearchTabs.module.css';

function SearchTabs() {
  const [activeTab, setActiveTab] = useState('hotel');

  const getTabClassName = (tabName) => {
    return `${styles.tabBtn} ${activeTab === tabName ? styles.active : ''}`;
  };

  const renderSearchForm = () => {
    switch (activeTab) {
      case 'hotel':
        return (
          <div className={styles.form}>
            <input type="text" placeholder="Nhập tên khách sạn hoặc thành phố" />
            <input type="date" />
            <input type="date" />
            <input type="text" placeholder="Số khách, số phòng" />
            <button>Tìm Khách Sạn</button>
          </div>
        );
      case 'flight':
        return (
          <div className={styles.form}>
            <input type="text" placeholder="Điểm đi" />
            <input type="text" placeholder="Điểm đến" />
            <input type="date" />
            <input type="date" placeholder="Ngày về (tùy chọn)" />
            <button>Tìm Chuyến Bay</button>
          </div>
        );
      case 'tour':
        return (
          <div className={styles.form}>
            <input type="text" placeholder="Bạn muốn đi đâu?" />
            <input type="date" />
            <input type="number" placeholder="Số người" min="1" />
            <button>Tìm Tour</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button className={getTabClassName('hotel')} onClick={() => setActiveTab('hotel')}>
            🏨 Khách sạn
        </button>
        <button className={getTabClassName('flight')} onClick={() => setActiveTab('flight')}>
            ✈️ Vé máy bay
        </button>
        <button className={getTabClassName('tour')} onClick={() => setActiveTab('tour')}>
            🏞️ Tour du lịch
        </button>
      </div>
      {renderSearchForm()}
    </div>
  );
}

export default SearchTabs;