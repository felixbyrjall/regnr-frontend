'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { SearchHistoryItem } from '@/app/types/history';
import {API_BASE_URL} from "@/app/config/constants";

export const UserHistoryView = () => {
    const { userId, token } = useAuth();
    const [history, setHistory] = useState<SearchHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get<SearchHistoryItem[]>(
                    `${API_BASE_URL}/api/history/user/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setHistory(response.data);
            } catch (err) {
                setError('Failed to load history');
                console.error('Error fetching history:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [userId, token]);

    if (isLoading) {
        return (
            <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">{error}</div>;
    }

    if (history.length === 0) {
        return <div className="text-center py-4">No search history found</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:px-6">
                <h2 className="text-xl font-bold">Your Search History</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                    <tr>
                        <th className="px-4 py-2 bg-gray-50 text-left text-sm font-medium text-gray-500">License Plate</th>
                        <th className="px-4 py-2 bg-gray-50 text-left text-sm font-medium text-gray-500">Time</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {history.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2">{item.licensePlate}</td>
                            <td className="px-4 py-2">
                                {new Date(item.timestamp).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
