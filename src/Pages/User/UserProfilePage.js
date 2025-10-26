import React, { useState } from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/UserProfilePage.module.css';

function UserProfilePage() {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <div className={styles.layout}>
                    <aside className={styles.sidebarNav}>
                        <div onClick={() => setActiveTab('profile')} className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`}>Thông tin cá nhân</div>
                        <div onClick={() => setActiveTab('history')} className={`${styles.navItem} ${activeTab === 'history' ? styles.active : ''}`}>Lịch sử đặt tour</div>
                        <div onClick={() => setActiveTab('password')} className={`${styles.navItem} ${activeTab === 'password' ? styles.active : ''}`}>Đổi mật khẩu</div>
                        <div className={styles.navItem}>Đăng xuất</div>
                    </aside>
                    <main className={styles.content}>
                        <h2>Thông tin cá nhân</h2>
                        <div className={styles.formGroup}>
                            <label htmlFor="fullName">Họ và tên</label>
                            <input type="text" id="fullName" defaultValue="Lâm" />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" defaultValue="lam.itstudent@example.com" readOnly />
                        </div>
                         <div className={styles.formGroup}>
                            <label htmlFor="phone">Số điện thoại</label>
                            <input type="tel" id="phone" defaultValue="0987654321" />
                        </div>
                        <button className={styles.saveBtn}>Lưu thay đổi</button>
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
}
export default UserProfilePage;