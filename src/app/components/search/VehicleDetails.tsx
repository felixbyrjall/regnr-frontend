'use client';

import { SimpleVehicleData, DetailedVehicleData } from '@/app/types/vehicle';

interface VehicleDetailRowProps {
    label: string;
    value: string | number | JSX.Element | null;
    placeholder?: string;
    hideIfEmpty?: boolean;
}

const VehicleDetailRow = ({
    label,
    value,
    placeholder = 'Ingen informasjon',  // Default placeholder
    hideIfEmpty = false                 // Show by default

}: VehicleDetailRowProps) => {
    // Enhanced value checking
    const hasValue = value !== null &&
        value !== undefined &&
        value !== '' &&
        !(typeof value === 'number' && isNaN(value));

    // Don't render if no value and hideIfEmpty is true
    if (!hasValue && hideIfEmpty) return null;

    const displayValue = hasValue ? value : placeholder;

    return (
        <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">{label}</span>
            <span className={`font-medium ${!hasValue ? 'text-gray-400 italic' : ''}`}>
                {displayValue}
            </span>
        </div>
    );
};

interface VehicleDetailsProps {
    vehicleData: SimpleVehicleData | DetailedVehicleData;
    isDetailedSearch: boolean;
}

// Type guard
const isDetailedData = (data: SimpleVehicleData | DetailedVehicleData): data is DetailedVehicleData => {
    return 'vin' in data;
};

