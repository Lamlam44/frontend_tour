import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/LoginPage.module.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
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
    // Chỉ là mô phỏng gửi form. Tích hợp API thực tế sau.
    setTimeout(() => {
      setSubmitting(false);
      if (email === 'admin@gmail.com' && password === 'admin123') {
        navigate('/dashboard'); // Redirect to the desired page
      } else {
        alert('Đăng nhập thành công (demo). Hãy tích hợp API thật sau!');
      }
    }, 800);
  };

  return (
    <div>
      <Header />
      <main className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Đăng nhập</h1>
          <p className={styles.subtitle}>Chào mừng bạn quay lại 👋</p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={errors.email ? styles.inputError : ''}
                autoComplete="email"
              />
              {errors.email && <div className={styles.error}>{errors.email}</div>}
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
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Ghi nhớ đăng nhập
              </label>
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
            <button type="button" className={styles.socialBtn}>Đăng nhập với Google</button>
            <button type="button" className={styles.socialBtnOutline}>Đăng nhập với Facebook</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LoginPage;
