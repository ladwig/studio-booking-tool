'use client';

import { useState, useEffect } from 'react';
import { BookingFormData } from '../../types/booking';
import { useLanguage } from '../../contexts/LanguageContext';
import BookingTerms from '../BookingTerms';
import { STUDIO_SETTINGS, MANDATORY_PRODUCTS } from '../../config/settings';
import { calculateTotal, calculateSavings, formatCurrency } from '../../utils/priceCalculations';

interface SummaryProps {
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
  onBack: () => void;
  onSubmit: () => Promise<void>;
}

const Summary = ({ formData, updateFormData, onBack, onSubmit }: SummaryProps) => {
  const { translations } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isDiscountEnabled = STUDIO_SETTINGS.discountMode.enabled;

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = calculateTotal(formData);
  const savings = calculateSavings(formData);

  // Check if all required fields are present
  const isFormComplete = formData.date && formData.selectedProduct && formData.timeSlot && formData.termsAccepted;

  const handleSubmit = async () => {
    // Validate required fields before submission
    if (!formData.date) {
      console.error('Missing date field during submission');
      setSubmissionError('Missing booking date. Please go back and select a date.');
      return;
    }
    
    if (!formData.selectedProduct) {
      console.error('Missing selected product during submission');
      setSubmissionError('Missing selected service. Please go back and select a service.');
      return;
    }
    
    if (!formData.timeSlot) {
      console.error('Missing time slot during submission');
      setSubmissionError('Missing time slot. Please go back and select a time slot.');
      return;
    }
    
    console.log('Summary: Form data before submission:', formData);
    console.log('Summary: Date field specifically:', formData.date);
    
    setIsSubmitting(true);
    setSubmissionError(null);
    try {
      await onSubmit();
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionError(translations.booking.submissionError || 'An error occurred. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (isSubmitted) {
    return (
      <div className="py-8">
        <div className="mb-4 text-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24"
            className="w-16 h-16 text-green-600 mx-auto"
          >
            <path 
              fill="currentColor"
              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          {translations.booking.submitted}
        </h2>
        <p className="text-white text-center">
          {translations.booking.bookingSuccess}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">
        {translations.steps.reviewAndConfirm}
      </h2>

      <div className="space-y-4">
        {formData.selectedProduct && (
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-white">{translations.booking.selectProduct}</h3>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-white">
                  {formData.selectedProduct.name}
                  {formData.selectedProduct.quantity > 1 ? ` (${formData.selectedProduct.quantity}x)` : ''}
                </span>
                <p className="text-gray-400 text-sm mt-1">{formData.selectedProduct.description}</p>
              </div>
              {isDiscountEnabled && formData.selectedProduct.discountPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 line-through text-sm">
                    {formatCurrency(formData.selectedProduct.price * (formData.selectedProduct.quantity || 1))}
                  </span>
                  <span className="text-green-600 font-semibold">
                    {formatCurrency(formData.selectedProduct.discountPrice * (formData.selectedProduct.quantity || 1))}
                  </span>
                </div>
              ) : (
                <span className="text-white">
                  {formatCurrency(formData.selectedProduct.price * (formData.selectedProduct.quantity || 1))}
                </span>
              )}
            </div>
          </div>
        )}

        {MANDATORY_PRODUCTS.length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-white">{translations.booking.mandatoryServices}</h3>
            <ul className="space-y-2">
              {MANDATORY_PRODUCTS.map((product) => (
                <li key={product.id} className="flex justify-between items-start">
                  <div>
                    <span className="text-white">{product.name}</span>
                    <p className="text-gray-400 text-sm mt-1">{product.description}</p>
                  </div>
                  <span className="text-white">{formatCurrency(product.price)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {formData.selectedExtras && formData.selectedExtras.length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-white">{translations.booking.additionalServices}</h3>
            <ul className="space-y-2">
              {formData.selectedExtras.map((extra) => (
                <li key={extra.id} className="flex justify-between items-start">
                  <div>
                    <span className="text-white">{extra.name} {extra.quantity > 1 && `(${extra.quantity}x)`}</span>
                    <p className="text-gray-400 text-sm mt-1">{extra.description}</p>
                  </div>
                  {isDiscountEnabled && extra.discountPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 line-through text-sm">
                        {formatCurrency(extra.price * extra.quantity)}
                      </span>
                      <span className="text-green-600 font-semibold">
                        {formatCurrency(extra.discountPrice * extra.quantity)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-white">{formatCurrency(extra.price * extra.quantity)}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-white">{translations.booking.dateAndTime}</h3>
          <p className="text-white">{formData.date ? formData.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''} - {formData.timeSlot}</p>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-white">{translations.booking.personalInformation}</h3>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-white"><span className="text-gray-400">{translations.booking.firstName}:</span> {formData.personalInfo.firstName}</p>
            <p className="text-white"><span className="text-gray-400">{translations.booking.lastName}:</span> {formData.personalInfo.lastName}</p>
            {formData.personalInfo.company && (
              <p className="text-white"><span className="text-gray-400">{translations.booking.company}:</span> {formData.personalInfo.company}</p>
            )}
            <p className="text-white"><span className="text-gray-400">{translations.booking.street}:</span> {formData.personalInfo.street}</p>
            <p className="text-white"><span className="text-gray-400">{translations.booking.city}:</span> {formData.personalInfo.city}</p>
            <p className="text-white"><span className="text-gray-400">{translations.booking.email}:</span> {formData.personalInfo.email}</p>
            <p className="text-white"><span className="text-gray-400">{translations.booking.phone}:</span> {formData.personalInfo.phone}</p>
          </div>
        </div>

        {formData.note && (
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-white">{translations.booking.additionalNotes}</h3>
            <p className="text-white">{formData.note}</p>
          </div>
        )}

        <div className="border-t pt-4 mt-6">
          {isDiscountEnabled && savings > 0 && (
            <div className="flex justify-between items-center text-sm text-green-600 mb-2">
              <span>{translations.booking.discount.save.replace('{amount}', formatCurrency(savings))}</span>
            </div>
          )}
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span className="text-white">{translations.booking.total}</span>
              <div className="text-right">
                <span className={(isDiscountEnabled && savings > 0) ? 'text-green-600' : 'text-white'}>
                  {formatCurrency(total)}
                </span>
                <p className="text-gray-400 text-sm mt-1">
                  {translations.booking.pricesExcludeVAT}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={formData.termsAccepted}
            onChange={(e) => updateFormData({ termsAccepted: e.target.checked })}
            className="h-4 w-4 text-blue-600"
          />
          <label htmlFor="terms" className="text-sm text-white">
            {translations.booking.iAcceptThe}{' '}
            <button 
              onClick={() => setIsTermsModalOpen(true)}
              className="text-blue-600 hover:underline focus:outline-none"
            >
              {translations.booking.bookingTerms}
            </button>
          </label>
        </div>
      </div>

      {submissionError && (
        <div className="border border-red-500 bg-red-100 text-red-700 p-4 rounded-lg text-center">
          <p>{submissionError}</p>
          <p className="mt-2 text-sm">
            {translations.booking.contactSupport || 'If the problem persists, please email us at:'} {STUDIO_SETTINGS.emailSettings.adminEmail}
          </p>
        </div>
      )}

      {!isSubmitted && (
        <>
          <div className="flex justify-between mt-6">
            <button
              onClick={onBack}
              disabled={isSubmitting}
              className="px-4 py-2 border rounded-md text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {translations.common.back}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormComplete || isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? translations.booking.submitting : translations.booking.confirmBooking}
            </button>
          </div>

          <BookingTerms 
            isOpen={isTermsModalOpen} 
            onClose={() => setIsTermsModalOpen(false)} 
          />
        </>
      )}
    </div>
  );
};

export default Summary; 