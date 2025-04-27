"use client"

import { useEffect, useRef } from "react"

interface LineChartProps {
  data?: { date: string; value: number }[]
}

export function LineChart({ data = [] }: LineChartProps) {
  if (data.length === 0) {
    return <div>Loading chart…</div>
  }

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Data points (Apr 10-16)
    const labels = data.map(item => item.date)
    const values = data.map(item => item.value)

    // Calculate max value for scaling
    const maxValue = Math.max(...values)
    const minValue = Math.min(...values)

    // Chart dimensions
    const chartWidth = canvas.width - 40
    const chartHeight = canvas.height - 40
    const padding = 20

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid lines
    ctx.strokeStyle = "#555"
    ctx.lineWidth = 0.5

    // Horizontal grid lines
    for (let i = 0; i <= 7; i++) {
      const y = padding + (chartHeight - (i / 7) * chartHeight)
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()

      // Add y-axis labels
      ctx.fillStyle = "#aaa"
      ctx.font = "10px Arial"
      ctx.textAlign = "right"
      ctx.fillText(i.toString(), padding - 5, y + 3)
    }

    // Draw connected data points
    ctx.strokeStyle = "#33c75a"
    ctx.lineWidth = 2
    ctx.beginPath()

    values.forEach((value, index) => {
      const x = padding + (index / (values.length - 1)) * chartWidth
      const y = padding + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw data points and labels
    values.forEach((value, index) => {
      const x = padding + (index / (values.length - 1)) * chartWidth
      const y = padding + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight

      // Draw point
      ctx.fillStyle = "#33c75a"
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()

      // Add x-axis labels
      ctx.fillStyle = "#aaa"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText(labels[index], x, padding + chartHeight + 15)
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

    // Set canvas dimensions
    canvas.width = 120
    canvas.height = 120

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = 45
    const lineWidth = 8

    // Draw background circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.strokeStyle = "#2c2e39"
    ctx.lineWidth = lineWidth
    ctx.stroke()

    // Draw progress arc
    const startAngle = -Math.PI / 2 // Start from top
    const endAngle = startAngle + (Math.PI * 2 * value) / 100

    // Draw remaining progress in light blue
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, endAngle, startAngle + Math.PI * 2)
    ctx.strokeStyle = "#00e0ff"
    ctx.lineWidth = lineWidth
    ctx.stroke()

    // Draw main progress in pink
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.stroke()

    // Draw small circle at the end of the progress
    const endX = centerX + radius * Math.cos(endAngle)
    const endY = centerY + radius * Math.sin(endAngle)

    ctx.beginPath()
    ctx.arc(endX, endY, lineWidth / 2, 0, Math.PI * 2)
    ctx.fillStyle = "#00e0ff"
    ctx.fill()
  }, [value, color])

  return <canvas ref={canvasRef} width="120" height="120" />
}
