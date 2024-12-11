'use client';

import React, { useCallback, useEffect, useState, FormEvent } from 'react';
import { SearchBar } from './components/search/SearchBar';
import { ErrorMessage } from './components/search/ErrorMessage';
import { VehicleDetails } from './components/search/VehicleDetails';
import { SimpleVehicleData, DetailedVehicleData } from "@/app/types/vehicle";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from "axios";

const Navbar = ({ username, onLogout }: { username: string | null, onLogout: () => void }) => {
    return (
        <nav className="bg-white shadow-lg mb-6">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-gray-800 text-lg font-semibold">
                            {username ? `Welcome, ${username}` : 'Welcome'}
                        </span>
                    </div>
                    <div className="flex items-center">
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
    );
};

export default function Home() {
    const { isAuthenticated, token, logout, user, userId } = useAuth();
    const [licensePlate, setLicensePlate] = useState('');
    const [isDetailedSearch, setIsDetailedSearch] = useState(false);
    const [vehicleData, setVehicleData] = useState<SimpleVehicleData | DetailedVehicleData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogout = useCallback(() => {
        console.log('Logging out...');
        logout();
        router.push('/login');
    }, [logout, router]);

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
                    await axios.get('http://localhost:8082/api/test-auth', {
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
                ? `http://localhost:8080/api/vehicle/detailed/${licensePlate}`
                : `http://localhost:8080/api/vehicle/simple/${licensePlate}`;

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
            <Navbar username={user} onLogout={handleLogout} />

            <div className="max-w-7xl mx-auto px-4">
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
            </div>
        </div>
    );
}
