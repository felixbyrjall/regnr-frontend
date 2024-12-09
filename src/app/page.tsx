'use client';

import { SearchBar } from './components/search/SearchBar';
import { ErrorMessage } from './components/search/ErrorMessage';
import { VehicleDetails } from './components/search/VehicleDetails';
import { useState, FormEvent, useEffect } from 'react';
import { SimpleVehicleData, DetailedVehicleData } from "@/app/types/vehicle";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
    const { isAuthenticated, token } = useAuth();
    const [licensePlate, setLicensePlate] = useState('');
    const [isDetailedSearch, setIsDetailedSearch] = useState(false);
    const [vehicleData, setVehicleData] = useState<SimpleVehicleData | DetailedVehicleData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login'); // Use Next.js router for navigation
        }
    }, [isAuthenticated, router]);

    // Handle search submit
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError(null);
        setVehicleData(null);
        setIsLoading(true);

        try {
            const endpoint = isDetailedSearch
                ? `http://localhost:8080/api/vehicle/detailed/${licensePlate}`
                : `http://localhost:8080/api/vehicle/simple/${licensePlate}`;

            const response = await fetch(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Kjøretøy ikke funnet');
            }
            const data = await response.json();
            setVehicleData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'En uventet feil oppstod');
        } finally {
            setIsLoading(false);
        }
    };

    // Display loading spinner or return the search UI
    if (!isAuthenticated) {
        return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <SearchBar
                licensePlate={licensePlate}
                setLicensePlate={setLicensePlate}
                isDetailedSearch={isDetailedSearch}
                setIsDetailedSearch={setIsDetailedSearch}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />

            <div className="container mx-auto px-4 py-8">
                {error && <ErrorMessage message={error} />}
                {vehicleData && (
                    <VehicleDetails
                        vehicleData={vehicleData}
                        isDetailedSearch={isDetailedSearch}
                    />
                )}
            </div>
        </div>
    );
}
