export interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  duration: number;
}

export interface Extra {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  company?: string;
  email: string;
  phone: string;
}

export interface BookingFormData {
  selectedProduct?: Product;
  selectedExtras?: Extra[];
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