export interface Ride {
  imageUrl: string;
  rideID: number;
  rideName: string;
  description: string | null;
  type: string;
  minimumHeight: number | null;
  maximumCapacity: number | null;
  openingTime: string;
  closingTime: string;
  duration: number;
  unitPrice: number;
  area: {
    areaID: number;
    areaName: string;
  };
  hasCrud: boolean;
}

export interface Purchase {
  rideId: number;
  name: string;
  itemType: "Ride";
  quantity: number;
  unitPrice: number;
}
