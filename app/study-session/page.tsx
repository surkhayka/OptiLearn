"use client"
import { useState } from "react"
import type React from "react"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BarChart3, CheckCircle, Clock, GraduationCap, PlusCircle, RefreshCw, Target, X } from "lucide-react"
import { Timer } from "@/components/timer"
import { useTimer } from "@/context/timer-context"
import { useConcentration } from "../hooks/useConcentration"

export default function StudySession() {
  const { resetPersonalTimer, isPersonalRunning } = useTimer()
  const personalRate = useConcentration(isPersonalRunning)
  const [goals, setGoals] = useState(["Study for 40 hours this week", "Understand complex numbers"])
  const [newGoal, setNewGoal] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("MATH1853")
  const [availableCourses, setAvailableCourses] = useState([
    "MATH1853",
    "COMP2121",
    "CCST9088",
    "MATH2014",
  ])

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, newGoal.trim()])
      setNewGoal("")
    }
  }

  const handleDeleteGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddGoal()
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-12 gap-6">
        {/* Goals Card */}
        <Card className="col-span-4 bg-[#404457] border-none rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5" />
            <h2 className="text-lg font-medium">Goals</h2>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder="Type a goal..."
              className="bg-[#2c2e39] border-none rounded-full text-white text-sm"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              variant="ghost"
              className="rounded-full p-1 bg-[#2c2e39] hover:bg-[#363846]"
              onClick={handleAddGoal}
            >
              <PlusCircle className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-3">
            {goals.map((goal, index) => (
              <div key={index} className="flex items-center gap-2 group">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm flex-grow">{goal}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-0 h-6 w-6 hover:bg-[#2c2e39]"
                  onClick={() => handleDeleteGoal(index)}
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-white" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Timer Card */}
        <Card className="col-span-4 bg-[#404457] border-none rounded-3xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <h2 className="text-lg font-medium">Personal Timer</h2>
            </div>
          </div>

          <Timer />
        </Card>

        {/* Stats Card */}
        <Card className="col-span-4 bg-[#404457] border-none rounded-3xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <h2 className="text-lg font-medium">Study stats</h2>
            </div>
            <div className="text-xs">This week</div>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <p className="mb-1">
                Concentration Rate :{' '}
                <span className="text-[#ffa601]">
                  {personalRate != null ? `${personalRate.toFixed(0)}%` : '…'}
                </span>
              </p>
            </div>

            <div>
              <p className="mb-1">Total Break Time : 45 min</p>
            </div>

            <div>
              <p className="mb-1">
                Concentration Streak: <span className="text-[#33c75a]">13 min</span>
              </p>
            </div>

            <div>
              <p className="mb-1">
                Tiredness : <span className="text-[#33c75a]">10%</span>
              </p>
            </div>

            <div>
              <p className="mb-1">
                Distraction Rate : <span className="text-[#ffa601]">27%</span>
              </p>
            </div>

            <div>
              <p className="mb-1">
                Distraction website interaction: <span className="text-[#33c75a]">3</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Course Card */}
        <Card className="col-span-4 col-start-5 flex flex-col bg-[#404457] border-none rounded-3xl p-6 h-48">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-5 w-5" />
            <h2 className="text-lg font-medium">Course</h2>
          </div>

          <div className="flex flex-grow justify-center items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-2xl font-bold text-[#ffa601] p-0 h-auto hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  {selectedCourse}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                {availableCourses.map((course) => (
                  <DropdownMenuItem
                    key={course}
                    onSelect={() => setSelectedCourse(course)}
                  >
                    {course}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      </div>
    </div>
  )
}
