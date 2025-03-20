export interface SubscriptionInterface {
  id: number;
  name: string;
  upcommingPayment: string;
  price: number;
  currency: '$' | '€';
  typeOfPayment: 'month' | 'year';
  totalSpend: number;
  activeFor: string;
  icon: string;
}

export interface SubscriptionIconInterface {
  id?: number;
  name: string;
  icon: string;
}
