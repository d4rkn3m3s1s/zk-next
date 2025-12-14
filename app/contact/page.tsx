import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone, Send, Github, Twitter, Instagram } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="min-h-screen pt-24 pb-12 relative overflow-hidden bg-[#020204]">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow delay-1000"></div>

            <div className="container max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/30 border border-cyan-500/30 backdrop-blur-md mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        <span className="text-xs font-bold font-mono text-cyan-300 tracking-widest uppercase">COMM_LINK_ESTABLISHED</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 drop-shadow-[0_0_25px_rgba(6,182,212,0.5)]">
                        BİZE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">ULAŞIN</span>
                    </h1>
                    <p className="text-slate-400 text-xl max-w-2xl mx-auto font-light">
                        Teknik destek, iş birliği veya sadece merhaba demek için.
                        <span className="text-cyan-400 font-mono"> 7/24 Aktif Frekans</span>.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                    {/* Holographic Contact Form */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

                            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <Mail className="h-6 w-6 text-cyan-400" />
                                <span className="tracking-wide">Mesaj Gönder</span>
                            </h3>

                            <form className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">İsim</label>
                                        <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus:border-cyan-400/50 focus:ring-cyan-400/20 transition-all font-light" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">E-posta</label>
                                        <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus:border-cyan-400/50 focus:ring-cyan-400/20 transition-all font-light" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Konu</label>
                                    <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus:border-cyan-400/50 focus:ring-cyan-400/20 transition-all font-light" placeholder="Proje veya Destek Talebi" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Mesaj</label>
                                    <Textarea className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[150px] rounded-xl focus:border-cyan-400/50 focus:ring-cyan-400/20 transition-all font-light resize-none p-4" placeholder="Mesajınız..." />
                                </div>
                                <Button className="w-full h-14 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all duration-300">
                                    GÖNDER <Send className="ml-2 h-5 w-5" />
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* 3D Map & Info */}
                    <div className="space-y-12">
                        {/* Info Cards */}
                        <div className="grid gap-6">
                            <div className="group relative overflow-hidden bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-start gap-4 relative z-10">
                                    <div className="h-12 w-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-1">Merkez Ofis</h4>
                                        <p className="text-slate-400 leading-relaxed">
                                            Teknoloji Vadisi, Blok 404<br />
                                            Maslak, İstanbul 34000
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-start gap-4 relative z-10">
                                    <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-1">İletişim Hattı</h4>
                                        <p className="text-slate-400 leading-relaxed">
                                            +90 (212) 555 0123<br />
                                            <span className="text-xs text-purple-400 uppercase tracking-wider">09:00 - 18:00 (Pzt-Cum)</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-start gap-4 relative z-10">
                                    <div className="h-12 w-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-1">E-posta</h4>
                                        <p className="text-slate-400 leading-relaxed">
                                            hello@zk-iletisim.com<br />
                                            support@zk-iletisim.com
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            {[
                                { icon: Github, color: "hover:text-white" },
                                { icon: Twitter, color: "hover:text-cyan-400" },
                                { icon: Instagram, color: "hover:text-pink-400" }
                            ].map((social, i) => (
                                <button key={i} className={`h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 transition-all hover:scale-110 hover:bg-white/10 ${social.color}`}>
                                    <social.icon className="h-6 w-6" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
