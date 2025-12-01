import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Common from './locales/en/common.json';
import Auth from './locales/en/auth.json';
import Account from './locales/en/account.json';
import Home from './locales/en/home.json';
import Battle from './locales/en/battle.json';
import Structures from './locales/en/structures.json';

const resources = {
  en: {
    common: Common,
    auth: Auth,
    account: Account,
    home: Home,
    battle: Battle,
    structures: Structures,
  },
};

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    resources,
    returnEmptyString: false,
    appendNamespaceToMissingKey: true,
    parseMissingKeyHandler: (key) => `🍋🍋🍋${key}`,
  });

export default i18next;
