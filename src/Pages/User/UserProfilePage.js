import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/UserProfilePage.module.css';
import { getUserProfile, updateUserProfile } from '../../services/api';
import { isLoggedIn, logout } from '../../services/auth';

function UserProfilePage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate('/login'); // Redirect to login if not authenticated
            return;
        }

        const fetchUser = async () => {
            setIsLoading(true);
            const response = await getUserProfile();
            if (response.success) {
                setUser(response.data);
            } else {
                setMessage('Không thể tải thông tin người dùng.');
            }
            setIsLoading(false);
        };

        fetchUser();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [id]: value
        }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setMessage('Đang lưu...');
        const response = await updateUserProfile({
            name: user.name,
            phone: user.phone,
            address: user.address,
        });
        if (response.success) {
            setMessage('Lưu thay đổi thành công!');
        } else {
            setMessage('Lưu thất bại. Vui lòng thử lại.');
        }
    };
    
    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to homepage after logout
    };

    const renderContent = () => {
        if (isLoading) {
            return <p>Đang tải dữ liệu...</p>;
        }

        switch (activeTab) {
            case 'profile':
                return (
                    <form onSubmit={handleSaveChanges}>
                        <h2>Thông tin cá nhân</h2>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Họ và tên</label>
                            <input type="text" id="name" value={user.name} onChange={handleInputChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" value={user.email} readOnly />
                        </div>
                         <div className={styles.formGroup}>
                            <label htmlFor="phone">Số điện thoại</label>
                            <input type="tel" id="phone" value={user.phone} onChange={handleInputChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="address">Địa chỉ</label>
                            <input type="text" id="address" value={user.address} onChange={handleInputChange} />
                        </div>
                        <button type="submit" className={styles.saveBtn}>Lưu thay đổi</button>
                        {message && <p className={styles.message}>{message}</p>}
                    </form>
                );
            case 'history':
                return <div><h2>Lịch sử đặt tour</h2><p>Tính năng này đang được phát triển.</p></div>;
            case 'password':
                return <div><h2>Đổi mật khẩu</h2><p>Tính năng này đang được phát triển.</p></div>;
            default:
                return null;
        }
    }

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <div className={styles.layout}>
                    <aside className={styles.sidebarNav}>
                        <div onClick={() => setActiveTab('profile')} className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`}>Thông tin cá nhân</div>
                        <div onClick={() => setActiveTab('history')} className={`${styles.navItem} ${activeTab === 'history' ? styles.active : ''}`}>Lịch sử đặt tour</div>
                        <div onClick={() => setActiveTab('password')} className={`${styles.navItem} ${activeTab === 'password' ? styles.active : ''}`}>Đổi mật khẩu</div>
                        <div onClick={handleLogout} className={styles.navItem}>Đăng xuất</div>
                    </aside>
                    <main className={styles.content}>
                        {renderContent()}
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
}
export default UserProfilePage;