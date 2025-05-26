import { NextResponse } from 'next/server';
import { sendBookingNotification, sendCustomerConfirmation } from '@/services/emailService';

export async function POST(request: Request) {
  try {
    console.log('Received booking submission request');
    const bookingData = await request.json();
    console.log('Booking data:', JSON.stringify(bookingData, null, 2));
    
    // Add detailed logging for date field
    console.log('Date field analysis:', {
      hasDateField: 'date' in bookingData,
      dateValue: bookingData.date,
      dateType: typeof bookingData.date,
      isNull: bookingData.date === null,
      isUndefined: bookingData.date === undefined,
      isEmpty: bookingData.date === ''
    });

    // Validate the booking data
    if (!bookingData.selectedProduct || !bookingData.date || !bookingData.timeSlot) {
      const missingFields = [];
      if (!bookingData.selectedProduct) missingFields.push('selectedProduct');
      if (!bookingData.date) missingFields.push('date');
      if (!bookingData.timeSlot) missingFields.push('timeSlot');
      
      console.log('Missing required booking information:', {
        product: !!bookingData.selectedProduct,
        date: !!bookingData.date,
        timeSlot: !!bookingData.timeSlot,
        missingFields
      });
      
      return NextResponse.json(
        { 
          error: `Missing required booking information: ${missingFields.join(', ')}`,
          missingFields 
        },
        { status: 400 }
      );
    }

    if (!bookingData.personalInfo?.email || !bookingData.personalInfo?.firstName) {
      console.log('Missing required personal information:', {
        email: !!bookingData.personalInfo?.email,
        firstName: !!bookingData.personalInfo?.firstName
      });
      return NextResponse.json(
        { error: 'Missing required personal information' },
        { status: 400 }
      );
    }

    // Verify environment variables
    console.log('Checking environment variables...');
    const requiredEnvVars = [
      'SMTP_HOST',
      'SMTP_PORT',
      'SMTP_USER',
      'SMTP_PASSWORD',
      'SMTP_FROM'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingEnvVars.length > 0) {
      console.error('Missing required environment variables:', missingEnvVars);
      return NextResponse.json(
        {
          error: 'Server configuration error',
          details: 'Missing required email configuration'
        },
        { status: 500 }
      );
    }

    // Log SMTP configuration (without sensitive data)
    console.log('SMTP Configuration:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER,
      from: process.env.SMTP_FROM,
    });

    console.log('Sending email notifications...');
    // Send email notifications
    try {
      // Send admin notification email
      await sendBookingNotification(bookingData);
      console.log('Admin email notification sent successfully');
      
      // Send customer confirmation email
      await sendCustomerConfirmation(bookingData);
      console.log('Customer confirmation email sent successfully');
      
    } catch (emailError) {
      console.error('Email error details:', emailError);
      const errorMessage = emailError instanceof Error ? emailError.message : 'Unknown email error';
      console.error('Full error details:', {
        message: errorMessage,
        stack: emailError instanceof Error ? emailError.stack : undefined,
        error: emailError
      });
      return NextResponse.json(
        {
          error: 'Failed to send email notifications',
          details: errorMessage
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Booking submitted successfully',
      success: true,
    });
  } catch (error) {
    console.error('Error submitting booking:', error);
    // Return more detailed error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Full error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      error: error
    });
    return NextResponse.json(
      {
        error: 'Failed to submit booking',
        details: errorMessage
      },
      { status: 500 }
    );
  }
} 