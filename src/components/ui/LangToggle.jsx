import { Globe } from 'lucide-react'
import { useLang } from '../../store/LangContext'

export default function LangToggle() {
  const { lang, setLang } = useLang()
  const next = lang === 'fr' ? 'en' : 'fr'

  return (
    <button
      onClick={() => setLang(next)}
      aria-label={`Switch to ${next.toUpperCase()}`}
      className="flex items-center gap-1.5 text-[10px] font-jetbrains tracking-[0.12em] uppercase text-kcb-pierre hover:text-white transition-colors duration-200 select-none"
    >
      <Globe className="w-3.5 h-3.5 flex-shrink-0" />
      <span>{next.toUpperCase()}</span>
    </button>
  )
}
