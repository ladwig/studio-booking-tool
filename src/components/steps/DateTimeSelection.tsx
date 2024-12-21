'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { BookingFormData, TimeSlot } from '../../types/booking';
import { STUDIO_SETTINGS } from '../../config/settings';

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

const generateTimeSlots = (duration: number) => {
  const slots: string[] = [];
  const maxStartHour = Math.min(latestBookingTime, closingHour - duration);
  
  for (let hour = earliestBookingTime; hour <= maxStartHour; hour++) {
    const startHour = hour;
    const endHour = startHour + duration;
    
    // Skip slots that would end after closing time
    if (endHour > closingHour) continue;
    
    const startTime = startHour.toString().padStart(2, '0') + ':00';
    const endTime = endHour.toString().padStart(2, '0') + ':00';
    
    slots.push(`${startTime} - ${endTime}`);
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

  // Check if the slot is within allowed booking time
  const now = new Date();
  const minBookingTime = new Date(now.getTime() + STUDIO_SETTINGS.bookingRules.minAdvanceBookingHours * 60 * 60 * 1000);
  if (slotStart < minBookingTime) {
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

const DateTimeSelection = ({
  formData,
  updateFormData,
  onNext,
  onBack,
}: DateTimeSelectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    formData.date || null
  );
  const [bookedSlots, setBookedSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    updateFormData({ timeSlot });
  };

  // Filter out past dates and limit future dates
  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);
  
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + STUDIO_SETTINGS.bookingRules.maxAdvanceBookingDays);

  // Generate time slots based on selected product duration
  const timeSlots = formData.selectedProduct 
    ? generateTimeSlots(formData.selectedProduct.duration)
    : [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Select Date and Time</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            minDate={minDate}
            maxDate={maxDate}
            dateFormat="MMMM d, yyyy"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholderText="Select a date"
          />
          <p className="mt-1 text-sm text-gray-500">
            You can book up to {STUDIO_SETTINGS.bookingRules.maxAdvanceBookingDays} days in advance
          </p>
        </div>

        {selectedDate && formData.selectedProduct && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Time Slots for {formData.selectedProduct.name} ({formData.selectedProduct.duration}h)
            </label>
            {isLoading ? (
              <div className="text-center py-4">Loading available slots...</div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {timeSlots.map((timeSlot) => {
                    const available = isSlotAvailable(
                      timeSlot,
                      selectedDate,
                      bookedSlots,
                      formData.selectedProduct!.duration
                    );
                    return (
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
                        {!available && <span className="block text-xs">(Booked)</span>}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Bookings must be made at least {STUDIO_SETTINGS.bookingRules.minAdvanceBookingHours} hours in advance
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-md text-gray-600 border border-gray-300 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!selectedDate || !formData.timeSlot}
          className={`px-6 py-2 rounded-md text-white ${
            selectedDate && formData.timeSlot
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DateTimeSelection; 