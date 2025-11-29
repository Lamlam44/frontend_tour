import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { login as loginApi, logout as logoutApi, getUserProfile, updateUserProfile } from '../api/authApi';
import axiosInstance from '../api/axiosConfig';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const loadUser = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            try {
                const profile = await getUserProfile();
                setUser(profile);
                setIsAuthenticated(true);
                localStorage.setItem('user', JSON.stringify(profile));
            } catch (error) {
                console.error("Failed to fetch user profile, logging out.", error);
                logoutApi(); // Token is invalid or expired
                setUser(null);
                setIsAuthenticated(false);
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const login = async (username, password) => {
        try {
            const data = await loginApi(username, password); // data = { token, user }
            
            // Set token
            localStorage.setItem('token', data.token);
            
            // Directly use user data from login response
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                setIsAuthenticated(true);
            } else {
                // Fallback to loadUser if login API doesn't return user for some reason
                await loadUser();
            }
            
            // Return the full data object that LoginPage expects
            return { success: true, data: data };
            
        } catch (error) {
            let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại!';
            if (error.message) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }
            return { 
                success: false, 
                error: errorMessage
            };
        }
    };

    const logout = () => {
        logoutApi();
        setUser(null);
        setIsAuthenticated(false);
        // The Authorization header will be removed by axios interceptor if it exists
    };

    const updateUser = async (profileData) => {
        try {
            const updatedUser = await updateUserProfile(profileData);
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return { success: true, data: updatedUser };
        } catch (error) {
            let errorMessage = 'Cập nhật thất bại. Vui lòng thử lại!';
            if (error.message) {
                errorMessage = error.message;
            }
            return { success: false, error: errorMessage };
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUser, // Expose the new function
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
