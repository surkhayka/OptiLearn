"use client";
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react';
import { BookOpen, Clock, Coffee, Lightbulb } from "lucide-react"

export default function Recommendations() {
  const [analysisText, setAnalysisText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    const stored = localStorage.getItem("sessionHistory") || "[]";
    const sessions = JSON.parse(stored);
    console.log("[Recommendations] Loaded sessionHistory:", sessions);
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session: sessions }),
      });
      if (!resp.ok) throw new Error("Server Error");
      const data = await resp.json();
      console.log("[Recommendations] Analyzer response:", data);
      const analysis = data.analysis || "";
      if (!analysis.trim()) {
        setAnalysisText("");
        setError("No recommendations available.");
      } else {
        setAnalysisText(analysis);
      }
    } catch (err) {
      console.error("Fetch recommendations failed", err);
      setError("Failed to fetch recommendations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  useEffect(() => {
    const onUpdate = () => fetchRecommendations();
    window.addEventListener('sessionHistoryUpdated', onUpdate);
    window.addEventListener('storage', onUpdate);
    return () => {
      window.removeEventListener('sessionHistoryUpdated', onUpdate);
      window.removeEventListener('storage', onUpdate);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-center">Personalized Recommendations</h1>
      <div className="flex justify-center mb-4">
        <Button onClick={fetchRecommendations} disabled={loading} className="bg-[#ffa601] hover:bg-[#ffb733] text-black px-6 py-2 font-bold">
          {loading ? 'Refreshing...' : 'Refresh Recommendations'}
        </Button>
      </div>
      <Card className="bg-[#404457] border-none rounded-3xl p-8">
        {loading ? (
          <p>Loading recommendations...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <pre className="whitespace-pre-wrap text-white">{analysisText}</pre>
        )}
      </Card>
    </div>
  );
}
