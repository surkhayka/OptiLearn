"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, ProgressCircle, FocusPieChart } from "@/components/charts"
import { Calendar, Clock, Target } from "lucide-react"

interface StudyData {
  date: string
  hours: number
  concentration: number
  productivity: number
  breakEfficiency: number
  focusDuration: number
}

interface SessionHistoryEntry {
  date: string
  rate: number | null
  tiredness: number | null
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("weekly")
  const [studyData, setStudyData] = useState<StudyData[]>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('studyData')
      return savedData ? JSON.parse(savedData) : generateMockData()
    }
    return []
  })

  const [sessionHistory, setSessionHistory] = useState<SessionHistoryEntry[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sessionHistory')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem('studyData', JSON.stringify(studyData))
  }, [studyData])

  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === 'sessionHistory') {
        setSessionHistory(e.newValue ? JSON.parse(e.newValue) : [])
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  useEffect(() => {
    function onSessionHistoryUpdated() {
      const saved = localStorage.getItem('sessionHistory')
      setSessionHistory(saved ? JSON.parse(saved) : [])
    }
    window.addEventListener('sessionHistoryUpdated', onSessionHistoryUpdated)
    return () => window.removeEventListener('sessionHistoryUpdated', onSessionHistoryUpdated)
  }, [])

  function generateMockData(): StudyData[] {
    const data: StudyData[] = []
    const today = new Date()
    
    for (let i = 0; i < 28; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      data.push({
        date: date.toISOString().split('T')[0],
        hours: Math.random() * 5 + 1,
        concentration: Math.random() * 100,
        productivity: Math.random() * 100,
        breakEfficiency: Math.random() * 100,
        focusDuration: Math.random() * 100
      })
    }
    return data
  }

  const getFilteredData = () => {
    const today = new Date();
  
    const filteredData = [...studyData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
    if (timeRange === "daily") {
      return filteredData.slice(-7).map(d => {
        const entryDate = new Date(d.date);
        const day = String(entryDate.getDate()).padStart(2, '0');
        const month = String(entryDate.getMonth() + 1).padStart(2, '0');
        return { ...d, date: `${day}.${month}` };
      });
    }
  
    if (timeRange === "weekly") {
      const weeks = [];
      for (let i = 0; i < 4; i++) {
        const weekData = filteredData.slice(-7 * (i + 1), filteredData.length - 7 * i);
        const weekAvg = weekData.reduce(
          (acc, cur) => ({
            date: weekData[weekData.length - 1]?.date || "",
            hours: acc.hours + cur.hours / weekData.length,
            concentration: acc.concentration + cur.concentration / weekData.length,
            productivity: acc.productivity + cur.productivity / weekData.length,
            breakEfficiency: acc.breakEfficiency + cur.breakEfficiency / weekData.length,
            focusDuration: acc.focusDuration + cur.focusDuration / weekData.length,
          }),
          { date: "", hours: 0, concentration: 0, productivity: 0, breakEfficiency: 0, focusDuration: 0 }
        );
  
        if (weekAvg.date) {
          const entryDate = new Date(weekAvg.date);
          const day = String(entryDate.getDate()).padStart(2, '0');
          const month = String(entryDate.getMonth() + 1).padStart(2, '0');
          weekAvg.date = `${day}.${month}`;
        }
  
        weeks.unshift(weekAvg);
      }
      return weeks;
    }
  
    if (timeRange === "monthly") {
      const months = [];
      for (let i = 0; i < 12; i++) {
        const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
  
        const monthData = filteredData.filter(d => {
          const entryDate = new Date(d.date);
          return entryDate.getFullYear() === monthDate.getFullYear() && entryDate.getMonth() === monthDate.getMonth();
        });
  
        if (monthData.length === 0) {
          months.unshift({
            date: `${String(monthDate.getMonth() + 1).padStart(2, '0')}.${String(monthDate.getFullYear()).slice(-2)}`,
            hours: 0,
            concentration: 0,
            productivity: 0,
            breakEfficiency: 0,
            focusDuration: 0,
          });
        } else {
          const monthAvg = monthData.reduce(
            (acc, cur) => ({
              date: monthDate.toISOString(),
              hours: acc.hours + cur.hours / monthData.length,
              concentration: acc.concentration + cur.concentration / monthData.length,
              productivity: acc.productivity + cur.productivity / monthData.length,
              breakEfficiency: acc.breakEfficiency + cur.breakEfficiency / monthData.length,
              focusDuration: acc.focusDuration + cur.focusDuration / monthData.length,
            }),
            { date: "", hours: 0, concentration: 0, productivity: 0, breakEfficiency: 0, focusDuration: 0 }
          );
  
          const entryDate = new Date(monthAvg.date);
          const month = String(entryDate.getMonth() + 1).padStart(2, '0');
          const year = String(entryDate.getFullYear()).slice(-2);
          monthAvg.date = `${month}.${year}`;
  
          months.unshift(monthAvg);
        }
      }
      return months;
    }
  
    return [];
  };

  const getAverageMetrics = () => {
    const filteredData = getFilteredData()
    if (filteredData.length === 0) return { concentration: 0, productivity: 0, breakEfficiency: 0, focusDuration: 0 }
    
    return {
      concentration: Math.round(filteredData.reduce((acc, curr) => acc + curr.concentration, 0) / filteredData.length),
      productivity: Math.round(filteredData.reduce((acc, curr) => acc + curr.productivity, 0) / filteredData.length),
      breakEfficiency: Math.round(filteredData.reduce((acc, curr) => acc + curr.breakEfficiency, 0) / filteredData.length),
      focusDuration: Math.round(filteredData.reduce((acc, curr) => acc + curr.focusDuration, 0) / filteredData.length)
    }
  }

  const metrics = getAverageMetrics()

  return (
    <div className="max-w-5xl mx-auto">
      <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as typeof timeRange)} className="mb-8">
        <TabsList className="bg-[#525a81] rounded-full p-1 mx-auto flex justify-center">
          <TabsTrigger value="daily" className="rounded-full text-white data-[state=active]:bg-[#404457]">
            Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" className="rounded-full text-white data-[state=active]:bg-[#404457]">
            Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" className="rounded-full text-white data-[state=active]:bg-[#404457]">
            Monthly
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="bg-[#404457] border-none rounded-3xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-6 w-6" />
            <h2 className="text-xl font-medium">Study Hours</h2>
          </div>
          <div className="h-64">
            <LineChart data={getFilteredData().map(d => ({ date: d.date, value: d.hours }))} />
          </div>
        </Card>

        <Card className="bg-[#404457] border-none rounded-3xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Target className="h-6 w-6" />
            <h2 className="text-xl font-medium">Performance Metrics</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Concentration</span>
                <span className="text-[#33c75a]">{metrics.concentration}%</span>
              </div>
              <div className="w-full bg-[#2c2e39] rounded-full h-2">
                <div className="bg-[#33c75a] h-2 rounded-full" style={{ width: `${metrics.concentration}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Productivity</span>
                <span className="text-[#33c75a]">{metrics.productivity}%</span>
              </div>
              <div className="w-full bg-[#2c2e39] rounded-full h-2">
                <div className="bg-[#33c75a] h-2 rounded-full" style={{ width: `${metrics.productivity}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Break Efficiency</span>
                <span className="text-[#ffa601]">{metrics.breakEfficiency}%</span>
              </div>
              <div className="w-full bg-[#2c2e39] rounded-full h-2">
                <div className="bg-[#ffa601] h-2 rounded-full" style={{ width: `${metrics.breakEfficiency}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Focus Duration</span>
                <span className="text-[#33c75a]">{metrics.focusDuration}%</span>
              </div>
              <div className="w-full bg-[#2c2e39] rounded-full h-2">
                <div className="bg-[#33c75a] h-2 rounded-full" style={{ width: `${metrics.focusDuration}%` }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-[#404457] border-none rounded-3xl p-8">
          {/* Study Consistency Section */}
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-6 w-6" />
            <h2 className="text-xl font-medium">Study Consistency</h2>
          </div>
          <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-2">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
              <div key={i}>{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {studyData.slice(0, 28).map((entry, i) => {
              const intensity = entry.hours / 5;
              const today = new Date();
              const entryDate = new Date(entry.date);
              const isToday = entryDate.toDateString() === today.toDateString();
              let greenIntensity = Math.floor(50 + intensity * 205);
              let bgColor = `rgb(50, ${greenIntensity}, 80)`;

              return (
                <div
                  key={i}
                  className={`aspect-square rounded-sm ${isToday ? "ring-2 ring-white" : ""}`}
                  style={{
                    backgroundColor: bgColor,
                    marginBottom: (i + 1) % 7 === 0 ? "6px" : "2px",
                  }}
                  title={`${entry.hours.toFixed(1)} hours on ${entry.date}`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-400">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-[rgb(50,50,80)]"></div>
              <div className="w-3 h-3 rounded-sm bg-[rgb(50,150,80)]"></div>
              <div className="w-3 h-3 rounded-sm bg-[rgb(50,200,80)]"></div>
              <div className="w-3 h-3 rounded-sm bg-[rgb(50,255,80)]"></div>
            </div>
            <span>More</span>
          </div>
        </Card>

        {/* 🆕 Focus Distribution Section */}
        <Card className="bg-[#404457] border-none rounded-3xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Target className="h-6 w-6" />
            <h2 className="text-xl font-medium">Focus Distribution</h2>
          </div>
          <div className="h-64">
            <FocusPieChart
              data={[
                { label: "Studying", value: 60, color: "#33c75a" },
                { label: "Browsing", value: 32, color: "#00e0ff" },
                { label: "Mobile phone", value: 3, color: "#ffa601" },
                { label: "Other", value: 5, color: "#e91e63" }
              ]}
            />
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="bg-[#404457] border-none rounded-3xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-6 w-6" />
            <h2 className="text-xl font-medium">Past Sessions</h2>
          </div>
          <ul className="space-y-2 text-sm">
            {sessionHistory.length === 0 ? (
              <li>No past sessions</li>
            ) : (
              sessionHistory.map((s, i) => (
                <li key={i}>
                  {new Date(s.date).toLocaleString()}: Concentration {s.rate?.toFixed(0)}%, Tiredness {s.tiredness?.toFixed(0)}%
                </li>
              ))
            )}
          </ul>
        </Card>
      </div>
    </div>
  )
}
