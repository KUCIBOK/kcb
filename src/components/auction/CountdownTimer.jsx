import { useEffect, useState } from "react";

export const CountdownTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date();
    const end = new Date(endTime);
    const difference = end - now;

    if (difference <= 0) return { expired: true };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor(difference / (1000 * 60 * 60)) % 24,
      minutes: Math.floor(difference / 1000 / 60) % 60,
      seconds: Math.floor(difference / 1000) % 60,
      expired: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft.expired) {
    return <span className="text-red-400">Terminé</span>;
  }

  return (
    <div className="flex items-center space-x-1">
      {timeLeft.days > 0 && (
        <span className="bg-gray-700/80 text-white text-xs px-1.5 py-0.5 rounded">
          {timeLeft.days}j
        </span>
      )}
      <span className="bg-gray-700/80 text-white text-xs px-1.5 py-0.5 rounded">
        {String(timeLeft.hours).padStart(2, "0")}h
      </span>
      <span className="bg-gray-700/80 text-white text-xs px-1.5 py-0.5 rounded">
        {String(timeLeft.minutes).padStart(2, "0")}m
      </span>
      <span className="bg-gray-700/80 text-white text-xs px-1.5 py-0.5 rounded">
        {String(timeLeft.seconds).padStart(2, "0")}s
      </span>
    </div>
  );
};
