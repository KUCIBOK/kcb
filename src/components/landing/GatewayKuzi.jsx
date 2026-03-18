/**
 * Kuzi mascot — fully static, hover scale only.
 */
export default function GatewayKuzi({ hover }) {
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
    </div>
  )
}
