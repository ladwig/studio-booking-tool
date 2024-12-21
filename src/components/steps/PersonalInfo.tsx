'use client';

import { useState } from 'react';
import { BookingFormData } from '../../types/booking';

interface PersonalInfoProps {
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PersonalInfo = ({ formData, updateFormData, onNext, onBack }: PersonalInfoProps) => {
  const [showTerms, setShowTerms] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    updateFormData({
      personalInfo: {
        ...formData.personalInfo,
        [field]: value,
      },
    });
  };

  const handleNoteChange = (value: string) => {
    updateFormData({ note: value });
  };

  const handleTermsChange = (accepted: boolean) => {
    updateFormData({ termsAccepted: accepted });
  };

  const isValid = () => {
    const { firstName, lastName, email, phone } = formData.personalInfo;
    return (
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      email.trim() !== '' &&
      phone.trim() !== '' &&
      formData.termsAccepted
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            value={formData.personalInfo.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.personalInfo.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <input
            type="text"
            value={formData.personalInfo.company || ''}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={formData.personalInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone *
          </label>
          <input
            type="tel"
            value={formData.personalInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Additional Notes
        </label>
        <textarea
          value={formData.note}
          onChange={(e) => handleNoteChange(e.target.value)}
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
          placeholder="Any special requests or additional information..."
        />
      </div>

      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          checked={formData.termsAccepted}
          onChange={(e) => handleTermsChange(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <div className="text-sm">
          <label className="font-medium text-gray-700">
            I accept the{' '}
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="text-blue-600 hover:text-blue-500 underline"
            >
              booking terms
            </button>
          </label>
        </div>
      </div>

      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <h3 className="text-xl font-bold mb-4">Booking Terms</h3>
            <div className="prose prose-sm">
              <h4>1. Booking and Cancellation</h4>
              <p>
                Bookings must be cancelled at least 48 hours before the scheduled time.
                Late cancellations may result in a cancellation fee.
              </p>

              <h4>2. Payment</h4>
              <p>
                Full payment is required at the time of booking. We accept credit cards
                and bank transfers.
              </p>

              <h4>3. Studio Rules</h4>
              <p>
                - Keep the studio clean and tidy<br />
                - No smoking inside the studio<br />
                - Report any equipment issues immediately<br />
                - Follow all safety guidelines
              </p>

              <h4>4. Equipment</h4>
              <p>
                Any damage to studio equipment may result in additional charges.
                Please handle all equipment with care.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTerms(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-md text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid()}
          className={`px-6 py-2 rounded-md text-white transition-colors ${
            isValid()
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

export default PersonalInfo; 