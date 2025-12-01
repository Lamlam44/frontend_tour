import axiosInstance from '../api/axiosConfig';

/**
 * HELPER: Xử lý lỗi API thống nhất
 */
const handleApiError = (error, defaultMessage) => {
    console.error(`${defaultMessage}:`, error);
    throw error.response?.data || { message: error.message || defaultMessage };
};

// ============================================================
// 1. AUTHENTICATION API (Đăng nhập, Đăng ký, Profile)
// ============================================================
export const login = async (username, password) => {
    try {
        // Nếu backend dùng JSON login
        const response = await axiosInstance.post('/auth/login', { username, password });
        return response.data;
    } catch (error) {
        // Fallback: Nếu backend dùng Form Login (x-www-form-urlencoded)
        if (error.response?.status === 404 || error.code === "ERR_NETWORK") {
             try {
                const params = new URLSearchParams();
                params.append('username', username);
                params.append('password', password);
                const formResponse = await axiosInstance.post('/login', params, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                return formResponse.data;
             } catch (formError) {
                 handleApiError(formError, "Login failed");
             }
        }
        handleApiError(error, "Login failed");
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await axiosInstance.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        handleApiError(error, "Registration failed");
    }
};

export const getUserProfile = async () => {
    try {
        const response = await axiosInstance.get('/auth/profile'); // Hoặc /customers/me tuỳ backend
        return response.data;
    } catch (error) {
        handleApiError(error, "Fetch profile failed");
    }
};

export const updateUserProfile = async (userData) => {
    try {
        const response = await axiosInstance.put('/auth/profile', userData); // Hoặc /customers/me
        return response.data;
    } catch (error) {
        handleApiError(error, "Update profile failed");
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Có thể gọi API logout nếu backend cần invalidate session
};

// ============================================================
// 2. ACCOUNT MANAGEMENT API
// ============================================================
export const getAccounts = async () => {
    try {
        const response = await axiosInstance.get("/accounts");
        return response.data;
    } catch (error) { handleApiError(error, "Error fetching accounts"); }
};

export const getAccountRoles = async () => {
    try {
        const response = await axiosInstance.get("/account-roles"); // Check lại endpoint backend của bạn
        return response.data;
    } catch (error) { handleApiError(error, "Error fetching roles"); }
};

export const addAccount = async (data) => {
    try {
        const response = await axiosInstance.post("/accounts", data);
        return response.data;
    } catch (error) { handleApiError(error, "Error adding account"); }
};

export const updateAccount = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/accounts/${id}`, data);
        return response.data;
    } catch (error) { handleApiError(error, "Error updating account"); }
};

export const deleteAccount = async (id) => {
    try {
        const response = await axiosInstance.delete(`/accounts/${id}`);
        return response.data;
    } catch (error) { handleApiError(error, "Error deleting account"); }
};

// ============================================================
// 3. CUSTOMER MANAGEMENT API
// ============================================================
export const getCustomers = async () => {
    try {
        const response = await axiosInstance.get("/customers");
        return response.data;
    } catch (error) { handleApiError(error, "Error fetching customers"); }
};

export const addCustomer = async (data) => {
    try {
        const response = await axiosInstance.post("/customers", data);
        return response.data;
    } catch (error) { handleApiError(error, "Error adding customer"); }
};

export const updateCustomer = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/customers/${id}`, data);
        return response.data;
    } catch (error) { handleApiError(error, "Error updating customer"); }
};

export const deleteCustomer = async (id) => {
    try {
        const response = await axiosInstance.delete(`/customers/${id}`);
        return response.data;
    } catch (error) { handleApiError(error, "Error deleting customer"); }
};

// ============================================================
// 4. TOUR MANAGEMENT API
// ============================================================
export const getTours = async () => {
    try {
        const response = await axiosInstance.get("/tours");
        return response.data;
    } catch (error) { handleApiError(error, "Error fetching tours"); }
};

