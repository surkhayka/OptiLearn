"use client"

import { useEffect, useRef } from "react"

export function LineChart({ data }: { data: { date: string; value: number }[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const maxValue = Math.max(...data.map(d => d.value), 7)
    const minValue = 0

    const chartWidth = canvas.width - 40
    const chartHeight = canvas.height - 40
    const padding = 20

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = "#555"
    ctx.lineWidth = 0.5

    for (let i = 0; i <= 7; i++) {
      const y = padding + (chartHeight - (i / 7) * chartHeight)
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()

      ctx.fillStyle = "#aaa"
      ctx.font = "10px Arial"
      ctx.textAlign = "right"
      ctx.fillText(i.toString(), padding - 5, y + 3)
    }

    ctx.strokeStyle = "#33c75a"
    ctx.lineWidth = 2
    ctx.beginPath()

    data.forEach((point, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth
      const y = padding + chartHeight - ((point.value - minValue) / (maxValue - minValue)) * chartHeight

      if (index === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })

    ctx.stroke()

    data.forEach((point, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth
      const y = padding + chartHeight - ((point.value - minValue) / (maxValue - minValue)) * chartHeight

      ctx.fillStyle = "#33c75a"
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#aaa"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText(point.date, x, padding + chartHeight + 15)
    })
  }, [data])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

export function ProgressCircle({ value, color }: { value: number; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 120
    canvas.height = 120

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = 45
    const lineWidth = 8

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.strokeStyle = "#2c2e39"
    ctx.lineWidth = lineWidth
    ctx.stroke()

    const startAngle = -Math.PI / 2
    const endAngle = startAngle + (Math.PI * 2 * value) / 100

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, endAngle, startAngle + Math.PI * 2)
    ctx.strokeStyle = "#00e0ff"
    ctx.lineWidth = lineWidth
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.stroke()

    const endX = centerX + radius * Math.cos(endAngle)
    const endY = centerY + radius * Math.sin(endAngle)

    ctx.beginPath()
    ctx.arc(endX, endY, lineWidth / 2, 0, Math.PI * 2)
    ctx.fillStyle = "#00e0ff"
    ctx.fill()
  }, [value, color])

  return <canvas ref={canvasRef} width="120" height="120" />
}

// 🆕 FocusPieChart component

export function FocusPieChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const total = data.reduce((acc, item) => acc + item.value, 0)
    let startAngle = -Math.PI / 2

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(canvas.width, canvas.height) * 0.4 // Bigger pie (was 0.33)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    data.forEach(item => {
      const sliceAngle = (item.value / total) * Math.PI * 2

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = item.color
      ctx.fill()

      startAngle += sliceAngle
    })
  }, [data])

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} className="w-full h-48" />

      <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-gray-300">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
            <span>{item.label} ({item.value}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}

