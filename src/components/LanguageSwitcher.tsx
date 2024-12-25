'use client';

import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex space-x-2 bg-white rounded-lg shadow-md p-1">
        <button
          onClick={() => setLanguage('en')}
          className={`px-2 py-1 rounded ${
            language === 'en'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('de')}
          className={`px-2 py-1 rounded ${
            language === 'de'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          DE
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher; 