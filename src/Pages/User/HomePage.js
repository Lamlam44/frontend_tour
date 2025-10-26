import React from 'react';
import Header from '../../Components/Header';
import SearchTabs from '../../Components/SearchTabs';
import FeaturedDeals from '../../Components/FeaturedDeals';
import Promotions from '../../Components/Promotions';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/HomePage.module.css';

function HomePage() {
  return (
    <div>
      <Header />
      <main>
        <section className={styles.heroSection}>
          <h1>Khám phá Việt Nam và Thế giới</h1>
          <p>Tìm kiếm ưu đãi tốt nhất cho Khách sạn, Chuyến bay và Tour du lịch</p>
          <SearchTabs />
        </section>
        <FeaturedDeals />
        <Promotions />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;