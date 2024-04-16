export interface Restaurant {
  imageURL: string;
  restaurantID: number;
  restaurantName: string;
  cuisineType: string;
  openingTime: string;
  closingTime: string;
  menuDescription: string;
  seatingCapacity: number;
  closureStatus: boolean;
  area: Area;
  menuList: MenuListItem[];
  hasCrud: number;
}

export interface Area {
  areaID: number;
  areaName: string;
}

export interface MenuListItem {
  itemID: number;
  itemName: string;
  price: number;
}
