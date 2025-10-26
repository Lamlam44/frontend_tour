import React from 'react';
import styles from '../Assets/CSS/ComponentsCSS/FilterSidebar.module.css';

function FilterGroup({ group }) {
  return (
    <div className={styles.filterGroup}>
      <h4>{group.title}</h4>
      {group.options.map((option, index) => (
        <label key={index}>
          <input type={group.type} name={group.name} /> {option}
        </label>
      ))}
    </div>
  );
}

function FilterSidebar({ filterGroups }) {
  return (
    <aside className={styles.sidebar}>
      <h3>Bộ lọc</h3>
      {filterGroups.map((group, index) => (
        <FilterGroup key={index} group={group} />
      ))}
       <button className={styles.applyBtn}>Áp dụng</button>
    </aside>
  );
}

export default FilterSidebar;