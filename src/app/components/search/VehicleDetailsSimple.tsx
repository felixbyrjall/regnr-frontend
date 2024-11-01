'use client';

interface VehicleDetailRowProps {
    label: string;
    value: string;
}

const VehicleDetailRow = ({ label, value }: VehicleDetailRowProps) => {
    return (
        <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
};

interface VehicleDetailsProps {
    vehicleData: {
        vehicleId: string;
        licensePlate: string;
        make: string;
        model: string;
        typeDesignation: string;
        fuelType: string;
        color: string;
    };
}

export const VehicleDetails = ({ vehicleData }: VehicleDetailsProps) => {
    const shouldShowLicensePlate = vehicleData.licensePlate !== vehicleData.vehicleId;

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

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Tilleggsinformasjon</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-600 mb-2">
                                Kjennemerke: {vehicleData.vehicleId}
                            </p>
                            <p className="text-gray-600">
                                Typebetegnelse: {vehicleData.typeDesignation}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
