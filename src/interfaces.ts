export interface SubscriptionInterface {
  id: number;
  name: string;
  upcommingPayment: string;
  price: number;
  currency: string;
  typeOfPayment: string;
  paymentMethod: string;
  icon: string;
  websiteLink: string;
  attachments: string[];
}

export interface ListedSubscriptionInterface {
  id: number;
  name: string;
  icon: string;
  websiteLink: string;
}
