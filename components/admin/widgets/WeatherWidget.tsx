"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, Wind, Droplets } from "lucide-react";

export function WeatherWidget() {
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await fetch("https://api.weatherapi.com/v1/current.json?key=b5250c55361e4bd794e130652251412&q=Kayseri&lang=tr");
                const data = await res.json();
                setWeather(data);
            } catch (error) {
                console.error("Failed to fetch weather", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (loading) {
        return (
            <Card className="col-span-1 bg-blue-950 text-white border-none shadow-xl">
                <CardContent className="flex items-center justify-center h-full">
                    <span className="text-xs text-white/50">Hava durumu yükleniyor...</span>
                </CardContent>
            </Card>
        )
    }

    if (!weather) return null;

    const { current, location } = weather;
    const isDay = current.is_day === 1;

    return (
        <Card className="col-span-1 bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none shadow-xl overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-400/20 rounded-full blur-xl" />

            <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-blue-100 flex items-center justify-between">
                    <span>{location.name}</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">{location.localtime.split(" ")[1]}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-4xl font-bold tracking-tighter">
                            {Math.round(current.temp_c)}°
                        </div>
                        <p className="text-sm text-blue-100 font-medium mt-1">
                            {current.condition.text}
                        </p>
                    </div>
                    <div className="p-2">
                        {/* We could use current.condition.icon but let's use Lucide for cleaner look if possible, or fallback to img */}
                        <img src={`https:${current.condition.icon}`} alt="Weather Icon" className="w-16 h-16 object-contain drop-shadow-lg" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/10 rounded-lg p-2 flex items-center gap-2">
                        <Wind className="h-4 w-4 text-blue-200" />
                        <div>
                            <p className="text-[10px] text-blue-200">Rüzgar</p>
                            <p className="text-xs font-bold">{current.wind_kph} km/s</p>
                        </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-200" />
                        <div>
                            <p className="text-[10px] text-blue-200">Nem</p>
                            <p className="text-xs font-bold">%{current.humidity}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
