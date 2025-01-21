'use client';

import { BookingFormData, Product } from '../../types/booking';
import { PRODUCTS, STUDIO_SETTINGS } from '../../config/settings';
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
  const isDiscountEnabled = STUDIO_SETTINGS.discountMode.enabled;

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
            className={`product-card border rounded-lg cursor-pointer transition-all ${
              formData.selectedProduct?.id === product.id ? 'selected' : ''
            }`}
            onClick={() => handleProductSelect(product)}
          >
            <div className="p-4">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{product.description}</p>
              <div className="price-tag text-right">
                {isDiscountEnabled && product.discountPrice ? (
                  <div className="flex flex-col items-end">
                    <div className="text-sm text-green-600 font-medium mb-1">
                      {translations.booking.discount.label}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 line-through text-sm">
                        {formatCurrency(product.price)}
                      </span>
                      <span className="text-green-600 font-semibold">
                        {formatCurrency(product.discountPrice)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span>{formatCurrency(product.price)}</span>
                )}
              </div>
            </div>
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