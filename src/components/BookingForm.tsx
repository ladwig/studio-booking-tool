'use client';

import { useState } from 'react';
import { BookingFormData } from '../types/booking';
import ProductSelection from './steps/ProductSelection';
import ExtrasSelection from './steps/ExtrasSelection';
import DateTimeSelection from './steps/DateTimeSelection';
import PersonalInfo from './steps/PersonalInfo';
import Summary from './steps/Summary';
import { useLanguage } from '../contexts/LanguageContext';

const STEPS = [1, 2, 3, 4, 5];

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
      const response = await fetch('/api/booking/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit booking');
      }

      return Promise.resolve();
    } catch (error) {
      console.error('Error submitting form:', error);
      return Promise.reject(error);
    }
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
    <div className="max-w-3xl px-4 py-8">
      {renderStep()}
    </div>
  );
};

export default BookingForm; 