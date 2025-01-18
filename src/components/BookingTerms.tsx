'use client';

import { useLanguage } from '../contexts/LanguageContext';

interface BookingTermsProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingTerms = ({ isOpen, onClose }: BookingTermsProps) => {
  const { translations, language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="modal-close"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold mb-4">
          {translations.booking.bookingTerms}
        </h2>
        
        <div className="space-y-4">
          {language === 'de' ? (
            <>
              <h3 className="text-lg font-semibold">Stornierungsbedingungen</h3>
              <p className="text-gray-300">
                Bei Stornierung bis zu 48 Stunden vor dem gebuchten Termin wird keine Gebühr erhoben.
                Bei späteren Stornierungen oder Nichterscheinen wird der volle Betrag in Rechnung gestellt.
              </p>
              
              <h3 className="text-lg font-semibold">Zahlungsbedingungen</h3>
              <p className="text-gray-300">
                Die Zahlung erfolgt nach der Session. Wir akzeptieren Barzahlung und Überweisung.
              </p>
              
              <h3 className="text-lg font-semibold">Haftung</h3>
              <p className="text-gray-300">
                Der Kunde haftet für Schäden, die durch unsachgemäße Nutzung der Ausrüstung entstehen.
                Das Studio übernimmt keine Haftung für persönliche Gegenstände.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold">Cancellation Policy</h3>
              <p className="text-gray-300">
                No fee will be charged for cancellations up to 48 hours before the booked appointment.
                For later cancellations or no-shows, the full amount will be charged.
              </p>
              
              <h3 className="text-lg font-semibold">Payment Terms</h3>
              <p className="text-gray-300">
                Payment is due after the session. We accept cash and bank transfer.
              </p>
              
              <h3 className="text-lg font-semibold">Liability</h3>
              <p className="text-gray-300">
                The client is liable for damages caused by improper use of equipment.
                The studio assumes no liability for personal belongings.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingTerms; 