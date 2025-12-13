"use client";

import { Search, Package, Wrench, CheckCircle, AlertCircle, FileText, Banknote } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useState } from "react"

// Import Scene dynamically to avoid SSR issues with Canvas
const Scene = dynamic(() => import("@/components/3d/Scene"), { ssr: false })

export default function RepairTrackingClient({
    initialCode,
    repair
}: {
    initialCode?: string
    repair: any
}) {
    const steps = [
        { id: "received", label: "Cihaz Teslim Alındı", icon: Package },
        { id: "diagnosing", label: "Arıza Tespiti", icon: Search },
        { id: "repairing", label: "Onarım Süreci", icon: Wrench },
        { id: "completed", label: "İşlem Tamamlandı", icon: CheckCircle },
    ]

    // Determine current step index
    let currentStepIndex = -1
    if (repair) {
        switch (repair.status) {
            case "received": currentStepIndex = 0; break;
            case "diagnosing": currentStepIndex = 1; break;
            case "repairing": currentStepIndex = 2; break;
            case "completed": currentStepIndex = 3; break;
            case "delivered": currentStepIndex = 4; break; // All completed
            default: currentStepIndex = 0;
        }
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 overflow-x-hidden relative font-sans">
            {/* 3D Scene Background */}
            <Scene />

            {/* Overlay Gradient for readability */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>

            <main className="relative z-10 container max-w-5xl mx-auto px-4 py-20 lg:py-32 flex flex-col items-center min-h-[80vh] justify-center">

                {/* Header */}
                <div className="text-center mb-16 space-y-6 relative">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-md text-cyan-400 text-sm font-medium animate-float">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                        Canlı Onarım Takibi
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-400 tracking-tight drop-shadow-2xl">
                        Cihaz Durumunu <br />
                        <span className="text-cyan-500 drop-shadow-[0_0_30px_rgba(6,182,212,0.8)]">Sorgula</span>
                    </h1>
                    <p className="text-slate-300 text-lg max-w-xl mx-auto border-l-2 border-cyan-500/50 pl-4 text-left drop-shadow-md">
                        Servisimize bıraktığınız cihazın tüm süreçlerini, ücret detaylarını ve teknisyen notlarını buradan takip edebilirsiniz.
                    </p>
                </div>

                {/* Search Box */}
                <div className="w-full max-w-md mb-20">
                    <form className="relative group perspective-1000">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
                        <div className="relative flex items-center bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl p-2 transition-all duration-300 group-hover:border-cyan-500/80 group-hover:shadow-[0_0_50px_rgba(6,182,212,0.3)]">
                            <input
                                name="code"
                                defaultValue={initialCode}
                                placeholder="Takip Kodu Girin (Örn: ZK-1234)"
                                className="flex-1 bg-transparent border-none text-white placeholder:text-slate-400 px-4 py-4 focus:ring-0 text-lg font-mono tracking-wider uppercase"
                                autoComplete="off"
                            />
                            <button type="submit" className="p-4 bg-cyan-500 text-black rounded-xl hover:bg-cyan-400 transition-all hover:scale-105 active:scale-95 font-bold shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                                <Search className="w-6 h-6" />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Result Display */}
                {initialCode && !repair && (
                    <div className="w-full max-w-md p-6 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-md text-center animate-pulse">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-red-200 mb-2">Kayıt Bulunamadı</h3>
                        <p className="text-red-200/60">Lütfen takip kodunuzu kontrol edip tekrar deneyin.</p>
                    </div>
                )}

                {repair && (
                    <div className="w-full max-w-4xl animate-in slide-in-from-bottom-10 fade-in duration-700">
                        {/* Status Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                            {/* Device Info Card */}
                            <div className="group relative bg-slate-900/30 border border-white/10 p-8 rounded-3xl backdrop-blur-xl hover:border-cyan-500/50 transition-all duration-500 hover:bg-slate-900/50 overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 p-32 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/20 transition-colors"></div>

                                <h3 className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-cyan-500 rounded-full"></div>
                                    Cihaz Bilgileri
                                </h3>

                                <div className="space-y-8 relative z-10">
                                    <div>
                                        <div className="text-xs text-slate-400 mb-1 uppercase tracking-wide">Model</div>
                                        <div className="text-3xl font-black text-white font-display tracking-tight text-shadow-glow">{repair.device_model}</div>
                                    </div>

                                    {/* NEW: Fault Note */}
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 uppercase tracking-wide">
                                            <FileText className="w-3 h-3 text-cyan-500" />
                                            Arıza Notu
                                        </div>
                                        <div className="text-lg text-slate-200 leading-relaxed">{repair.issue}</div>
                                    </div>

                                    {/* NEW: Fee Display */}
                                    <div className="flex items-center justify-between bg-gradient-to-r from-cyan-950/50 to-transparent rounded-2xl p-4 border border-cyan-500/20">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-cyan-500/20 rounded-lg">
                                                <Banknote className="w-6 h-6 text-cyan-400" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-400 uppercase tracking-wide">Tahmini Ücret</div>
                                                <div className="text-sm text-cyan-300">Onay Bekliyor / Netleşmedi</div>
                                            </div>
                                        </div>
                                        <div className="text-2xl font-black text-white">
                                            {repair.estimated_cost ? `₺${Number(repair.estimated_cost).toLocaleString('tr-TR')}` : '-'}
                                        </div>
                                    </div>

                                    <div className="flex gap-8 pt-4 border-t border-white/10">
                                        <div>
                                            <div className="text-xs text-slate-400 mb-1">Kayıt Tarihi</div>
                                            <div className="text-sm font-mono text-cyan-400">{new Date(repair.createdAt).toLocaleDateString('tr-TR')}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-400 mb-1">Tahmini Teslim</div>
                                            <div className="text-sm font-mono text-cyan-400">
                                                {repair.estimatedDate ? new Date(repair.estimatedDate).toLocaleDateString('tr-TR') : 'Hesaplanıyor...'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Timeline Card */}
                            <div className="relative bg-slate-900/30 border border-white/10 p-8 rounded-3xl backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-2xl">
                                <div className="absolute bottom-0 left-0 p-24 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                                <h3 className="text-purple-400 text-sm font-bold uppercase tracking-widest mb-8 relative z-10 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                                    İşlem Durumu
                                </h3>

                                <div className="relative space-y-8 pl-4 z-10">
                                    {/* Connecting Line */}
                                    <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-800"></div>

                                    {steps.map((step, idx) => {
                                        const isCompleted = idx <= currentStepIndex
                                        const isCurrent = idx === currentStepIndex

                                        return (
                                            <div key={step.id} className={`relative flex items-center gap-6 ${isCompleted ? 'opacity-100' : 'opacity-40 blur-[1px]'}`}>
                                                <div className={`
                                                    relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500
                                                    ${isCurrent ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.6)] scale-110 rotate-3' :
                                                        isCompleted ? 'bg-slate-800 border-cyan-500/50 text-cyan-400' :
                                                            'bg-slate-900 border-slate-700 text-slate-600'}
                                                `}>
                                                    <step.icon className={`w-6 h-6 ${isCurrent ? 'text-black animate-pulse' : ''}`} />
                                                </div>
                                                <div>
                                                    <div className={`font-bold text-lg ${isCurrent ? 'text-white text-shadow-glow' : 'text-slate-300'}`}>{step.label}</div>
                                                    {isCurrent && <div className="text-xs text-cyan-400 font-medium mt-1 animate-pulse tracking-wider uppercase">Şu anki aşama</div>}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="text-center">
                            <p className="text-slate-400 text-sm drop-shadow-md">
                                Sorularınız için <Link href="/contact" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/30">İletişime Geçin</Link> veya WhatsApp hattımızı kullanın.
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
