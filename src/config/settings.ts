import { Product, Extra } from '../types/booking';

export const STUDIO_SETTINGS = {
  timezone: 'Europe/Berlin',
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
    adminEmail: 'info@qs1.studio',
    notificationSubject: 'New Studio Booking Request',
  }
};

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Studio Rental 1h',
    price: 75,
    description: 'One hour studio rental with basic equipment',
    duration: 1,
  },
  {
    id: '2',
    name: 'Half Day',
    price: 250,
    description: '4 hours studio rental with basic equipment',
    duration: 4,
  },
  {
    id: '3',
    name: 'Full Day',
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
    price: 25,
    description: 'Professional seamless paper backdrop in various colors',
  },
  {
    id: '3',
    name: 'Professional Lighting Kit',
    price: 75,
    description: 'Additional professional lighting setup',
  },
]; 