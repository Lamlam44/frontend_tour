import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWebSocket } from '../../context/WebSocketContext';
import styles from '../../Assets/CSS/PageCSS/UserProfilePage.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { getInvoicesForCurrentUser } from '../../services/api';
import { useToast } from '@chakra-ui/react';

const UserProfilePage = () => {
    const { user, updateUser, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    // 1. Lấy context WebSocket an toàn
    const webSocketContext = useWebSocket();
    const { subscribe, isConnected } = webSocketContext || {}; 

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
    const [userInvoices, setUserInvoices] = useState([]);
    const [showBookingHistory, setShowBookingHistory] = useState(false);
    
    // Ref lưu trữ subscription để unsubscribe sau này
    const subscriptionRef = useRef(null);

    // Helper: Format Date an toàn
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
    };

    // Giá trị khởi tạo form
    const initialFormData = {
        customerName: user?.name || '',
        customerEmail: user?.email || '',
        customerPhone: user?.phone || '',
        customerAddress: user?.address || '',
        customerDateOfBirth: formatDateForInput(user?.dateOfBirth),
        password: ''
    };

    // Effect 1: Kiểm tra Auth và tải dữ liệu ban đầu
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        if (user) {
            setFormData(initialFormData);
            const fetchUserInvoices = async () => {
                try {
                    const invoices = await getInvoicesForCurrentUser();
                    setUserInvoices(invoices);
                } catch (error) {
                    console.error("Error fetching user invoices:", error);
                    setNotification({ message: 'Không thể tải lịch sử đặt tour.', type: 'error' });
                }
            };
            fetchUserInvoices();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isAuthenticated, navigate]);

    // ==================================================================
    // Effect 2: WebSocket Subscription 
    // ==================================================================
    useEffect(() => {
        if (isConnected && user && subscribe) {
            const topic = `/user/queue/payment-updates`; 

            if (subscriptionRef.current) {
                if (typeof subscriptionRef.current.unsubscribe === 'function') {
                    subscriptionRef.current.unsubscribe();
                }
            }

            const newSubscription = subscribe(topic, (msgBody) => {
                console.log("Realtime invoice update received:", msgBody);
                
                if (!msgBody || !msgBody.invoice) return;

                const updatedInvoiceData = msgBody.invoice;

                // 3. THÔNG BÁO BẰNG TOAST (Thay thế setNotification)
                toast({
                    title: `Cập nhật đơn hàng #${updatedInvoiceData.invoiceId}`,
                    description: `Trạng thái mới: ${updatedInvoiceData.status}. ${msgBody.message || ''}`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right',
                    variant: 'solid'
                });

                // Cập nhật danh sách
                setUserInvoices(prevInvoices => {
                    if (!prevInvoices || prevInvoices.length === 0) return [updatedInvoiceData];
                    return prevInvoices.map(inv => 
                        inv.invoiceId === updatedInvoiceData.invoiceId 
                            ? updatedInvoiceData 
                            : inv
                    );
                });
            });

            subscriptionRef.current = newSubscription;
        }

        return () => {
            if (subscriptionRef.current) {
                if (typeof subscriptionRef.current.unsubscribe === 'function') {
                    subscriptionRef.current.unsubscribe();
                }
                subscriptionRef.current = null;
            }
        };
    }, [isConnected, user, subscribe, toast]); // Thêm toast vào dependency

    // Các hàm xử lý Form

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleEdit = (e) => {
        if(e) e.preventDefault();
        setTimeout(() => {
            setIsEditing(true);
        }, 100);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData(initialFormData);
        setNotification({ message: '', type: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isEditing) return;

        const updateData = { ...formData };
        // Nếu không nhập password thì xóa field này để không gửi lên server
        if (!updateData.password) {
            delete updateData.password;
        }

        try {
            const result = await updateUser(updateData);
            if (result.success) {
                setNotification({ message: 'Cập nhật thông tin thành công!', type: 'success' });
                setIsEditing(false);
            } else {
                setNotification({ message: result.error || 'Đã xảy ra lỗi.', type: 'error' });
            }
        } catch (error) {
            setNotification({ message: 'Lỗi kết nối server.', type: 'error' });
        }

        // Tự động ẩn thông báo sau 3s
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Kiểm tra an toàn trước khi render
    if (!user) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải thông tin...</div>;
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
                <div className={styles.formRow}>
                    <div className={styles.formLabel}>Họ và Tên</div>
                    <div className={styles.formValue}>
                        <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} disabled={!isEditing} className={styles.inputField} />
                    </div>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formLabel}>Email</div>
                    <div className={styles.formValue}>
                        <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} disabled={!isEditing} className={styles.inputField} />
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

            <div className={styles.historySection}>
                <button 
                    className={styles.toggleHistoryButton} 
                    onClick={() => setShowBookingHistory(!showBookingHistory)}
                >
                    {showBookingHistory ? 'Ẩn lịch sử đặt tour' : 'Xem lịch sử đặt tour'} ({userInvoices.length})
                </button>

                {showBookingHistory && (
                    <div className={styles.invoiceList}>
                        {userInvoices.length > 0 ? (
                            <table className={styles.invoiceTable}>
                                <thead>
                                    <tr>
                                        <th>Mã hóa đơn</th>
                                        <th>Tour</th>
                                        <th>Số người</th>
                                        <th>Tổng tiền</th>
                                        <th>Trạng thái</th>
                                        <th>Ngày tạo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userInvoices.map(invoice => (
                                        <tr key={invoice.invoiceId}>
                                            <td>{invoice.invoiceId}</td>
                                            <td>{invoice.tour?.tourName || 'N/A'}</td>
                                            <td>{invoice.numberOfPeople}</td>
                                            <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(invoice.totalAmount)}</td>
                                            <td>{invoice.status}</td>
                                            <td>{new Date(invoice.invoiceCreatedAt || invoice.invoiceDate).toLocaleDateString('vi-VN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Bạn chưa có lịch sử đặt tour nào.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfilePage;