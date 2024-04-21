export interface Ride {
  rideID: number;
  rideName: string;
}

export interface GiftShop {
  shopID: number;
  shopName: string;
}

export interface Restaurant {
  restaurantID: number;
  restaurantName: string;
}

export interface ParkArea {
  imageUrl: string;
  areaID: number;
  areaName: string;
  theme: string;
  description: string;
  openingTime: string;
  closingTime: string;
  rides: Ride[] | null;
  giftShops: GiftShop[] | null;
  restaurants: Restaurant[] | null;
}
