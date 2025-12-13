"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function FloatingRock({
    src,
    className,
    delay = 0,
    width,
    height,
    depth = 1,
}: {
    src: string;
    className?: string;
    delay?: number;
    width: number;
    height: number;
    depth?: number;
}) {
    return (
        <motion.div
            initial={{ y: 0, rotate: 0 }}
            animate={{
                y: [0, -20 * depth, 0],
                rotate: [0, 5 * depth, 0],
            }}
            transition={{
                duration: 5 + depth,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: delay,
            }}
            className={cn("absolute pointer-events-none mix-blend-screen", className)}
            style={{ zIndex: 10 + Math.floor(depth * 10) }}
        >
            <Image
                src={src}
                alt="Floating Rock"
                width={width}
                height={height}
                className="opacity-90"
            />
        </motion.div>
    );
}

function QuantumHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const planetY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <div
            ref={containerRef}
            className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050505]"
        >
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a103c_0%,#000000_100%)] opacity-60" />

            {/* Stars/Dust (Static for now, could be animated) */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-200" />

            {/* Main Planet Arc */}
            <motion.div
                style={{ y: planetY }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] md:w-[100%] aspect-square md:aspect-video flex items-start justify-center pt-20 mix-blend-screen z-0"
            >
                <div className="relative w-full h-full max-w-[1400px]">
                    <Image
                        src="/assets/planet-arc.png"
                        alt="Cosmic Horizon"
                        fill
                        className="object-contain object-top opacity-80"
                        priority
                    />
                    {/* Glow behind planet */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-purple-600/30 blur-[120px] rounded-full" />
                </div>
            </motion.div>

            {/* Floating Rocks */}
            <FloatingRock
                src="/assets/rock-1.png"
                width={300}
                height={300}
                className="top-[20%] left-[5%] md:left-[10%] opacity-60"
                delay={0}
                depth={1.2}
            />
            <FloatingRock
                src="/assets/rock-2.png"
                width={200}
                height={200}
                className="bottom-[20%] right-[5%] md:right-[15%]"
                delay={2}
                depth={1.5}
            />
            <FloatingRock
                src="/assets/rock-1.png" // Reusing rock 1 as rock 3 for now or rock 2 flipped
                width={150}
                height={150}
                className="top-[40%] right-[10%] md:right-[20%] opacity-40 blur-[2px]"
                delay={1}
                depth={0.8}
            />

            <FloatingRock
                src="/assets/rock-2.png"
                width={400}
                height={400}
                className="bottom-[-10%] left-[-10%] blur-[4px] opacity-80"
                delay={1.5}
                depth={2}
            />

            {/* Main Content */}
            <motion.div
                style={{ y: textY }}
                className="relative z-20 flex flex-col items-center text-center px-4 max-w-5xl mx-auto mt-20"
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md text-purple-300 text-sm font-medium tracking-wider mb-8 uppercase shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                        Geleceğin Teknolojisi Şimdi Burada
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                    className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-6 uppercase drop-shadow-[0_0_50px_rgba(168,85,247,0.5)]"
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-purple-200">
                        Teknolojinin <br /> Yeni Boyutu
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="text-lg md:text-xl text-purple-100/80 max-w-2xl font-light tracking-wide mb-10 leading-relaxed"
                >
                    Zk İletişim ile sınırları zorlayan cihazları keşfedin. Premium servis, orijinal aksesuarlar ve en yeni modeller tek bir noktada.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="flex flex-col sm:flex-row gap-6 mb-16"
                >
                    <Button
                        asChild
                        size="lg"
                        className="h-14 px-10 rounded-full bg-white text-black hover:bg-purple-50 font-bold text-base tracking-wide shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all duration-300 transform hover:scale-105"
                    >
                        <Link href="/products">
                            Ürünleri İncele <ArrowUpRight className="ml-2 w-5 h-5" />
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="h-14 px-10 rounded-full border-purple-500/50 bg-purple-950/20 text-white hover:bg-purple-900/40 font-bold text-base tracking-wide backdrop-blur-md"
                    >
                        <Link href="#services">
                            Hizmetlerimiz
                        </Link>
                    </Button>
                </motion.div>

                {/* Stats - Verified Feature Restoration */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="flex items-center justify-center gap-8 md:gap-16 border-t border-purple-500/20 pt-8 mt-4"
                >
                    <div className="text-center">
                        <p className="text-3xl font-bold text-white mb-1">10K+</p>
                        <p className="text-xs text-purple-300/60 uppercase tracking-widest">Mutlu Müşteri</p>
                    </div>
                    <div className="w-px h-12 bg-purple-500/20"></div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-white mb-1">%100</p>
                        <p className="text-xs text-purple-300/60 uppercase tracking-widest">Memnuniyet</p>
                    </div>
                    <div className="w-px h-12 bg-purple-500/20"></div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-white mb-1">24/7</p>
                        <p className="text-xs text-purple-300/60 uppercase tracking-widest">Destek</p>
                    </div>
                </motion.div>
            </motion.div>

            {/* Bottom Gradient Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/50 to-transparent z-20 pointer-events-none" />
        </div>
    );
}

export { QuantumHero };
