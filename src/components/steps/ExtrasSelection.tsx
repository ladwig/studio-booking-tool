'use client';

import { BookingFormData, Extra } from '../../types/booking';
import { EXTRAS } from '../../config/settings';
import { useLanguage } from '../../contexts/LanguageContext';

interface ExtrasSelectionProps {
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const ExtrasSelection = ({
  formData,
  updateFormData,
  onNext,
  onBack,
}: ExtrasSelectionProps) => {
  const { translations } = useLanguage();

  const handleExtraToggle = (extra: Extra) => {
    const currentExtras = formData.selectedExtras || [];
    const isSelected = currentExtras.some((e) => e.id === extra.id);

    if (isSelected) {
      updateFormData({
        selectedExtras: currentExtras.filter((e) => e.id !== extra.id),
      });
    } else {
      updateFormData({
        selectedExtras: [...currentExtras, extra],
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {translations.booking.additionalServices}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {EXTRAS.map((extra) => {
          const isSelected = formData.selectedExtras?.some(
            (e) => e.id === extra.id
          );
          return (
            <div
              key={extra.id}
              className={`extra-card border rounded-lg cursor-pointer transition-all ${
                isSelected ? 'selected' : ''
              }`}
              onClick={() => handleExtraToggle(extra)}
            >
              <div className="p-4">
                <h3 className="font-semibold text-lg">{extra.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{extra.description}</p>
                <p className="price-tag">{formatCurrency(extra.price)}</p>
              </div>
            </div>
          );
        })}
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
          className="px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          {translations.common.next}
        </button>
      </div>
    </div>
  );
};

export default ExtrasSelection; 