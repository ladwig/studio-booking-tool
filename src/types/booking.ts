export interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  duration: number;
  allowQuantity: boolean;
  maxQuantity?: number;
  isMandatory?: boolean;
}

export interface Extra {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  allowQuantity?: boolean;
  maxQuantity?: number;
}

export interface SelectedExtra extends Omit<Extra, 'quantity'> {
  quantity: number;
}

export interface SelectedProduct extends Omit<Product, 'quantity'> {
  quantity: number;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  company?: string;
  email: string;
  phone: string;
}

export interface BookingFormData {
  selectedProduct?: SelectedProduct;
  selectedExtras?: SelectedExtra[];
  date?: Date;
  timeSlot: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    phone: string;
  };
  note: string;
  termsAccepted: boolean;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
} 