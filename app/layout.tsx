import type { Metadata } from "next"
import { Lexend } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { TimerProvider } from "@/context/timer-context"

const lexend = Lexend({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Study Dashboard",
  description: "Study session tracking application",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${lexend.className} min-h-screen bg-[#2c2e39] text-white`}>
        <TimerProvider>
          <div className="p-4 md:p-6">
            {/* Navigation */}
            <nav className="mb-8 md:mb-16">
              <div className="bg-[#525a81] rounded-full p-1 flex items-center justify-center mx-auto max-w-fit">
                <NavLink href="/">Main Menu</NavLink>
                <NavLink href="/study-session">Study Session</NavLink>
                <NavLink href="/study-buddy">Study Buddy</NavLink>
                <NavLink href="/recommendations">Recommendations</NavLink>
                <NavLink href="/analytics">Analytics</NavLink>
              </div>
            </nav>
            {children}
          </div>
        </TimerProvider>
      </body>
    </html>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="px-4 py-2 rounded-full text-white hover:bg-[#404457] transition-colors"
    >
      {children}
    </Link>
  )
}

import './globals.css'