import { Product } from "./product";

export interface CartResponse {
  status: string;
  message: string;
  numOfCartItems: number;
  cartId: string;
  data: CartResponseData;
}

export interface CartResponseData {
  _id: string;
  cartOwner: string;
  products: CartProductItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalCartPrice: number;
}

export interface CartProductItem {
  product:string | Product;
  count: number;
  price: number;
  _id: string;
}
