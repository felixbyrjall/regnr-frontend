'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

interface AuthContextProps {
    user: string | null;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    register: (username: string, password: string, email: string) => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    axios.defaults.withCredentials = true;

    useEffect(() => {
        const setupCsrf = async () => {
            try {
                const response = await axios.get('http://localhost:8082/api/csrf');
                axios.defaults.headers.common['X-XSRF-TOKEN'] = response.data.token;
            } catch (error) {
                console.error('Failed to fetch CSRF token:', error);
            }
        };
        setupCsrf();

        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(storedUser);
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
            const csrfResponse = await axios.get('http://localhost:8082/api/csrf');
            const csrfToken = csrfResponse.data.token;

            const response = await axios.post('http://localhost:8082/api/auth/login',
                { username, password },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-XSRF-TOKEN': csrfToken
                    }
                }
            );
            const { token } = response.data;
            setToken(token);
            setUser(username);
            localStorage.setItem('token', token);
            localStorage.setItem('user', username);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error: any) {
            console.error('Login failed:', error.response?.data || error.message);
            throw new Error(error.response?.data?.error || 'Login failed.');
        }
    };

    const register = async (username: string, password: string, email: string) => {
        try {
            await axios.post('http://localhost:8082/api/auth/register', { username, password, email });
            console.log('Registration successful');
        } catch (error: any) {
            console.error('Registration failed:', error.response?.data || error.message);
            throw new Error(error.response?.data?.error || 'Registration failed.');
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, isAuthenticated }}>
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
