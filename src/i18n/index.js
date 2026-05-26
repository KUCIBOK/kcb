import { useLang } from '../store/LangContext'

/**
 * Hook de traduction par namespace.
 * @param {object} translations — objet { fr: {...}, en: {...} }
 * @returns {object} traductions pour la langue courante (fallback fr)
 */
export function useT(translations) {
  const { lang } = useLang()
  return translations[lang] ?? translations.fr
}
