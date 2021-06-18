import { ReduxState, Record, Identifier } from 'react-admin';

// TODO: update types (copy from serializer fields)

export type ThemeName = 'light' | 'dark';

export interface AppState extends ReduxState {
  theme: ThemeName;
}

export interface UserProfile {
  // TODO: update props
  id: Identifier;
  fullName?: string;
  avatar?: string;
  [key: string]: any;
}

export interface Category extends Record {
  name: string;
}

export interface Department extends Record {
  name: string;
}

export interface Designation extends Record {
  name: string;
}

export interface Role extends Record {
  name: string;
}

export interface Product extends Record {
  category: Identifier;
  description: string;
  height: number;
  image: { src?: string; title?: string };
  price: number;
  reference: string;
  stock: number;
  thumbnail: { src?: string; title?: string };
  width: number;
}

export interface Employee extends Record {
  id: number;
  password: string;
  company: string;
  email: string;
  name: string;
  department: string;
  role: string;
  image: { src?: string; title?: string };
  resume: string;
  first_name: string;
  last_name: string;
  residential_address: string;
  postal_code: string;
  ic_no: string;
  nationality: string;
  gender: string;
  date_of_birth: Date;
  date_of_commencement: Date;
  date_of_cessation: Date;
  phone_no: string;
}

export interface Customer extends Record {
  first_name: string;
  last_name: string;
  address: string;
  stateAbbr: string;
  city: string;
  zipcode: string;
  avatar: string;
  birthday: string;
  first_seen: string;
  last_seen: string;
  has_ordered: boolean;
  latest_purchase: string;
  has_newsletter: boolean;
  groups: string[];
  agents: number[];
  nb_commands: number;
  total_spent: number;
}

export interface Supplier extends Record {
  first_name: string;
  last_name: string;
  address: string;
  stateAbbr: string;
  city: string;
  zipcode: string;
  avatar: string;
  birthday: string;
  first_seen: string;
  last_seen: string;
  has_ordered: boolean;
  latest_purchase: string;
  has_newsletter: boolean;
  groups: string[];
  nb_commands: number;
  total_spent: number;
}

export type OrderStatus = 'ordered' | 'delivered' | 'cancelled';

export interface Order extends Record {
  status: OrderStatus;
  basket: BasketItem[];
  date: Date;
  total: number;
}

export interface BasketItem {
  product_id: Identifier;
  quantity: number;
}

export interface Invoice extends Record {}

export type ReviewStatus = 'accepted' | 'pending' | 'rejected';

export interface Review extends Record {
  date: Date;
  status: ReviewStatus;
  customer_id: Identifier;
  product_id: Identifier;
}

declare global {
  interface Window {
    restServer: any;
  }
}
