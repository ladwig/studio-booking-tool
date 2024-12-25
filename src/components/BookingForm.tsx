'use client';

import { useState } from 'react';
import { BookingFormData } from '../types/booking';
import ProductSelection from './steps/ProductSelection';
import ExtrasSelection from './steps/ExtrasSelection';
import DateTimeSelection from './steps/DateTimeSelection';
import PersonalInfo from './steps/PersonalInfo';
import Summary from './steps/Summary';
import { 
  ShoppingBagIcon, 
  PlusCircleIcon, 
  CalendarDaysIcon, 
  UserIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';

const STEPS = [
  { id: 1, icon: ShoppingBagIcon },
  { id: 2, icon: PlusCircleIcon },
  { id: 3, icon: CalendarDaysIcon },
  { id: 4, icon: UserIcon },
  { id: 5, icon: CheckCircleIcon },
];

const BookingForm = () => {
  const { translations } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    selectedProduct: undefined,
    selectedExtras: [],
    date: undefined,
    timeSlot: '',
    personalInfo: {
      firstName: '',
      lastName: '',
      company: '',
      email: '',
      phone: '',
    },
    note: '',
    termsAccepted: false,
  });

  const updateFormData = (data: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    try {
      // Here you would typically make an API call to submit the booking
      console.log('Form submitted:', formData);
      // You can add your submission logic here
      return Promise.resolve();
    } catch (error) {
      console.error('Error submitting form:', error);
      return Promise.reject(error);
    }
  };

  const getStepName = (stepId: number) => {
    switch (stepId) {
      case 1:
        return translations.steps.selectService;
      case 2:
        return translations.steps.addExtras;
      case 3:
        return translations.steps.chooseDateAndTime;
      case 4:
        return translations.steps.personalDetails;
      case 5:
        return translations.steps.reviewAndConfirm;
      default:
        return '';
    }
  };

  const renderProgressBar = () => {
    const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

    return (
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {STEPS.map(({ id, icon: Icon }) => (
            <div
              key={id}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                id === currentStep
                  ? 'bg-blue-600 text-white'
                  : id < currentStep
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProductSelection
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <ExtrasSelection
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <DateTimeSelection
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <PersonalInfo
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <Summary
            formData={formData}
            updateFormData={updateFormData}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {renderProgressBar()}
      {renderStep()}
    </div>
  );
};

export default BookingForm; 