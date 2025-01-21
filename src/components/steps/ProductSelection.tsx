'use client';

import { BookingFormData, Product, SelectedProduct } from '../../types/booking';
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

  const handleProductSelect = (product: Product, quantity: number = 1) => {
    if (quantity === 0) {
      updateFormData({ selectedProduct: undefined });
    } else {
      const selectedProduct: SelectedProduct = {
        ...product,
        quantity,
        // Update the duration based on quantity for products that allow quantity
        duration: product.allowQuantity ? product.duration * quantity : product.duration
      };
      updateFormData({ selectedProduct: selectedProduct });
    }
  };

  const handleQuantityChange = (product: Product, quantity: number) => {
    handleProductSelect(product, quantity);
  };

  const handleCardClick = (product: Product, isSelected: boolean) => {
    if (isSelected) {
      updateFormData({ selectedProduct: undefined });
    } else {
      handleProductSelect(product);
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
        {translations.booking.selectProduct}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PRODUCTS.map((product) => {
          const selectedProduct = formData.selectedProduct;
          const isSelected = selectedProduct?.id === product.id;
          const currentQuantity = (isSelected && selectedProduct?.quantity) || 0;
          const maxQuantity = product.maxQuantity || 8;
          const hasDiscount = isDiscountEnabled && product.discountPrice && product.discountPrice < product.price;
          const quantity = product.allowQuantity ? currentQuantity || 1 : 1;

          return (
            <div
              key={product.id}
              className={`product-card border rounded-lg cursor-pointer transition-all ${
                isSelected ? 'selected' : ''
              }`}
              onClick={() => handleCardClick(product, isSelected)}
            >
              <div className="p-4">
                <div>
                  <h3 className="font-semibold text-lg text-white">{product.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{product.description}</p>
                </div>
                <div className="flex justify-between items-end mt-4">
                  {product.allowQuantity && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        value={currentQuantity}
                        onChange={(e) => handleQuantityChange(product, Number(e.target.value))}
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
                            {formatCurrency(product.price * quantity)}
                          </span>
                          <span className="text-green-600 font-semibold">
                            {formatCurrency(product.discountPrice! * quantity)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-white">{formatCurrency(product.price * quantity)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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