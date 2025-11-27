import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in the headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Hàm đăng nhập (Gửi email + password lên Server)
export const login = async (credentials) => {
  try {
    // 1. CHUẨN BỊ DỮ LIỆU THEO ĐÚNG ĐỊNH DẠNG
    const formBody = new URLSearchParams();
    formBody.append('username', credentials.username); // Backend mặc định dùng key 'username'
    formBody.append('password', credentials.password);

    // 2. GỌI ĐẾN ĐÚNG URL ĐĂNG NHẬP
    // URL là '/login' theo cấu hình mặc định của Spring Security.
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        // 3. ĐỊNH NGHĨA ĐÚNG CONTENT-TYPE
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody.toString(),
    });

    // 4. KIỂM TRA KẾT QUẢ TRẢ VỀ
    // fetch() không báo lỗi cho các mã HTTP như 401 (Unauthorized).
    // Chúng ta phải tự kiểm tra response.ok.
    if (!response.ok) {
      // Nếu không 'ok', nghĩa là đăng nhập thất bại (sai email/mật khẩu).
      throw new Error('Đăng nhập thất bại: Sai thông tin đăng nhập.');
    }

    // 5. XỬ LÝ KHI THÀNH CÔNG
    // Khi đăng nhập thành công, trình duyệt sẽ tự động nhận và lưu session cookie.
    // Body của response có thể trống. Chúng ta có thể trả về một trạng thái thành công.
    // Hoặc nếu backend bạn có trả về thông tin user dạng JSON, chúng ta có thể thử parse nó.
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json(); // Nếu có JSON, trả về dữ liệu đó
    }
    
    return { loggedIn: true }; // Nếu không, trả về trạng thái đăng nhập thành công

  } catch (error) {
    console.error('Lỗi trong quá trình đăng nhập:', error);
    // Ném lỗi ra ngoài để component có thể bắt và xử lý (ví dụ: hiển thị thông báo).
    throw error;
  }
};

