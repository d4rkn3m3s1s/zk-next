"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ShieldCheck, Zap, Camera, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PremiumPhoneCard() {
    const ref = useRef<HTMLDivElement>(null);

    // Mouse tilt values
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth springs for tilt
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), {
        stiffness: 150,
        damping: 20,
    });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), {
        stiffness: 150,
        damping: 20,
    });

    // Floating layers - Parallax effect
    const cardX = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });
    const cardY = useSpring(useTransform(y, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

    const badgeX = useSpring(useTransform(x, [-0.5, 0.5], [-25, 25]), { stiffness: 150, damping: 20 });
    const badgeY = useSpring(useTransform(y, [-0.5, 0.5], [-25, 25]), { stiffness: 150, damping: 20 });

    const glowX = useSpring(useTransform(x, [-0.5, 0.5], [-50, 50]), { stiffness: 150, damping: 20 });
    const glowY = useSpring(useTransform(y, [-0.5, 0.5], [-50, 50]), { stiffness: 150, damping: 20 });


    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();

        // Normalize mouse position from -0.5 to 0.5 relative to the center
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = (mouseX / width) - 0.5;
        const yPct = (mouseY / height) - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center p-4">
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="relative w-[320px] md:w-[360px] aspect-[9/19] rounded-[3rem] cursor-pointer group"
            >

                {/* Deep Aura Glow Behind */}
                <motion.div
                    style={{ x: glowX, y: glowY, z: -50 }}
                    className="absolute -inset-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                />

                {/* --- MAIN PHONE BODY (Middle Layer) --- */}
                <div
                    className="absolute inset-0 bg-black rounded-[3rem] border-[8px] border-[#222] shadow-2xl overflow-hidden z-20"
                    style={{ transform: "translateZ(0px)" }}
                >
                    {/* Screen Image / Wallpaper */}
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1696426362228-568eb220370f?q=80&w=2664&auto=format&fit=crop')" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    </div>

                    {/* UI Elements on screen */}
                    <div className="absolute top-0 left-0 right-0 p-6 pt-12 flex justify-between items-start">
                        <div className="text-white/80 text-xs font-medium backdrop-blur-md bg-black/20 px-2 py-1 rounded-full">9:41</div>
                        <div className="flex gap-1">
                            <div className="w-4 h-4 rounded-full bg-black/40 backdrop-blur-md border border-white/10"></div>
                            <div className="w-4 h-4 rounded-full bg-black/40 backdrop-blur-md border border-white/10"></div>
                        </div>
                    </div>

                    <div className="absolute bottom-10 left-6">
                        <h3 className="text-white text-3xl font-bold leading-tight">iPhone 16 <br /><span className="text-purple-400">Pro Max</span></h3>
                        <p className="text-white/60 text-sm mt-2">Titanium. So strong. So light. So Pro.</p>
                    </div>
                </div>


                {/* --- REFLECTIONS/GLOSS (Top Layer) --- */}
                <div className="absolute inset-0 rounded-[3rem] ring-1 ring-white/10 z-30 pointer-events-none bg-gradient-to-tr from-white/10 to-transparent mix-blend-overlay"></div>


                {/* --- FLOATING BADGES (Front Layer - Parallax) --- */}
                <motion.div
                    style={{ x: badgeX, y: badgeY, z: 60 }}
                    className="absolute -right-12 top-20 flex items-center gap-3 z-40"
                >
                    <div className="glass-panel p-3 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_8px_16px_-4px_rgba(0,0,0,0.5)] flex items-center gap-3 animate-float-delayed">
                        <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                            <Cpu className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <div className="text-[10px] uppercase font-bold text-white/40 tracking-wider">CHIP</div>
                            <div className="text-sm font-bold text-white">A18 Pro</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    style={{ x: cardX, y: cardY, z: 50 }}
                    className="absolute -left-12 bottom-32 flex items-center gap-3 z-40"
                >
                    <div className="glass-panel p-3 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_8px_16px_-4px_rgba(0,0,0,0.5)] flex items-center gap-3 animate-float">
                        <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400">
                            <Camera className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <div className="text-[10px] uppercase font-bold text-white/40 tracking-wider">CAMERA</div>
                            <div className="text-sm font-bold text-white">48MP Main</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    style={{ x: badgeX, y: badgeY, z: 70 }}
                    className="absolute -right-4 bottom-10 flex items-center gap-3 z-40"
                >
                    <div className="glass-panel p-3 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_8px_16px_-4px_rgba(0,0,0,0.5)] flex items-center gap-3 animate-float-delayed">
                        <div className="bg-amber-500/20 p-2 rounded-lg text-amber-400">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <div className="text-[10px] uppercase font-bold text-white/40 tracking-wider">BUILD</div>
                            <div className="text-sm font-bold text-white">Titanium</div>
                        </div>
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
}
