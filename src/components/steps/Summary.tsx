'use client';

import { useState } from 'react';
import { BookingFormData } from '../../types/booking';

interface SummaryProps {
  formData: BookingFormData;
  onBack: () => void;
  onSubmit: () => void;
}

const Summary = ({ formData, onBack, onSubmit }: SummaryProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const calculateTotal = () => {
    const productPrice = formData.selectedProduct?.price || 0;
    const extrasTotal = formData.selectedExtras.reduce(
      (sum, extra) => sum + extra.price,
      0
    );
    return productPrice + extrasTotal;
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const bookingDataToSend = {
        ...formData,
        date: formData.date?.toISOString(),
      };

      const response = await fetch('/api/booking/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingDataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to submit booking');
      }

      setSuccess(true);
      onSubmit();
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Selected Service</h3>
          <div className="flex justify-between items-center">
            <span>{formData.selectedProduct?.name}</span>
            <span className="font-medium">{formatCurrency(formData.selectedProduct?.price || 0)}</span>
          </div>
        </div>

        {formData.selectedExtras.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Services</h3>
            {formData.selectedExtras.map((extra) => (
              <div key={extra.id} className="flex justify-between items-center">
                <span>{extra.name}</span>
                <span className="font-medium">{formatCurrency(extra.price)}</span>
              </div>
            ))}
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Date & Time</h3>
          <p>{formatDate(formData.date)}</p>
          <p>{formData.timeSlot}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
          <p>
            {formData.personalInfo.firstName} {formData.personalInfo.lastName}
          </p>
          {formData.personalInfo.company && (
            <p>{formData.personalInfo.company}</p>
          )}
          <p>{formData.personalInfo.email}</p>
          <p>{formData.personalInfo.phone}</p>
        </div>

        {formData.note && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Notes</h3>
            <p className="text-gray-700">{formData.note}</p>
          </div>
        )}

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span>{formatCurrency(calculateTotal())}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-600">
            Booking submitted successfully! We&apos;ll contact you shortly to confirm your booking.
          </p>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-2 rounded-md text-gray-600 border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || success}
          className={`px-6 py-2 rounded-md text-white ${
            isSubmitting || success
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Submitting...' : success ? 'Submitted' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
};

export default Summary; 