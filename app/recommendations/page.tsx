import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Coffee, Lightbulb } from "lucide-react"

export default function Recommendations() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-center">Personalized Recommendations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-[#404457] border-none rounded-3xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-6 w-6 text-[#ffa601]" />
            <h2 className="text-xl font-medium">Optimal Study Time</h2>
          </div>
          <p className="mb-4">Based on your performance data, your peak concentration hours are:</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Morning: 9:00 AM - 11:00 AM</li>
            <li>Afternoon: 2:00 PM - 4:00 PM</li>
          </ul>
          <p className="text-[#33c75a]">Try scheduling your most challenging tasks during these times!</p>
        </Card>

        <Card className="bg-[#404457] border-none rounded-3xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Coffee className="h-6 w-6 text-[#ffa601]" />
            <h2 className="text-xl font-medium">Break Recommendations</h2>
          </div>
          <p className="mb-4">Your current break pattern could be improved:</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Try the Pomodoro technique: 25 min work, 5 min break</li>
            <li>Take a longer 15-minute break every 2 hours</li>
            <li>Use breaks for physical movement to reduce tiredness</li>
          </ul>
          <Button className="bg-[#525a81] hover:bg-[#424b6e] w-full">Apply Pomodoro Timer</Button>
        </Card>

        <Card className="bg-[#404457] border-none rounded-3xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-6 w-6 text-[#ffa601]" />
            <h2 className="text-xl font-medium">Study Material Suggestions</h2>
          </div>
          <p className="mb-4">For your current courses:</p>
          <div className="space-y-4 mb-6">
            <div>
              <h3 className="font-medium text-[#ffa601]">MATH1853</h3>
              <p>Khan Academy's Linear Algebra series would complement your coursework</p>
            </div>
            <div>
              <h3 className="font-medium text-[#ffa601]">ENGG1340</h3>
              <p>Try the interactive coding exercises on Codecademy</p>
            </div>
          </div>
          <Button className="bg-[#525a81] hover:bg-[#424b6e] w-full">View All Resources</Button>
        </Card>

        <Card className="bg-[#404457] border-none rounded-3xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="h-6 w-6 text-[#ffa601]" />
            <h2 className="text-xl font-medium">Productivity Tips</h2>
          </div>
          <ul className="list-disc list-inside space-y-3">
            <li>Your distraction rate increases after 45 minutes of continuous study</li>
            <li>Website distractions are highest between 7-9 PM</li>
            <li>Try the Forest app to reduce phone distractions</li>
            <li>Your concentration improves by 23% when studying with Vlad</li>
            <li>Consider using noise-cancelling headphones during peak distraction times</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
