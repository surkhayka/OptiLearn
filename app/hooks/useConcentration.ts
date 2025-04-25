import { useState, useEffect } from "react";

export function useConcentration(enabled: boolean, intervalMs = 5000) {
  const [rate, setRate] = useState<number | null>(null);

  console.log("API URL is", process.env.NEXT_PUBLIC_API_URL);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (!enabled) {
      setRate(null);
      return;
    }
    const fetchRate = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rate`);
        const json = await res.json();
        setRate(json.concentrationRate);
      } catch (err) {
        console.error("Failed to fetch concentration rate", err);
      }
    };
    fetchRate();
    id = setInterval(fetchRate, intervalMs);
    return () => clearInterval(id);
  }, [enabled, intervalMs]);

  return rate;
}
