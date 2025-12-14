import { Zap, ShieldCheck, Smartphone, RefreshCw, Building2, Server, Cpu, Microscope, Layers } from "lucide-react"
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/40 via-[#020204] to-[#020204] z-0" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="relative z-10 pt-32 pb-20 px-4 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-24 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-md text-cyan-400 text-xs font-mono tracking-widest uppercase">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        Next-Gen Repair Architecture
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
                        GELECEĞİN <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">TEKNOLOJİSİ</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
                        Sıradan tamir servislerini unutun. Uzay çağı ekipmanları ve yapay zeka destekli diyagnostik ile cihazınızı fabrika standartlarının ötesine taşıyoruz.
                    </p>
                </div>

                {/* Main Grid */}
                <BentoGrid className="lg:grid-rows-4 mb-20">
                    <BentoCard
                        name="Nano-Teknoloji Onarım"
                        className="lg:col-span-2 lg:row-span-2"
                        icon={<Microscope className="h-full w-full" />}
                        description="Mikroskobik düzeyde anakart onarımı. Gözle görülmeyen arızaları lazer hassasiyetiyle tespit edip onarıyoruz."
                        href="/contact"
                        cta="Teknik Servis Başlat"
                        background={<div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />}
                    />
                    <BentoCard
                        name="Orijinal Parça Ekosistemi"
                        className="lg:col-span-1 lg:row-span-1"
                        icon={<ShieldCheck className="h-full w-full" />}
                        description="Apple, Samsung ve Xiaomi yetkili servis parçaları."
                        href="/contact"
                        cta="Stok Sorgula"
                        background={<div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-green-500/20 to-transparent" />}
                    />
                    <BentoCard
                        name="AI Destekli Diyagnostik"
                        className="lg:col-span-1 lg:row-span-1"
                        icon={<Cpu className="h-full w-full" />}
                        description="Yapay zeka algoritmaları ile cihazınızın röntgenini çekiyoruz."
                        href="/contact"
                        cta="Tarama Yap"
                        background={<div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-transparent to-transparent" />}
                    />
                    <BentoCard
                        name="Hızlı Ekran & Batarya"
                        className="lg:col-span-1 lg:row-span-2"
                        icon={<Zap className="h-full w-full" />}
                        description="30 dakikada cihazınız ilk günkü performansına dönsün."
                        href="/contact"
                        cta="Randevu Al"
                        background={<div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-yellow-500/20 to-transparent" />}
                    />
                    <BentoCard
                        name="Veri Kurtarma"
                        className="lg:col-span-2 lg:row-span-1"
                        icon={<Server className="h-full w-full" />}
                        description="Silinen, hasar gören veya açılmayan cihazlardan %98 başarı oranıyla verilerinizi kurtarıyoruz."
                        href="/contact"
                        cta="Analiz İste"
                        background={<div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent" />}
                    />
                    <BentoCard
                        name="Kurumsal Filo Yönetimi"
                        className="lg:col-span-1 lg:row-span-1"
                        icon={<Building2 className="h-full w-full" />}
                        description="Şirket cihazlarınız için yerinde servis ve bakım anlaşmaları."
                        href="/contact"
                        cta="Teklif Al"
                        background={<div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent" />}
                    />
                    <BentoCard
                        name="Takas & Yenileme"
                        className="lg:col-span-2 lg:row-span-1"
                        icon={<RefreshCw className="h-full w-full" />}
                        description="Eski cihazınızı getirin, en son model teknolojiyle anında değiştirin. Yüksek takas desteği."
                        href="/contact"
                        cta="Değer Hesapla"
                        background={<div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-transparent" />}
                    />
                </BentoGrid>

                {/* Tech Stack / Brands Section */}
                <div className="border-t border-white/10 pt-20">
                    <h3 className="text-center text-sm font-mono text-slate-500 mb-10 uppercase tracking-widest">Çalıştığımız Teknolojiler</h3>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholder text logos for brands, styling them to look futuristic */}
                        {['APPLE', 'SAMSUNG', 'XIAOMI', 'HUAWEI', 'OPPO', 'DYSON'].map((brand) => (
                            <span key={brand} className="text-2xl font-black text-slate-300 hover:text-white hover:scale-110 transition-transform cursor-default">
                                {brand}
                            </span>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-32 relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm p-12 text-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />
                    <h2 className="text-4xl font-bold mb-6 relative z-10">Hazır mısınız?</h2>
                    <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto relative z-10">
                        Cihazınız için en iyi servisi deneyimlemek üzeresiniz.
                    </p>
                    <div className="relative z-10">
                        <Button size="lg" className="bg-white text-black hover:bg-slate-200 rounded-full px-8 h-12 font-bold" asChild>
                            <Link href="/contact">Hemen İletişime Geçin</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
