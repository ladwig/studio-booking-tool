import nodemailer from 'nodemailer';
import { BookingFormData } from '../types/booking';
import { STUDIO_SETTINGS } from '../config/settings';

const { adminEmail, notificationSubject } = STUDIO_SETTINGS.emailSettings;

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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

const calculateTotal = (formData: BookingFormData): number => {
  const productPrice = formData.selectedProduct?.price 
    ? formData.selectedProduct.price * (formData.selectedProduct.quantity || 1)
    : 0;
  const extrasTotal = formData.selectedExtras?.reduce(
    (sum, extra) => sum + (extra.price * (extra.quantity || 1)),
    0
  ) || 0;
  return productPrice + extrasTotal;
};

export const sendBookingNotification = async (formData: BookingFormData) => {
  try {
    console.log('Starting email notification process...');
    const transporter = createTransporter();

    const total = calculateTotal(formData);
    
    // Create HTML content for the email
    const htmlContent = `
      <h2>New Studio Booking Request</h2>
      
      <h3>Booking Details</h3>
      <p><strong>Date:</strong> ${formatDate(new Date(formData.date!))}</p>
      <p><strong>Time:</strong> ${formData.timeSlot}</p>
      
      <h3>Selected Service</h3>
      <p>
        <strong>${formData.selectedProduct?.name}</strong>${formData.selectedProduct && formData.selectedProduct.quantity > 1 ? ` (${formData.selectedProduct.quantity}x)` : ''}<br>
        ${formData.selectedProduct?.description}<br>
        ${formatCurrency(formData.selectedProduct?.price || 0)}${formData.selectedProduct && formData.selectedProduct.quantity > 1 ? ` x ${formData.selectedProduct.quantity} = ${formatCurrency((formData.selectedProduct.price || 0) * formData.selectedProduct.quantity)}` : ''}
      </p>
      
      ${formData.selectedExtras && formData.selectedExtras.length > 0 ? `
        <h3>Additional Services</h3>
        <ul>
          ${formData.selectedExtras.map(extra => `
            <li>
              <strong>${extra.name}</strong>${extra.quantity > 1 ? ` (${extra.quantity}x)` : ''} - ${formatCurrency(extra.price)}${extra.quantity > 1 ? ` x ${extra.quantity} = ${formatCurrency(extra.price * extra.quantity)}` : ''}<br>
              ${extra.description}
            </li>
          `).join('')}
        </ul>
      ` : ''}
      
      <h3>Customer Information</h3>
      <p>
        <strong>Name:</strong> ${formData.personalInfo.firstName} ${formData.personalInfo.lastName}<br>
        <strong>Email:</strong> ${formData.personalInfo.email}<br>
        <strong>Phone:</strong> ${formData.personalInfo.phone}
      </p>
      
      ${formData.note ? `
        <h3>Additional Notes</h3>
        <p>${formData.note}</p>
      ` : ''}
      
      <h3>Total: ${formatCurrency(total)}</h3>
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