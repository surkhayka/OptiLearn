"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type TimerContextType = {
  // Personal timer
  personalTime: number
  isPersonalRunning: boolean
  startPersonalTimer: () => void
  pausePersonalTimer: () => void
  resetPersonalTimer: () => void

  // Group timer
  groupTime: number
  isGroupRunning: boolean
  startGroupTimer: () => void
  pauseGroupTimer: () => void
  resetGroupTimer: () => void

  // Shared
  formatTime: (time: number) => string
}

const TimerContext = createContext<TimerContextType | undefined>(undefined)

export function TimerProvider({ children }: { children: React.ReactNode }) {
  // Personal timer state
  const [personalTime, setPersonalTime] = useState(0)
  const [isPersonalRunning, setIsPersonalRunning] = useState(false)

  // Group timer state
  const [groupTime, setGroupTime] = useState(0)
  const [isGroupRunning, setIsGroupRunning] = useState(false)

  // Load saved times from localStorage on initial render
  useEffect(() => {
    const savedPersonalTime = localStorage.getItem("studyPersonalTimer")
    const savedPersonalRunning = localStorage.getItem("studyPersonalTimerRunning")
    const savedGroupTime = localStorage.getItem("studyGroupTimer")
    const savedGroupRunning = localStorage.getItem("studyGroupTimerRunning")

    if (savedPersonalTime) {
      setPersonalTime(Number.parseInt(savedPersonalTime))
    }

    if (savedPersonalRunning === "true") {
      setIsPersonalRunning(true)
    }

    if (savedGroupTime) {
      setGroupTime(Number.parseInt(savedGroupTime))
    }

    if (savedGroupRunning === "true") {
      setIsGroupRunning(true)
    }
  }, [])

  // Save personal timer to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("studyPersonalTimer", personalTime.toString())
    localStorage.setItem("studyPersonalTimerRunning", isPersonalRunning.toString())
  }, [personalTime, isPersonalRunning])

  // Save group timer to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("studyGroupTimer", groupTime.toString())
    localStorage.setItem("studyGroupTimerRunning", isGroupRunning.toString())
  }, [groupTime, isGroupRunning])

  // Personal timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isPersonalRunning) {
      interval = setInterval(() => {
        setPersonalTime((prevTime) => prevTime + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPersonalRunning])

  // Group timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isGroupRunning) {
      interval = setInterval(() => {
        setGroupTime((prevTime) => prevTime + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isGroupRunning])

  // Personal timer controls
  const startPersonalTimer = () => setIsPersonalRunning(true)
  const pausePersonalTimer = () => setIsPersonalRunning(false)
  const resetPersonalTimer = () => {
    setIsPersonalRunning(false)
    setPersonalTime(0)
  }

  // Group timer controls
  const startGroupTimer = () => setIsGroupRunning(true)
  const pauseGroupTimer = () => setIsGroupRunning(false)
  const resetGroupTimer = () => {
    setIsGroupRunning(false)
    setGroupTime(0)
  }

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    const seconds = timeInSeconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`
  }

  return (
    <TimerContext.Provider
      value={{
        personalTime,
        isPersonalRunning,
        startPersonalTimer,
        pausePersonalTimer,
        resetPersonalTimer,
        groupTime,
        isGroupRunning,
        startGroupTimer,
        pauseGroupTimer,
        resetGroupTimer,
        formatTime,
      }}
    >
      {children}
    </TimerContext.Provider>
  )
}

export function useTimer() {
  const context = useContext(TimerContext)
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider")
  }
  return context
}