export const getTourById = async (id) => {
    try {
        const response = await axiosInstance.get(`/tours/${id}`);
        return response.data;
    } catch (error) { handleApiError(error, "Error fetching tour details"); }
};

export const searchTours = async (keyword) => {
    try {
        const response = await axiosInstance.get('/tours/search', { params: { keyword } });
        return response.data;
    } catch (error) { handleApiError(error, "Error searching tours"); }
};

export const addTour = async (data) => {
    try {
        const response = await axiosInstance.post("/tours", data);
        return response.data;
    } catch (error) { handleApiError(error, "Error adding tour"); }
};

export const updateTour = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/tours/${id}`, data);
        return response.data;
    } catch (error) { handleApiError(error, "Error updating tour"); }
};

export const deleteTour = async (id) => {
    try {
        const response = await axiosInstance.delete(`/tours/${id}`);
        return response.data;
    } catch (error) { handleApiError(error, "Error deleting tour"); }
};

// ============================================================
// 5. BOOKING & INVOICE API (Nghiệp vụ quan trọng)
// ============================================================
export const createBooking = async (bookingData) => {
    try {
        const response = await axiosInstance.post('/bookings', bookingData);
        return response.data;
    } catch (error) { handleApiError(error, "Error creating booking"); }
};

export const getBookingsByCurrentUser = async () => {
    try {
        const response = await axiosInstance.get('/bookings/my-bookings');
        return response.data;
    } catch (error) { handleApiError(error, "Error fetching user bookings"); }
};

export const getBookingById = async (bookingId) => {
    try {
        const response = await axiosInstance.get(`/bookings/${bookingId}`);
        return response.data;
    } catch (error) { handleApiError(error, "Error fetching booking"); }
};

// --- INVOICES ---
export const getInvoices = async () => {
    try {
        const response = await axiosInstance.get("/invoices");
        return response.data;
    } catch (error) { handleApiError(error, "Error fetching invoices"); }
};

export const getInvoicesForCurrentUser = async () => {
    try {
        const response = await axiosInstance.get('/invoices/my-invoices');
        return response.data;
    } catch (error) { handleApiError(error, "Error fetching user invoices"); }
};

export const createInvoice = async (invoiceData) => {
    try {
        const response = await axiosInstance.post('/invoices', invoiceData);
        return response.data;
    } catch (error) { handleApiError(error, "Error creating invoice"); }
};

export const updateInvoice = async (id, invoiceData) => {
    try {
        const response = await axiosInstance.put(`/invoices/${id}`, invoiceData);
        return response.data;
    } catch (error) { handleApiError(error, "Error updating invoice"); }
};

export const deleteInvoice = async (id) => {
    try {
        const response = await axiosInstance.delete(`/invoices/${id}`);
        return response.data;
    } catch (error) { handleApiError(error, "Error deleting invoice"); }
};

export const requestCashPayment = async (invoiceId) => {
    try {
        const response = await axiosInstance.post(`/invoices/${invoiceId}/request-cash-payment`);
        return response.data;
    } catch (error) { handleApiError(error, "Error requesting cash payment"); }
};

// ============================================================
// 6. PAYMENT GATEWAY (VNPAY)
// ============================================================
export const createVnPayPaymentUrl = async (paymentData) => {
    try {
        const response = await axiosInstance.post('/payments/vnpay/create-url', paymentData);
        return response.data;
    } catch (error) { handleApiError(error, "Error creating VNPAY URL"); }
};

export const verifyVnPayPayment = async (params) => {
    try {
        const response = await axiosInstance.get('/payments/vnpay-return', { params });
        return response.data;
    } catch (error) { handleApiError(error, "Error verifying VNPAY"); }
};

export const processPayment = async (paymentData) => {
    try {
        const response = await axiosInstance.post('/payment/process', paymentData);
        return response.data;
    } catch (error) { handleApiError(error, "Error processing payment"); }
};

// ============================================================
// 7. PROMOTION API
// ============================================================
export const getPromotions = async () => {
    try {
        const response = await axiosInstance.get("/promotions");
        return response.data;
    } catch (error) { handleApiError(error, "Error fetching promotions"); }
};

export const addPromotion = async (data) => {
    try {
        const response = await axiosInstance.post("/promotions", data);
        return response.data;
    } catch (error) { handleApiError(error, "Error adding promotion"); }
};

export const updatePromotion = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/promotions/${id}`, data);
        return response.data;
    } catch (error) { handleApiError(error, "Error updating promotion"); }
};