// Hàm đăng ký người dùng
export const registerUser = async (userData) => {
  try {
    // Endpoint để tạo tài khoản khách hàng mới
    const response = await apiClient.post('/customers/register', userData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error.response?.data || error.message);
    // Ném lỗi cụ thể từ backend nếu có
    throw new Error(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
  }
};

// Lấy thông tin cá nhân của người dùng đã đăng nhập
export const getUserProfile = async () => {
  try {
    // Endpoint này cần được bảo vệ và trả về thông tin của user hiện tại
    const response = await apiClient.get('/customers/me');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    throw error;
  }
};

// Cập nhật thông tin cá nhân
export const updateUserProfile = async (userData) => {
  try {
    const response = await apiClient.put('/customers/me', userData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin người dùng:', error);
    throw error;
  }
};

// Tạo một booking mới
export const createBooking = async (bookingData) => {
  try {
    const response = await apiClient.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo booking:', error);
    throw error;
  }
};

// Lấy danh sách booking của người dùng hiện tại
export const getBookingsByCurrentUser = async () => {
  try {
    // Endpoint này cần được bảo vệ và trả về booking của user đã xác thực
    const response = await apiClient.get('/bookings/my-bookings');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách booking:', error);
    throw error;
  }
};

// --- CÁC HÀM API CHO THANH TOÁN ---

// 1. Lấy chi tiết booking theo ID (dùng cho trang thanh toán)
export const getBookingById = async (bookingId) => {
  try {
    const response = await apiClient.get(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy booking ID ${bookingId}:`, error);
    throw error;
  }
};

// Function to create an Invoice
export const createInvoice = async (invoiceData) => {
  try {
    const response = await apiClient.post('/invoices', invoiceData);
    return response.data; // This should contain the InvoiceResponseDTO with invoiceId
  } catch (error) {
    console.error('Lỗi khi tạo hóa đơn:', error);
    throw new Error(error.response?.data?.message || 'Không thể tạo hóa đơn.');
  }
};


// 2. Tạo URL thanh toán VNPAY
export const createVnPayPaymentUrl = async (paymentData) => {
  try {
    const response = await apiClient.post('/payments/vnpay/create-url', paymentData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo URL thanh toán VNPAY:', error);
    throw new Error(error.response?.data?.message || 'Không thể tạo yêu cầu thanh toán VNPAY.');
  }
};

// 3. Xử lý các phương thức thanh toán khác (ví dụ: tại quầy, chuyển khoản)
export const processPayment = async (paymentData) => {
  try {
    const response = await apiClient.post('/payment/process', paymentData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xử lý thanh toán:', error);
    throw error;
  }
}

// 4. Xác thực lại giao dịch VNPAY trả về
export const verifyVnPayPayment = async (params) => {
  try {
    // Gửi tất cả các query params từ VNPAY về backend
    const response = await apiClient.get('/payments/vnpay-return', { params });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xác thực thanh toán VNPAY:', error);
    throw error;
  }
};

export const createHotelBooking = async (bookingData) => {
    try {
        const response = await apiClient.post('/hotel-bookings', bookingData);
        return response.data;
    } catch (error) {
        console.error('Error creating hotel booking:', error);
        throw error;
    }
};

export const createFlightBooking = async (bookingData) => {
    try {
        const response = await apiClient.post('/flight-bookings', bookingData);
        return response.data;
    } catch (error) {
        console.error('Error creating flight booking:', error);
        throw error;
    }
};

export const getPromotions = async () => {
  try {
    const response = await apiClient.get('/promotions');
    return response.data;
  } catch (error) {
    console.error('Error fetching promotions:', error);
    throw error;
  }
};

export const addPromotion = async (promotionData) => {
  try {
    const response = await apiClient.post('/promotions', promotionData);
    return response.data;
  } catch (error) {
    console.error('Error adding promotion:', error);
    throw error;
  }
};

export const updatePromotion = async (id, promotionData) => {
  try {
    const response = await apiClient.put(`/promotions/${id}`, promotionData);
    return response.data;
  } catch (error) {
    console.error('Error updating promotion:', error);
    throw error;
  }
};

export const deletePromotion = async (id) => {
  try {
    const response = await apiClient.delete(`/promotions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting promotion:', error);
    throw error;
  }
};

export const getTravelVehicles = async () => {
  try {
    const response = await apiClient.get('/travel-vehicles');
    return response.data;
  } catch (error) {
    console.error('Error fetching travel vehicles:', error);
    throw error;
  }
};

export const addTravelVehicle = async (travelVehicleData) => {
  try {
    const response = await apiClient.post('/travel-vehicles', travelVehicleData);
    return response.data;
  } catch (error) {
    console.error('Error adding travel vehicle:', error);
    throw error;
  }
};

export const updateTravelVehicle = async (id, travelVehicleData) => {
  try {
    const response = await apiClient.put(`/travel-vehicles/${id}`, travelVehicleData);
    return response.data;
  } catch (error) {
    console.error('Error updating travel vehicle:', error);
    throw error;
  }
};

export const deleteTravelVehicle = async (id) => {
  try {
    const response = await apiClient.delete(`/travel-vehicles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting travel vehicle:', error);
    throw error;
  }
};


export const getTours = async () => {
  try {
    const response = await apiClient.get('/tours');
    return response.data;
  } catch (error) {
    console.error('Error fetching tours:', error);
    throw error;
  }
};

export const getTourById = async (id) => {
  try {
    const response = await apiClient.get(`/tours/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tour with id ${id}:`, error);
    throw error;
  }
};

export const addTour = async (tourData) => {
  try {
    const response = await apiClient.post('/tours', tourData);
    return response.data;
  } catch (error) {
    console.error('Error adding tour:', error);
    throw error;
  }
};

export const updateTour = async (id, tourData) => {
  try {
    const response = await apiClient.put(`/tours/${id}`, tourData);
    return response.data;
  } catch (error) {
    console.error('Error updating tour:', error);
    throw error;
  }
};

export const deleteTour = async (id) => {
  try {
    const response = await apiClient.delete(`/tours/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting tour:', error);
    throw error;
  }
};

export const getAccommodations = async () => {
  try {
    const response = await apiClient.get('/accommodations');
    return response.data;
  } catch (error) {
    console.error('Error fetching accommodations:', error);
    throw error;
  }
};

export const getAccommodationById = async (id) => {
  try {
    const response = await apiClient.get(`/accommodations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching accommodation with id ${id}:`, error);
    throw error;
  }
};

export const addAccommodation = async (accommodationData) => {
  try {
    const response = await apiClient.post('/accommodations', accommodationData);
    return response.data;
  } catch (error) {
    console.error('Error adding accommodation:', error);
    throw error;
  }
};

export const updateAccommodation = async (id, accommodationData) => {
  try {
    const response = await apiClient.put(`/accommodations/${id}`, accommodationData);
    return response.data;
  } catch (error) {
    console.error('Error updating accommodation:', error);
    throw error;
  }
};

export const deleteAccommodation = async (id) => {
  try {
    const response = await apiClient.delete(`/accommodations/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting accommodation:', error);
    throw error;
  }
};

export const getCustomers = async () => {
  try {
    const response = await apiClient.get('/customers');
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const addCustomer = async (customerData) => {
  try {
    const response = await apiClient.post('/customers', customerData);
    return response.data;
  } catch (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
};

export const updateCustomer = async (id, customerData) => {
  try {
    const response = await apiClient.put(`/customers/${id}`, customerData);
    return response.data;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await apiClient.delete(`/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

export const getTourGuides = async () => {
  try {
    const response = await apiClient.get('/tour-guides');
    return response.data;
  } catch (error) {
    console.error('Error fetching tour guides:', error);
    throw error;
  }
};

export const addTourGuide = async (tourGuideData) => {
  try {
    const response = await apiClient.post('/tour-guides', tourGuideData);
    return response.data;
  } catch (error) {
    console.error('Error adding tour guide:', error);
    throw error;
  }
};

export const updateTourGuide = async (id, tourGuideData) => {
  try {
    const response = await apiClient.put(`/tour-guides/${id}`, tourGuideData);
    return response.data;
  } catch (error) {
    console.error('Error updating tour guide:', error);
    throw error;
  }
};

export const deleteTourGuide = async (id) => {
  try {
    const response = await apiClient.delete(`/tour-guides/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting tour guide:', error);
    throw error;
  }
};

export const getTouristDestinations = async () => {
  try {
    const response = await apiClient.get('/tourist-destinations');
    return response.data;
  } catch (error) {
    console.error('Error fetching tourist destinations:', error);
    throw error;
  }
};

export const addTouristDestination = async (touristDestinationData) => {
  try {
    const response = await apiClient.post('/tourist-destinations', touristDestinationData);
    return response.data;
  } catch (error) {
    console.error('Error adding tourist destination:', error);
    throw error;
  }
};

export const updateTouristDestination = async (id, touristDestinationData) => {
  try {
    const response = await apiClient.put(`/tourist-destinations/${id}`, touristDestinationData);
    return response.data;
  } catch (error) {
    console.error('Error updating tourist destination:', error);
    throw error;
  }
};

export const deleteTouristDestination = async (id) => {
  try {
    const response = await apiClient.delete(`/tourist-destinations/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting tourist destination:', error);
    throw error;
  }
};