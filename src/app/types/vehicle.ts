export interface SimpleVehicleData {
    vehicleId: string;
    licensePlate: string;
    make: string;
    model: string;
    typeDesignation: string;
    fuelType: string;
    color: string;
}

export interface DetailedVehicleData extends SimpleVehicleData {
    vin: string;
    firstRegistrationDateInNorway: string;
    registrationStatus: string;
    registrationDateOnCurrentOwner: string;
    importCountry: string;
    nextControlDate: string;
    lastControlDate: string;
    emissionsClass: string;

    co2Emission: number;
    fuelConsumption: number;
    maxNetPower: number;
    engineVolume: number;


    importMilage: number;
    seatCount: number;
    curbWeight: number;
    minimumCurbWeight: number;
    payloadCapacity: number;
    maxTrailerWeightWithBrakes: number;
    maxTrailerWeightWithoutBrakes: number;
    maxTotalWeight: number;
    maxVerticalCouplingLoad: number;
    maxGrossWeight: number;

    county: string;
    geographicalArea: string;
    vehicleType: string;
}
