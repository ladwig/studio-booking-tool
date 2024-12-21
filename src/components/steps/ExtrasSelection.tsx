'use client';

import { BookingFormData, Extra } from '../../types/booking';
import { EXTRAS } from '../../config/settings';

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
  const toggleExtra = (extra: Extra) => {
    const isSelected = formData.selectedExtras.some((e) => e.id === extra.id);
    let newExtras;
    
    if (isSelected) {
      newExtras = formData.selectedExtras.filter((e) => e.id !== extra.id);
    } else {
      newExtras = [...formData.selectedExtras, extra];
    }
    
    updateFormData({ selectedExtras: newExtras });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Select Additional Services</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {EXTRAS.map((extra) => {
          const isSelected = formData.selectedExtras.some((e) => e.id === extra.id);
          return (
            <div
              key={extra.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => toggleExtra(extra)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{extra.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{extra.description}</p>
                </div>
                <p className="text-blue-600 font-bold">${extra.price}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-md text-gray-600 border border-gray-300 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ExtrasSelection; 