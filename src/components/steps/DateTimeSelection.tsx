'use client';

import { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { BookingFormData, TimeSlot } from '../../types/booking';
import { STUDIO_SETTINGS } from '../../config/settings';
import { useLanguage } from '../../contexts/LanguageContext';

interface DateTimeSelectionProps {
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const {
  openingHour,
  closingHour,
  earliestBookingTime,
  latestBookingTime,
} = STUDIO_SETTINGS.operatingHours;

const { showUnavailableSlots, unavailableSlotMessage } = STUDIO_SETTINGS.displaySettings;

// Add timezone constant at the top
const TIMEZONE = 'Europe/Berlin';

// Format time for display (e.g., "09:00" or "17:00")
const formatTime = (hour: number) => {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return date.toLocaleTimeString('de-DE', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false,
    timeZone: TIMEZONE 
  });
};

// Get the first bookable date (considering minAdvanceBookingHours)
const getFirstBookableDate = () => {
  const now = new Date();
  const berlinTime = new Date(now.toLocaleString('en-US', { timeZone: TIMEZONE }));
  const minBookingTime = new Date(
    berlinTime.getTime() + STUDIO_SETTINGS.bookingRules.minAdvanceBookingHours * 60 * 60 * 1000
  );
  const date = new Date(minBookingTime);
  date.setHours(0, 0, 0, 0);
  return date;
};

const generateTimeSlots = (duration: number) => {
  const slots: string[] = [];
  
  // Calculate the latest possible start time based on:
  // 1. Latest allowed booking start time from settings
  // 2. Time needed to complete the booking before closing
  const maxStartHour = Math.min(
    latestBookingTime,
    closingHour - duration // Ensure booking ends before closing
  );

  // Start from the earliest allowed booking time
  for (let hour = earliestBookingTime; hour <= maxStartHour; hour++) {
    const startTime = formatTime(hour);
    const endHour = hour + duration;
    const endTime = formatTime(endHour);

    // Only add the slot if:
    // 1. The end time doesn't exceed closing hour
    // 2. The start time is not before opening hour
    if (endHour <= closingHour && hour >= openingHour) {
      slots.push(`${startTime} - ${endTime}`);
    }
  }
  
  return slots;
};

// Helper function to check if a time slot overlaps with any booked slots
const isSlotAvailable = (
  timeSlot: string,
  date: Date,
  bookedSlots: TimeSlot[],
  duration: number
): boolean => {
  const [startTime] = timeSlot.split(' - ');
  const [hours, minutes] = startTime.split(':').map(Number);
  
  const slotStart = new Date(date);
  slotStart.setHours(hours, minutes, 0, 0);
  
  const slotEnd = new Date(slotStart);
  slotEnd.setHours(slotStart.getHours() + duration);

  // Convert to Berlin timezone for comparison
  const now = new Date();
  const berlinNow = new Date(now.toLocaleString('en-US', { timeZone: TIMEZONE }));
  const minBookingTime = new Date(
    berlinNow.getTime() + STUDIO_SETTINGS.bookingRules.minAdvanceBookingHours * 60 * 60 * 1000
  );

  // Check if the slot is within allowed booking time
  const startHour = slotStart.getHours();
  const endHour = slotEnd.getHours();
  
  if (
    startHour < openingHour || // Starts before opening
    startHour > latestBookingTime || // Starts after latest booking time
    endHour > closingHour || // Ends after closing
    slotStart < minBookingTime // Too soon to book
  ) {
    return false;
  }

  return !bookedSlots.some(bookedSlot => {
    const bookedStart = new Date(bookedSlot.start);
    const bookedEnd = new Date(bookedSlot.end);
    
    // Check if there's any overlap between the proposed slot and the booked slot
    const hasOverlap = (
      (slotStart >= bookedStart && slotStart < bookedEnd) || // Slot starts during a booking
      (slotEnd > bookedStart && slotEnd <= bookedEnd) || // Slot ends during a booking
      (slotStart <= bookedStart && slotEnd >= bookedEnd) // Slot completely contains a booking
    );
    
    return hasOverlap;
  });
};

// Generate an array of dates for the week view starting from Monday
const getWeekDates = (currentDate: Date) => {
  const dates = [];
  const startOfWeek = new Date(currentDate);
  // Get to Monday (1 is Monday, 0 is Sunday)
  const day = startOfWeek.getDay();
  const diff = day === 0 ? -6 : 1 - day; // If Sunday, go back 6 days, otherwise go to Monday
  startOfWeek.setDate(currentDate.getDate() + diff);

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const formatDateForDisplay = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const DateTimeSelection = ({
  formData,
  updateFormData,
  onNext,
  onBack,
}: DateTimeSelectionProps) => {
  const { translations } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    formData.date || getFirstBookableDate()
  );
  const [bookedSlots, setBookedSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close date picker when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDate) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/calendar/booked-slots?date=${selectedDate.toISOString()}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch booked slots');
        }
        const data = await response.json();
        setBookedSlots(data.bookedSlots);
      } catch (error) {
        console.error('Error fetching booked slots:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookedSlots();
  }, [selectedDate]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    updateFormData({ date: date || undefined, timeSlot: undefined });
    setShowDatePicker(false);
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    updateFormData({ timeSlot });
  };

  const navigateDate = (days: number) => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    handleDateChange(newDate);
  };

  // Filter out past dates and limit future dates
  const minDate = getFirstBookableDate();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + STUDIO_SETTINGS.bookingRules.maxAdvanceBookingDays);

  // Generate time slots based on selected product duration
  const timeSlots = formData.selectedProduct 
    ? generateTimeSlots(formData.selectedProduct.duration)
    : [];

  // Filter and process time slots based on availability
  const processedTimeSlots = timeSlots.map(timeSlot => ({
    timeSlot,
    available: formData.selectedProduct 
      ? isSlotAvailable(
          timeSlot,
          selectedDate || new Date(),
          bookedSlots,
          formData.selectedProduct.duration
        )
      : false
  })).filter(({ available }) => showUnavailableSlots || available);

  // Get dates for the week view
  const weekDates = selectedDate ? getWeekDates(selectedDate) : [];

  const formatWeekday = (date: Date) => {
    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayIndex = date.getDay();
    return translations.weekdays[weekdays[dayIndex] as keyof typeof translations.weekdays];
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {translations.booking.dateAndTime}
      </h2>
      
      <div className="space-y-4">
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateDate(-7)}
              className="px-3 py-1 text-gray-600 border rounded-md hover:bg-gray-50"
            >
              {translations.calendar.previousWeek}
            </button>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="px-3 py-1 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
            >
              {selectedDate ? formatDateForDisplay(selectedDate) : translations.booking.selectDate}
            </button>
            <button
              onClick={() => navigateDate(7)}
              className="px-3 py-1 text-gray-600 border rounded-md hover:bg-gray-50"
            >
              {translations.calendar.nextWeek}
            </button>
          </div>

          {showDatePicker && (
            <div 
              ref={datePickerRef}
              className="absolute z-10 bg-white shadow-lg rounded-lg p-4 border mt-2 left-1/2 transform -translate-x-1/2"
            >
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                minDate={minDate}
                maxDate={maxDate}
                dateFormat="MMMM d, yyyy"
                inline
                calendarStartDay={1} // Start week on Monday
              />
            </div>
          )}

          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDates.map((date) => {
              const isSelected = selectedDate?.toDateString() === date.toDateString();
              const isPast = date < minDate;
              const isFuture = date > maxDate;
              const isDisabled = isPast || isFuture;

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => !isDisabled && handleDateChange(date)}
                  disabled={isDisabled}
                  className={`p-2 text-center rounded-md transition-colors ${
                    isDisabled
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : isSelected
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="text-xs font-medium">
                    {formatWeekday(date)}
                  </div>
                  <div className="text-sm">
                    {date.getDate()}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedDate && formData.selectedProduct && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {`${translations.booking.availableTimeSlots} ${formData.selectedProduct.name} (${formData.selectedProduct.duration}h)`}
            </label>
            {isLoading ? (
              <div className="text-center py-4">Loading available slots...</div>
            ) : processedTimeSlots.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {processedTimeSlots.map(({ timeSlot, available }) => (
                    <button
                      key={timeSlot}
                      onClick={() => available && handleTimeSlotSelect(timeSlot)}
                      disabled={!available}
                      className={`p-2 text-sm border rounded-md transition-colors ${
                        !available
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : formData.timeSlot === timeSlot
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      {timeSlot}
                      {!available && <span className="block text-xs">{unavailableSlotMessage}</span>}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {translations.calendar.advanceBookingNotice.replace(
                    '{hours}',
                    STUDIO_SETTINGS.bookingRules.minAdvanceBookingHours.toString()
                  )}
                </p>
              </>
            ) : (
              <p className="text-center py-4 text-gray-500">
                {translations.calendar.noTimeSlots}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          {translations.common.back}
        </button>
        <button
          onClick={onNext}
          disabled={!formData.timeSlot}
          className={`px-6 py-2 rounded-md text-white ${
            formData.timeSlot
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {translations.common.next}
        </button>
      </div>
    </div>
  );
};

export default DateTimeSelection; 