import { getSettings } from "@/app/actions/settings"
import { Shield, Target, Zap, Award } from "lucide-react"

export default async function AboutPage() {
    const rawSettings = await getSettings()
    const settings = rawSettings as any

    const brands = settings?.brands ? JSON.parse(settings.brands) : [
        'APPLE', 'SAMSUNG', 'XIAOMI', 'HUAWEI', 'OPPO', 'DYSON',
        'SONY', 'LG', 'ASUS', 'HP', 'DELL', 'LENOVO'
    ]

    return (
        <div className="min-h-screen pt-24 pb-12 relative overflow-hidden bg-[#020204]">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow delay-1000"></div>

            <div className="container max-w-7xl mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/30 border border-purple-500/30 backdrop-blur-md mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                        </span>
                        <span className="text-xs font-bold font-mono text-purple-300 tracking-widest uppercase">ABOUT_US</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]">
                        HAKKIMIZDA
                    </h1>
                    <p className="text-slate-400 text-xl max-w-3xl mx-auto font-light leading-relaxed">
                        {settings?.aboutText || "Geleceğin teknolojisini bugünden deneyimleyin. Yenilenmiş cihazlarda güvenin adresi."}
                    </p>
                </div>

                {/* Vision & Mission */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    {/* Vision */}
                    <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-14 w-14 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30">
                                    <Target className="h-7 w-7" />
                                </div>
                                <h2 className="text-3xl font-black text-white">Vizyonumuz</h2>
                            </div>
                            <p className="text-slate-300 leading-relaxed text-lg">
                                {settings?.vision || "Teknoloji dünyasında sürdürülebilir ve erişilebilir çözümler sunarak, herkesin en son teknolojiye ulaşabilmesini sağlamak."}
                            </p>
                        </div>
                    </div>

                    {/* Mission */}
                    <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-14 w-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
                                    <Zap className="h-7 w-7" />
                                </div>
                                <h2 className="text-3xl font-black text-white">Misyonumuz</h2>
                            </div>
                            <p className="text-slate-300 leading-relaxed text-lg">
                                {settings?.mission || "Müşterilerimize kaliteli, güvenilir ve uygun fiyatlı teknoloji ürünleri sunarak, teknolojinin herkes için erişilebilir olmasını sağlamak."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Values */}
                <div className="mb-20">
                    <h2 className="text-4xl font-black text-white text-center mb-12">Değerlerimiz</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: Shield, title: "Güvenilirlik", desc: "Her ürünümüz detaylı testlerden geçer ve garanti altındadır." },
                            { icon: Award, title: "Kalite", desc: "Sadece en iyi durumda olan ürünleri müşterilerimize sunuyoruz." },
                            { icon: Zap, title: "Hız", desc: "Hızlı teslimat ve anında teknik destek sağlıyoruz." }
                        ].map((value, i) => (
                            <div key={i} className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                                <div className="relative z-10">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center text-purple-400 mb-4 border border-purple-500/30">
                                        <value.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                                    <p className="text-slate-400 leading-relaxed">{value.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Brands */}
                <div className="text-center">
                    <h2 className="text-4xl font-black text-white mb-4">Çalıştığımız Teknolojiler</h2>
                    <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
                        Dünyanın önde gelen teknoloji markalarıyla çalışıyoruz
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {brands.map((brand: string, i: number) => (
                            <div
                                key={i}
                                className="group relative px-8 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-purple-500/30 transition-all"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                                <span className="relative z-10 text-xl font-black text-slate-300 group-hover:text-white transition-colors tracking-wider">
                                    {brand}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
