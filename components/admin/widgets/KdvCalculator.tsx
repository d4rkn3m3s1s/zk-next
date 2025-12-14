"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

export function KdvCalculator() {
    const [amount, setAmount] = useState<string>("");
    const [rate, setRate] = useState<number>(20); // Default 20%
    const [result, setResult] = useState<{ base: number, kdv: number, total: number } | null>(null);

    const calculate = (type: 'include' | 'exclude') => {
        const val = parseFloat(amount);
        if (isNaN(val)) return;

        if (type === 'exclude') {
            // Amount is base, add KDV
            const kdvAmount = val * (rate / 100);
            setResult({
                base: val,
                kdv: kdvAmount,
                total: val + kdvAmount
            });
        } else {
            // Amount is total, extract KDV
            const baseAmount = val / (1 + rate / 100);
            const kdvAmount = val - baseAmount;
            setResult({
                base: baseAmount,
                kdv: kdvAmount,
                total: val
            });
        }
    };

    return (
        <Card className="col-span-1 border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">KDV Hesaplayıcı</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs">Tutar</Label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Oran (%)</Label>
                            <div className="grid grid-cols-3 gap-1">
                                {[1, 10, 20].map((r) => (
                                    <div
                                        key={r}
                                        onClick={() => setRate(r)}
                                        className={`cursor-pointer px-1 py-1.5 text-xs rounded-md border text-center transition-colors font-medium ${rate === r ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                                    >
                                        %{r}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" onClick={() => calculate('exclude')}>
                            KDV Ekle
                        </Button>
                        <Button size="sm" onClick={() => calculate('include')}>
                            KDV Dahil
                        </Button>
                    </div>

                    {result && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg space-y-1 text-sm border border-border">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Matrah:</span>
                                <span className="font-mono">{result.base.toFixed(2)} ₺</span>
                            </div>
                            <div className="flex justify-between text-red-500">
                                <span>KDV (%{rate}):</span>
                                <span className="font-mono">+{result.kdv.toFixed(2)} ₺</span>
                            </div>
                            <div className="border-t border-border mt-2 pt-2 flex justify-between font-bold">
                                <span>Toplam:</span>
                                <span className="font-mono">{result.total.toFixed(2)} ₺</span>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
