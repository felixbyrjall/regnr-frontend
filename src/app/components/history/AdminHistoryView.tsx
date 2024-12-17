'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { SearchHistoryItem } from '@/app/types/history';
import { API_BASE_URL } from "@/app/config/constants";

const HistoryRow = React.memo(({
                                   item,
                                   onLicensePlateClick,
                               }: {
    item: SearchHistoryItem,
    onLicensePlateClick: (plate: string, isDetailed?: boolean) => void
}) => (
    <tr className="hover:bg-gray-50">
        <td className="px-4 py-2">{item.userId}</td>
        <td
            className="px-4 py-2 cursor-pointer text-blue-600 hover:underline"
            onClick={() => onLicensePlateClick(item.licensePlate)}
        >
            {item.licensePlate}
        </td>
        <td className="px-4 py-2">
            {new Date(item.timestamp).toLocaleString()}
        </td>
    </tr>
));

export const AdminHistoryView = ({ onLicensePlateClick }: { onLicensePlateClick: (plate: string, isDetailed?: boolean) => void }) => {
    const { token } = useAuth();
    const [history, setHistory] = useState<SearchHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get<SearchHistoryItem[]>(
                    `${API_BASE_URL}/api/history/all`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const sortedHistory = response.data
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                setHistory(sortedHistory);
            } catch (err) {
                setError('Failed to load history');
                console.error('Error fetching history:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [token]);

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
                <h2 className="text-xl font-bold">All Users Search History</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                    <tr>
                        <th className="px-4 py-2 bg-gray-50 text-left text-sm font-medium text-gray-500">User ID</th>
                        <th className="px-4 py-2 bg-gray-50 text-left text-sm font-medium text-gray-500">License Plate</th>
                        <th className="px-4 py-2 bg-gray-50 text-left text-sm font-medium text-gray-500">Time</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {history.map((item) => (
                        <HistoryRow
                            key={`${item.id}-${item.timestamp}`}
                            item={item}
                            onLicensePlateClick={onLicensePlateClick}
                        />
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
