import { useEffect, useRef, useState } from "react"

/**
 * Animated Kuzi mascot for Gateway Africa side.
 * 6-second phase loop: idle → engage → welcome → energy → settle
 * Animations: breathing, sway, blink (JS-timed), phase transforms, bounce.
 * Image: 468×534px — all overlay positions are percentage-based on this ratio.
 */

const PHASES      = ["idle", "engage", "welcome", "energy", "settle"]
const PHASE_MS    = [1200,   1200,     2000,      1200,     1400]

// Per-phase visual style applied via CSS transition
const PHASE_STYLE = {
  idle:    { rotate: "1.5deg",  ty: "0px",  brightness: 1,    scale: 1    },
  engage:  { rotate: "-1deg",   ty: "-3px", brightness: 1.05, scale: 1    },
  welcome: { rotate: "-3.5deg", ty: "-5px", brightness: 1.08, scale: 1.01 },
  energy:  { rotate: "0deg",    ty: "-6px", brightness: 1.15, scale: 1.03 },
  settle:  { rotate: "1deg",    ty: "-2px", brightness: 1.02, scale: 1    },
}

export default function GatewayKuzi({ hover }) {
  const [phaseIdx, setPhaseIdx]   = useState(0)
  const [blink,    setBlink]      = useState(false)   // true = eyes closed
  const [bounce,   setBounce]     = useState(false)   // true = energy jump active
  const phaseRef = useRef(0)
  const phase    = PHASES[phaseIdx]
  const ps       = PHASE_STYLE[phase]

  // ── Phase cycle (6 s total) ─────────────────────────────────────────────
  useEffect(() => {
    let t
    const tick = () => {
      phaseRef.current = (phaseRef.current + 1) % PHASES.length
      const next = phaseRef.current
      setPhaseIdx(next)

      // Trigger bounce when entering energy phase
      if (PHASES[next] === "energy") {
        setBounce(true)
        setTimeout(() => setBounce(false), 700)
      }

      t = setTimeout(tick, PHASE_MS[next])
    }
    t = setTimeout(tick, PHASE_MS[0])
    return () => clearTimeout(t)
  }, [])

  // ── Blink cycle (3–4.5 s intervals) ────────────────────────────────────
  useEffect(() => {
    let t
    const doBlink = () => {
      setBlink(true)                                   // close  0.2 s
      setTimeout(() => setBlink(false), 300)           // hold 0.1 s + open 0.2 s
      t = setTimeout(doBlink, 3000 + Math.random() * 1500)
    }
    t = setTimeout(doBlink, 2200)
    return () => clearTimeout(t)
  }, [])

  // ── Sway animation name (pause during bounce) ──────────────────────────
  const swayAnim = bounce
    ? "kuzi-bounce 0.38s cubic-bezier(0.36,0.07,0.19,0.97) 2"
    : "kuzi-sway 2.6s ease-in-out infinite"

  return (
    <div className="relative w-full select-none">

      {/* Layer 1 — breathing (vertical bob) */}
      <div style={{ animation: "kuzi-breathe 3.5s ease-in-out infinite" }}>

        {/* Layer 2 — sway / bounce */}
        <div style={{ animation: swayAnim }}>

          {/* Layer 3 — phase transform (head tilt, brightness) */}
          <div
            className="relative"
            style={{
              transform:  `rotate(${ps.rotate}) translateY(${ps.ty}) scale(${ps.scale})`,
              filter:     `brightness(${ps.brightness})`,
              transition: "transform 0.65s cubic-bezier(0.34,1.56,0.64,1), filter 0.45s ease",
            }}
          >
            {/* Character image */}
            <img
              src="/images/KuziNew.png"
              alt="Kuzi"
              className="w-full h-auto"
              draggable={false}
              style={{
                filter:     "drop-shadow(0 16px 40px rgba(0,0,0,0.45))",
                transform:  hover ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.5s ease",
              }}
            />

            {/* ── Left eyelid overlay ──
                Image 468×534 — left eye approx x:120-185, y:210-232
                → left 25.6%, top 39.3%, w 13.9%, h 4.1%            */}
            <div
              className="absolute pointer-events-none"
              style={{
                left:            "25.5%",
                top:             "39%",
                width:           "14%",
                height:          "4.5%",
                background:      "#5C2A0A",
                borderRadius:    "0 0 50% 50% / 0 0 100% 100%",
                transformOrigin: "50% 0%",
                transform:       `scaleY(1)`,
              }}
            />

            {/* ── Right eyelid overlay ──
                Right eye approx x:245-310, y:210-232
                → left 52.3%, top 39.3%, w 13.9%, h 4.1%            */}
            <div
              className="absolute pointer-events-none"
              style={{
                left:            "52%",
                top:             "39%",
                width:           "14%",
                height:          "4.5%",
                background:      "#5C2A0A",
                borderRadius:    "0 0 50% 50% / 0 0 100% 100%",
                transformOrigin: "50% 0%",
                transform:       `scaleY(1)`,
              }}
            />

            {/* ── Eye shine — brightens during energy phase ── */}
            {(phase === "energy" || phase === "welcome") && (
              <>
                {/* Left eye highlight */}
                <div
                  className="absolute pointer-events-none rounded-full"
                  style={{
                    left:       "28%",
                    top:        "39.5%",
                    width:      "3%",
                    height:     "2%",
                    background: "rgba(255,255,255,0.55)",
                    animation:  "kuzi-shine 0.6s ease-in-out infinite alternate",
                    filter:     "blur(1px)",
                  }}
                />
                {/* Right eye highlight */}
                <div
                  className="absolute pointer-events-none rounded-full"
                  style={{
                    left:       "55%",
                    top:        "39.5%",
                    width:      "3%",
                    height:     "2%",
                    background: "rgba(255,255,255,0.55)",
                    animation:  "kuzi-shine 0.6s ease-in-out infinite alternate",
                    filter:     "blur(1px)",
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
