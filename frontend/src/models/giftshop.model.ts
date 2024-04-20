export interface GiftShop {
  imageURL: string | null;
  shopID: number;
  shopName: string;
  description: string;
  openingTime: string;
  closingTime: string;
  merchandiseType: string;
  closureStatus: boolean;
  area: {
    areaID: number;
    areaName: string;
  };
  inventory: Inventory[];
  hasCrud: number;
}

export interface Inventory {
  itemID: number;
  shopID: number;
  itemName: string;
  description: string | null;
  quantity: number;
  unitPrice: number;
}
export interface Item {
  id: number;
  eventID?: number;
  name: string;
  unitPrice: number;
  itemType: ItemType;
  quantity: number;
  availableInventory?: number;
}

export type ItemType = "Event" | "Ride" | "GiftShop";