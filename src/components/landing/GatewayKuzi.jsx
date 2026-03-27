/**
 * Kuzi mascot — fully static, hover scale only.
 * Renders h-full w-auto so parent controls the height.
 */
export default function GatewayKuzi({ hover }) {
  return (
    <div className="h-full w-full flex items-end justify-center select-none">
      <img
        src="/images/Kuzi.gif"
        alt="Kuzi"
        className="h-full w-auto max-w-none"
        draggable={false}
        style={{
          filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.4))',
          transform: hover ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.5s ease',
        }}
      />
    </div>
  )
}
