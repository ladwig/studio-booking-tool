'use client';

import { BookingFormData, PersonalInfo as PersonalInfoType } from '../../types/booking';
import { useLanguage } from '../../contexts/LanguageContext';

interface PersonalInfoProps {
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PersonalInfo = ({
  formData,
  updateFormData,
  onNext,
  onBack,
}: PersonalInfoProps) => {
  const { translations } = useLanguage();
  const { personalInfo } = formData;

  const handleInputChange = (field: keyof PersonalInfoType, value: string) => {
    updateFormData({
      personalInfo: {
        ...personalInfo,
        [field]: value,
      },
    });
  };

  const isFormValid = () => {
    return (
      personalInfo.firstName.trim() !== '' &&
      personalInfo.lastName.trim() !== '' &&
      personalInfo.street.trim() !== '' &&
      personalInfo.city.trim() !== '' &&
      personalInfo.email.trim() !== '' &&
      personalInfo.phone.trim() !== ''
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {translations.booking.personalInformation}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {translations.booking.firstName} *
          </label>
          <input
            type="text"
            value={personalInfo.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {translations.booking.lastName} *
          </label>
          <input
            type="text"
            value={personalInfo.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {translations.booking.street} *
          </label>
          <input
            type="text"
            value={personalInfo.street}
            onChange={(e) => handleInputChange('street', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {translations.booking.city} *
          </label>
          <input
            type="text"
            value={personalInfo.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {translations.booking.company}
          </label>
          <input
            type="text"
            value={personalInfo.company || ''}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {translations.booking.email} *
          </label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {translations.booking.phone} *
          </label>
          <input
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {translations.booking.additionalNotes}
        </label>
        <textarea
          value={formData.note || ''}
          onChange={(e) => updateFormData({ note: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          rows={4}
          placeholder={translations.booking.notesPlaceholder}
        />
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
          disabled={!isFormValid()}
          className={`px-6 py-2 rounded-md text-white ${
            isFormValid()
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

export default PersonalInfo; 