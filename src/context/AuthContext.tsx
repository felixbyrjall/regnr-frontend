'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

interface AuthContextProps {
    user: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    register: (username: string, password: string, email: string) => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get('http://localhost:8082/api/csrf', {
                    withCredentials: true
                });
                const token = response.data.token;
                axios.defaults.headers.common['X-XSRF-TOKEN'] = token;
            } catch (error) {
                console.error('Failed to fetch CSRF token:', error);
            }
        };
        fetchCsrfToken();
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await axios.post('http://localhost:8082/api/auth/login', {
                username,
                password,
            }, {
                withCredentials: true,
            });
            const token = response.data.token;
            setUser(username);
            console.log('Logged in user:', username); // Debugging log

            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error: any) {
            console.error('Login failed:', error.response?.data || error.message);
            throw new Error('Login failed.');
        }
    };

    const register = async (username: string, password: string, email: string) => {
        try {
            await axios.post(
                'http://localhost:8082/api/auth/register',
                { username, password, email },
                {
                    withCredentials: true,
                }
            );
        } catch (error: any) {
            console.error('Registration failed:', error.response?.data || error.message);
            throw new Error('Registration failed.');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated }}>
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
