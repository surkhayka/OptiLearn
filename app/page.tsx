"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { LineChart, ProgressCircle } from "@/components/charts"
import { Zap, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Task {
  id: string
  label: string
  completed: boolean
}

export default function MainMenu() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = localStorage.getItem("tasks")
    if (saved) setTasks(JSON.parse(saved))
    else {
      setTasks([
        { id: "task1", label: "ENGG1340 Module 7", completed: true },
        { id: "task2", label: "MATH1851 Problem Set 3", completed: false },
        { id: "task3", label: "MATH1853 Assignment 3", completed: false },
      ])
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tasks", JSON.stringify(tasks))
    }
  }, [tasks])

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t))
  }

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return
    const task: Task = { id: `task${Date.now()}`, label: newTask.trim(), completed: false }
    setTasks([...tasks, task])
    setNewTask("")
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
      {/* Trend Chart */}
      <Card className="bg-[#404457] border-0 shadow-none rounded-3xl p-6 md:col-span-2">
        <h2 className="text-2xl font-medium mb-4">Trend</h2>
        <div className="h-40">
          <LineChart data={[]} />
        </div>
      </Card>

      {/* Daily Quote */}
      <Card className="bg-[#404457] border-0 shadow-2xl rounded-3xl h-[260px] flex flex-col justify-center">
        <div className="flex flex-col items-center gap-5">
          <h2 className="text-lg font-medium">Daily Quote</h2>
          <p className="italic text-lg">"One hour is better than none"</p>
        </div>
      </Card>

      {/* To-Do List */}
      <Card className="bg-[#404457] border-0 shadow-none rounded-3xl p-6">
        <h2 className="text-2xl font-medium mb-4">To-Do</h2>
        <form onSubmit={addTask} className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            className="bg-[#2c2e39] border-[#525a81] text-white"
          />
          <Button type="submit" className="bg-[#525a81] hover:bg-[#404457]">Add</Button>
        </form>
        <div className="space-y-3 max-h-[200px] overflow-y-auto">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center justify-between w-full space-x-3">
              <div className="flex items-center space-x-3 flex-grow">
                <Checkbox
                  id={task.id}
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="border-[#525a81] data-[state=checked]:bg-[#525a81] data-[state=checked]:border-[#525a81]"
                />
                <label htmlFor={task.id} className={`text-base ${task.completed ? "line-through text-gray-400" : ""}`}>{task.label}</label>
              </div>
              <Button variant="ghost" size="sm" className="p-0 h-6 w-6 text-gray-400 hover:text-white hover:bg-red-500/20" onClick={() => handleDeleteTask(task.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Statistics */}
      <Card className="bg-[#404457] border-0 shadow-none rounded-3xl p-6">
        <h2 className="text-2xl font-medium mb-4">Statistics</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <ProgressCircle value={92} color="#ff5acd" />
            <p className="text-2xl mt-2">92%</p>
            <p className="text-sm text-gray-400">Goal Progress</p>
          </div>
          <div className="flex flex-col items-center">
            <ProgressCircle value={78} color="#ff5acd" />
            <p className="text-2xl mt-2">78%</p>
            <p className="text-sm text-gray-400">Concentration Rate</p>
          </div>
          <div className="flex flex-col items-center">
            <ProgressCircle value={57} color="#ff5acd" />
            <p className="text-2xl mt-2">57%</p>
            <p className="text-sm text-gray-400">Break to Study Ratio</p>
          </div>
        </div>
      </Card>

      {/* Streak */}
      <Card className="bg-[#404457] border-0 shadow-none rounded-3xl p-6">
        <h2 className="text-2xl font-medium mb-4">Streak</h2>
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="bg-[#e74c6b] rounded-full p-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <p className="text-2xl">You have an 8-day streak!</p>
        </div>
      </Card>
    </div>
  )
}
