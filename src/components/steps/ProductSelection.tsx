'use client';

import { BookingFormData, Product } from '../../types/booking';
import { PRODUCTS } from '../../config/settings';
import { useLanguage } from '../../contexts/LanguageContext';

interface ProductSelectionProps {
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
  onNext: () => void;
}

const ProductSelection = ({
  formData,
  updateFormData,
  onNext,
}: ProductSelectionProps) => {
  const { translations } = useLanguage();

  const handleProductSelect = (product: Product) => {
    updateFormData({ selectedProduct: product });
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
        {translations.booking.selectProduct}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PRODUCTS.map((product) => (
          <div
            key={product.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              formData.selectedProduct?.id === product.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleProductSelect(product)}
          >
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{product.description}</p>
            <p className="text-blue-600 font-bold mt-2">{formatCurrency(product.price)}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <button
          onClick={onNext}
          disabled={!formData.selectedProduct}
          className={`px-6 py-2 rounded-md text-white ${
            formData.selectedProduct
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {translations.common.next}
        </button>
      </div>
    </div>
  );
};

export default ProductSelection; 