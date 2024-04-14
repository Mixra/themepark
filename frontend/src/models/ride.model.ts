export interface Ride {
  imageUrl: string;
  rideID: number;
  rideName: string;
  description: string;
  type: string;
  minimumHeight: number;
  maximumCapacity: number;
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
  price: number;
}
