import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || '';
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY ? 
  process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n') : '';

const TIMEZONE = 'Europe/Berlin';

const getAuthClient = () => {
  return new google.auth.JWT(
    GOOGLE_SERVICE_ACCOUNT_EMAIL,
    undefined,
    GOOGLE_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/calendar.readonly']
  );
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date');

  if (!dateStr) {
    return NextResponse.json({ error: 'No date provided' }, { status: 400 });
  }

  try {
    const date = new Date(dateStr);
    const berlinDate = new Date(date.toLocaleString('en-US', { timeZone: TIMEZONE }));
    
    // Set start and end of day in Berlin timezone
    const startOfDay = new Date(berlinDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(berlinDate);
    endOfDay.setHours(23, 59, 59, 999);

    const auth = getAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });

    const response = await calendar.events.list({
      calendarId: GOOGLE_CALENDAR_ID,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      showDeleted: false,
      timeZone: TIMEZONE
    });

    const bookedSlots = (response.data.items || []).map(event => ({
      start: event.start?.dateTime || '',
      end: event.end?.dateTime || '',
      available: false,
    }));

    return NextResponse.json({ bookedSlots });
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booked slots' },
      { status: 500 }
    );
  }
} 