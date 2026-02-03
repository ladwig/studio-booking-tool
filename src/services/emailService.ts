import { Resend } from 'resend';
import { BookingFormData } from '../types/booking';
import { STUDIO_SETTINGS, MANDATORY_PRODUCTS } from '../config/settings';
import { calculateTotal, calculateSavings, formatCurrency } from '../utils/priceCalculations';

const { adminEmail, notificationSubject } = STUDIO_SETTINGS.emailSettings;
const isDiscountEnabled = STUDIO_SETTINGS.discountMode.enabled;

// Create Resend client
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

// Helper to parse comma-separated email addresses into an array
const parseEmailAddresses = (emails: string): string[] => {
  return emails.split(',').map(email => email.trim()).filter(email => email.length > 0);
};

const formatDate = (date: Date | string) => {
  if (typeof date === 'string') {
    // Check if it's an ISO string and extract date parts manually
    if (date.includes('T') || date.includes('-')) {
      const datePart = date.split('T')[0]; // Get YYYY-MM-DD part
      const [yearStr, monthStr, dayStr] = datePart.split('-');
      const year = parseInt(yearStr);
      const month = parseInt(monthStr);
      const day = parseInt(dayStr);

      // Create date-only object using the extracted components
      const manualDate = new Date(year, month - 1, day);

      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Europe/Berlin'
      }).format(manualDate);
    }

    // Fallback: try to parse the date string directly
    const parsedDate = new Date(date);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Europe/Berlin'
    }).format(parsedDate);
  }

  // If it's already a Date object
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Europe/Berlin'
  }).format(date as Date);
};

export const sendBookingNotification = async (formData: BookingFormData) => {
  try {
    const total = calculateTotal(formData);
    const savings = calculateSavings(formData);

    // Create HTML content for the email
    const htmlContent = `
      <h2>New Studio Booking Request</h2>
      
      <h3>Booking Details</h3>
      <p><strong>Date:</strong> ${formatDate(formData.date!)}</p>
      <p><strong>Time:</strong> ${formData.timeSlot}</p>
      
      ${formData.selectedProduct ? `
        <h3>Selected Service</h3>
        <p>
          <strong>${formData.selectedProduct.name}</strong>
          ${formData.selectedProduct.quantity > 1 ? ` (${formData.selectedProduct.quantity}x)` : ''}<br>
          ${formData.selectedProduct.description}<br>
          Price: 
          ${isDiscountEnabled && formData.selectedProduct.discountPrice ?
          `<s>${formatCurrency(formData.selectedProduct.price * (formData.selectedProduct.quantity || 1))}</s> 
             <strong>${formatCurrency(formData.selectedProduct.discountPrice * (formData.selectedProduct.quantity || 1))}</strong>` :
          formatCurrency(formData.selectedProduct.price * (formData.selectedProduct.quantity || 1))
        }
        </p>
      ` : ''}

      ${MANDATORY_PRODUCTS.length > 0 ? `
        <h3>Mandatory Services</h3>
        <ul>
          ${MANDATORY_PRODUCTS.map(product => `
            <li>
              <strong>${product.name}</strong> - ${formatCurrency(product.price)}<br>
              ${product.description}
            </li>
          `).join('')}
        </ul>
      ` : ''}
      
      ${formData.selectedExtras && formData.selectedExtras.length > 0 ? `
        <h3>Additional Services</h3>
        <ul>
          ${formData.selectedExtras.map(extra => `
            <li>
              <strong>${extra.name}</strong>${extra.quantity > 1 ? ` (${extra.quantity}x)` : ''} - 
              ${isDiscountEnabled && extra.discountPrice ?
            `<s>${formatCurrency(extra.price * extra.quantity)}</s> 
                 <strong>${formatCurrency(extra.discountPrice * extra.quantity)}</strong>` :
            formatCurrency(extra.price * extra.quantity)
          }<br>
              ${extra.description}
            </li>
          `).join('')}
        </ul>
      ` : ''}
      
      <h3>Customer Information</h3>
      <p>
        <strong>Name:</strong> ${formData.personalInfo.firstName} ${formData.personalInfo.lastName}<br>
        ${formData.personalInfo.company ? `<strong>Company:</strong> ${formData.personalInfo.company}<br>` : ''}
        <strong>Address:</strong> ${formData.personalInfo.street}, ${formData.personalInfo.city}<br>
        <strong>Email:</strong> ${formData.personalInfo.email}<br>
        <strong>Phone:</strong> ${formData.personalInfo.phone}
      </p>
      
      ${formData.note ? `
        <h3>Additional Notes</h3>
        <p>${formData.note}</p>
      ` : ''}
      
      ${savings > 0 ? `
        <p style="color: green;"><strong>Savings: ${formatCurrency(savings)}</strong></p>
      ` : ''}
      <h3>Total: ${formatCurrency(total)}</h3>
      <p><small>All prices exclude VAT where applicable.</small></p>
    `;

    // Send admin notification email via Resend
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: parseEmailAddresses(adminEmail),
      subject: notificationSubject,
      html: htmlContent,
      replyTo: formData.personalInfo.email,
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in sendBookingNotification:', error);
    throw error;
  }
};

