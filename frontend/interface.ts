// Purpose: This file contains the interfaces for the items in the database.
export interface BaseItem {
    id: number;
    Name:string;
    Description: string;
    ClosingTime: string;
    OpeningTime: string;
  }

  export interface GiftShop extends BaseItem {
        MerchandiseType: string[];
  }
  export interface Rides extends BaseItem {
    MinHeight: number;
    MaxHeight: number;
    Duration: number;
  }
  export interface Restaurant extends BaseItem {
    SeatingCapacity: number;

  }

  export interface Restaurant extends BaseItem {
    SeatingCapacity: number;
  }
  export interface ParkAreas extends BaseItem {
    MinHeight: number;
    MaxHeight: number;
    Duration: number;
  }
  