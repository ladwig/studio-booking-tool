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
      street: '',
      city: '',
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
      console.log('Form data before submission:', formData);
      console.log('Date field specifically:', formData.date);
      console.log('Date type:', typeof formData.date);
      if (formData.date) {
        console.log('Date components before serialization:', {
          year: formData.date.getFullYear(),
          month: formData.date.getMonth() + 1,
          day: formData.date.getDate(),
          hours: formData.date.getHours(),
          minutes: formData.date.getMinutes()
        });
        console.log('Date toISOString():', formData.date.toISOString());
      }
      console.log('Date serialized:', JSON.stringify(formData.date));
      
      // Create a copy of formData with date as date-only string to avoid timezone issues
      const formDataForSubmission = {
        ...formData,
        date: formData.date ? `${formData.date.getFullYear()}-${String(formData.date.getMonth() + 1).padStart(2, '0')}-${String(formData.date.getDate()).padStart(2, '0')}` : undefined
      };
      
      console.log('Form data for submission with date string:', formDataForSubmission);
      console.log('Date string sent to API:', formDataForSubmission.date);
      
      const serializedFormData = JSON.stringify(formDataForSubmission);
      console.log('Full serialized form data:', serializedFormData);
      
      // Parse it back to see what the server will receive
      const parsedBack = JSON.parse(serializedFormData);
      console.log('Parsed back date:', parsedBack.date);
      console.log('Parsed back date type:', typeof parsedBack.date);
      
      const response = await fetch('/api/booking/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: serializedFormData,
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