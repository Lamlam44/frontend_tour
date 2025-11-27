import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const googleButtonRef = useRef(null);

  // Load Google Sign-In API
  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && googleButtonRef.current) {
          window.google.accounts.id.initialize({
            client_id: '782213992795-q76p3jo5em0dktaevab51ab8drnq62df.apps.googleusercontent.com',
            callback: handleGoogleResponse,
          });
          // Render button vào div
          window.google.accounts.id.renderButton(
            googleButtonRef.current,
            { 
              theme: 'outline', 
              size: 'large',
              width: googleButtonRef.current.offsetWidth,
              text: 'signin_with',
              locale: 'vi'
            }
          );
        }
      };
      document.body.appendChild(script);
    };
    loadGoogleScript();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!username) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (username.length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }
    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSubmitting(true);
    setErrors({});

    try {
      // Since AuthContext and its login function are removed,
      // we'll simulate a failed login attempt.
      setErrors({ submit: 'Chức năng đăng nhập hiện không khả dụng do AuthContext bị thiếu.' });
    } catch (error) {
      setErrors({ submit: 'Đã xảy ra lỗi. Vui lòng thử lại!' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleResponse = async (response) => {
    if (!response.credential) return;

    try {
      // Decode JWT token từ Google
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const googleUser = JSON.parse(jsonPayload);
      const email = googleUser.email;

      // Gọi API backend với email từ Google
      const loginResult = await fetch('http://localhost:8080/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });

      const loginData = await loginResult.json();

      if (loginResult.ok && loginData.token) {
        // Đăng nhập thành công
        localStorage.setItem('token', loginData.token);
        localStorage.setItem('user', JSON.stringify(loginData.user));
        
        const userRole = loginData.user.role;
        if (userRole === 'admin' || userRole === 'ROLE_ADMIN') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } else if (loginResult.status === 202) {
        // Cần xác thực email
        setErrors({ submit: loginData.message || 'Vui lòng kiểm tra email để xác thực tài khoản' });
      } else {
        setErrors({ submit: 'Đăng nhập Google thất bại' });
      }
    } catch (error) {
      console.error('Google login error:', error);
      setErrors({ submit: 'Lỗi kết nối với Google' });
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
            <div className={styles.errorBox} style={{
              backgroundColor: '#fee', 
              color: '#c33', 
              padding: '10px', 
              borderRadius: '4px', 
              marginBottom: '15px',
              border: '1px solid #fcc'
            }}>
              {errors.submit}
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formGroup}>
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                className={errors.username ? styles.inputError : ''}
                autoComplete="username"
              />
              {errors.username && <div className={styles.error}>{errors.username}</div>}
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="password">Mật khẩu</label>
                <button
                  type="button"
                  className={styles.smallLink}
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={errors.password ? styles.inputError : ''}
                autoComplete="current-password"
              />
              {errors.password && <div className={styles.error}>{errors.password}</div>}
            </div>

            <div className={styles.optionsRow}>
              <Link className={styles.smallLink} to="#">Quên mật khẩu?</Link>
            </div>

            <button className={styles.submitBtn} type="submit" disabled={submitting}>
              {submitting ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>

          <p className={styles.bottomText}>
            Chưa có tài khoản?{' '}
            <Link to="/register" className={styles.linkAccent}>Đăng ký ngay</Link>
          </p>

          <div className={styles.divider}><span>hoặc</span></div>

          <div className={styles.socials}>
            <div ref={googleButtonRef} style={{ width: '100%' }}></div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LoginPage;