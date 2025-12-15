"use client"

import { useEffect, useState } from "react"
import { AlertTriangle } from "lucide-react"

interface Product {
    name: string
    stock: number
}

interface StockTickerProps {
    lowStockProducts: Product[]
}

export function StockTicker({ lowStockProducts }: StockTickerProps) {
    if (!lowStockProducts || lowStockProducts.length === 0) return null

    return (
        <div className="relative bg-red-950/30 border-y border-red-500/20 py-2 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10"></div>

            <div className="flex items-center gap-2 px-4 absolute left-0 z-20 h-full bg-black/60 backdrop-blur-sm border-r border-red-500/20">
                <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider whitespace-nowrap">Kritik Stok</span>
            </div>

            <div className="animate-marquee whitespace-nowrap flex items-center gap-8 pl-40">
                {/* Double the list for seamless loop */}
                {[...lowStockProducts, ...lowStockProducts, ...lowStockProducts].map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-red-200/80">
                        <span className="font-medium text-red-100">{p.name}</span>
                        <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-xs font-bold">
                            {p.stock} Adet
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
