"use client"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BarChart3, Clock, RefreshCw } from "lucide-react"
import { GroupTimer } from "@/components/timer"
import { useTimer } from "@/context/timer-context"
import { Button } from "@/components/ui/button"
import { useConcentration } from "../hooks/useConcentration"
import { useTiredness } from "../hooks/useTiredness"

export default function StudyBuddy() {
  const { resetGroupTimer, isGroupRunning } = useTimer()
  const surkhayRate = useConcentration(isGroupRunning)
  const tirednessRate = useTiredness(isGroupRunning)

  return (
    <div className="max-w-6xl mx-auto space-y-4 md:space-y-8">
      <Card className="bg-[#404457] border-none rounded-3xl p-4 md:p-8">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 md:h-6 md:w-6" />
            <h2 className="text-lg md:text-xl font-medium">Study stats</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#33c75a]"></div>
            <span className="text-xs md:text-sm">Live</span>
          </div>
        </div>

        {/* User Comparison */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
          <div className="bg-[#2c2e39] rounded-full py-1 md:py-2 px-2 md:px-4 text-center text-sm md:text-base">
            <span>Surkhay (You)</span>
          </div>
          <div className="text-center font-bold text-lg md:text-xl">VS</div>
          <div className="bg-[#2c2e39] rounded-full py-1 md:py-2 px-2 md:px-4 text-center text-sm md:text-base">
            <span>Vlad</span>
          </div>
        </div>

        {/* Stats Comparison */}
        <div className="space-y-3 md:space-y-4 text-xs md:text-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
            <div className="text-center">
              <p className="mb-1">
                Concentration Rate :{' '}
                <span
                  className={
                    surkhayRate != null
                      ? surkhayRate < 50
                        ? 'text-red-500'
                        : surkhayRate < 75
                          ? 'text-yellow-500'
                          : 'text-green-500'
                      : 'text-gray-500'
                  }
                >
                  {surkhayRate != null ? `${surkhayRate.toFixed(0)}%` : '…'}
                </span>
              </p>
            </div>
            <div className="md:col-start-3 text-center">
              <p className="mb-1">
                Concentration Rate :{' '}
                <span
                  className={
                    79 < 50
                      ? 'text-red-500'
                      : 79 < 75
                        ? 'text-yellow-500'
                        : 'text-green-500'
                  }
                >
                  79%
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
            <div className="text-center">
              <p className="mb-1">Total Break Time : 35 min</p>
            </div>
            <div className="md:col-start-3 text-center">
              <p className="mb-1">Total Break Time : 40 min</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
            <div className="text-center">
              <p className="mb-1">
                Concentration Streak: <span className="text-[#33c75a]">21 min</span>
              </p>
            </div>
            <div className="md:col-start-3 text-center">
              <p className="mb-1">
                Concentration Streak: <span className="text-[#33c75a]">17 min</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
            <div className="text-center">
              <p className="mb-1">
                Tiredness :{' '}
                <span
                  className={
                    tirednessRate != null
                      ? tirednessRate < 25
                        ? 'text-green-500'
                        : tirednessRate < 50
                          ? 'text-yellow-500'
                          : 'text-red-500'
                      : 'text-gray-500'
                  }
                >
                  {tirednessRate != null ? `${tirednessRate.toFixed(0)}%` : '…'}
                </span>
              </p>
            </div>
            <div className="md:col-start-3 text-center">
              <p className="mb-1">
                Tiredness :{' '}
                <span
                  className={
                    36 < 25
                      ? 'text-green-500'
                      : 36 < 50
                        ? 'text-yellow-500'
                        : 'text-red-500'
                  }
                >
                  36%
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
            <div className="text-center">
              <p className="mb-1">
                Distraction Rate :{' '}
                <span
                  className={
                    surkhayRate != null
                      ? (100 - surkhayRate) < 25
                        ? 'text-green-500'
                        : (100 - surkhayRate) < 50
                          ? 'text-yellow-500'
                          : 'text-red-500'
                      : 'text-gray-500'
                  }
                >
                  {surkhayRate != null ? `${(100 - surkhayRate).toFixed(0)}%` : '…'}
                </span>
              </p>
            </div>
            <div className="md:col-start-3 text-center">
              <p className="mb-1">
                Distraction Rate :{' '}
                <span
                  className={
                    (100 - 79) < 25
                      ? 'text-green-500'
                      : (100 - 79) < 50
                        ? 'text-yellow-500'
                        : 'text-red-500'
                  }
                >
                  {`${(100 - 79).toFixed(0)}%`}
                </span>
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
        <Card className="md:col-span-8 bg-[#404457] border-none rounded-3xl p-4 md:p-8">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 md:h-6 md:w-6" />
              <h2 className="text-lg md:text-xl font-medium">Group Timer</h2>
            </div>
          </div>

          <GroupTimer />
        </Card>

        <Card className="md:col-span-4 bg-[#404457] border-none rounded-3xl p-4 md:p-8">
          <h2 className="text-lg md:text-xl font-medium mb-4 md:mb-6">Online Friends</h2>
          <div className="space-y-3 md:space-y-4">
            {["Alex", "Maria", "John", "Sophia"].map((name, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-8 w-8 md:h-10 md:w-10 bg-[#525a81] text-white">
                    <AvatarFallback>{name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 h-2 w-2 md:h-3 md:w-3 rounded-full bg-[#33c75a] border-2 border-[#404457]"></div>
                </div>
                <span className="text-sm md:text-base">{name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
