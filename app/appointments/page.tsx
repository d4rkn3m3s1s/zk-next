"use client";

import { useState } from "react";
import { createAppointmentAction } from "@/app/actions/appointment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Clock, Smartphone, User, Pencil, CheckCircle2 } from "lucide-react";
import { Meteors } from "@/components/ui/meteors";

export default function AppointmentPage() {
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(formData: FormData) {
        await createAppointmentAction(formData);
        setSubmitted(true);
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
                <Meteors number={20} />
                <div className="text-center space-y-6 relative z-10 max-w-lg bg-white/5 p-10 rounded-3xl border border-green-500/30 backdrop-blur-xl">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-10 h-10 text-green-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-white">Randevu Alındı!</h1>
                    <p className="text-slate-300 text-lg">
                        Talebiniz bize ulaştı. Ekibimiz sizinle en kısa sürede iletişime geçerek randevunuzu onaylayacaktır.
                    </p>
                    <Button onClick={() => window.location.href = '/'} className="bg-white/10 hover:bg-white/20 text-white rounded-xl">
                        Ana Sayfaya Dön
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12 relative overflow-hidden font-sans">
            <Meteors number={30} />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 mb-6 drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                        RANDEVU OLUŞTUR
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Cihazınız için en uygun zamanı seçin, uzman ekibimiz sizi bekliyor.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Info Section */}
                    <div className="space-y-8 hidden lg:block text-slate-300">
                        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-4 hover:bg-white/10 transition">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Clock className="w-6 h-6 text-cyan-400" /> Hızlı Servis
                            </h3>
                            <p>Randevulu müşterilerimiz için öncelikli servis hizmeti sunuyoruz. Beklemeden işleminizi başlatın.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-4 hover:bg-white/10 transition">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Smartphone className="w-6 h-6 text-purple-400" /> Ücretsiz Arıza Tespiti
                            </h3>
                            <p>Cihazınızı inceleyip sorunu tespit ediyoruz. Onarım onayı vermezseniz herhangi bir ücret talep etmiyoruz.</p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative">
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl -z-10 blur-sm"></div>

                        <form action={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Ad Soyad</Label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <Input name="name" required placeholder="İsim Soyisim" className="bg-black/50 border-slate-700 pl-10 h-12 text-white focus:border-cyan-500 rounded-xl" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Telefon</Label>
                                    <div className="relative">
                                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <Input name="phone" required placeholder="0555 555 55 55" className="bg-black/50 border-slate-700 pl-10 h-12 text-white focus:border-cyan-500 rounded-xl" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-purple-400 text-xs font-bold uppercase tracking-wider">Tarih</Label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <Input name="date" type="date" required className="bg-black/50 border-slate-700 pl-10 h-12 text-white focus:border-purple-500 rounded-xl [color-scheme:dark]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-purple-400 text-xs font-bold uppercase tracking-wider">Saat</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <Input name="time" type="time" required className="bg-black/50 border-slate-700 pl-10 h-12 text-white focus:border-purple-500 rounded-xl [color-scheme:dark]" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Cihaz Sorunu / Notunuz</Label>
                                <div className="relative">
                                    <Pencil className="absolute left-4 top-4 w-4 h-4 text-slate-500" />
                                    <Textarea name="description" placeholder="Örn: iPhone 13 ekran değişimi istiyorum..." className="bg-black/50 border-slate-700 pl-10 min-h-[120px] text-white focus:border-white/50 rounded-xl" />
                                </div>
                            </div>

                            <Button type="submit" size="lg" className="w-full h-14 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform hover:scale-[1.02]">
                                RANDEVUYU ONAYLA
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
