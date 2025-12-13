import Link from "next/link"
import { Phone, Mail, MapPin, MessageCircle, Send, Camera, ThumbsUp, Store, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { createMessage } from "@/app/actions/message"

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
    const { success: successParam } = await searchParams
    const success = successParam === 'true'

    return (
        <main className="relative flex min-h-screen w-full flex-col pt-10 overflow-x-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
            </div>

            <div className="container relative z-10 flex h-full grow flex-col px-5 md:px-10 lg:px-40 py-10">
                <div className="flex flex-col max-w-[1200px] mx-auto w-full gap-16">
                    {/* Hero Section */}
                    <section className="flex flex-col lg:flex-row gap-12 items-center lg:items-start pt-10">
                        {/* Text Content */}
                        <div className="flex-1 flex flex-col gap-6 lg:pt-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary w-fit">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider">7/24 Destek</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.1]">
                                Teknolojiyle <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Bağlantıda Kalın</span>
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                                Cihazınızla ilgili bir sorunuz mu var? Teknik servis, satış veya sadece bir merhaba için buradayız. ZK İletişim olarak size en hızlı çözümü sunuyoruz.
                            </p>
                            <div className="flex flex-wrap gap-4 mt-4">
                                <Link href="tel:+905551234567" className="group flex items-center gap-4 p-4 pr-6 rounded-2xl bg-card shadow-sm border border-border hover:border-primary/50 transition-all cursor-pointer">
                                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium text-muted-foreground uppercase">Hemen Arayın</span>
                                        <span className="font-bold text-foreground">+90 555 123 45 67</span>
                                    </div>
                                </Link>
                                <Link href="mailto:info@zkiletisim.com" className="group flex items-center gap-4 p-4 pr-6 rounded-2xl bg-card shadow-sm border border-border hover:border-primary/50 transition-all cursor-pointer">
                                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium text-muted-foreground uppercase">E-Posta Gönderin</span>
                                        <span className="font-bold text-foreground">info@zkiletisim.com</span>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* 3D Visual Representation */}
                        <div className="flex-1 w-full flex justify-center lg:justify-end perspective-container">
                            <div className="relative w-full max-w-[500px] aspect-square">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl transform rotate-12"></div>
                                {/* Main Image Card */}
                                <div className="absolute inset-4 z-20 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-500/20 border-[8px] border-slate-900 bg-slate-900 animate-float">
                                    <img
                                        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                                        alt="Modern smartphone showing abstract colorful gradient screen"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvleIQKkWaPajkoVOKI4E86GhvKbn7GavZRcEXJWPh55qrODlfcGglnmiZXJidrXmxSC9X6e9g26G6Qp-lFAWE_qSJcv450lE812VXnLkz1V-FauuWvY8BX3OJzcHzOkfE4T30FZI9eA0DKmTfBFfZ1I8fUPu7D5JOkNzxO_yIqoeKi9xehkCOBOn7ztj_uvFVv__3enOTpmdwf4ZMbR4MqkLjCVRJuPjRxnQ_q3fprhz5ZNiXG-uRelv_uADfIwDF-iCs8LacBw"
                                    />
                                    {/* Overlay UI Elements */}
                                    <div className="absolute bottom-6 left-6 right-6 p-4 bg-background/60 backdrop-blur-md rounded-xl flex items-center justify-between border border-white/10">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-muted-foreground">Durum</span>
                                            <span className="text-sm font-bold text-white">Çevrimiçi</span>
                                        </div>
                                        <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
                                    </div>
                                </div>
                                {/* Decorative Floating Elements */}
                                <div className="absolute -top-4 -right-4 z-30 p-4 bg-card rounded-2xl shadow-lg border border-border animate-float-delayed">
                                    <MapPin className="text-primary h-8 w-8" />
                                </div>
                                <div className="absolute bottom-10 -left-6 z-30 p-4 bg-card rounded-2xl shadow-lg border border-border animate-float">
                                    <MessageCircle className="text-primary h-8 w-8" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Info & Form Section */}
                    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        {/* Left: Contact Form */}
                        <div className="lg:col-span-7 flex flex-col gap-6">
                            <div className="bg-card/50 backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-border relative overflow-hidden">
                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold text-foreground mb-2">Bize Yazın</h3>
                                    <p className="text-muted-foreground mb-8">Formu doldurun, uzman ekibimiz en kısa sürede sizinle iletişime geçsin.</p>

                                    {success ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                                            <div className="size-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                            </div>
                                            <h4 className="text-xl font-bold text-foreground">Mesajınız Gönderildi!</h4>
                                            <p className="text-muted-foreground max-w-xs">
                                                En kısa sürede sizinle iletişime geçeceğiz. Teşekkür ederiz.
                                            </p>
                                            <Link href="/contact">
                                                <Button variant="outline">Yeni Mesaj Gönder</Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <form action={createMessage} className="flex flex-col gap-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">Adınız Soyadınız</Label>
                                                    <Input id="name" name="name" placeholder="John Doe" className="h-12 rounded-xl" required />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="phone">Telefon Numarası</Label>
                                                    <Input id="phone" name="phone" placeholder="0555 000 00 00" type="tel" className="h-12 rounded-xl" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="email">E-Posta Adresi</Label>
                                                    <Input id="email" name="email" placeholder="ornek@email.com" type="email" className="h-12 rounded-xl" required />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="subject">Konu</Label>
                                                    <Input id="subject" name="subject" placeholder="Teknik Servis, Satış..." className="h-12 rounded-xl" required />
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="message">Mesajınız</Label>
                                                <Textarea id="message" name="message" placeholder="Sorununuzu veya talebinizi kısaca anlatın..." rows={4} className="rounded-xl resize-none" required />
                                            </div>
                                            <div className="flex items-center space-x-2 pt-2">
                                                <Checkbox id="privacy" required />
                                                <label htmlFor="privacy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground">
                                                    <Link href="#" className="text-primary hover:underline">KVKK Aydınlatma Metni</Link>'ni okudum ve kabul ediyorum.
                                                </label>
                                            </div>
                                            <Button size="lg" className="w-full md:w-auto self-start h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/30">
                                                Gönder <Send className="ml-2 h-5 w-5" />
                                            </Button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: Map & Socials */}
                        <div className="lg:col-span-5 flex flex-col gap-6">
                            {/* Map Card */}
                            <div className="h-[300px] lg:h-auto lg:flex-1 rounded-3xl overflow-hidden border border-border relative group">
                                <div className="w-full h-full bg-slate-800 relative">
                                    <img
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                        alt="Google Maps view of Istanbul city streets"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuADbddPfDmoh5uIMZvnr-VmwfP1yLHB0r4sCgVHzfherYkHCKECPa4IxRb3-WzEeDd4P_r9UY5Zz19aO4lg9QgvzdjXBSpiOt2Xgs5kilCxR1mBTZt2HaQ22K8CnvyKHkvFM6x-beraBzee617Q5L5Y6yRbbSej3Ctee_nMK6xcOFfRJMFpsGc5T98Xig8soNNW-i62KilSxlCawyBH7ZguuWt_aapmagzE3QHvIb6GlFozQzBsd0DTSWM4KEJwzVbq2nt3cIZlxQ"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="size-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/50 animate-bounce">
                                                <Store className="text-white h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg">Merkez Mağaza</h4>
                                                <p className="text-sm text-slate-200">Teknoloji Cad. No: 12, İstanbul</p>
                                            </div>
                                        </div>
                                        <Button variant="secondary" className="w-full bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30 text-white">
                                            Yol Tarifi Al
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="grid grid-cols-3 gap-4">
                                <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-card border border-border hover:border-pink-500 hover:text-pink-500 transition-all group shadow-sm">
                                    <Camera className="h-8 w-8 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-bold text-muted-foreground group-hover:text-pink-500">Instagram</span>
                                </Link>
                                <Link href="https://wa.me/905551234567" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-card border border-border hover:border-green-500 hover:text-green-500 transition-all group shadow-sm">
                                    <MessageCircle className="h-8 w-8 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-bold text-muted-foreground group-hover:text-green-500">WhatsApp</span>
                                </Link>
                                <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-card border border-border hover:border-blue-600 hover:text-blue-600 transition-all group shadow-sm">
                                    <ThumbsUp className="h-8 w-8 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-bold text-muted-foreground group-hover:text-blue-600">Facebook</span>
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Floating Action Button */}
            <Link href="https://wa.me/905551234567" target="_blank" rel="noopener noreferrer" className="fixed bottom-8 right-8 z-50 size-16 bg-green-500 hover:bg-green-600 rounded-full shadow-lg shadow-green-500/40 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 group">
                <MessageCircle className="h-8 w-8 animate-pulse" />
                <span className="absolute right-full mr-4 bg-card text-foreground text-sm font-bold px-3 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-border">
                    Canlı Destek
                </span>
            </Link>
        </main>
    )
}
