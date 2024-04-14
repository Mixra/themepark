export interface Event {
  eventID: number;
  eventName: string;
  description: string;
  eventType: string;
  ageRestriction: string;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  requireTicket: boolean;
  unitPrice?: number;
}

export interface Purchase {
  eventID: number;
  itemType: "Event";
  name: string;
  quantity: number;
  unitPrice: number;
}
