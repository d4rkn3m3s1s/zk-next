"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

export function DigitalClockWidget() {
    const [time, setTime] = useState<Date | null>(null)

    useEffect(() => {
        setTime(new Date())
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    if (!time) return null

    return (
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/50 border border-cyan-500/30 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-md">
            <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
            <div className="flex flex-col leading-none">
                <span className="text-xl font-black text-cyan-50 tracking-widest font-mono">
                    {time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className="text-[10px] text-cyan-400/60 font-bold uppercase tracking-wider text-center">
                    {time.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' })}
                </span>
            </div>
        </div>
    )
}