export const sendCustomerConfirmation = async (formData: BookingFormData) => {
  try {
    const total = calculateTotal(formData);
    const savings = calculateSavings(formData);

    // Create HTML content for customer confirmation email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Thank you for your booking request!</h2>
        
        <p>Dear ${formData.personalInfo.firstName} ${formData.personalInfo.lastName},</p>
        
        <p>We have received your studio booking request and will confirm availability and contact you within the next <strong>12 hours</strong>.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Your Booking Request Summary</h3>
          
          <h4 style="color: #555;">Booking Details</h4>
          <p><strong>Date:</strong> ${formatDate(formData.date!)}</p>
          <p><strong>Time:</strong> ${formData.timeSlot}</p>
          
          ${formData.selectedProduct ? `
            <h4 style="color: #555;">Selected Service</h4>
            <p>
              <strong>${formData.selectedProduct.name}</strong>
              ${formData.selectedProduct.quantity > 1 ? ` (${formData.selectedProduct.quantity}x)` : ''}<br>
              <em>${formData.selectedProduct.description}</em><br>
              Price: 
              ${isDiscountEnabled && formData.selectedProduct.discountPrice ?
          `<span style="text-decoration: line-through; color: #666;">${formatCurrency(formData.selectedProduct.price * (formData.selectedProduct.quantity || 1))}</span> 
                 <strong style="color: #16a34a;">${formatCurrency(formData.selectedProduct.discountPrice * (formData.selectedProduct.quantity || 1))}</strong>` :
          `<strong>${formatCurrency(formData.selectedProduct.price * (formData.selectedProduct.quantity || 1))}</strong>`
        }
            </p>
          ` : ''}

          ${MANDATORY_PRODUCTS.length > 0 ? `
            <h4 style="color: #555;">Included Services</h4>
            <ul style="margin: 0; padding-left: 20px;">
              ${MANDATORY_PRODUCTS.map(product => `
                <li style="margin-bottom: 8px;">
                  <strong>${product.name}</strong> - ${formatCurrency(product.price)}<br>
                  <em style="color: #666;">${product.description}</em>
                </li>
              `).join('')}
            </ul>
          ` : ''}
          
          ${formData.selectedExtras && formData.selectedExtras.length > 0 ? `
            <h4 style="color: #555;">Additional Services</h4>
            <ul style="margin: 0; padding-left: 20px;">
              ${formData.selectedExtras.map(extra => `
                <li style="margin-bottom: 8px;">
                  <strong>${extra.name}</strong>${extra.quantity > 1 ? ` (${extra.quantity}x)` : ''} - 
                  ${isDiscountEnabled && extra.discountPrice ?
            `<span style="text-decoration: line-through; color: #666;">${formatCurrency(extra.price * extra.quantity)}</span> 
                     <strong style="color: #16a34a;">${formatCurrency(extra.discountPrice * extra.quantity)}</strong>` :
            `<strong>${formatCurrency(extra.price * extra.quantity)}</strong>`
          }<br>
                  <em style="color: #666;">${extra.description}</em>
                </li>
              `).join('')}
            </ul>
          ` : ''}
          
          ${formData.note ? `
            <h4 style="color: #555;">Your Notes</h4>
            <p style="font-style: italic; color: #666;">"${formData.note}"</p>
          ` : ''}
          
          ${savings > 0 ? `
            <p style="color: #16a34a; font-weight: bold; margin: 15px 0;">You save: ${formatCurrency(savings)}</p>
          ` : ''}
          
          <div style="border-top: 2px solid #2563eb; padding-top: 15px; margin-top: 20px;">
            <h3 style="color: #2563eb; margin: 0;">Total: ${formatCurrency(total)}</h3>
            <p style="color: #666; font-size: 14px; margin: 5px 0 0 0;">All prices exclude VAT where applicable.</p>
          </div>
        </div>
        
        <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb;">
          <h4 style="color: #1e40af; margin-top: 0;">What happens next?</h4>
          <ul style="color: #374151; margin: 0; padding-left: 20px;">
            <li>We will check availability for your requested date and time</li>
            <li>You will receive a confirmation email within 12 hours</li>
            <li>If your preferred slot is unavailable, we'll suggest alternative times</li>
            <li>Payment details will be provided upon confirmation</li>
          </ul>
        </div>
        
        <p style="margin-top: 30px;">If you have any questions or need to make changes to your request, please don't hesitate to contact us.</p>
        
        <p>Best regards,<br>
        <strong>QS1 Studio</strong></p>
        
      </div>
    `;

    // Send customer confirmation email via Resend
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: formData.personalInfo.email,
      subject: 'Booking Request Confirmation - Studio A',
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in sendCustomerConfirmation:', error);
    throw error;
  }
}; 