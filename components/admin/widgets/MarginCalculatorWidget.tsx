"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, ArrowRight, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MarginCalculatorWidget() {
    const [cost, setCost] = useState("")
    const [margin, setMargin] = useState("30") // Default %30 profit
    const [price, setPrice] = useState<number | null>(null)
    const [profit, setProfit] = useState<number | null>(null)

    const calculate = () => {
        const c = parseFloat(cost)
        const m = parseFloat(margin)
        if (isNaN(c) || isNaN(m)) return

        // Formula: Cost + (Cost * Margin / 100)
        const profitAmount = c * (m / 100)
        const finalPrice = c + profitAmount

        setProfit(profitAmount)
        setPrice(finalPrice)
    }

    const reset = () => {
        setCost("")
        setMargin("30")
        setPrice(null)
        setProfit(null)
    }

    return (
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md h-full">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-white text-lg">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <Calculator className="h-5 w-5 text-emerald-400" />
                    </div>
                    Hızlı Fiyat Hesapla
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-slate-400">Maliyet (TL)</Label>
                        <Input
                            type="number"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            className="bg-black/40 border-white/10 text-white h-9"
                            placeholder="0"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-slate-400">Kâr Oranı (%)</Label>
                        <Input
                            type="number"
                            value={margin}
                            onChange={(e) => setMargin(e.target.value)}
                            className="bg-black/40 border-white/10 text-white h-9"
                            placeholder="30"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button onClick={calculate} className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-9 text-white">
                        Hesapla
                    </Button>
                    <Button onClick={reset} size="icon" variant="outline" className="border-white/10 hover:bg-white/5 h-9 w-9">
                        <RefreshCcw className="h-4 w-4 text-slate-400" />
                    </Button>
                </div>

                {price !== null && (
                    <div className="pt-2 border-t border-white/10 space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Net Kâr:</span>
                            <span className="text-emerald-400 font-bold">+{profit?.toFixed(2)} ₺</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                            <span className="text-emerald-100 font-medium">Satış Fiyatı</span>
                            <span className="text-2xl font-black text-white">{price?.toFixed(2)} ₺</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
