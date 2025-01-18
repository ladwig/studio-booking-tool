'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { useState } from 'react';

interface BookingTermsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Section {
  title: string;
  content: string;
}

const BOOKING_TERMS = {
  en: [
    {
      title: "Payment Terms",
      content: "Payments are accepted in cash or via bank transfer only. Payment is due upon receipt of invoice. Payment terms are specified in the invoice."
    },
    {
      title: "Cancellation Policy",
      content: "• Free cancellation: More than 48 hours before rental start\n• 50% of rental cost: Cancellation between 24 and 48 hours before rental start\n• 100% of rental cost: Cancellation on the day of rental"
    },
    {
      title: "Additional Services and Costs",
      content: "• Transport and Storage: Costs for transporting, storing, or picking up renter's equipment must be agreed upon with the studio team in advance.\n\n• Technical Services:\n- Support from the studio team for lighting setups, modifications, or equipment handling may incur additional charges\n- Extensive support beyond usual tasks may result in extra costs, to be discussed in advance\n- Studio restoration: Changes to the studio setup will incur additional fees\n- Special cleaning: Additional cleaning fees apply for excessive mess"
    },
    {
      title: "Power Usage",
      content: "The renter must keep power consumption within reasonable limits. Extraordinary power consumption may result in additional fees."
    },
    {
      title: "Rental Duration and Access",
      content: "• Rental duration is set according to the booked package\n• Any deviations must be communicated and confirmed in writing\n• Unauthorized extensions will be charged at regular hourly rates\n• Punctual departure is required\n• Late arrivals do not extend rental time\n• Load-in/out times must be coordinated with the studio team"
    },
    {
      title: "Liability and Equipment Usage",
      content: "• Renter is liable for all damages during rental period\n• Equipment must be used properly and returned in perfect condition\n• Pre-rental inspection is recommended\n• Studio is not liable for personal items or injuries\n• Cyclorama and props modifications only allowed with studio team present"
    },
    {
      title: "Insurance Requirements",
      content: "• Renter must have liability insurance\n• Proof of insurance may be requested\n• Studio is not liable for personal equipment damage\n• Additional equipment insurance is recommended"
    },
    {
      title: "General Conditions",
      content: "• No subletting without written consent\n• Professional conduct required\n• Force majeure clause applies\n• Confidentiality and data protection assured\n• This agreement represents the complete understanding between parties"
    }
  ],
  de: [
    {
      title: "Zahlungsbedingungen",
      content: "Zahlungen erfolgen ausschließlich in Bar oder per Banküberweisung. Der Betrag ist bei Rechnungsstellung fällig. Die Zahlungsfristen richten sich nach der gestellten Rechnung."
    },
    {
      title: "Stornierung",
      content: "• Kostenlose Stornierung: Mehr als 48 Stunden vor Mietbeginn\n• 50 % der Mietkosten: Stornierung zwischen 24 und 48 Stunden vor Mietbeginn\n• 100 % der Mietkosten: Stornierung am Tag des Mietbeginns"
    },
    {
      title: "Zusätzliche Services und Kosten",
      content: "• Transport- und Lagerung: Kosten für Equipment oder Material müssen vorab abgestimmt werden\n\n• Technische Dienstleistungen:\n- Unterstützung bei Licht-Setups und Equipment kann zusätzlich berechnet werden\n- Bei umfangreichem Support können Zusatzkosten entstehen\n- Wiederherstellung der Studioeinrichtung wird zusätzlich berechnet\n- Besondere Reinigung wird zusätzlich berechnet"
    },
    {
      title: "Stromnutzung",
      content: "Der Mieter ist dazu verpflichtet, den Stromverbrauch auf ein übliches Maß zu begrenzen. Für außergewöhnlich hohen Stromverbrauch behält sich der Vermieter vor, eine zusätzliche Gebühr zu erheben."
    },
    {
      title: "Mietdauer und Zugangsbedingungen",
      content: "• Die Mietzeit wird gemäß des gebuchten Pakets festgelegt\n• Abweichende Zeiträume müssen vorab kommuniziert werden\n• Jede Verlängerung ohne Absprache wird berechnet\n• Pünktliches Verlassen ist erforderlich\n• Verspätungen verlängern die Mietzeit nicht\n• Load-in/Out-Zeiten müssen abgestimmt werden"
    },
    {
      title: "Haftung und Nutzung von Equipment",
      content: "• Der Mieter haftet für alle Schäden während der Mietzeit\n• Equipment muss sachgemäß genutzt werden\n• Vorab-Inspektion wird empfohlen\n• Studio übernimmt keine Haftung für persönliche Gegenstände\n• Hohlkehle und Requisiten nur mit Studio-Team verändern"
    },
    {
      title: "Versicherungsanforderungen",
      content: "• Haftpflichtversicherung ist erforderlich\n• Nachweis kann angefordert werden\n• Studio haftet nicht für persönliches Equipment\n• Zusatzversicherung wird empfohlen"
    },
    {
      title: "Allgemeine Bedingungen",
      content: "• Keine Untervermietung ohne schriftliche Zustimmung\n• Professionelles Verhalten erforderlich\n• Höhere Gewalt Klausel gilt\n• Vertraulichkeit und Datenschutz zugesichert\n• Diese Vereinbarung stellt die gesamte Absprache dar"
    }
  ]
};

