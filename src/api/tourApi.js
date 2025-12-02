import axiosInstance from './axiosConfig';

// Get all tours
export const getAllTours = async (params = {}) => {
    try {
        const response = await axiosInstance.get('/tours', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get tour by ID
export const getTourById = async (id) => {
    try {
        const response = await axiosInstance.get(`/tours/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Create new tour (Admin only)
export const createTour = async (tourData) => {
    try {
        const response = await axiosInstance.post('/tours', tourData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Update tour (Admin only)
export const updateTour = async (id, tourData) => {
    try {
        const response = await axiosInstance.put(`/tours/${id}`, tourData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Delete tour (Admin only)
export const deleteTour = async (id) => {
    try {
        const response = await axiosInstance.delete(`/tours/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Book a tour
export const bookTour = async (tourId, bookingData) => {
    try {
        const response = await axiosInstance.post(`/tours/${tourId}/book`, bookingData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Upload images
export const uploadImages = async (formData) => {
    try {
        const response = await axiosInstance.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
