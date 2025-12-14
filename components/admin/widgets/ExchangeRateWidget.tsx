"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, RefreshCcw, DollarSign, Euro } from "lucide-react";
import { getExchangeRates } from "@/app/actions/currency";

interface Rate {
    code: string;
    value: number;
    change: number; // Placeholder for change as this API might only give current rate
}

export function ExchangeRateWidget() {
    const [rates, setRates] = useState<Rate[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const updateRates = async () => {
        setLoading(true);
        try {
            const res = await getExchangeRates();
            if (res.success && res.rates) {
                setRates(res.rates);
                setLastUpdated(new Date());
            }
        } catch (error) {
            console.error("Failed to update rates", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        updateRates();
        const interval = setInterval(updateRates, 60000 * 10); // Update every 10 mins
        return () => clearInterval(interval);
    }, []);

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-1 bg-gradient-to-br from-slate-900 to-slate-950 text-white border-none shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                    Piyasalar
                </CardTitle>
                <RefreshCcw
                    className={`h-4 w-4 text-slate-400 cursor-pointer hover:text-white transition-colors ${loading ? 'animate-spin' : ''}`}
                    onClick={updateRates}
                />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {rates.map((rate) => (
                        <div key={rate.code} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-white/10 rounded-full">
                                    {rate.code === 'USD' ? <DollarSign className="h-4 w-4 text-green-400" /> :
                                        rate.code === 'EUR' ? <Euro className="h-4 w-4 text-blue-400" /> :
                                            <span className="text-xs font-bold w-4 text-center text-yellow-400">G</span>}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{rate.code === 'GOLD' ? 'Gram Altın' : `${rate.code}/TRY`}</p>
                                    <p className="text-[10px] text-slate-400">Canlı Kur</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-mono font-bold text-white">
                                    ₺{rate.value.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                    {loading && rates.length === 0 && (
                        <div className="text-center text-xs text-slate-500 py-4">Veriler yükleniyor...</div>
                    )}
                </div>
                {lastUpdated && (
                    <p className="text-[10px] text-slate-600 mt-4 text-center">
                        Son Güncelleme: {lastUpdated.toLocaleTimeString()}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
