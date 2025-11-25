import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi, logout as logoutApi } from '../api/authApi';

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

    // Kiểm tra token khi component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            // Gọi API login từ backend
            const data = await loginApi(username, password);
            
            // Lưu token và thông tin user vào localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            setUser(data.user);
            setIsAuthenticated(true);
            
            return { success: true, data: data };
            
        } catch (error) {
            // Xử lý lỗi từ backend
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
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
