'use client';

import './globals.css';
import { LanguageProvider } from '../contexts/LanguageContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Studio A Booking</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
