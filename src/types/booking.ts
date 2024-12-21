export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  duration: number;
}

export interface Extra {
  id: string;
  name: string;
  price: number;
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
  selectedProduct: Product | undefined;
  selectedExtras: Extra[];
  date: Date | undefined;
  timeSlot: string;
  personalInfo: PersonalInfo;
  note: string;
  termsAccepted: boolean;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
} 