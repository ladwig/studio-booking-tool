'use client';

import { BookingFormData } from '../../types/booking';

interface SummaryProps {
  formData: BookingFormData;
  onBack: () => void;
  onSubmit: () => void;
}

const Summary = ({ formData, onBack, onSubmit }: SummaryProps) => {
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Booking Summary</h2>
      
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Selected Service</h3>
          <div className="flex justify-between items-center">
            <span>{formData.selectedProduct?.name}</span>
            <span className="font-medium">${formData.selectedProduct?.price}</span>
          </div>
        </div>

        {formData.selectedExtras.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Services</h3>
            {formData.selectedExtras.map((extra) => (
              <div key={extra.id} className="flex justify-between items-center">
                <span>{extra.name}</span>
                <span className="font-medium">${extra.price}</span>
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
            <span>${calculateTotal()}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-md text-gray-600 border border-gray-300 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          className="px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default Summary; 