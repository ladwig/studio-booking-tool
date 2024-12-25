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

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
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
        <div className="flex justify-between mb-2">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={`flex flex-col items-center space-y-1 ${
                  step.id === currentStep
                    ? 'text-blue-600'
                    : step.id < currentStep
                    ? 'text-gray-600'
                    : 'text-gray-400'
                }`}
              >
                <Icon className="w-6 h-6 md:hidden" />
                <span className="text-sm font-medium hidden md:block">
                  {getStepName(step.id)}
                </span>
                <span className="text-xs md:hidden">
                  {translations.steps.selectService} {step.id}
                </span>
              </div>
            );
          })}
        </div>
        <div className="h-2 bg-gray-200 rounded-full mt-2">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
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
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {renderProgressBar()}
      {renderStep()}
    </div>
  );
};

export default BookingForm; 