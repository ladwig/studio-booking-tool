import { google } from 'googleapis';
import { TimeSlot } from '../types/booking';

// Service account credentials should be stored securely in environment variables
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || '';
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';

const getAuthClient = () => {
  return new google.auth.JWT(
    GOOGLE_SERVICE_ACCOUNT_EMAIL,
    undefined,
    GOOGLE_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/calendar.readonly']
  );
};

export const getBookedSlots = async (date: Date): Promise<TimeSlot[]> => {
  const auth = getAuthClient();
  const calendar = google.calendar({ version: 'v3', auth });
  
  // Get the start and end of the selected date
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const response = await calendar.events.list({
      calendarId: GOOGLE_CALENDAR_ID,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      showDeleted: false,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    return (response.data.items || []).map(event => ({
      start: event.start?.dateTime || '',
      end: event.end?.dateTime || '',
      available: false,
    }));
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
};

// Helper function to check if a time slot overlaps with any booked slots
export const isSlotAvailable = (
  timeSlot: string,
  date: Date,
  bookedSlots: TimeSlot[]
): boolean => {
  const [startTime] = timeSlot.split(' - ');
  const [hours, minutes] = startTime.split(':').map(Number);
  
  const slotStart = new Date(date);
  slotStart.setHours(hours, minutes, 0, 0);
  
  return !bookedSlots.some(bookedSlot => {
    const bookedStart = new Date(bookedSlot.start);
    const bookedEnd = new Date(bookedSlot.end);
    return slotStart >= bookedStart && slotStart < bookedEnd;
  });
}; 