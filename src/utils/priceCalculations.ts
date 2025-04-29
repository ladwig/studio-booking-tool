import { BookingFormData, SelectedProduct, SelectedExtra } from '../types/booking';
import { STUDIO_SETTINGS, MANDATORY_PRODUCTS } from '../config/settings';

const isDiscountEnabled = STUDIO_SETTINGS.discountMode.enabled;

/**
 * Calculates the price for a single item (product or extra) considering quantity and discounts.
 */
const calculateItemPrice = (item: SelectedProduct | SelectedExtra, useDiscount: boolean): number => {
  const quantity = item.quantity || 1;
  if (useDiscount && item.discountPrice) {
    return item.discountPrice * quantity;
  }
  return item.price * quantity;
};

/**
 * Calculates the regular price for a single item (product or extra) considering quantity.
 */
const calculateRegularItemPrice = (item: SelectedProduct | SelectedExtra): number => {
  const quantity = item.quantity || 1;
  return item.price * quantity;
};

/**
 * Calculates the total booking price considering selected product, extras, mandatory products, quantities, and discounts.
 */
export const calculateTotal = (formData: BookingFormData): number => {
  let total = 0;

  // Add selected product price
  if (formData.selectedProduct) {
    total += calculateItemPrice(formData.selectedProduct, isDiscountEnabled);
  }

  // Add extras total
  if (formData.selectedExtras?.length) {
    total += formData.selectedExtras.reduce((sum, extra) => {
      return sum + calculateItemPrice(extra, isDiscountEnabled);
    }, 0);
  }

  // Add mandatory products (these typically don't have quantity or discounts in this setup)
  total += MANDATORY_PRODUCTS.reduce((sum, product) => sum + product.price, 0);

  return total;
};

/**
 * Calculates the total savings if discounts are applied.
 */
export const calculateSavings = (formData: BookingFormData): number => {
  if (!isDiscountEnabled) {
    return 0;
  }

  let regularTotal = 0;

  // Regular product price
  if (formData.selectedProduct) {
    regularTotal += calculateRegularItemPrice(formData.selectedProduct);
  }

  // Regular extras price
  regularTotal += formData.selectedExtras?.reduce(
    (sum, extra) => sum + calculateRegularItemPrice(extra),
    0
  ) || 0;
  
  // Add mandatory products price to regular total as well
  regularTotal += MANDATORY_PRODUCTS.reduce((sum, product) => sum + product.price, 0);


  const discountTotal = calculateTotal(formData); // Uses the function that considers discounts
  
  const savings = regularTotal - discountTotal;
  return savings > 0 ? savings : 0; // Ensure savings are not negative
};

/**
 * Formats a number as currency (EUR).
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}; 