import { useState, useEffect } from "react";

export function useTiredness(enabled: boolean, intervalMs = 1000) {
  const [rate, setRate] = useState<number | null>(null);

  console.log("Tiredness API URL is", process.env.NEXT_PUBLIC_API_URL);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (!enabled) {
      setRate(null);
      return;
    }
    const fetchRate = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tiredness`);
        const json = await res.json();
        setRate(json.tirednessRate);
      } catch (err) {
        console.error("Failed to fetch tiredness rate", err);
      }
    };
    fetchRate();
    id = setInterval(fetchRate, intervalMs);
    return () => clearInterval(id);
  }, [enabled, intervalMs]);

  return rate;
}
