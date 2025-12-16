"use client";

import { useEffect, useState } from "react";
import { getDeviceSpecs, MobileDeviceConfig } from "@/lib/mobile-specs";
import { Check, X, Smartphone, Cpu, Battery, Wifi, Camera, HardDrive, Maximize } from "lucide-react";
import { motion } from "framer-motion";

interface ComparisonTableProps {
    devices: MobileDeviceConfig[];
    onRemove: (index: number) => void;
}

export function ComparisonTable({ devices, onRemove }: ComparisonTableProps) {
    const [fullSpecs, setFullSpecs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [cache, setCache] = useState<Record<string, any>>({});

    useEffect(() => {
        loadSpecs();
    }, [devices]);

    async function loadSpecs() {
        if (devices.length === 0) {
            setFullSpecs([]);
            return;
        }
        setLoading(true);

        const promises = devices.map(async (d) => {
            if (d.specifications) return d;

            // Checks simple cache
            if (cache[d.phone_name_slug]) {
                return { ...d, specifications: cache[d.phone_name_slug] };
            }

            // V2 uses a single slug for the detail
            const data = await getDeviceSpecs(d.phone_name_slug);

            // Update cache silently
            if (data?.specifications) {
                setCache(prev => ({ ...prev, [d.phone_name_slug]: data.specifications }));
            }

            // The API returns the object directly in data, with 'specifications' property
            return { ...d, specifications: data?.specifications || [] };
        });

        const results = await Promise.all(promises);
        setFullSpecs(results);
        setLoading(false);
    }

    // Helper to extract specific spec value safely
    const getSpecValue = (specs: any[], title: string, key?: string) => {
        if (!specs) return "-";
        const category = specs.find((s: any) => s.title.toLowerCase().includes(title.toLowerCase()));
        if (!category) return "-";
        // Often the API structure is Title -> Specs array -> {key, val}
        // We will flatten or search deep
        // Let's assume structure: { title: "Display", specs: [ { key: "Type", val: ["AMOLED"] } ] }

        if (key) {
            const item = category.specs.find((s: any) => s.key.toLowerCase().includes(key.toLowerCase()));
            return item ? item.val[0] : "-";
        }

        // Return first valuable thing if no key specific
        return category.specs[0]?.val[0] || "-";
    };

    // Helper to determine winner (simple numeric parsing)
    // Returns index of winner or -1
    const compareNumeric = (val1: string, val2: string): number => {
        const parse = (v: string) => {
            if (!v || v === '-') return 0;
            const nums = v.match(/(\d+(\.\d+)?)/g);
            return nums ? parseFloat(nums[0]) : 0;
        };
        const n1 = parse(val1);
        const n2 = parse(val2);
        if (n1 > n2) return 0;
        if (n2 > n1) return 1;
        return -1;
    }

    // Categories to Compare
    const rows = [
        { icon: Maximize, label: "Ekran", category: "Display", key: "Size", compare: true },
        { icon: Cpu, label: "Platform", category: "Platform", key: "OS", compare: false },
        { icon: Cpu, label: "İşlemci", category: "Platform", key: "Chipset", compare: false },
        { icon: HardDrive, label: "Hafıza", category: "Memory", key: "Internal", compare: true },
        { icon: Camera, label: "Ana Kamera", category: "Camera", key: "Main", compare: false }, // Complex to compare MP directly
        { icon: Camera, label: "Selfie", category: "Selfie", key: "Single", compare: false },
        { icon: Battery, label: "Batarya", category: "Battery", key: "Type", compare: true }, // Try to find mAh
    ];

    if (loading) return <div className="p-20 text-center text-purple-400 animate-pulse">Cihaz verileri analiz ediliyor...</div>;
    if (fullSpecs.length === 0) return null;

    return (
        <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]/50 backdrop-blur-md">
            {/* Header Row (Images & Names) */}
            <div className="grid grid-cols-[150px_1fr_1fr] divide-x divide-white/10 border-b border-white/10">
                <div className="p-6 flex items-center justify-center text-slate-500 font-medium italic">
                    Özellikler
                </div>
                {fullSpecs.map((device, idx) => (
                    <div key={idx} className="p-6 relative group">
                        <button
                            onClick={() => onRemove(idx)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all hover:text-white"
                        >
                            <X className="size-4" />
                        </button>
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-40 w-full relative">
                                <img
                                    src={device.phone_img_url}
                                    alt={device.phone_name}
                                    className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                />
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-white">{device.phone_name}</h3>
                                <p className="text-purple-400 text-sm font-medium">{device.brand}</p>
                            </div>
                        </div>
                    </div>
                ))}
                {fullSpecs.length < 2 && (
                    <div className="p-6 flex flex-col items-center justify-center text-slate-600 gap-2 border-dashed bg-white/5 md:block hidden">
                        <Smartphone className="size-12 opacity-20" />
                        <p>Karşılaştırma için cihaz ekleyin</p>
                    </div>
                )}
            </div>

            {/* Spec Rows */}
            <div className="divide-y divide-white/5">
                {rows.map((row, rowIdx) => {
                    const val1 = getSpecValue(fullSpecs[0]?.specifications, row.category, row.key);
                    const val2 = fullSpecs[1] ? getSpecValue(fullSpecs[1].specifications, row.category, row.key) : "-";

                    const winnerIdx = (fullSpecs.length === 2 && row.compare)
                        ? compareNumeric(val1, val2)
                        : -1;

                    return (
                        <div key={rowIdx} className="grid grid-cols-[150px_1fr_1fr] divide-x divide-white/10 hover:bg-white/5 transition-colors group">
                            <div className="p-4 flex items-center gap-3 text-slate-400 font-medium bg-black/20">
                                <row.icon className="size-5 text-purple-500" />
                                <span>{row.label}</span>
                            </div>

                            {/* Device 1 Spec */}
                            <div className={`p-4 flex items-center text-sm md:text-base ${winnerIdx === 0 ? 'bg-emerald-500/10 text-emerald-300 font-semibold' : 'text-slate-300'}`}>
                                {val1}
                                {winnerIdx === 0 && <Check className="ml-auto size-4 text-emerald-500" />}
                            </div>

                            {/* Device 2 Spec */}
                            <div className={`p-4 flex items-center text-sm md:text-base ${fullSpecs[1] ? (winnerIdx === 1 ? 'bg-emerald-500/10 text-emerald-300 font-semibold' : 'text-slate-300') : 'text-slate-700'}`}>
                                {val2}
                                {winnerIdx === 1 && <Check className="ml-auto size-4 text-emerald-500" />}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend / Info Footer */}
            <div className="p-4 bg-black/40 text-center text-xs text-slate-600">
                * Veriler mobile-specs-server API üzerinden anlık olarak çekilmektedir.
            </div>
        </div>
    );
}
