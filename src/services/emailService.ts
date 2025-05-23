import nodemailer from 'nodemailer';
import { BookingFormData } from '../types/booking';
import { STUDIO_SETTINGS, MANDATORY_PRODUCTS } from '../config/settings';
import { calculateTotal, calculateSavings, formatCurrency } from '../utils/priceCalculations';

const { adminEmail, notificationSubject } = STUDIO_SETTINGS.emailSettings;
const isDiscountEnabled = STUDIO_SETTINGS.discountMode.enabled;

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  console.log('Creating SMTP transporter with config:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      // password is hidden
    },
  });

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    debug: true,
    logger: true
  });
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const sendBookingNotification = async (formData: BookingFormData) => {
  try {
    console.log('Starting email notification process...');
    const transporter = createTransporter();

    const total = calculateTotal(formData);
    const savings = calculateSavings(formData);
    
    // Create HTML content for the email
    const htmlContent = `
      <h2>New Studio Booking Request</h2>
      
      <h3>Booking Details</h3>
      <p><strong>Date:</strong> ${formatDate(new Date(formData.date!))}</p>
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

    console.log('Preparing to send email with config:', {
      from: process.env.SMTP_FROM || adminEmail,
      to: adminEmail,
      subject: notificationSubject,
      replyTo: formData.personalInfo.email,
    });

    // Send email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || adminEmail,
      to: adminEmail,
      subject: notificationSubject,
      html: htmlContent,
      replyTo: formData.personalInfo.email,
    });

    console.log('Email sent successfully:', info.response);
    return info;
  } catch (error) {
    console.error('Error in sendBookingNotification:', error);
    throw error;
  }
}; 