"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Cpu, Smartphone, Battery, Camera, Trophy, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchPhones, getPhoneDetails } from "@/app/actions/phone-api";


// Dynamically import 3D Phone
const PhoneExperience = dynamic(() => import("@/components/ui/3d-phone").then(mod => mod.default), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full flex items-center justify-center text-white/20">3D MODEL YÜKLENİYOR...</div>
});

// Simple hook if lib/hooks doesn't exist
function useDebounceValue(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

function DeviceSelector({ label, selectedDevice, onSelect }: { label: string, selectedDevice: any, onSelect: (d: any) => void }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const debouncedQuery = useDebounceValue(query, 500);

    useEffect(() => {
        async function fetch() {
            if (debouncedQuery.length < 2) {
                setResults([]);
                return;
            }
            setLoading(true);
            const data = await searchPhones(debouncedQuery);
            setResults(data);
            setLoading(false);
        }
        fetch();
    }, [debouncedQuery]);

    const handleSelect = async (slug: string) => {
        setLoading(true);
        const details = await getPhoneDetails(slug);
        if (details) {
            onSelect(details);
            setQuery("");
            setOpen(false);
        }
        setLoading(false);
    };

    return (
        <div className="w-full md:w-80 bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl relative">
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{label}</label>

            {!selectedDevice ? (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                        placeholder="Cihaz Ara..."
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                        className="pl-10 bg-white/5 border-white/10 text-white"
                    />
                    {/* Results Dropdown */}
                    {open && query.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl overflow-hidden z-50 max-h-60 overflow-y-auto shadow-xl">
                            {loading && <div className="p-4 text-center text-xs text-slate-500"><Loader2 className="w-4 h-4 animate-spin mx-auto" /></div>}
                            {!loading && results.length === 0 && <div className="p-4 text-center text-xs text-slate-500">Sonuç bulunamadı</div>}
                            {results.map((phone) => (
                                <div
                                    key={phone.slug}
                                    className="p-3 hover:bg-white/10 cursor-pointer flex items-center gap-3 transition-colors"
                                    onClick={() => handleSelect(phone.slug)}
                                >
                                    <img src={phone.image} alt={phone.phone_name} className="w-8 h-8 object-contain rounded-md bg-white/5" />
                                    <div className="text-sm font-bold text-white max-w-[180px] truncate">{phone.phone_name}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="relative">
                    <div className="flex flex-col items-center">
                        <img src={selectedDevice.image} alt={selectedDevice.name} className="h-32 object-contain mb-4 drop-shadow-2xl" />
                        <h3 className="text-xl font-black text-white text-center leading-tight mb-1">{selectedDevice.name}</h3>
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">{selectedDevice.brand}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0 h-6 w-6 p-0 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-400"
                        onClick={() => onSelect(null)}
                    >
                        X
                    </Button>
                </div>
            )}
        </div>
    );
}

export default function ComparePage() {
    const [data1, setData1] = useState<any>(null);
    const [data2, setData2] = useState<any>(null);

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black z-0 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-purple-400">
                        VERSUS
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Milyonlarca cihaz arasından seçim yapın ve detaylı karşılaştırma yapın.
                    </p>
                </motion.div>

                {/* 3D Hero Between/Background */}
                <div className="w-full h-[400px] md:h-[500px] mb-12 relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center z-0 opacity-40 pointer-events-none">
                        {/* 3D Model placeholder or actual if performant */}
                        <PhoneExperience />
                    </div>

                    {/* Comparison Controls */}
                    <div className="w-full max-w-5xl z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-4">
                        <DeviceSelector label="Cihaz 1" selectedDevice={data1} onSelect={setData1} />

                        <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center font-black text-3xl shadow-[0_0_50px_rgba(255,255,255,0.3)] z-20 shrink-0">
                            VS
                        </div>

                        <DeviceSelector label="Cihaz 2" selectedDevice={data2} onSelect={setData2} />
                    </div>
                </div>

                {/* Comparison Table */}
                {(data1 || data2) && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-4xl bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden"
                    >
                        <div className="grid grid-cols-3 bg-white/5 p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                            <div>{data1?.name || "Seçilmedi"}</div>
                            <div>Özellik</div>
                            <div>{data2?.name || "Seçilmedi"}</div>
                        </div>

                        {[
                            { label: "İşlemci / Platform", icon: Cpu, k: "cpu" },
                            { label: "Bellek (RAM/ROM)", icon: Cpu, k: "ram" },
                            { label: "Ekran", icon: Smartphone, k: "screen" },
                            { label: "Çözünürlük", icon: Smartphone, k: "resolution" },
                            { label: "Batarya", icon: Battery, k: "battery" },
                            { label: "Kamera", icon: Camera, k: "camera" },
                            { label: "İşletim Sistemi", icon: Cpu, k: "os" },
                        ].map((row, idx) => (
                            <div key={idx} className="grid grid-cols-3 p-6 border-t border-white/5 items-center hover:bg-white/5 transition-colors">
                                <div className="text-center font-medium text-slate-300 text-sm md:text-base">
                                    {data1?.specs[row.k] || "-"}
                                </div>
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <row.icon className="w-5 h-5 text-slate-600" />
                                    <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase text-center">{row.label}</span>
                                </div>
                                <div className="text-center font-medium text-slate-300 text-sm md:text-base">
                                    {data2?.specs[row.k] || "-"}
                                </div>
                            </div>
                        ))}

                        {/* Scores */}
                        <div className="p-8 border-t border-white/10 bg-black/40">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-purple-400 font-bold flex items-center gap-2">
                                    <Trophy className="w-4 h-4" /> ZK Skoru
                                </div>
                                <div className="text-cyan-400 font-bold flex items-center gap-2">
                                    ZK Skoru <Trophy className="w-4 h-4" />
                                </div>
                            </div>

                            <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden flex">
                                {data1 && (
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${data1.specs.score}%` }}
                                        className="h-full bg-purple-500 rounded-l-full"
                                    />
                                )}
                                <div className="flex-1" />
                                {data2 && (
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${data2.specs.score}%` }}
                                        className="h-full bg-cyan-500 rounded-r-full"
                                    />
                                )}
                            </div>
                            <div className="flex justify-between mt-2 text-2xl font-black">
                                <span>{data1 ? data1.specs.score : 0}</span>
                                <span>{data2 ? data2.specs.score : 0}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

// Dynamically import 3D Phone to avoid SSR issues
