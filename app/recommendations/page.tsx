"use client";
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Coffee, Lightbulb } from "lucide-react"
import { useState, useEffect } from 'react';

export default function Recommendations() {
  const [breakRecs, setBreakRecs] = useState<string[]>([]);
  const [prodTips, setProdTips] = useState<string[]>([]);
  const [timePatterns, setTimePatterns] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const stored = localStorage.getItem('sessionHistory');
    const sessions = stored ? JSON.parse(stored) : [];
    (async () => {
      try {
        const resp = await fetch('http://localhost:5001/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session: sessions }),
        });
        const { analysis } = await resp.json();
        if (!resp.ok) console.error('Analyzer error', analysis);
        const text = typeof analysis === 'string' ? analysis : String(analysis);
        const lines = text.split('\n');
        let current: 'break' | 'prod' | 'time' | null = null;
        const br: string[] = [];
        const pt: string[] = [];
        const tp: string[] = [];
        for (const l of lines) {
          const line = l.trim();
          if (/^break recommendations/i.test(line)) current = 'break';
          else if (/^productivity tips/i.test(line)) current = 'prod';
          else if (/^session time patterns/i.test(line)) current = 'time';
          else if (/^[-*]\s+/.test(line)) {
            const item = line.replace(/^[-*]\s+/, '');
            if (current === 'break') br.push(item);
            else if (current === 'prod') pt.push(item);
            else if (current === 'time') tp.push(item);
          }
        }
        setBreakRecs(br);
        setProdTips(pt);
        setTimePatterns(tp);
      } catch (err) {
        console.error('Fetch analysis failed', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-center">Personalized Recommendations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-[#404457] border-none rounded-3xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-6 w-6 text-[#ffa601]" />
            <h2 className="text-xl font-medium">Optimal Study Time</h2>
          </div>
          {loading ? (
            <p className="mb-4">Loading session time patterns...</p>
          ) : timePatterns.length > 0 ? (
            <ul className="list-disc list-inside mb-6 space-y-2">
              {timePatterns.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          ) : (
            <p className="mb-4">No session time patterns available.</p>
          )}
          <p className="text-[#33c75a]">Schedule your sessions around these patterns for best focus.</p>
        </Card>

        <Card className="bg-[#404457] border-none rounded-3xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Coffee className="h-6 w-6 text-[#ffa601]" />
            <h2 className="text-xl font-medium">Break Recommendations</h2>
          </div>
          {loading ? (
            <p className="mb-4">Loading AI break recommendations...</p>
          ) : (
            <ul className="list-disc list-inside mb-6 space-y-2">
              {breakRecs.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          )}
          <p className="text-[#33c75a]">Take breaks to refresh your mind and come back stronger.</p>
        </Card>

        <Card className="bg-[#404457] border-none rounded-3xl p-8 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="h-6 w-6 text-[#ffa601]" />
            <h2 className="text-xl font-medium">Productivity Tips</h2>
          </div>
          {loading ? (
            <p>Loading AI productivity tips...</p>
          ) : (
            <ul className="list-disc list-inside space-y-3">
              {prodTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
