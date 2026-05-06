// Import Dependencies
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Local Imports
import { defaultTheme } from "configs/theme.config";

// ----------------------------------------------------------------------

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: defaultTheme.fallbackLang,
    lng: defaultTheme.defaultLang,
    supportedLngs: ["en"],
    ns: ["translations"],
    defaultNS: "translations",
    interpolation: {
      escapeValue: false,
    },
    lowerCaseLng: true,
    debug: false,
  }).languages = ["en"];

export default i18n
