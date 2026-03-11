/**
 * Monospace label with decorative line, used as section header accent.
 * @param {object} props
 * @param {string} props.text - Label text
 */
export default function SectionLabel({ text }) {
  return (
    <div className="inline-flex items-center gap-4 font-jetbrains text-[10px] tracking-[0.25em] uppercase text-[var(--accent,var(--kcb-or))]">
      <span className="block w-12 h-px bg-[var(--accent,var(--kcb-or))]" />
      {text}
    </div>
  )
}
