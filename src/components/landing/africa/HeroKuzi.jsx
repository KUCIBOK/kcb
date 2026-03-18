/**
 * Kuzi mascot with smoke particle effects for Africa hero.
 */
export default function HeroKuzi() {
  return (
    <div className="relative flex flex-col items-center -mb-16 sm:-mb-28 lg:-mb-40 z-10">
      {/* Smoke particles */}
      <div className="absolute w-[120px] sm:w-[180px] h-[80px] sm:h-[120px] bottom-[10%] -left-6 sm:-left-10 rounded-full pointer-events-none z-[1]"
        style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.07), transparent 70%)", animation: "smoke-drift-1 7s ease-in-out infinite" }}
      />
      <div className="absolute w-[150px] sm:w-[220px] h-[90px] sm:h-[140px] bottom-[5%] -right-[30px] sm:-right-[50px] rounded-full pointer-events-none z-[1]"
        style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.07), transparent 70%)", animation: "smoke-drift-2 9s ease-in-out infinite" }}
      />
      <div className="absolute w-[110px] sm:w-[160px] h-[70px] sm:h-[100px] bottom-[20%] left-[20%] rounded-full pointer-events-none z-[1]"
        style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.07), transparent 70%)", animation: "smoke-drift-3 5.5s ease-in-out infinite" }}
      />

      {/* Base glow */}
      <div className="absolute w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] -bottom-5 left-1/2 -translate-x-1/2 rounded-full pointer-events-none z-[1]"
        style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 40%, transparent 70%)", animation: "smoke-1 6s ease-in-out infinite" }}
      />
      <div className="absolute w-[280px] sm:w-[400px] h-[140px] sm:h-[200px] -bottom-10 left-1/2 -translate-x-1/2 rounded-full pointer-events-none z-[1]"
        style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, rgba(22,24,30,0.06) 30%, transparent 65%)", animation: "smoke-2 8s ease-in-out infinite" }}
      />

      <img
        src="/images/Kuzi.webp"
        alt="Kuzi — mascotte Kucibok"
        className="w-[180px] sm:w-[240px] md:w-[280px] lg:w-[340px] h-auto relative z-[2]"
        style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.4))" }}
      />
    </div>
  )
}
