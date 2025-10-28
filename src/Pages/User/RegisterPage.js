import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/RegisterPage.module.css';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Vui lòng nhập họ và tên';
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
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Mật khẩu nhập lại không khớp';
    }
    if (!agree) newErrors.agree = 'Bạn cần đồng ý với điều khoản sử dụng';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    // Demo: giả lập gửi dữ liệu đăng ký. Tích hợp API backend thực tế sau.
    setTimeout(() => {
      setSubmitting(false);
      alert('Đăng ký thành công (demo). Hãy tích hợp API thật sau!');
    }, 900);
  };

  return (
    <div>
      <Header />
      <main className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Tạo tài khoản</h1>
          <p className={styles.subtitle}>Nhanh chóng và miễn phí ✨</p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formGroup}>
              <label htmlFor="name">Họ và tên</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className={errors.name ? styles.inputError : ''}
                autoComplete="name"
              />
              {errors.name && <div className={styles.error}>{errors.name}</div>}
            </div>

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
                autoComplete="new-password"
              />
              {errors.password && <div className={styles.error}>{errors.password}</div>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={errors.confirmPassword ? styles.inputError : ''}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <div className={styles.error}>{errors.confirmPassword}</div>
              )}
            </div>

            <div className={styles.optionsRow}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                Tôi đồng ý với <Link to="#" className={styles.smallLink}>Điều khoản sử dụng</Link>
              </label>
            </div>
            {errors.agree && <div className={styles.error}>{errors.agree}</div>}

            <button className={styles.submitBtn} type="submit" disabled={submitting}>
              {submitting ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
          </form>

          <p className={styles.bottomText}>
            Đã có tài khoản?{' '}
            <Link to="/login" className={styles.linkAccent}>Đăng nhập</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default RegisterPage;
