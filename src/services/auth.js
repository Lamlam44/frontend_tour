// src/services/auth.js

/**
 * Dịch vụ xác thực để quản lý trạng thái đăng nhập của người dùng.
 * Sử dụng localStorage để lưu trữ token hoặc thông tin người dùng một cách giả lập.
 */

const USER_TOKEN_KEY = 'authToken';

/**
 * Giả lập đăng nhập: lưu một token giả vào localStorage.
 * @param {string} username 
 * @param {string} password 
 */
export const login = async (username, password) => {
  console.log(`AUTH: Đăng nhập với ${username}...`);
  // Trong ứng dụng thực tế, bạn sẽ gọi API đăng nhập ở đây.
  // const response = await fetch(`${API_BASE_URL}/auth/login`, { ... });
  // const data = await response.json();
  // if(data.success) {
  //   localStorage.setItem(USER_TOKEN_KEY, data.token);
  // }
  
  // Giả lập thành công và lưu token giả
  await new Promise(res => setTimeout(res, 500));
  const fakeToken = `fake-token-for-${username}`;
  localStorage.setItem(USER_TOKEN_KEY, fakeToken);
  console.log('AUTH: Đăng nhập thành công.');
  return { success: true, token: fakeToken };
};

/**
 * Đăng xuất: xóa token khỏi localStorage.
 */
export const logout = () => {
  console.log('AUTH: Đăng xuất...');
  localStorage.removeItem(USER_TOKEN_KEY);
};

/**
 * Kiểm tra xem người dùng đã đăng nhập hay chưa.
 * @returns {boolean} True nếu đã đăng nhập, ngược lại là false.
 */
export const isLoggedIn = () => {
  const token = localStorage.getItem(USER_TOKEN_KEY);
  return !!token;
};

/**
 * Lấy thông tin người dùng hiện tại.
 * Trong thực tế, bạn có thể giải mã token JWT ở đây hoặc gọi API /me.
 * Ở đây, chúng ta chỉ trả về một đối tượng giả lập nếu đã đăng nhập.
 */
export const getCurrentUser = () => {
  if (isLoggedIn()) {
    return {
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      // Thêm các thông tin khác nếu cần
    };
  }
  return null;
};
