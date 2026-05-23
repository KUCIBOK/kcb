import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'kcb_lang'

const LangContext = createContext({ lang: 'fr', setLang: () => {} })

export const useLang = () => useContext(LangContext)

export function LangProvider({ children, defaultLang = 'fr' }) {
  const [lang, setLangState] = useState(() => localStorage.getItem(STORAGE_KEY) || defaultLang)

  const setLang = (l) => {
    localStorage.setItem(STORAGE_KEY, l)
    setLangState(l)
  }

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, defaultLang)
    }
  }, [defaultLang])

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}
