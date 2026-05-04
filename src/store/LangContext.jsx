import { createContext, useContext, useState } from 'react'

const LangContext = createContext({ lang: 'fr', setLang: () => {} })

export const useLang = () => useContext(LangContext)

export function LangProvider({ children, defaultLang = 'fr' }) {
  const [lang, setLang] = useState(defaultLang)
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}
