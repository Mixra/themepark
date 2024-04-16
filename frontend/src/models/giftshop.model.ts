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
