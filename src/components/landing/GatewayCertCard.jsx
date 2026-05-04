/**
 * Animated KCB certification card for the Gateway Global side.
 * Simulates a real Kucibok Bridge certificate being authenticated.
 */
export default function GatewayCertCard() {
  return (
    <div
      className="relative w-[280px] md:w-[300px]"
      style={{ animation: 'kcb-float-1 4s ease-in-out infinite' }}
    >
      {/* Outer glow */}
      <div
        className="absolute -inset-4 rounded-sm pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(168,176,188,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Card */}
      <div
        className="relative border border-kcb-silver/[0.15] bg-kcb-noir-deep overflow-hidden"
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)' }}
      >
        {/* Scan line animation */}
        <div
          className="absolute left-0 w-full h-[2px] pointer-events-none z-10"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(168,176,188,0.5), transparent)',
            animation: 'cert-scan 3.5s ease-in-out infinite',
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-kcb-silver/[0.08]">
          <div className="flex items-center gap-2.5">
            <img src="/images/kucibok-white-logo.svg" alt="" className="w-5 h-5 opacity-70" />
            <span className="font-jetbrains text-[8px] tracking-[0.2em] text-kcb-silver/70 uppercase">
              KCB Standard
            </span>
          </div>
          <div className="font-jetbrains text-[7px] tracking-[0.1em] text-kcb-silver/40">v2.1</div>
        </div>

        {/* Artwork preview area */}
        <div className="relative h-[130px] overflow-hidden bg-kcb-ardoise-cool/60">
          {/* Abstract artwork stripes — stylised */}
          <div className="absolute inset-0 flex">
            <div
              className="flex-1"
              style={{ background: 'linear-gradient(160deg, #2a1f0e 0%, #3d2b10 100%)' }}
            />
            <div
              className="flex-[0.6]"
              style={{ background: 'linear-gradient(160deg, #1a2030 0%, #0f1520 100%)' }}
            />
            <div
              className="flex-[0.8]"
              style={{ background: 'linear-gradient(160deg, #201510 0%, #2e1c0c 100%)' }}
            />
          </div>
          {/* Subtle geometric shapes suggesting abstract art */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-6 left-8 w-16 h-16 rounded-full border border-kcb-or/30" />
            <div className="absolute bottom-4 right-6 w-10 h-10 border border-kcb-silver/20 rotate-45" />
            <div className="absolute top-10 right-16 w-6 h-6 bg-kcb-or/20 rounded-full" />
          </div>
          {/* Overlay gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, transparent 60%, rgba(8,12,20,0.9) 100%)',
            }}
          />
          {/* Certification stamp */}
          <div className="absolute bottom-3 right-3 border border-kcb-silver/20 px-2 py-0.5">
            <span className="font-jetbrains text-[6px] tracking-[0.2em] text-kcb-silver/50 uppercase">
              Certified
            </span>
          </div>
        </div>

        {/* KCB ID */}
        <div className="px-5 pt-4 pb-2 border-b border-kcb-silver/[0.06]">
          <div className="font-jetbrains text-[9px] tracking-[0.12em] text-kcb-silver/40 mb-1 uppercase">
            Kucibok ID
          </div>
          <div className="font-jetbrains text-[14px] tracking-[0.08em] text-kcb-or font-medium">
            KCB-8B4F2A1C
          </div>
        </div>

        {/* Fields */}
        <div className="px-5 py-3 space-y-2">
          {[
            { label: 'Artist', value: 'Ibrahim Maïga' },
            { label: 'Title', value: 'Harmattan Series #4' },
            { label: 'Year', value: '2024' },
            { label: 'Origin', value: 'Dakar, Sénégal' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-baseline justify-between">
              <span className="font-jetbrains text-[7px] tracking-[0.12em] text-kcb-silver/35 uppercase w-12 flex-shrink-0">
                {label}
              </span>
              <span className="font-dm-sans text-[10px] text-kcb-silver/70 text-right">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Status bar */}
        <div className="flex items-center gap-2.5 px-5 py-3 border-t border-kcb-silver/[0.07] bg-kcb-ardoise-cool/30">
          <div
            className="w-2 h-2 rounded-full bg-[#86c586] flex-shrink-0"
            style={{ animation: 'cert-pulse 2.5s ease-in-out infinite' }}
          />
          <span className="font-jetbrains text-[8px] tracking-[0.16em] text-[#86c586] uppercase">
            Authenticated
          </span>
          <div className="ml-auto font-jetbrains text-[7px] text-kcb-silver/30">14.03.2026</div>
        </div>
      </div>

      {/* Bottom reflection */}
      <div
        className="absolute -bottom-6 left-4 right-4 h-6 opacity-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(168,176,188,0.08), transparent)',
          filter: 'blur(4px)',
        }}
      />
    </div>
  )
}
