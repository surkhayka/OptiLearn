import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import path from 'path'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const jsonStr = JSON.stringify(body)
  const scriptPath = path.resolve(process.cwd(), 'app', 'deepseek.py')

  return new Promise<NextResponse>((resolve) => {
    exec(`python3 "${scriptPath}" '${jsonStr}'`, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        console.error('Analyzer error:', error)
        resolve(NextResponse.json({ error: error.message }, { status: 500 }))
      } else {
        if (stderr) console.error('Analyzer stderr:', stderr);
        const analysis = stdout.trim()
        resolve(NextResponse.json({ analysis }))
      }
    })
  })
}