export const VehicleDetails = ({ vehicleData, isDetailedSearch }: VehicleDetailsProps) => {
    const shouldShowLicensePlate = vehicleData.licensePlate !== vehicleData.vehicleId;

    // If it's not a detailed search or doesn't have detailed data, render simple view
    if (!isDetailedSearch || !isDetailedData(vehicleData)) {
        return (
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6">
                    <div className="border-b pb-4 mb-4">
                        <h2 className="text-xl font-semibold mb-2">
                            {vehicleData.make} {vehicleData.model}
                        </h2>
                        <p className="text-gray-600">
                            {vehicleData.typeDesignation}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Kjøretøysopplysninger</h3>
                            <div className="space-y-3">
                                {shouldShowLicensePlate && (
                                    <VehicleDetailRow label="Personlig kjennemerke" value={vehicleData.licensePlate} />
                                )}
                                <VehicleDetailRow label="Kjennemerke" value={vehicleData.vehicleId} />
                                <VehicleDetailRow label="Merke" value={vehicleData.make} />
                                <VehicleDetailRow label="Modell" value={vehicleData.model} />
                                <VehicleDetailRow label="Typebetegnelse" value={vehicleData.typeDesignation} />
                                <VehicleDetailRow label="Farge" value={vehicleData.color} />
                                <VehicleDetailRow label="Drivstoff" value={vehicleData.fuelType} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
                <div className="border-b pb-4 mb-4">
                    <h2 className="text-xl font-semibold mb-2">
                        {vehicleData.make} {vehicleData.model}
                    </h2>
                    <p className="text-gray-600">
                        {vehicleData.typeDesignation}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Kjøretøysopplysninger</h3>
                        <div className="space-y-3">
                            {shouldShowLicensePlate && (
                                <VehicleDetailRow label="Personlig kjennemerke" value={vehicleData.licensePlate} />
                            )}
                            <VehicleDetailRow label="Kjennemerke" value={vehicleData.vehicleId} />
                            <VehicleDetailRow label="Merke" value={vehicleData.make} />
                            <VehicleDetailRow label="Modell" value={vehicleData.model} />
                            <VehicleDetailRow label="Typebetegnelse" value={vehicleData.typeDesignation} />
                            <VehicleDetailRow label="Farge" value={vehicleData.color} />
                            <VehicleDetailRow label="Drivstoff" value={vehicleData.fuelType} />

                            <VehicleDetailRow label="VIN-nummer" value={vehicleData.vin} />
                            <VehicleDetailRow
                                label="Kjøretøystype"
                                value={vehicleData.vehicleType}
                            />
                        </div>
                    </div>

                    {/* Registration Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Registreringsinformasjon</h3>
                        <div className="space-y-3">
                            <VehicleDetailRow
                                label="Registrert i Norge"
                                value={vehicleData.firstRegistrationDateInNorway}
                            />
                            <VehicleDetailRow
                                label="Status"
                                value={vehicleData.registrationStatus}
                            />
                            <VehicleDetailRow
                                label="Registrert på eier"
                                value={vehicleData.registrationDateOnCurrentOwner}
                            />
                            <VehicleDetailRow
                                label="Importland"
                                value={vehicleData.importCountry}
                                placeholder="Ikke importert"
                            />
                            <VehicleDetailRow
                                label="Kilometerstand ved import"
                                value={vehicleData.importMilage ? `${vehicleData.importMilage} km` : null}
                                hideIfEmpty={true}
                            />
                            <VehicleDetailRow
                                label="Fylke"
                                value={vehicleData.county}
                            />
                            <VehicleDetailRow
                                label="Område"
                                value={vehicleData.geographicalArea}
                            />
                        </div>
                    </div>

                    {/* Technical Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Tekniske spesifikasjoner</h3>
                        <div className="space-y-3">
                            <VehicleDetailRow
                                label="Hestekrefter"
                                value={`${Math.round(vehicleData.maxNetPower / 0.7355)} hk`}
                            /><VehicleDetailRow
                                label="Effekt"
                                value={`${vehicleData.maxNetPower} kW`}
                            />
                            <VehicleDetailRow
                                label="Motorvolum"
                                value={
                                    <>
                                        {(vehicleData.engineVolume / 1000)} L
                                        <br />
                                        {vehicleData.engineVolume} cm<sup>3</sup>
                                    </>
                                }
                            />
                            <VehicleDetailRow
                                label="CO2-utslipp"
                                value={`${vehicleData.co2Emission} g/km`}
                            />
                            <VehicleDetailRow
                                label="Utslippsklasse"
                                value={vehicleData.emissionsClass}
                            />
                            <VehicleDetailRow
                                label="Drivstofforbruk"
                                value={vehicleData.fuelConsumption}
                            />
                            <VehicleDetailRow
                                label="Antall seter"
                                value={vehicleData.seatCount} />
                        </div>
                    </div>

                    {/* Weight Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Vekt og last</h3>
                        <div className="space-y-3">
                            <VehicleDetailRow
                                label="Egenvekt"
                                value={`${vehicleData.curbWeight} kg`}
                            />
                            <VehicleDetailRow
                                label="Minimum egenvekt"
                                value={`${vehicleData.minimumCurbWeight} kg`}
                            />
                            <VehicleDetailRow
                                label="Nyttelast"
                                value={`${vehicleData.payloadCapacity} kg`}
                            />
                            <VehicleDetailRow
                                label="Maks totalvekt"
                                value={`${vehicleData.maxTotalWeight} kg`}
                            />
                            <VehicleDetailRow
                                label="Tilhengervekt m/brems"
                                value={`${vehicleData.maxTrailerWeightWithBrakes} kg`}
                            />
                            <VehicleDetailRow
                                label="Tilhengervekt u/brems"
                                value={`${vehicleData.maxTrailerWeightWithoutBrakes} kg`}
                            />
                            <VehicleDetailRow
                                label="Tillatt vertikal koplingslast"
                                value={`${vehicleData.maxVerticalCouplingLoad} kg`}
                            />
                            <VehicleDetailRow
                                label="Maks vogntogvekt"
                                value={`${vehicleData.maxGrossWeight} kg`}
                            />

                        </div>
                    </div>

                    {/* EU Control */}
                    <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold mb-4">EU-kontroll</h3>
                        <div className="space-y-3">
                            <VehicleDetailRow
                                label="Neste kontroll"
                                value={vehicleData.nextControlDate}
                            />
                            <VehicleDetailRow
                                label="Sist godkjent"
                                value={vehicleData.lastControlDate}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
