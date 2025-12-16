"use client";

import { useState } from "react";
import { DeviceSelector } from "@/components/compare/DeviceSelector";
import { ComparisonTable } from "@/components/compare/ComparisonTable";
import { MobileDeviceConfig } from "@/lib/mobile-specs";
import { Scale, Zap, Trophy, Sparkles } from "lucide-react";

export default function ComparePage() {
    // We store up to 2 devices for comparison in this version
    const [selectedDevices, setSelectedDevices] = useState<MobileDeviceConfig[]>([]);

    function addDevice(device: MobileDeviceConfig) {
        if (selectedDevices.length >= 2) {
            // Replace the second one or show warning
            // For UX, let's just replace the last one if full, or maybe strict limit?
            // Let's replace the last one so user can keep switching
            const newArr = [...selectedDevices];
            newArr[1] = device;
            setSelectedDevices(newArr);
        } else {
            setSelectedDevices([...selectedDevices, device]);
        }
    }

    function removeDevice(index: number) {
        const newArr = selectedDevices.filter((_, i) => i !== index);
        setSelectedDevices(newArr);
    }

    return (
        <div className="min-h-screen pb-20 overflow-x-hidden">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-purple-900/20 blur-[120px] -z-10" />

            <div className="container mx-auto px-4 py-8 space-y-12">

                {/* Header Section */}
                <div className="text-center space-y-4 relative">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-4 animate-in fade-in zoom-in duration-700">
                        <Sparkles className="size-4" />
                        <span>Next-Gen Comparison Engine</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 tracking-tighter drop-shadow-2xl">
                        Cihaz Karşılaştırma
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Yapay zeka destekli altyapı ile cihazları yan yana getirin, donanım farklarını anında analiz edin.
                    </p>
                </div>

                {/* Device Selection Area */}
                <div className="max-w-2xl mx-auto relative z-20">
                    <DeviceSelector
                        onSelect={addDevice}
                        slotId={selectedDevices.length}
                    />
                    <div className="text-center mt-4 text-xs text-slate-500 flex items-center justify-center gap-2">
                        <span>Database: Mobile Specs Server v2</span>
                        <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                </div>

                {/* Comparison Arena */}
                <div className="relative animate-in slide-in-from-bottom-10 duration-700 fade-in fill-mode-backwards">
                    {selectedDevices.length > 0 ? (
                        <ComparisonTable
                            devices={selectedDevices}
                            onRemove={removeDevice}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12 bg-white/5 border border-white/5 rounded-3xl p-12 text-center">
                            <div className="space-y-4 flex flex-col items-center justify-center opacity-50">
                                <div className="size-20 bg-slate-800 rounded-full flex items-center justify-center">
                                    <Scale className="size-10 text-slate-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Adil Karşılaştırma</h3>
                                <p className="text-slate-400 text-sm">Teknik verilerle tarafsız analiz.</p>
                            </div>
                            <div className="space-y-4 flex flex-col items-center justify-center opacity-50">
                                <div className="size-20 bg-slate-800 rounded-full flex items-center justify-center">
                                    <Trophy className="size-10 text-slate-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Kazananı Gör</h3>
                                <p className="text-slate-400 text-sm">Üstün özellikler otomatik vurgulanır.</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