export const deletePromotion = async (id) => {
    try {
        const response = await axiosInstance.delete(`/promotions/${id}`);
        return response.data;
    } catch (error) { handleApiError(error, "Error deleting promotion"); }
};

export const applyPromotion = async (promotionCode, tourId) => {
    try {
        const response = await axiosInstance.post('/promotions/apply', null, {
            params: { code: promotionCode, tourId: tourId }
        });
        return response.data;
    } catch (error) { handleApiError(error, "Error applying promotion"); }
};

// ============================================================
// 8. OTHER ENTITIES (Accommodations, Guides, Destinations, Vehicles)
// ============================================================
// Accommodation
export const getAccommodations = async () => {
    try {
        const response = await axiosInstance.get("/accommodations");
        return response.data;
    } catch (error) { handleApiError(error, "Error fetching accommodations"); }
};
export const addAccommodation = async (data) => {
    try {
        const response = await axiosInstance.post("/accommodations", data);
        return response.data;
    } catch (error) { handleApiError(error, "Error adding accommodation"); }
};
export const updateAccommodation = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/accommodations/${id}`, data);
        return response.data;
    } catch (error) { handleApiError(error, "Error updating accommodation"); }
};
export const deleteAccommodation = async (id) => {
    try {
        const response = await axiosInstance.delete(`/accommodations/${id}`);
        return response.data;
    } catch (error) { handleApiError(error, "Error deleting accommodation"); }
};

// Tourist Destinations
export const getTouristDestinations = async () => {
    try {
        const response = await axiosInstance.get("/tourist-destinations");
        return response.data;
    } catch (error) { handleApiError(error, "Error fetching destinations"); }
};
export const addTouristDestination = async (data) => {
    try {
        const response = await axiosInstance.post("/tourist-destinations", data);
        return response.data;
    } catch (error) { handleApiError(error, "Error adding destination"); }
};
export const updateTouristDestination = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/tourist-destinations/${id}`, data);
        return response.data;
    } catch (error) { handleApiError(error, "Error updating destination"); }
};
export const deleteTouristDestination = async (id) => {
    try {
        const response = await axiosInstance.delete(`/tourist-destinations/${id}`);
        return response.data;
    } catch (error) { handleApiError(error, "Error deleting destination"); }
};

// Tour Guides
export const getTourGuides = async () => {
    try {
        const response = await axiosInstance.get("/tour-guides");
        return response.data;
    } catch (error) { handleApiError(error, "Error fetching guides"); }
};
export const addTourGuide = async (data) => {
    try {
        const response = await axiosInstance.post("/tour-guides", data);
        return response.data;
    } catch (error) { handleApiError(error, "Error adding guide"); }
};
export const updateTourGuide = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/tour-guides/${id}`, data);
        return response.data;
    } catch (error) { handleApiError(error, "Error updating guide"); }
};
export const deleteTourGuide = async (id) => {
    try {
        const response = await axiosInstance.delete(`/tour-guides/${id}`);
        return response.data;
    } catch (error) { handleApiError(error, "Error deleting guide"); }
};

// Travel Vehicles
export const getTravelVehicles = async () => {
    try {
        const response = await axiosInstance.get('/travel-vehicles');
        return response.data;
    } catch (error) { handleApiError(error, "Error fetching vehicles"); }
};

// ============================================================
// 9. FILE UPLOAD API
// ============================================================
export const uploadImages = async (formData) => {
    try {
        const response = await axiosInstance.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Error uploading images");
    }
};