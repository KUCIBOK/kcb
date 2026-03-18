import { useEffect, useState } from "react"

/**
 * Animated Kuzi mascot — eyes blink only, body fully static.
 * Image: 468×534px — eyelid positions calibrated from screenshot.
 */
export default function GatewayKuzi({ hover }) {
  const [blink, setBlink] = useState(false)

  // Blink every 3–4.5s: 0.18s close → 0.1s hold → 0.2s open
  useEffect(() => {
    let t
    const doBlink = () => {
      setBlink(true)
      setTimeout(() => setBlink(false), 280) // close + hold duration
      t = setTimeout(doBlink, 3000 + Math.random() * 1500)
    }
    t = setTimeout(doBlink, 2000)
    return () => clearTimeout(t)
  }, [])

  const eyelidBase = {
    position:        "absolute",
    pointerEvents:   "none",
    height:          "4.8%",
    width:           "13.5%",
    background:      "#5C2A0A",
    borderRadius:    "0 0 50% 50% / 0 0 100% 100%",
    transformOrigin: "50% 0%",
    transform:       `scaleY(${blink ? 1 : 0})`,
    transition:      `transform ${blink ? "0.18s" : "0.2s"} ease-in-out`,
  }

  return (
    <div className="relative w-full select-none">
      <img
        src="/images/KuziNew.png"
        alt="Kuzi"
        className="w-full h-auto"
        draggable={false}
        style={{
          filter:     "drop-shadow(0 16px 40px rgba(0,0,0,0.4))",
          transform:  hover ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.5s ease",
        }}
      />

      {/* Left eyelid — calibrated: x≈120-183px, y≈205px on 468×534 image */}
      <div style={{ ...eyelidBase, left: "25.5%", top: "37.5%" }} />

      {/* Right eyelid — calibrated: x≈248-311px, y≈205px */}
      <div style={{ ...eyelidBase, left: "52.5%", top: "37.5%" }} />
    </div>
  )
}
