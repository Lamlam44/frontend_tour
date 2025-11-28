import axiosInstance from './axiosConfig';

// API Login
export const login = async (username, password) => {
    try {
        const response = await axiosInstance.post('/auth/login', {
            username,
            password
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// API Register
export const register = async (userData) => {
    try {
        const response = await axiosInstance.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// API Logout
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// API Get User Profile
export const getUserProfile = async () => {
    try {
        const response = await axiosInstance.get('/auth/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// API Update User Profile
export const updateUserProfile = async (userData) => {
    try {
        const response = await axiosInstance.put('/auth/profile', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// API Google Login
export const googleLogin = async (email) => {
    try {
        const response = await axiosInstance.post('/auth/google-login', { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
