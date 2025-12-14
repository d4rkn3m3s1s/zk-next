import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Zap, Shield, Globe } from "lucide-react"

export function Footer() {
    return (
        <footer className="relative bg-[#020204] border-t border-white/10 overflow-hidden pt-20 pb-10">
            {/* Neon Grid Floor Effect */}
            <div className="absolute bottom-0 left-0 w-full h-[300px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

            {/* Massive Typography Background */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-[0.03] select-none pointer-events-none">
                <h1 className="text-[20vw] font-black text-white leading-none tracking-tighter truncate">
                    ZK_FUTURE
                </h1>
            </div>

            <div className="container max-w-7xl mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <h2 className="text-3xl font-black text-white tracking-tighter">
                                ZK<span className="text-cyan-400">.</span>IO
                            </h2>
                        </Link>
                        <p className="text-slate-400 leading-relaxed font-light">
                            Geleceğin teknolojisini bugünden deneyimleyin.
                            <br />
                            Yenilenmiş cihazlarda güvenin adresi.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/30 transition-all border border-white/5 hover:border-cyan-500/30"
                                >
                                    <Icon className="h-5 w-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Kurumsal</h3>
                        <ul className="space-y-4">
                            {['Hakkımızda', 'Kariyer', 'Blog', 'İletişim'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                                        <span className="h-px w-0 bg-cyan-400 group-hover:w-4 transition-all duration-300"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Hizmetler</h3>
                        <ul className="space-y-4">
                            {['Tamir Hizmetleri', 'Cihaz Satın Al', 'Cihazını Sat', 'Kurumsal'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-2 group">
                                        <span className="h-px w-0 bg-purple-400 group-hover:w-4 transition-all duration-300"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Bülten</h3>
                        <p className="text-slate-400 text-sm mb-4">
                            Teknoloji dünyasındaki son gelişmelerden haberdar olun.
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="E-posta adresi"
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 w-full"
                            />
                            <button className="h-10 w-10 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center transition-colors">
                                <Zap className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                    <p>© 2024 ZK İletişim. Tüm hakları saklıdır.</p>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
                        <Link href="#" className="hover:text-white transition-colors">Kullanım Şartları</Link>
                    </div>
                    <div className="flex items-center gap-2 opacity-50">
                        <Globe className="h-4 w-4" />
                        <span>TR / TRY</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
