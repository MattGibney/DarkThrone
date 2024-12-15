// import all namespaces (for the default language, only)
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

export const fallbackNS = 'fallback';

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(resourcesToBackend((language: string, namespace:string ) => import(`../../../libs/locales/${language}/${namespace}.json`)))
  .init({
    debug: false,
    fallbackLng: 'en-GB',
    fallbackNS,
    supportedLngs: ['en-GB', 'en-US', 'en'],
    ns: [
        'common',
        'attack',
        'auth',
        'bank',
        'errors',
        'structures',
        'training',
        'units',
        'upgrades',
    ],
    interpolation: {
      escapeValue: false // react already safes from xss
    },
  });

export default i18next;