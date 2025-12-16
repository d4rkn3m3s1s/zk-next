"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Smartphone, Plus } from "lucide-react";
import { searchDevices, MobileDeviceConfig } from "@/lib/mobile-specs";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface DeviceSelectorProps {
    onSelect: (device: MobileDeviceConfig) => void;
    slotId: number;
}

export function DeviceSelector({ onSelect, slotId }: DeviceSelectorProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<MobileDeviceConfig[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                setLoading(true);
                const data = await searchDevices(query);
                setResults(data);
                setLoading(false);
            } else {
                setResults([]);
            }
        }, 500); // Debounce

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="relative w-full">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="size-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Cihaz Ara (Örn: iPhone 14)"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    // onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Delay for click
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all shadow-lg backdrop-blur-sm"
                />
                {loading && (
                    <div className="absolute inset-y-0 right-4 flex items-center">
                        <Loader2 className="size-5 text-purple-500 animate-spin" />
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isOpen && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 max-h-[400px] overflow-y-auto custom-scrollbar"
                    >
                        <div className="p-2 space-y-1">
                            {results.map((device, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        onSelect(device);
                                        setQuery("");
                                        setResults([]);
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                                >
                                    <div className="size-12 rounded-lg bg-white/5 p-1 relative overflow-hidden border border-white/5 group-hover:border-purple-500/30">
                                        {/* We use a generic icon if img url fails or is placeholder */}
                                        {device.phone_img_url ? (
                                            <img
                                                src={device.phone_img_url}
                                                alt={device.phone_name}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <Smartphone className="w-full h-full text-slate-600 p-2" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-200 group-hover:text-purple-300 transition-colors">
                                            {device.phone_name}
                                        </div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                                            {device.brand}
                                        </div>
                                    </div>
                                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus className="size-5 text-purple-500" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop to close */}
            {isOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            )}
        </div>
    );
}
