import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../../Assets/CSS/PageCSS/UserProfilePage.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const UserProfilePage = () => {
    const { user, updateUser, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: '',
        customerDateOfBirth: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    // Store initial data to revert to
    const initialFormData = {
        customerName: user?.name || '',
        customerEmail: user?.email || '',
        customerPhone: user?.phone || '',
        customerAddress: user?.address || '',
        // Kiểm tra kỹ null/undefined trước khi format date
        customerDateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        password: ''
    };

    // Effect to update form data when user object changes
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (user) {
            setFormData(initialFormData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isAuthenticated, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // --- PHẦN SỬA ĐỔI QUAN TRỌNG ---
    // Function to enter edit mode
    const handleEdit = (e) => {
        // Ngăn chặn hành vi mặc định nếu có
        if(e) e.preventDefault();

        // Sử dụng setTimeout để đẩy việc cập nhật state xuống cuối hàng đợi sự kiện.
        // Điều này đảm bảo sự kiện "mouseup" của người dùng hoàn tất trên nút "Sửa"
        // TRƯỚC KHI nút "Xác nhận" (Submit) xuất hiện tại cùng vị trí.
        setTimeout(() => {
            setIsEditing(true);
        }, 100); // Delay 100ms là đủ an toàn và mượt mà
    };
    // --------------------------------

    // Function to cancel editing and revert changes
    const handleCancel = () => {
        setIsEditing(false);
        setFormData(initialFormData);
        setNotification({ message: '', type: '' });
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Safeguard: Do not submit if not in editing mode.
        if (!isEditing) {
            return;
        }

        const updateData = { ...formData };
        
        // Only include password if it has been changed
        if (!updateData.password) {
            delete updateData.password;
        }

        try {
            const result = await updateUser(updateData);
            if (result.success) {
                setNotification({ message: 'Cập nhật thông tin thành công!', type: 'success' });
                setIsEditing(false); // Tắt chế độ edit sau khi thành công
            } else {
                setNotification({ message: result.error || 'Đã xảy ra lỗi.', type: 'error' });
            }
        } catch (error) {
            setNotification({ message: 'Lỗi kết nối server.', type: 'error' });
        }

        // Tự động ẩn thông báo sau 3 giây
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.profileContainer}>
            <Link to="/" className={styles.closeButton}>&times;</Link>
            <h1>Hồ Sơ Của Tôi</h1>
            <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
            <hr />

            {notification.message && (
                <div className={`${styles.notification} ${styles[notification.type]}`}>
                    {notification.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.profileForm}>
                {/* Form Fields */}
                <div className={styles.formRow}>
                    <div className={styles.formLabel}>Họ và Tên</div>
                    <div className={styles.formValue}>
                        <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} disabled={!isEditing} className={styles.inputField} />
                    </div>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formLabel}>Email</div>
                    <div className={styles.formValue}>
                        <input type="customerEmail" name="customerEmail" value={formData.customerEmail} onChange={handleChange} disabled={!isEditing} className={styles.inputField} />
                    </div>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formLabel}>Số điện thoại</div>
                    <div className={styles.formValue}>
                        <input type="tel" name="customerPhone" value={formData.customerPhone} onChange={handleChange} disabled={!isEditing} className={styles.inputField} />
                    </div>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formLabel}>Địa chỉ</div>
                    <div className={styles.formValue}>
                        <input type="text" name="customerAddress" value={formData.customerAddress} onChange={handleChange} disabled={!isEditing} className={styles.inputField} />
                    </div>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formLabel}>Ngày sinh</div>
                    <div className={styles.formValue}>
                        <input type="date" name="customerDateOfBirth" value={formData.customerDateOfBirth} onChange={handleChange} disabled={!isEditing} className={styles.inputField} />
                    </div>
                </div>
                {isEditing && (
                    <div className={styles.formRow}>
                        <div className={styles.formLabel}>Mật khẩu mới</div>
                        <div className={`${styles.formValue} ${styles.passwordInputContainer}`}>
                            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className={styles.inputField} placeholder="Để trống nếu không muốn đổi" />
                            <span className={styles.passwordIcon} onMouseDown={togglePasswordVisibility} onMouseUp={togglePasswordVisibility} onMouseLeave={() => setShowPassword(false)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                )}

                {/* Button Group */}
                <div className={styles.buttonGroup}>
                    {isEditing ? (
                        <>
                            <div className={styles.confirmButtonContainer}>
                                <button type="submit" className={styles.actionButton}>
                                    Xác nhận
                                </button>
                            </div>
                            <div className={styles.rightButtons}>
                                <button type="button" className={styles.secondaryButton} onClick={handleCancel}>
                                    Quay lại
                                </button>
                                <button type="button" className={styles.logoutButton} onClick={handleLogout}>
                                    Đăng xuất
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className={styles.rightButtons}>
                            {/* Đã thêm onClick gọi hàm handleEdit mới */}
                            <button type="button" className={styles.actionButton} onClick={handleEdit}>
                                Sửa thông tin
                            </button>
                            <button type="button" className={styles.logoutButton} onClick={handleLogout}>
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default UserProfilePage;