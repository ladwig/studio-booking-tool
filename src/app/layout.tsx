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
        <style>{`
          :root {
            --font-family: inherit;
            --text-color: inherit;
            --primary-color: #2563eb;
            --primary-hover-color: #1d4ed8;
          }

          body {
            font-family: var(--font-family);
            color: var(--text-color);
          }

          * {
            font-family: inherit;
          }
        `}</style>
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
