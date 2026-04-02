export interface Banners {
  id: number,
  img: string
}
export interface Categorys {
  id: number,
  name: string,
  img: string
}

export interface Variants {
  name: string,
  additionalPrice: number,
  stock: string,
  _id: string;
}

export interface category {
  _id: string,
  catagory: string,
  imagePath: string,
}

export interface products {
  _id: string;
  name: string,
  description: string,
  price: number,
  stock: number,
  category: category,
  images: string[],
  createdAt: string,
  updatedAt: string
}

export type ProductResponse = {
  products: products[];
};

export type CartItem = {
  _id: string;
  name: string;
  images: string,
  price: number;
  quantity: number;
};
export type CartState = {
  cart: CartItem[];
};

export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  images: string[];
  quantity: number;
}

export interface OrderProduct {
  product: Product;
  quantity: number;
  price: number;
  _id: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Address {
  street?: string;
  city: string;
  state?: string | null;
  country: string;
  postalCode?: string;
}

export interface Order {
  _id: string;
  user: User;
  products: OrderProduct[];
  totalQuantity: number;
  totalPrice: number;
  paymentStatus: string;
  address: Address;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrderResponse {
  orders: Order[];
  totalRevenue: number,
  totalShipments: number,
}
export interface IOrderResponse {
  orders: Order[];
  totalRevenue?: number;
  totalShipments?: number;
}

export interface Catagory {
  _id: string;
  catagory: string;
  imagePath: string;
  createdAt: string;
  updatedAt: string;
}
export interface CatagoryResponse {
  catagory: Catagory[]
}

export interface IUser {
  _id: string;
  googleId: string | null;
  name: string;
  email: string;
  password: string;
  profilePic: string;
  activeAccount: boolean;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
  message: string
}

export interface IUserResponse {
  user: IUser[]
}
export interface IUserProfile {
  user: IUser,
  message:string
}

export interface ISignleUserResposne {
  user: IUser
}

export interface SizeType {
  id: number;
  name: string;
};
export interface IOrderResponse {
  orders: Order[]
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  category: string;
  stock: number;
  updatedAt: string;
  createdAt: string;
}

export interface IproductResponse {
  product: IProduct
}

export interface SignUpForm {
  name: string;
  email: string;
  password: string;
}
export interface SignInForm {
  email: string;
  password: string;
}

