'use client';

import { BookingFormData, Extra, SelectedExtra } from '../../types/booking';
import { EXTRAS, STUDIO_SETTINGS } from '../../config/settings';
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
  const isDiscountEnabled = STUDIO_SETTINGS.discountMode.enabled;

  const handleExtraSelect = (extra: Extra, quantity: number = 1) => {
    const currentExtras = formData.selectedExtras || [];
    
    if (quantity === 0) {
      updateFormData({
        selectedExtras: currentExtras.filter((e) => e.id !== extra.id),
      });
    } else {
      const newExtra: SelectedExtra = {
        ...extra,
        quantity,
      };
      const existingIndex = currentExtras.findIndex((e) => e.id === extra.id);
      
      if (existingIndex >= 0) {
        updateFormData({
          selectedExtras: [
            ...currentExtras.slice(0, existingIndex),
            newExtra,
            ...currentExtras.slice(existingIndex + 1),
          ],
        });
      } else {
        updateFormData({
          selectedExtras: [...currentExtras, newExtra],
        });
      }
    }
  };

  const handleCardClick = (extra: Extra, isSelected: boolean) => {
    if (isSelected) {
      const currentExtras = formData.selectedExtras || [];
      updateFormData({
        selectedExtras: currentExtras.filter((e) => e.id !== extra.id),
      });
    } else {
      handleExtraSelect(extra);
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
      <h2 className="text-2xl font-bold text-white">
        {translations.booking.additionalServices}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {EXTRAS.map((extra) => {
          const selectedExtra = formData.selectedExtras?.find(
            (e) => e.id === extra.id
          );
          const isSelected = !!selectedExtra;
          const currentQuantity = (isSelected && selectedExtra?.quantity) || 0;
          const maxQuantity = extra.maxQuantity || 8;
          const hasDiscount = isDiscountEnabled && extra.discountPrice && extra.discountPrice < extra.price;
          const quantity = extra.allowQuantity ? currentQuantity || 1 : 1;

          return (
            <div
              key={extra.id}
              className={`extra-card border rounded-lg cursor-pointer transition-all ${
                isSelected ? 'selected' : ''
              }`}
              onClick={() => handleCardClick(extra, isSelected)}
            >
              <div className="p-4">
                <div>
                  <h3 className="font-semibold text-lg text-white">{extra.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{extra.description}</p>
                </div>
                <div className="flex justify-between items-end mt-4">
                  {extra.allowQuantity && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        value={currentQuantity}
                        onChange={(e) => handleExtraSelect(extra, Number(e.target.value))}
                        className="block w-16 text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white bg-transparent"
                      >
                        <option value="0" className="bg-gray-800">0</option>
                        {Array.from({ length: maxQuantity }, (_, i) => i + 1).map((num) => (
                          <option key={num} value={num} className="bg-gray-800">
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="price-tag">
                    {hasDiscount ? (
                      <div className="flex flex-col items-end">
                        <div className="text-sm text-green-600 font-medium mb-1">
                          {translations.booking.discount.label}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 line-through text-sm">
                            {formatCurrency(extra.price * quantity)}
                          </span>
                          <span className="text-green-600 font-semibold">
                            {formatCurrency(extra.discountPrice! * quantity)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-white">{formatCurrency(extra.price * quantity)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-md text-white hover:bg-gray-100"
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