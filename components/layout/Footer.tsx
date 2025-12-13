import Link from "next/link"
import { Smartphone, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-[#0b1016] text-white pt-20 pb-10 border-t border-white/5" id="contact">
            <div className="max-w-7xl mx-auto px-4 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-gradient-to-tr from-primary to-cyan-400 flex items-center justify-center text-white">
                                <Smartphone className="size-5" />
                            </div>
                            <h2 className="text-xl font-bold">Zk İletişim</h2>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Teknolojinin kalbinde, güven ve kalitenin adresi. 10 yılı aşkın tecrübemizle hizmetinizdeyiz.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                                <Instagram className="size-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                                <Twitter className="size-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-6">Hızlı Erişim</h3>
                        <ul className="flex flex-col gap-4 text-slate-400">
                            <li><Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link></li>
                            <li><Link href="/#services" className="hover:text-primary transition-colors">Hizmetlerimiz</Link></li>
                            <li><Link href="/products" className="hover:text-primary transition-colors">Ürünler</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">İletişim</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-6">İletişim</h3>
                        <ul className="flex flex-col gap-4 text-slate-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-primary mt-1 size-5" />
                                <span>Bağdat Caddesi No: 123<br />Kadıköy, İstanbul</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-primary size-5" />
                                <span>+90 212 123 45 67</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-primary size-5" />
                                <span>info@zkiletisim.com</span>
                            </li>
                        </ul>
                    </div>

                    <div className="h-48 bg-slate-800 rounded-xl overflow-hidden relative">
                        <div className="w-full h-full bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-500"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDg7SOLALHEUkMzQNF_qsxmP9y7SXLy0gB2Koc5zf6xwWZMXs0PGdGWVUZ-Pz3Fw4AJiBM2JFRFNnK3_s5Rl18L7_dy-9WmLbiEwylrvtRuI2QCo5YH_mS9b6z_lZLI6HbStzNRqaVl-njmg_MFRcC0RBn3jTwpv7F_ySid2AI4yoaDoZeA-GgW8XV3jsnCLGqRbuLSJs8nbIG_Cta8pmDUup2hz6IlXPi7zy37dXpr9Fka3448TLHNp5pphlHUg-dEVyDmuc1FUQ')" }}>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <MapPin className="text-primary size-10 drop-shadow-lg animate-bounce" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                    <p>© 2024 Zk İletişim. Tüm hakları saklıdır.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white">Gizlilik Politikası</Link>
                        <Link href="#" className="hover:text-white">Kullanım Şartları</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
