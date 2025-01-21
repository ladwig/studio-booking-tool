'use client';

import { useState, useEffect } from 'react';
import { BookingFormData } from '../../types/booking';
import { useLanguage } from '../../contexts/LanguageContext';
import BookingTerms from '../BookingTerms';
import { STUDIO_SETTINGS } from '../../config/settings';

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
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isDiscountEnabled = STUDIO_SETTINGS.discountMode.enabled;

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const calculateTotal = () => {
    if (!isDiscountEnabled) {
      const productPrice = formData.selectedProduct?.price || 0;
      const extrasTotal = formData.selectedExtras?.reduce(
        (sum, extra) => sum + extra.price,
        0
      ) || 0;
      return productPrice + extrasTotal;
    } else {
      const productPrice = formData.selectedProduct?.discountPrice || formData.selectedProduct?.price || 0;
      const extrasTotal = formData.selectedExtras?.reduce(
        (sum, extra) => sum + (extra.discountPrice || extra.price),
        0
      ) || 0;
      return productPrice + extrasTotal;
    }
  };

  const calculateSavings = () => {
    const regularTotal = (formData.selectedProduct?.price || 0) +
      (formData.selectedExtras?.reduce((sum, extra) => sum + extra.price, 0) || 0);
    const discountTotal = calculateTotal();
    return regularTotal - discountTotal;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          {translations.booking.submitted}
        </h2>
        <p className="text-gray-600 text-center">
          {translations.booking.bookingSuccess}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {translations.steps.reviewAndConfirm}
      </h2>

      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">{translations.booking.selectProduct}</h3>
          <div className="flex justify-between items-center">
            <span>{formData.selectedProduct?.name}</span>
            {isDiscountEnabled && formData.selectedProduct?.discountPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 line-through text-sm">
                  {formatCurrency(formData.selectedProduct.price)}
                </span>
                <span className="text-green-600 font-semibold">
                  {formatCurrency(formData.selectedProduct.discountPrice)}
                </span>
              </div>
            ) : (
              <span>{formatCurrency(formData.selectedProduct?.price || 0)}</span>
            )}
          </div>
        </div>

        {formData.selectedExtras && formData.selectedExtras.length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">{translations.booking.additionalServices}</h3>
            <ul className="space-y-2">
              {formData.selectedExtras.map((extra) => (
                <li key={extra.id} className="flex justify-between items-center">
                  <span>{extra.name}</span>
                  {isDiscountEnabled && extra.discountPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 line-through text-sm">
                        {formatCurrency(extra.price)}
                      </span>
                      <span className="text-green-600 font-semibold">
                        {formatCurrency(extra.discountPrice)}
                      </span>
                    </div>
                  ) : (
                    <span>{formatCurrency(extra.price)}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">{translations.booking.dateAndTime}</h3>
          <p>{formData.date?.toLocaleDateString()} - {formData.timeSlot}</p>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">{translations.booking.personalInformation}</h3>
          <div className="grid grid-cols-2 gap-2">
            <p><span className="text-gray-600">{translations.booking.firstName}:</span> {formData.personalInfo.firstName}</p>
            <p><span className="text-gray-600">{translations.booking.lastName}:</span> {formData.personalInfo.lastName}</p>
            {formData.personalInfo.company && (
              <p><span className="text-gray-600">{translations.booking.company}:</span> {formData.personalInfo.company}</p>
            )}
            <p><span className="text-gray-600">{translations.booking.email}:</span> {formData.personalInfo.email}</p>
            <p><span className="text-gray-600">{translations.booking.phone}:</span> {formData.personalInfo.phone}</p>
          </div>
        </div>

        {formData.note && (
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">{translations.booking.additionalNotes}</h3>
            <p>{formData.note}</p>
          </div>
        )}

        <div className="border-t pt-4 mt-6">
          {isDiscountEnabled && calculateSavings() > 0 && (
            <div className="flex justify-between items-center text-sm text-green-600 mb-2">
              <span>{translations.booking.discount.save.replace('{amount}', formatCurrency(calculateSavings()))}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>{translations.booking.total}</span>
            <span className={isDiscountEnabled ? 'text-green-600' : ''}>
              {formatCurrency(calculateTotal())}
            </span>
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
          <label htmlFor="terms" className="text-sm text-gray-600">
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

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          {translations.common.back}
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.termsAccepted}
          className={`px-6 py-2 rounded-md text-white ${
            !isSubmitting && formData.termsAccepted
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? translations.booking.submitting : translations.booking.confirmBooking}
        </button>
      </div>

      <BookingTerms 
        isOpen={isTermsModalOpen} 
        onClose={() => setIsTermsModalOpen(false)} 
      />
    </div>
  );
};

export default Summary; 