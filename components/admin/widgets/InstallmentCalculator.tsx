"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, CreditCard } from "lucide-react";

const RATES = [
    { months: 1, rate: 13.3 },
    { months: 2, rate: 14.2 },
    { months: 3, rate: 15.0 },
    { months: 4, rate: 16.7 },
    { months: 5, rate: 18.3 },
    { months: 6, rate: 20.0 },
    { months: 7, rate: 22.2 },
    { months: 8, rate: 24.3 },
    { months: 9, rate: 26.5 },
    { months: 10, rate: 28.7 },
    { months: 11, rate: 30.8 },
    { months: 12, rate: 33.0 },
];

export function InstallmentCalculator() {
    const [amount, setAmount] = useState<string>("");
    const [selectedInstallment, setSelectedInstallment] = useState<string>("1");
    const [result, setResult] = useState<{ total: number, monthly: number } | null>(null);

    useEffect(() => {
        const val = parseFloat(amount);
        if (!amount || isNaN(val)) {
            setResult(null);
            return;
        }

        const installment = RATES.find(r => r.months === parseInt(selectedInstallment));
        if (installment) {
            const total = val + (val * installment.rate / 100);
            const monthly = total / installment.months;
            setResult({ total, monthly });
        }
    }, [amount, selectedInstallment]);

    return (
        <Card className="col-span-1 border-none shadow-xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white overflow-hidden relative group">
            {/* Glow Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors pointer-events-none"></div>

            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-indigo-400" />
                    Taksit Hesapla
                </CardTitle>
                <Calculator className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
                <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Tutar (TL)</Label>
                    <Input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Taksit Sayısı</Label>
                    <Select value={selectedInstallment} onValueChange={setSelectedInstallment}>
                        <SelectTrigger className="bg-black/20 border-white/10 text-white focus:ring-offset-0 focus:ring-indigo-500/20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700 text-white">
                            {RATES.map((rate) => (
                                <SelectItem key={rate.months} value={rate.months.toString()} className="focus:bg-indigo-500/20 focus:text-white">
                                    {rate.months} Taksit (%{rate.rate})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {result && (
                    <div className="pt-2 space-y-3">
                        <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-indigo-300">Aylık Tutar</span>
                                <span className="text-lg font-bold text-white">₺{result.monthly.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-indigo-500/20">
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Toplam Geri Ödeme</span>
                                <span className="text-xs font-mono text-indigo-200">₺{result.total.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
