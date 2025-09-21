import { CartProductItem } from "./cart";

export interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email?: string;
  };
  cartItems: CartProductItem[];
  totalOrderPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
}

export interface CheckoutSessionResponse {
  status: string;
  session?: {
    url: string;
    [key: string]: any;
  };
}

export interface ShippingAddress {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
  address: string;
}

export interface DeleteBillResponse {
  status: string;   
  message: string;  
}
