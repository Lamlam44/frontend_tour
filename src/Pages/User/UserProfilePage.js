import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWebSocket } from '../../context/WebSocketContext';
import styles from '../../Assets/CSS/PageCSS/UserProfilePage.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { getInvoicesForCurrentUser } from '../../services/api';
// 1. Import useToast từ Chakra UI
import { useToast } from '@chakra-ui/react';

const UserProfilePage = () => {
    const { user, updateUser, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    
    // 2. Khởi tạo Toast (Sửa lỗi 'toast is not defined')
    const toast = useToast();

    const webSocketContext = useWebSocket();
    // Lấy các biến từ context an toàn
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
    
    // State notification cũ (vẫn giữ để hiện thông báo lỗi form nếu cần)
    const [notification, setNotification] = useState({ message: '', type: '' });
    
    const [userInvoices, setUserInvoices] = useState([]);
    // Mặc định hiện lịch sử để dễ test
    const [showBookingHistory, setShowBookingHistory] = useState(true);
    
    const subscriptionRef = useRef(null);

    // Helper: Format Date an toàn
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
    };

    const initialFormData = {
        customerName: user?.name || '',
        customerEmail: user?.email || '',
        customerPhone: user?.phone || '',
        customerAddress: user?.address || '',
        customerDateOfBirth: formatDateForInput(user?.dateOfBirth),
        password: ''
    };

    // Effect 1: Kiểm tra Auth và Tải dữ liệu hóa đơn ban đầu
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
    // Effect 2: WebSocket Subscription (LOGIC REALTIME HOÀN CHỈNH)
    // ==================================================================
    // ==================================================================
    // DEBUG REALTIME EFFECT
    // ==================================================================
    useEffect(() => {
        // 1. LOG KIỂM TRA DỮ LIỆU USER
        console.log("--- DEBUG WEBSOCKET ---");
        console.log("Is Connected:", isConnected);
        console.log("User Object:", user);
        
        // Kiểm tra xem user có account không
        if (!user) {
            console.log("❌ User chưa đăng nhập hoặc chưa load xong.");
            return;
        }

        // TÌM ACCOUNT ID (Thử nhiều cách để tránh null)
        // Tùy vào API login trả về, nó có thể nằm ở user.account.accountId hoặc user.accountId
        const accountId = user.account?.accountId || user.accountId || user.id;

        if (!accountId) {
            console.error("❌ LỖI NGHIÊM TRỌNG: Không tìm thấy Account ID trong đối tượng User!");
            console.log("Cấu trúc User hiện tại:", JSON.stringify(user, null, 2));
            return;
        }

        if (isConnected && subscribe) {
            // Topic này phải khớp 100% với Backend
            const topic = `/topic/invoices/${accountId}`; 
            console.log("✅ Frontend đang đăng ký nghe tại kênh:", topic);

            if (subscriptionRef.current) {
                if (typeof subscriptionRef.current.unsubscribe === 'function') {
                    subscriptionRef.current.unsubscribe();
                }
            }

            const newSubscription = subscribe(topic, (msgBody) => {
                console.log("🔥 NHẬN ĐƯỢC TIN NHẮN TỪ SERVER:", msgBody);
                
                if (!msgBody || !msgBody.invoice) {
                    console.warn("⚠️ Tin nhắn rỗng hoặc sai cấu trúc:", msgBody);
                    return;
                }

                const updatedInvoice = msgBody.invoice;
                console.log("📦 Dữ liệu hóa đơn mới:", updatedInvoice);

                // HIỆN TOAST
                toast({
                    title: `Cập nhật đơn hàng #${updatedInvoice.invoiceId}`,
                    description: `Trạng thái mới: ${updatedInvoice.status}.`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right',
                    variant: 'solid'
                });

                // CẬP NHẬT STATE
                setUserInvoices(prevInvoices => {
                    console.log("Danh sách cũ:", prevInvoices);
                    const newList = prevInvoices.map(inv => 
                        inv.invoiceId === updatedInvoice.invoiceId ? updatedInvoice : inv
                    );
                    console.log("Danh sách mới sau update:", newList);
                    return newList;
                });
            });

            subscriptionRef.current = newSubscription;
        }
        
        return () => {
            if (subscriptionRef.current?.unsubscribe) {
                subscriptionRef.current.unsubscribe();
            }
        };
    }, [isConnected, user, subscribe, toast]); 

    // --- Handlers Form ---

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
        if (!updateData.password) delete updateData.password;

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
                                            <td style={{ 
                                                color: invoice.status === 'PAID' ? 'green' : 'orange',
                                                fontWeight: 'bold',
                                                transition: 'all 0.3s ease' // Hiệu ứng chuyển màu mượt mà
                                            }}>
                                                {invoice.status}
                                            </td>
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