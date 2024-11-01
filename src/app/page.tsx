'use client';

import { SearchBar } from './components/search/SearchBar';
import { ErrorMessage } from './components/search/ErrorMessage';
import { VehicleDetails } from './components/search/VehicleDetailsSimple';
import { useState, FormEvent } from 'react';

export default function Home() {
    const [licensePlate, setLicensePlate] = useState('');
    const [vehicleData, setVehicleData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError(null);
        setVehicleData(null);
        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/api/vehicle/simple/${licensePlate}`);
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

    return (
        <div className="min-h-screen bg-gray-100">
            <SearchBar
                licensePlate={licensePlate}
                setLicensePlate={setLicensePlate}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />

            <div className="container mx-auto px-4 py-8">
                {error && <ErrorMessage message={error} />}
                {vehicleData && <VehicleDetails vehicleData={vehicleData} />}
            </div>
        </div>
    );
}
