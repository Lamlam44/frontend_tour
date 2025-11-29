import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/LoginPage.module.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Hàm xử lý khi bấm nút Google - CHUYỂN HƯỚNG SANG BACKEND
  const handleGoogleLogin = () => {
    // URL của Spring Security OAuth2 Endpoint
    // Backend chạy port 8080 (mặc định), nếu khác thì sửa lại
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const validate = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Vui lòng nhập tên đăng nhập';
    if (!password) newErrors.password = 'Vui lòng nhập mật khẩu';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSubmitting(true);
    setErrors({});

    try {
      const result = await login(username, password);
      
      if (result.success) {
        // After a successful login, the AuthContext state will update.
        // We simply navigate to the home page.
        // Role-based redirects should be handled by a dedicated router component or ProtectedRoutes.
        navigate('/');
      } else {
        // Show error message from backend
        setErrors({ submit: result.error || 'Đăng nhập thất bại' });
      }
    } catch (error) {
      const errorMessage = error.message || 'Đã xảy ra lỗi. Vui lòng thử lại!';
      setErrors({ submit: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Header />
      <main className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Đăng nhập</h1>
          <p className={styles.subtitle}>Chào mừng bạn quay lại 👋</p>

          {errors.submit && (
            <div className={styles.errorBox} style={{backgroundColor: '#fee', color: '#c33', padding: '10px', borderRadius: '4px', marginBottom: '15px'}}>
              {errors.submit}
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formGroup}>
              <label htmlFor="username">Tên đăng nhập</label>
              <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={errors.username ? styles.inputError : ''} />
              {errors.username && <div className={styles.error}>{errors.username}</div>}
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="password">Mật khẩu</label>
                <button type="button" className={styles.smallLink} onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Ẩn' : 'Hiện'}</button>
              </div>
              <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className={errors.password ? styles.inputError : ''} />
              {errors.password && <div className={styles.error}>{errors.password}</div>}
            </div>

            <button className={styles.submitBtn} type="submit" disabled={submitting}>
              {submitting ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>

          <p className={styles.bottomText}>Chưa có tài khoản? <Link to="/register" className={styles.linkAccent}>Đăng ký ngay</Link></p>
          <div className={styles.divider}><span>hoặc</span></div>

          <div className={styles.socials}>
            {/* Nút Google mới - Đơn giản và hiệu quả */}
            <button 
                type="button"
                onClick={handleGoogleLogin}
                style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    padding: '10px', backgroundColor: '#fff', border: '1px solid #dadce0', borderRadius: '4px',
                    cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#3c4043', height: '40px'
                }}
            >
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" style={{ width: '18px' }} />
                Đăng nhập với Google
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LoginPage;