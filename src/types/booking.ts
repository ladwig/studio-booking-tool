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

export interface BookingFormData {
  selectedProduct?: Product;
  selectedExtras: Extra[];
  date?: Date;
  timeSlot?: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  note: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
} 