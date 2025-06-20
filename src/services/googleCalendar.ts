import { google } from 'googleapis';
import { TimeSlot, BookingFormData } from '../types/booking';

// Service account credentials should be stored securely in environment variables
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || '';
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';

const getAuthClient = () => {
  return new google.auth.JWT(
    GOOGLE_SERVICE_ACCOUNT_EMAIL,
    undefined,
    GOOGLE_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/calendar']
  );
};

const getReadOnlyAuthClient = () => {
  return new google.auth.JWT(
    GOOGLE_SERVICE_ACCOUNT_EMAIL,
    undefined,
    GOOGLE_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/calendar.readonly']
  );
};

export const getBookedSlots = async (date: Date): Promise<TimeSlot[]> => {
  const auth = getReadOnlyAuthClient();
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

// Create a calendar entry for a booking request
export const createBookingRequest = async (bookingData: BookingFormData): Promise<string | null> => {
  try {
    console.log('Creating calendar entry for booking request...');
    
    const auth = getAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });

    if (!bookingData.date || !bookingData.timeSlot || !bookingData.selectedProduct) {
      throw new Error('Missing required booking data for calendar entry');
    }

    // Parse the time slot
    const [startTime, endTime] = bookingData.timeSlot.split(' - ');
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    // Create start and end datetime objects in Berlin timezone
    // We need to create the date in Berlin timezone, not convert to UTC
    const berlinDate = new Date(bookingData.date);
    
    // Create the datetime string in Berlin timezone format
    const year = berlinDate.getFullYear();
    const month = String(berlinDate.getMonth() + 1).padStart(2, '0');
    const day = String(berlinDate.getDate()).padStart(2, '0');
    
    const startTimeStr = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}:00`;
    const endTimeStr = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}:00`;
    
    const startISO = `${year}-${month}-${day}T${startTimeStr}`;
    const endISO = `${year}-${month}-${day}T${endTimeStr}`;

    console.log('Event times:', { startISO, endISO });

    // Build description with booking details
    const description = `
BOOKING REQUEST - REQUIRES CONFIRMATION

Customer: ${bookingData.personalInfo.firstName} ${bookingData.personalInfo.lastName}
Email: ${bookingData.personalInfo.email}
Phone: ${bookingData.personalInfo.phone}
Address: ${bookingData.personalInfo.street}, ${bookingData.personalInfo.city}

Service: ${bookingData.selectedProduct.name}
Duration: ${bookingData.selectedProduct.duration} minutes
Price: €${bookingData.selectedProduct.price}

${bookingData.selectedExtras && bookingData.selectedExtras.length > 0 ? 
  `Extras:\n${bookingData.selectedExtras.map(extra => `- ${extra.name}: €${extra.price}`).join('\n')}\n\n` : 
  ''
}

${bookingData.note ? `Notes: ${bookingData.note}\n\n` : ''}

⚠️ This is a booking request that needs to be confirmed or declined.
`.trim();

    const event = {
      summary: `REQUEST: ${bookingData.selectedProduct.name} - ${bookingData.personalInfo.firstName} ${bookingData.personalInfo.lastName}`,
      description: description,
      start: {
        dateTime: startISO,
        timeZone: 'Europe/Berlin',
      },
      end: {
        dateTime: endISO,
        timeZone: 'Europe/Berlin',
      },
      status: 'tentative',
      colorId: '11', // Red color to indicate pending status
    };

    console.log('Creating event with data:', JSON.stringify(event, null, 2));

    const response = await calendar.events.insert({
      calendarId: GOOGLE_CALENDAR_ID || 'primary',
      requestBody: event,
    });

    console.log('Calendar event created successfully:', response.data.id);
    return response.data.id || null;

  } catch (error) {
    console.error('Error creating calendar entry:', error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Don't throw the error - just log it and return null
    // This prevents the entire booking process from failing
    return null;
  }
}; 