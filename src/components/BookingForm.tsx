'use client';

import { useState } from 'react';
import { BookingFormData } from '../types/booking';
import ProductSelection from './steps/ProductSelection';
import ExtrasSelection from './steps/ExtrasSelection';
import DateTimeSelection from './steps/DateTimeSelection';
import PersonalInfo from './steps/PersonalInfo';
import Summary from './steps/Summary';

const initialFormData: BookingFormData = {
  selectedProduct: undefined,
  selectedExtras: [],
  date: undefined,
  timeSlot: undefined,
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  },
  note: '',
};

const BookingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const updateFormData = (data: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProductSelection
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <ExtrasSelection
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <DateTimeSelection
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <PersonalInfo
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <Summary
            formData={formData}
            onBack={prevStep}
            onSubmit={() => console.log('Form submitted:', formData)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`w-1/5 text-center ${
                step === currentStep
                  ? 'text-blue-600 font-bold'
                  : step < currentStep
                  ? 'text-green-600'
                  : 'text-gray-400'
              }`}
            >
              Step {step}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full mt-2">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
          />
        </div>
      </div>
      {renderStep()}
    </div>
  );
};

export default BookingForm; 