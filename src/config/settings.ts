import { Product, Extra } from '../types/booking';

export const STUDIO_SETTINGS = {
  timezone: 'Europe/Berlin',
  defaultLanguage: 'en',
  operatingHours: {
    openingHour: 9, // 9 AM
    closingHour: 23, // 11 PM
    earliestBookingTime: 8, // Earliest time someone can start a booking (9 AM)
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
    adminEmail: 'info@qs1.studio, ladwig.daniel@icloud.com',
    notificationSubject: 'New Studio A Booking Request',
  },
};

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Studio A - 1h',
    price: 75,
    description: 'One hour studio rental with basic equipment',
    duration: 1,
  },
  {
    id: '2',
    name: 'Studio A - Half Day',
    price: 275,
    description: '4 hours studio rental with basic equipment',
    duration: 4,
  },
  {
    id: '3',
    name: 'Studio A - Full Day',
    price: 450,
    description: '8 hours studio rental with basic equipment',
    duration: 8,
  },
];

export const EXTRAS: Extra[] = [
  {
    id: '1',
    name: 'Tech Support',
    price: 50,
    description: 'Professional technical support during your session',
  },
  {
    id: '2',
    name: 'Color Backdrop',
    price: 9,
    description: 'Varying color backdrops, while price is per used meter',
  }
]; 