const HOUSE_RULES = {
  en: [
    {
      title: "General Rules",
      content: "• Cleanliness: Please leave the studio in a tidy condition\n• Cyclorama and Props: Modifications only with studio team\n• Maximum Capacity: Up to 10 people\n• Conduct: Respectful behavior required\n• Noise Levels: Coordinate loud productions"
    },
    {
      title: "Studio Usage",
      content: "• Access only during booked time\n• Plan for setup and teardown\n• Extensions charged per hour\n• Shared spaces need approval"
    },
    {
      title: "Technical Equipment",
      content: "• Handle equipment with care\n• Equipment list available in studio\n• Power usage within limits"
    },
    {
      title: "Liability",
      content: "• Responsible for damages\n• Liability insurance recommended"
    }
  ],
  de: [
    {
      title: "Allgemeine Regeln",
      content: "• Sauberkeit: Studio ordentlich hinterlassen\n• Hohlkehle und Requisiten: Änderungen nur mit Studioteam\n• Maximale Personenanzahl: Bis zu 10 Personen\n• Verhalten: Respektvoller Umgang erforderlich\n• Lärmbeschränkungen: Laute Produktionen abstimmen"
    },
    {
      title: "Nutzung des Studios",
      content: "• Zugang nur während gebuchter Zeit\n• Zeit für Auf- und Abbau einplanen\n• Verlängerungen werden berechnet\n• Gemeinschaftsbereiche nach Absprache"
    },
    {
      title: "Technik und Equipment",
      content: "• Sorgsamer Umgang mit Equipment\n• Equipmentliste im Studio verfügbar\n• Stromverbrauch im Rahmen halten"
    },
    {
      title: "Haftung",
      content: "• Verantwortlich für Schäden\n• Haftpflichtversicherung empfohlen"
    }
  ]
};

const BookingTerms = ({ isOpen, onClose }: BookingTermsProps) => {
  const { translations, language } = useLanguage();
  const [activeSection, setActiveSection] = useState<'terms' | 'rules'>('terms');

  if (!isOpen) return null;

  const currentTerms = BOOKING_TERMS[language as keyof typeof BOOKING_TERMS];
  const currentRules = HOUSE_RULES[language as keyof typeof HOUSE_RULES];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold mb-6">{translations.booking.bookingTerms}</h2>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveSection('terms')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeSection === 'terms'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {language === 'de' ? 'Buchungsbedingungen' : 'Booking Terms'}
          </button>
          <button
            onClick={() => setActiveSection('rules')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeSection === 'rules'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {language === 'de' ? 'Hausordnung' : 'House Rules'}
          </button>
        </div>

        <div className="space-y-6">
          {activeSection === 'terms' ? (
            currentTerms.map((section, index) => (
              <div key={index} className="border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-blue-400">{section.title}</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{section.content}</p>
              </div>
            ))
          ) : (
            currentRules.map((section, index) => (
              <div key={index} className="border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-blue-400">{section.title}</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{section.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingTerms; 