"use client";

import { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ShieldAlert, Cpu, ChevronRight, AlertTriangle, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

// Glitch Text Component
const GlitchText = ({ text, className }: { text: string, className?: string }) => {
    return (
        <div className={`relative inline-block ${className}`}>
            <span className="relative z-10">{text}</span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-green-500 opacity-70 animate-pulse translate-x-[2px]">{text}</span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-red-500 opacity-70 animate-pulse -translate-x-[2px]">{text}</span>
        </div>
    );
};

// Hex Column Component
const HexColumn = ({ side }: { side: "left" | "right" }) => {
    const [hex, setHex] = useState<string[]>([]);

    useEffect(() => {
        const generateHex = () => {
            const arr = [];
            for (let i = 0; i < 40; i++) {
                arr.push(Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0'));
            }
            setHex(arr);
        };
        generateHex();
        const interval = setInterval(generateHex, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`absolute top-0 ${side === "left" ? "left-0" : "right-0"} w-12 h-screen overflow-hidden flex flex-col items-center opacity-20 pointer-events-none select-none`}>
            {hex.map((h, i) => (
                <div key={i} className="text-[10px] text-green-500 font-mono leading-tight">{h}</div>
            ))}
        </div>
    );
};

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [consoleOutput, setConsoleOutput] = useState<string[]>([
        "> SYSTEM_BOOT... [OK]",
        "> LOADING_KERNAL_MODULES... [OK]",
        "> ESTABLISHING_SECURE_TUNNEL... [OK]",
        "> WAITING_FOR_PAYLOAD...",
    ]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Matrix Rain Effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops: number[] = [];
        for (let i = 0; i < columns; i++) drops[i] = 1;
        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0F0';
            ctx.font = `${fontSize}px monospace`;
            for (let i = 0; i < drops.length; i++) {
                const text = String.fromCharCode(0x30A0 + Math.random() * 96);
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        };
        const interval = setInterval(draw, 33);
        return () => clearInterval(interval);
    }, []);

    const addToConsole = (text: string, delay = 0) => {
        setTimeout(() => {
            setConsoleOutput(prev => [...prev.slice(-6), text]);
        }, delay);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Hacking Sequence Simulation
        addToConsole("> INITIATING_BRUTE_FORCE_ATTACK...", 0);
        addToConsole("> CRACKING_HASH_SHA256...", 400);
        addToConsole("> BYPASSING_FIREWALL_LEVEL_3...", 800);
        addToConsole("> INJECTING_SQL_PAYLOAD...", 1200);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            await new Promise(r => setTimeout(r, 2000)); // Wait for animation

            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("ACCESS_DENIED: Invalid Credentials");
                addToConsole("> ERROR: AUTH_FAILURE_DETECTED", 100);
                addToConsole("> ACCESS_DENIED_BY_MAINFRAME", 300);
                setLoading(false);
            } else {
                addToConsole("> ROOT_ACCESS_GRANTED", 0);
                addToConsole("> DECRYPTING_ADMIN_DASHBOARD...", 300);
                setTimeout(() => {
                    router.push("/admin/dashboard");
                    router.refresh();
                }, 1000);
            }
        } catch (error) {
            setError("SYSTEM_FATAL_ERROR");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black font-mono selection:bg-green-900 selection:text-green-100">
            {/* Background Effects */}
            <canvas ref={canvasRef} className="absolute inset-0 opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[5] bg-[length:100%_2px,3px_100%] pointer-events-none"></div>

            {/* Hex Dumps */}
            <HexColumn side="left" />
            <HexColumn side="right" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-lg p-6"
            >
                <div className="relative border border-green-500/50 bg-black/90 shadow-[0_0_40px_rgba(34,197,94,0.15)] rounded-sm overflow-hidden backdrop-blur-md group">
                    {/* Animated Border Line */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-green-500 animate-slide"></div>

                    {/* Header */}
                    <div className="bg-green-900/10 border-b border-green-500/20 p-3 flex items-center justify-between backdrop-blur-lg">
                        <div className="flex items-center gap-3">
                            <Terminal className="w-5 h-5 text-green-500 animate-pulse" />
                            <GlitchText text="ZK_SYSTEM_OS v9.0.1" className="text-sm font-bold text-green-400 tracking-widest" />
                        </div>
                        <div className="flex gap-2 text-[10px] text-green-600 font-bold">
                            <span>CPU: 12%</span>
                            <span>MEM: 40TB</span>
                        </div>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="text-center mb-8 relative">
                            <div className="absolute -inset-4 bg-green-500/5 blur-xl rounded-full"></div>
                            <h1 className="text-2xl font-black text-green-500 tracking-[0.2em] relative z-10 mb-2">
                                <GlitchText text="ADMIN_GATEWAY" />
                            </h1>
                            <p className="text-xs text-green-700 tracking-widest uppercase animate-pulse">Restricted Access // Level 5 Clearance</p>
                        </div>

                        {/* Console */}
                        <div className="h-36 bg-black border border-green-500/30 p-3 font-mono text-xs text-green-500 overflow-hidden relative shadow-inner">
                            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,255,0,0.05)_50%,transparent_100%)] bg-[length:100%_4px] animate-scan"></div>
                            {consoleOutput.map((line, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="mb-1"
                                >
                                    {line}
                                </motion.div>
                            ))}
                            <span className="w-2 h-4 bg-green-500 inline-block align-middle ml-1 animate-blink"></span>
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 text-red-500 bg-red-950/20 p-3 border border-red-500/40 text-xs font-bold font-mono tracking-wide">
                                <AlertTriangle className="w-4 h-4" />
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1 relative group">
                                <label className="text-[10px] text-green-800 font-bold uppercase tracking-widest ml-1">Identity_Hash</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 font-bold text-xs">{`root@zk:~$`}</div>
                                    <input
                                        name="email"
                                        type="email"
                                        autoFocus
                                        disabled={loading}
                                        className="w-full bg-black border border-green-900 text-green-400 pl-24 pr-4 py-3 text-sm font-mono focus:outline-none focus:border-green-500/80 focus:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all placeholder:text-green-900/50 disabled:opacity-50"
                                        placeholder="enter_id..."
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full opacity-0 group-focus-within:opacity-100 animate-pulse"></div>
                                </div>
                            </div>

                            <div className="space-y-1 relative group">
                                <label className="text-[10px] text-green-800 font-bold uppercase tracking-widest ml-1">Access_Token</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 font-bold text-xs">{`key:`}</div>
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        disabled={loading}
                                        className="w-full bg-black border border-green-900 text-green-400 pl-12 pr-10 py-3 text-sm font-mono focus:outline-none focus:border-green-500/80 focus:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all placeholder:text-green-900/50 disabled:opacity-50"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-green-700 hover:text-green-500 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 font-bold h-12 uppercase tracking-[0.2em] border border-green-500/40 hover:border-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all mt-6 group relative overflow-hidden"
                            >
                                <span className="relative flex items-center justify-center gap-3 z-10">
                                    {loading ? <span className="animate-pulse">DECRYPTING...</span> : <GlitchText text="EXECUTE_SEQUENCE" />}
                                    {!loading && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                </span>
                                <div className="absolute inset-0 bg-green-500/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            </Button>
                        </form>
                    </div>

                    {/* Footer / Status Bar */}
                    <div className="bg-black/80 p-3 border-t border-green-500/20 flex justify-between items-center text-[10px] font-mono text-green-800 uppercase">
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="w-3 h-3 text-green-600" />
                            <span>System_Secure</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                            <span>Online</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
