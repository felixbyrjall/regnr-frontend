'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_BASE_URL } from '@/app/config/constants.ts';
import axios from 'axios';

interface AuthContextProps {
    user: string | null;
    userId: string | null;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    register: (username: string, password: string, email: string) => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    axios.defaults.withCredentials = true;

    useEffect(() => {
        const setupCsrf = async () => {
            try {
                console.log('Starting CSRF setup...');
                const response = await axios.get(`${API_BASE_URL}/api/csrf`, {
                    withCredentials: true,
                });
                console.log('CSRF Response:', response);
            } catch (error: any) {
                console.error('CSRF Error:', {
                    message: error.message,
                    response: error.response,
                    request: error.request,
                    config: error.config
                });
            }
        };

        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedUserId = localStorage.getItem('userId');
        console.log("Stored userId:", storedUserId);
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(storedUser);
            setUserId(storedUserId);
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
    }, []);

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const csrfResponse = await axios.get(`${API_BASE_URL}/api/csrf`);
            const csrfToken = csrfResponse.data.token;

            const response = await axios.post(`${API_BASE_URL}/api/auth/login`,
                { username, password },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-XSRF-TOKEN': csrfToken
                    }
                }
            );
            const { token, userId } = response.data;
            setToken(token);
            setUser(username);
            setUserId(userId)
            localStorage.setItem('token', token);
            localStorage.setItem('user', username);
            localStorage.setItem('userId', userId);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error: any) {
            console.error('Login failed:', error.response?.data || error.message);
            throw new Error(error.response?.data?.error || 'Login failed.');
        }
    };

    const register = async (username: string, password: string, email: string) => {
        try {
            await axios.post(`${API_BASE_URL}/api/auth/register`, { username, password, email });
            console.log('Registration successful');
        } catch (error: any) {
            console.error('Registration failed:', error.response?.data || error.message);
            throw new Error(error.response?.data?.error || 'Registration failed.');
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setUserId(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId')
        delete axios.defaults.headers.common['Authorization'];
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, userId, token, login, logout, register, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
