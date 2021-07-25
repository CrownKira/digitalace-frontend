import { ReduxState, Record, Identifier } from "react-admin";

export type Memoize = <T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: any[]) => any
) => T;

export type ThemeName = "light" | "dark";

export interface AppState extends ReduxState {
  theme: ThemeName;
}

export interface FileValue {
  src: string;
  title: string;
}

export interface UserConfig extends Record {
  gst_rate: number;
  discount_rate: number;
  theme: ThemeName;
  language: string;
}

export interface PaymentMethod extends Record {
  name: string;
}

export interface Announcement extends Record {
  title: string;
  message: string;
  status: "DFT" | "OP";
  severity: "SUCC" | "INFO" | "WARN" | "ERR";
}

export interface UserProfile extends Record {
  fullName: string;
  avatar: string;
  is_staff: boolean;
  email: string;
  name: string;
  roles: string;
  image: FileValue;
  resume: FileValue;
  first_name: string;
  last_name: string;
  residential_address: string;
  postal_code: string;
  ic_no: string;
  nationality: string;
  gender: string;
  date_of_birth: string;
  date_of_commencement: string;
  date_of_cessation: string;
  phone_no: string;
}

export interface Category extends Record {
  name: string;
  image: FileValue;
}

export interface Designation extends Record {
  department: Identifier;
  name: string;
  user_set: Identifier[];
}

export interface Department extends Record {
  name: string;
  image: FileValue;
  designation_set: Designation[];
}

export interface Role extends Record {
  name: string;
  image: FileValue;
}

export interface Product extends Record {
  category: Identifier;
  supplier: Identifier;
  name: string;
  unit: string;
  cost: string;
  unit_price: string;
  image: FileValue;
  thumbnail: FileValue;
  stock: number;
  sales: number;
  description: string;
}

export interface Employee extends Record {
  is_staff: boolean;
  email: string;
  name: string;
  roles: Identifier[];
  image: FileValue;
  resume: FileValue;
  first_name: string;
  last_name: string;
  residential_address: string;
  postal_code: string;
  ic_no: string;
  nationality: string;
  gender: string;
  date_of_birth: string;
  date_of_commencement: string;
  date_of_cessation: string;
  phone_no: string;
}

export interface Customer extends Record {
  attention: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  contact: string;
  term: string;
  phone_no: string;
  email: string;
  receivables: number;
  image: FileValue;
}

export interface Supplier extends Record {
  attention: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  contact: string;
  term: string;
  phone_no: string;
  email: string;
  payables: string;
  image: FileValue;
}

export interface CreditsApplication extends Record {
  id: Identifier;
  invoice: Identifier;
  credit_note: Identifier;
  date: string;
  amount_to_credit: number;
}

export interface CreditNote extends Record {
  reference: string;
  created_from: string;
  company: Identifier;
  company_name: string;
  date: string;
  description: string;
  payment_date: string;
  payment_method: string;
  payment_note: string;
  gst_rate: number;
  discount_rate: number;
  gst_amount: number;
  discount_amount: number;
  net: number;
  total_amount: number;
  grand_total: number;
  status: string;
  customer: Identifier;
  salesperson: Identifier;
  sales_order: Identifier;
  creditnoteitem_set: CreditNoteItem[];
  credits_used: number;
  credits_remaining: number;
}

export interface CreditNoteItem extends Record {
  product: Identifier;
  unit: number;
  cost: number;
  quantity: number;
  unit_price: number;
  invoice: Identifier;
}

export interface Invoice extends Record {
  reference: string;
  company: Identifier;
  company_name: string;
  date: string;
  description: string;
  payment_date: string;
  payment_method: string;
  payment_note: string;
  gst_rate: number;
  discount_rate: number;
  gst_amount: number;
  discount_amount: number;
  net: number;
  total_amount: number;
  grand_total: number;
  status: string;
  customer: Identifier;
  salesperson: Identifier;
  sales_order: Identifier;
  invoiceitem_set: InvoiceItem[];
}

export interface InvoiceItem extends Record {
  product: Identifier;
  unit: number;
  cost: number;
  quantity: number;
  unit_price: number;
  invoice: Identifier;
}

export interface SalesOrder extends Record {
  reference: string;
  company: Identifier;
  company_name: string;
  date: string;
  description: string;
  payment_date: string;
  payment_method: string;
  payment_note: string;
  gst_rate: number;
  discount_rate: number;
  gst_amount: number;
  discount_amount: number;
  net: number;
  total_amount: number;
  grand_total: number;
  status: string;
  customer: Identifier;
  salesperson: Identifier;
  invoice: Identifier;
  salesorderitem_set: SalesOrderItem[];
}

export interface SalesOrderItem extends Record {
  product: Identifier;
  unit: number;
  cost: number;
  quantity: number;
  unit_price: number;
  sales_order: Identifier;
}

export interface Adjustment extends Record {
  reference: string;
  status: string;
  mode: string;
  date: string;
  address: string;
  adjustmentitem_set: AdjustmentItem[];
  description: string;
  reason: string;
}

export interface AdjustmentItem extends Record {
  product: Identifier;
  unit: number;
  cost: number;
  quantity: number;
  unit_price: number;
  adjustment: Identifier;
}

export interface Receive extends Record {
  reference: string;
  company: Identifier;
  company_name: string;
  date: string;
  description: string;
  payment_date: string;
  payment_method: string;
  payment_note: string;
  gst_rate: number;
  discount_rate: number;
  gst_amount: number;
  discount_amount: number;
  net: number;
  total_amount: number;
  grand_total: number;
  status: string;
  supplier: Identifier;
  purchase_order: Identifier;
  receiveitem_set: ReceiveItem[];
}

export interface ReceiveItem extends Record {
  product: Identifier;
  unit: number;
  cost: number;
  quantity: number;
  unit_price: number;
  receive: Identifier;
}

export interface PurchaseOrder extends Record {
  reference: string;
  company: Identifier;
  company_name: string;
  date: string;
  description: string;
  payment_date: string;
  payment_method: string;
  payment_note: string;
  gst_rate: number;
  discount_rate: number;
  gst_amount: number;
  discount_amount: number;
  net: number;
  total_amount: number;
  grand_total: number;
  status: string;
  supplier: Identifier;
  receive: Identifier;
  purchaseorderitem_set: PurchaseOrderItem[];
}

export interface PurchaseOrderItem extends Record {
  product: Identifier;
  unit: number;
  cost: number;
  quantity: number;
  unit_price: number;
  purchase_order: Identifier;
}

export type OrderStatus = "ordered" | "delivered" | "cancelled";

export interface Order extends Record {
  status: OrderStatus;
  basket: BasketItem[];
  date: string;
  total: number;
}

export interface BasketItem {
  product_id: Identifier;
  quantity: number;
}

export type ReviewStatus = "accepted" | "pending" | "rejected";

export interface Review extends Record {
  date: string;
  status: ReviewStatus;
  customer_id: Identifier;
  product_id: Identifier;
}

declare global {
  interface Window {
    restServer: any;
  }
}
