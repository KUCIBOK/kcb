import React, { useEffect, useRef, useState } from "react";

export function InfiniteCarousel({ testimonials, speed = 40 }) {
  // speed: pixels per second
  const containerRef = useRef();
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  // Duplicate testimonials for seamless loop
  const items = [...testimonials, ...testimonials];

  useEffect(() => {
    const updateWidths = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        setContentWidth(containerRef.current.firstChild.scrollWidth);
      }
    };
    updateWidths();
    window.addEventListener("resize", updateWidths);
    return () => window.removeEventListener("resize", updateWidths);
  }, []);

  useEffect(() => {
    if (!contentWidth) return;
    let raf;
    let lastTime = performance.now();

    const animate = (now) => {
      const elapsed = (now - lastTime) / 1000;
      lastTime = now;
      setTranslateX((prev) => {
        let next = prev - speed * elapsed;
        if (Math.abs(next) >= contentWidth / 2) {
          // Reset for seamless loop
          return 0;
        }
        return next;
      });
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line
  }, [contentWidth, speed]);

  return (
    <div
      className="overflow-hidden w-full"
      ref={containerRef}
      style={{ height: 220, position: "relative" }}
    >
      <div
        className="flex gap-6"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: "none",
          width: contentWidth ? contentWidth : "auto",
        }}
      >
        {items.map((t, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-lg shadow-sm text-left min-w-[260px] max-w-xs flex flex-col justify-between px-6 py-5 mx-1"
            style={{ flex: "0 0 auto" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-11 h-11 rounded-full object-cover border border-white/20 shadow"
              />
              <div>
                <div className="font-semibold text-base text-white/90 leading-tight">{t.name}</div>
                <div className="text-xs text-white/50 leading-tight">{t.role}</div>
              </div>
            </div>
            <p className="italic text-sm text-white/70 mb-0 line-clamp-3">“{t.quote}”</p>
          </div>
        ))}
      </div>
    </div>
  );
}
