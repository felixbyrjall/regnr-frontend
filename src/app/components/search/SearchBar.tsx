'use client';

interface SearchBarProps {
    licensePlate: string;
    setLicensePlate: (value: string) => void;
    isDetailedSearch: boolean;
    setIsDetailedSearch: (value: boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
}

export const SearchBar = ({ licensePlate, setLicensePlate, isDetailedSearch, setIsDetailedSearch, onSubmit, isLoading }: SearchBarProps) => {
    return (
        <div className="w-full bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Finn kjøretøysopplysninger
                    </h1>
                    <div className="w-full max-w-2xl">
                        <form onSubmit={onSubmit} className="relative">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={licensePlate}
                                    onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                                    placeholder="REGNR ELLER PERSONLIG BILSKILT"
                                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-l-lg
                                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="flex items-center justify-center px-6 py-3 bg-blue-600
                                             text-white rounded-r-lg hover:bg-blue-700 focus:outline-none
                                             focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                             disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent
                                                      rounded-full animate-spin"/>
                                    ) : (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="advancedSearch"
                                    checked={isDetailedSearch}
                                    onChange={(e) => setIsDetailedSearch(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500
                                                 border-gray-300 rounded cursor-pointer"
                                />
                                <label
                                    htmlFor="advancedSearch"
                                    className="text-sm text-gray-600 cursor-pointer hover:text-gray-900"
                                >
                                    Detaljert søk (Få utvidet kjøretøysinformasjon)
                                </label>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
