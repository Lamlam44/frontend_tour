import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import styles from '../../Assets/CSS/PageCSS/RegisterPage.module.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    address: '',
    dateOfBirth: ''
  });
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    // Validate username
    if (!formData.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }
    
    // Validate email
    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Mật khẩu nhập lại không khớp';
    }
    
    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }
    
    // Validate phone
    if (!formData.phone) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10-11 số)';
    }
    
    // Validate address
    if (!formData.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }
    
    // Validate date of birth
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Vui lòng nhập ngày sinh';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        newErrors.dateOfBirth = 'Bạn phải từ 13 tuổi trở lên';
      }
    }
    
    // Validate agree
    if (!agree) {
      newErrors.agree = 'Bạn cần đồng ý với điều khoản sử dụng';
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
      // Bước 1: Tạo Account trước
      const accountData = {
        username: formData.username,
        password: formData.password,
        roleId: "ROL-94C8E4AC", // mặc định là ROLE_USER
        status: true // Active by default
      };

      const accountResponse = await axiosInstance.post('/accounts', accountData);
      
      if (!accountResponse.data) {
        throw new Error('Tạo tài khoản thất bại');
      }

      const accountId = accountResponse.data.accountId;

      // Bước 2: Tạo Customer với accountId vừa tạo
      const customerData = {
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        customerDateOfBirth: formData.dateOfBirth,
        accountId: accountId
      };

      const customerResponse = await axiosInstance.post('/customers', customerData);
      
      if (customerResponse.data) {
        alert('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Register error:', error);
      
      // Lấy message từ responseDTO backend
      let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại!';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
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
          <h1 className={styles.title}>Tạo tài khoản</h1>
          <p className={styles.subtitle}>Nhanh chóng và miễn phí ✨</p>

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
              <label htmlFor="username">Tên đăng nhập *</label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder=""
                className={errors.username ? styles.inputError : ''}
                autoComplete="username"
              />
              {errors.username && <div className={styles.error}>{errors.username}</div>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=""
                className={errors.email ? styles.inputError : ''}
                autoComplete="email"
              />
              {errors.email && <div className={styles.error}>{errors.email}</div>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="fullName">Họ và tên *</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder=""
                className={errors.fullName ? styles.inputError : ''}
                autoComplete="name"
              />
              {errors.fullName && <div className={styles.error}>{errors.fullName}</div>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Số điện thoại *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder=""
                className={errors.phone ? styles.inputError : ''}
                autoComplete="tel"
              />
              {errors.phone && <div className={styles.error}>{errors.phone}</div>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="dateOfBirth">Ngày sinh *</label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={errors.dateOfBirth ? styles.inputError : ''}
                autoComplete="bday"
              />
              {errors.dateOfBirth && <div className={styles.error}>{errors.dateOfBirth}</div>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="address">Địa chỉ *</label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                placeholder=""
                className={errors.address ? styles.inputError : ''}
                autoComplete="street-address"
              />
              {errors.address && <div className={styles.error}>{errors.address}</div>}
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="password">Mật khẩu *</label>
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
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={errors.password ? styles.inputError : ''}
                autoComplete="new-password"
              />
              {errors.password && <div className={styles.error}>{errors.password}</div>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Nhập lại mật khẩu *</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
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
