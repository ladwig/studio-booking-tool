import { Product, Extra } from '../types/booking';

export const STUDIO_SETTINGS = {
  timezone: 'Europe/Berlin',
  defaultLanguage: 'en',
  operatingHours: {
    openingHour: 7, // 9 AM
    closingHour: 23, // 11 PM
    earliestBookingTime: 7, // Earliest time someone can start a booking 
    latestBookingTime: 21, // Latest time someone can start a booking (9 PM)
  },
  
  bookingRules: {
    minAdvanceBookingHours: 24, // Minimum hours in advance for booking
    maxAdvanceBookingDays: 60, // Maximum days in advance for booking
  },

  displaySettings: {
    showUnavailableSlots: false, // Whether to show or hide unavailable time slots
    unavailableSlotMessage: '(Booked)', // Message to show for unavailable slots (if shown)
  },

  emailSettings: {
    adminEmail: 'info@qs1.studio, daniel@qs1.studio, ladwig.daniel@icloud.com',
    notificationSubject: 'New Studio A Booking Request',
  },

  discountMode: {
    enabled: false, // Whether discount prices are active
  },
};

export const MANDATORY_PRODUCTS: Product[] = [
  {
    id: 'mandatory-1',
    name: 'Final Cleaning',
    price: 40,
    description: 'Mandatory cleaning and repainting after each session',
    isMandatory: true,
    duration: 0,
    allowQuantity: false
  }
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Studio A - 1h',
    price: 80,
    discountPrice: 60,
    description: 'One hour studio rental with basic equipment',
    duration: 1,
    allowQuantity: true,
    maxQuantity: 8,
    isMandatory: false
  },
  {
    id: '2',
    name: 'Studio A - Half Day',
    price: 275,
    discountPrice: 205,
    description: '4 hours studio rental with basic equipment',
    duration: 4,
    allowQuantity: false,
    isMandatory: false
  },
  {
    id: '3',
    name: 'Studio A - Full Day',
    price: 450,
    discountPrice: 338,
    description: '8 hours studio rental with basic equipment',
    duration: 8,
    allowQuantity: false,
    isMandatory: false
  },
];

export const EXTRAS: Extra[] = [
  {
    id: '1',
    name: 'Tech Support',
    price: 50,
    discountPrice: 40,
    description: 'Professional technical support during your session',
    allowQuantity: true,
    maxQuantity: 8
  },
  {
    id: '2',
    name: 'Color Backdrop',
    price: 9,
    discountPrice: 9,
    description: 'Varying paper color backdrops, while price is per used meter',
    allowQuantity: true,
    maxQuantity: 8
  }
]; 