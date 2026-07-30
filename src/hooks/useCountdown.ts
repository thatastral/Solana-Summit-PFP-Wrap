import { useEffect, useState } from "react";

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculate(targetIso: string): Countdown {
  const diff = new Date(targetIso).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export function useCountdown(targetIso: string): Countdown {
  const [value, setValue] = useState(() => calculate(targetIso));

  useEffect(() => {
    const timer = setInterval(() => setValue(calculate(targetIso)), 1000);
    return () => clearInterval(timer);
  }, [targetIso]);

  return value;
}
