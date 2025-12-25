import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Zap, Shield, Globe } from "lucide-react"

interface FooterProps {
    settings?: any
}

export function Footer({ settings }: FooterProps) {
    const year = new Date().getFullYear();

    return (
        <footer className="relative bg-[#020204] border-t border-white/10 overflow-hidden pt-20 pb-10">
            {/* Neon Grid Floor Effect */}
            <div className="absolute bottom-0 left-0 w-full h-[300px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>


            {/* Massive Typography Background */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-[0.03] select-none pointer-events-none">
                <h1 className="text-[20vw] font-black text-white leading-none tracking-tighter truncate">
                    {settings?.siteName?.toUpperCase() || "ZK_FUTURE"}
                </h1>
            </div>

            <div className="container max-w-7xl mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <h2 className="text-3xl font-black text-white tracking-tighter">
                                {settings?.siteName || "ZK"}
                                <span className="text-cyan-400">.</span>IO
                            </h2>
                        </Link>
                        <p className="text-slate-400 leading-relaxed font-light">
                            {settings?.description || "Geleceğin teknolojisini bugünden deneyimleyin. Yenilenmiş cihazlarda güvenin adresi."}
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Facebook, href: settings?.facebook || "#", label: "Facebook" },
                                { icon: Twitter, href: settings?.twitter || "#", label: "Twitter" },
                                { icon: Instagram, href: settings?.instagram || "#", label: "Instagram" },
                                { icon: Youtube, href: settings?.youtube || "#", label: "YouTube" }
                            ].filter(s => s.href !== "#").map((social, i) => (
                                <Link
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/30 transition-all border border-white/5 hover:border-cyan-500/30"
                                    title={social.label}
                                >
                                    <social.icon className="h-5 w-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Kurumsal</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/about" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                                    <span className="h-px w-0 bg-cyan-400 group-hover:w-4 transition-all duration-300"></span>
                                    Hakkımızda
                                </Link>
                            </li>
                            {settings?.careerLink && (
                                <li>
                                    <Link href={settings.careerLink} className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                                        <span className="h-px w-0 bg-cyan-400 group-hover:w-4 transition-all duration-300"></span>
                                        Kariyer
                                    </Link>
                                </li>
                            )}
                            {settings?.blogLink && (
                                <li>
                                    <Link href={settings.blogLink} className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                                        <span className="h-px w-0 bg-cyan-400 group-hover:w-4 transition-all duration-300"></span>
                                        Blog
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Link href="/contact" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                                    <span className="h-px w-0 bg-cyan-400 group-hover:w-4 transition-all duration-300"></span>
                                    İletişim
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">İletişim & Adres</h3>
                        <ul className="space-y-4">
                            <li className="text-slate-400 flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">📍</span>
                                <span>{settings?.address || "Adres bilgisi mevcut değil."}</span>
                            </li>
                            <li className="text-slate-400 flex items-center gap-2">
                                <span className="text-cyan-400">📞</span>
                                <span>{settings?.phone || "Telefon mevcut değil."}</span>
                            </li>
                            <li className="text-slate-400 flex items-center gap-2">
                                <span className="text-cyan-400">✉️</span>
                                <span>{settings?.email || "E-posta mevcut değil."}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Brands */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Çalıştığımız Teknolojiler</h3>
                        <div className="flex flex-wrap gap-2">
                            {(() => {
                                try {
                                    const brands = settings?.brands ? JSON.parse(settings.brands) : ['APPLE', 'SAMSUNG', 'XIAOMI', 'HUAWEI', 'OPPO', 'DYSON'];
                                    return brands.map((brand: string, i: number) => (
                                        <span key={i} className="px-3 py-1 text-xs font-bold bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
                                            {brand}
                                        </span>
                                    ));
                                } catch (e) {
                                    return null;
                                }
                            })()}
                        </div>
                    </div>
                </div>


                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                    <p>© {year} {settings?.siteName || "ZK İletişim"}. Tüm hakları saklıdır.</p>
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
