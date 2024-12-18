'use client';

import React, { useCallback, useEffect, useState, FormEvent } from 'react';
import { API_BASE_URL } from '@/app/config/constants';
import { SearchBar } from './components/search/SearchBar';
import { ErrorMessage } from './components/search/ErrorMessage';
import { VehicleDetails } from './components/search/VehicleDetails';
import { SimpleVehicleData, DetailedVehicleData } from "@/app/types/vehicle";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { AdminHistoryView } from './components/history/AdminHistoryView';
import { UserHistoryView } from './components/history/UserHistoryView';
import axios from "axios";

const Navbar = ({ username, onLogout }: { username: string | null, onLogout: () => void }) => {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const { token } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (token) {
            // Parse the JWT token to check for admin role
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            setIsAdmin(tokenPayload.roles.includes('ADMIN'));
        }
    }, [token]);

    return (
        <>
            <nav className="bg-white shadow-lg mb-6">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-gray-800 text-lg font-semibold">
                                {username ? `Welcome, ${username}` : 'Welcome'}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsHistoryOpen(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                {isAdmin ? 'View All History' : 'View History'}
                            </button>
                            <button
                                onClick={onLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            {isAdmin ? (
                <AdminHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
            ) : (
                <UserHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
            )}
        </>
    );
};

export default function Home() {
    const { isAuthenticated, token, logout, user, userId } = useAuth();
    const [licensePlate, setLicensePlate] = useState('');
    const [isDetailedSearch, setIsDetailedSearch] = useState(false);
    const [vehicleData, setVehicleData] = useState<SimpleVehicleData | DetailedVehicleData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    const handleLogout = useCallback(() => {
        console.log('Logging out...');
        logout();
        router.push('/login');
    }, [logout, router]);

    const handleLicensePlateSearch = async (plate: string, isDetailed: boolean = false) => {
        const normalizedPlate = plate.replace(/[-\s]/g, '').toUpperCase();
        setLicensePlate(normalizedPlate);
        setIsDetailedSearch(isDetailed);

        setShowHistory(false);

        setError(null);
        setVehicleData(null);
        setIsLoading(true);

        try {
            const endpoint = isDetailed
                ? `${API_BASE_URL}/api/vehicle/detailed/${normalizedPlate}`
                : `${API_BASE_URL}/api/vehicle/simple/${normalizedPlate}`;

            console.log("Making request with userId:", userId);

            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-User-Id': userId,
                },
            });

            setVehicleData(response.data);
            console.log("Vehicle data set:", response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            console.error("Error fetching vehicle data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            try {
                const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                console.log('Token payload:', tokenPayload);
                if (tokenPayload && tokenPayload.roles) {
                    setIsAdmin(tokenPayload.roles.includes('ADMIN'));
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error('Error parsing token:', error);
                setIsAdmin(false);
            }
        }
    }, [token]);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated && token) {
            console.log('Setting up auth check interval');
            const interval = setInterval(async () => {
                try {
                    console.log('Making auth check request...');
                    await axios.get(`${API_BASE_URL}/api/test-auth`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            'X-User-Id': userId,
                        },
                    });
                    console.log('Auth check successful');
                } catch (error: any) {
                    console.log('Auth check failed:', error.response?.status);
                    if (error.response?.status === 401) {
                        console.log('Token expired, logging out');
                        logout();
                        router.push('/login');
                    }
                }
            }, 5000); // Check if token is valid every 5s

            return () => {
                console.log('Cleaning up interval');
                clearInterval(interval);
            };
        }
    }, [isAuthenticated, token, logout, router, user, userId]);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError(null);
        setVehicleData(null);
        setIsLoading(true);

        try {
            const endpoint = isDetailedSearch
                ? `${API_BASE_URL}/api/vehicle/detailed/${licensePlate}`
                : `${API_BASE_URL}/api/vehicle/simple/${licensePlate}`;

            console.log("Making request with userId:", userId);

            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-User-Id': userId,
                },
            });

            setVehicleData(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'En uventet feil oppstod');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg mb-6">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-gray-800 text-lg font-semibold">
                                {user ? `Welcome, ${user}` : 'Welcome'}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                {showHistory ? 'Show Search' : 'Show History'}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4">
                {showHistory ? (
                    isAdmin ? (
                        <AdminHistoryView onLicensePlateClick={handleLicensePlateSearch} />
                    ) : (
                        <UserHistoryView onLicensePlateClick={handleLicensePlateSearch} />
                    )
                ) : (
                    <>
                        <SearchBar
                            licensePlate={licensePlate}
                            setLicensePlate={setLicensePlate}
                            isDetailedSearch={isDetailedSearch}
                            setIsDetailedSearch={setIsDetailedSearch}
                            onSubmit={handleSubmit}
                            isLoading={isLoading}
                        />
                        <div className="mt-8">
                            {error && <ErrorMessage message={error} />}
                            {vehicleData && (
                                <VehicleDetails
                                    vehicleData={vehicleData}
                                    isDetailedSearch={isDetailedSearch}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
