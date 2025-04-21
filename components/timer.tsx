"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pause, Play, Square } from "lucide-react"
import { useTimer } from "@/context/timer-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function Timer() {
  const { personalTime, isPersonalRunning, startPersonalTimer, pausePersonalTimer, resetPersonalTimer, formatTime } =
    useTimer()
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const toggleTimer = () => {
    if (isPersonalRunning) {
      pausePersonalTimer()
    } else {
      startPersonalTimer()
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center items-center mb-4 md:mb-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-wider">{formatTime(personalTime)}</h1>
      </div>

      <div className="flex justify-center gap-4">
        <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="rounded-md p-1 md:p-2 hover:bg-[#2c2e39] transition-colors">
              <Square className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#404457] border-none text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Timer?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                This will reset your timer to 00:00:00. Your progress will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-[#2c2e39] text-white border-none hover:bg-[#363846]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-[#525a81] text-white border-none hover:bg-[#424b6e]"
                onClick={resetPersonalTimer}
              >
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          variant="ghost"
          className={`rounded-md p-1 md:p-2 transition-colors ${isPersonalRunning ? "bg-[#2c2e39]/50" : "hover:bg-[#2c2e39]"}`}
          onClick={toggleTimer}
        >
          {isPersonalRunning ? <Pause className="h-5 w-5 md:h-6 md:w-6" /> : <Play className="h-5 w-5 md:h-6 md:w-6" />}
        </Button>
      </div>
    </div>
  )
}

export function GroupTimer() {
  const { groupTime, isGroupRunning, startGroupTimer, pauseGroupTimer, resetGroupTimer, formatTime } = useTimer()
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const toggleTimer = () => {
    if (isGroupRunning) {
      pauseGroupTimer()
    } else {
      startGroupTimer()
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center items-center mb-4 md:mb-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-wider">{formatTime(groupTime)}</h1>
      </div>

      <div className="flex justify-center gap-4">
        <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="rounded-md p-1 md:p-2 hover:bg-[#2c2e39] transition-colors">
              <Square className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#404457] border-none text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Group Timer?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                This will reset the group timer to 00:00:00. Group progress will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-[#2c2e39] text-white border-none hover:bg-[#363846]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-[#525a81] text-white border-none hover:bg-[#424b6e]"
                onClick={resetGroupTimer}
              >
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          variant="ghost"
          className={`rounded-md p-1 md:p-2 transition-colors ${isGroupRunning ? "bg-[#2c2e39]/50" : "hover:bg-[#2c2e39]"}`}
          onClick={toggleTimer}
        >
          {isGroupRunning ? <Pause className="h-5 w-5 md:h-6 md:w-6" /> : <Play className="h-5 w-5 md:h-6 md:w-6" />}
        </Button>
      </div>
    </div>
  )
}
