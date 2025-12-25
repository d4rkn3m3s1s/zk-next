"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import {
    CheckCircle2,
    Smartphone,
    BatteryCharging,
    Cpu,
    Headset,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    Check,
    MessageSquare,
    Mail
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createAppointment } from "@/app/actions/appointment"
import { useRouter } from "next/navigation"

const services = [
    {
        id: "screen",
        title: "Ekran Değişimi",
        description: "Orijinal veya A kalite ekran seçenekleriyle 30 dakikada değişim.",
        icon: Smartphone,
        color: "text-primary",
        bgColor: "bg-primary/10",
        borderColor: "peer-checked:border-primary",
        activeBg: "peer-checked:bg-primary/5"
    },
    {
        id: "battery",
        title: "Batarya Değişimi",
        description: "Performans kaybı yaşayan cihazlar için hızlı batarya yenileme.",
        icon: BatteryCharging,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        borderColor: "peer-checked:border-orange-500",
        activeBg: "peer-checked:bg-orange-500/5"
    },
    {
        id: "software",
        title: "Yazılım Desteği",
        description: "Donma, kapanma ve veri kurtarma sorunları için teknik destek.",
        icon: Cpu,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        borderColor: "peer-checked:border-green-500",
        activeBg: "peer-checked:bg-green-500/5"
    },
    {
        id: "consulting",
        title: "Genel Danışmanlık",
        description: "Cihaz yükseltme veya alım-satım öncesi uzman görüşü.",
        icon: Headset,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        borderColor: "peer-checked:border-purple-500",
        activeBg: "peer-checked:bg-purple-500/5"
    }
]

const timeSlots = [
    "09:00 - 10:00",
    "10:30 - 11:30",
    "13:00 - 14:00",
    "15:30 - 16:30"
]

export default function AppointmentPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [selectedService, setSelectedService] = useState<string | null>(null)
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        device: "",
        note: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleNext = () => {
        if (step < 3) setStep(step + 1)
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSubmit = async () => {
        if (!selectedService || !date || !selectedTime || !formData.name || !formData.phone) {
            alert("Lütfen tüm zorunlu alanları doldurun.")
            return
        }

        setIsSubmitting(true)
        try {
            await createAppointment({
                name: formData.name,
                phone: formData.phone,
                date: date,
                time: selectedTime,
                description: `${selectedService} - ${formData.device} - ${formData.note}`
            })
            alert("Randevunuz başarıyla oluşturuldu!")
            router.push("/")
        } catch (error) {
            console.error("Randevu oluşturulurken hata:", error)
            alert("Bir hata oluştu. Lütfen tekrar deneyin.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="pt-28 pb-20 min-h-screen relative overflow-hidden">
            {/* Background Decor */}
            <div className="fixed top-0 right-0 w-[50%] h-[70%] bg-gradient-to-bl from-primary/5 via-primary/0 to-transparent -z-10 rounded-bl-[100px] pointer-events-none"></div>

            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Side: Booking Flow */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Header Text */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Online Randevu Sistemi
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
                                Cihazınız için <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Profesyonel Bakım</span>
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl">
                                Aşağıdaki adımları takip ederek 3D destekli servisimizde yerinizi ayırtın. Size en uygun zamanı ve hizmeti seçin, gerisini uzman ekibimize bırakın.
                            </p>
                        </div>

                        {/* Progress Indicator */}
                        <div className="bg-card p-4 rounded-xl shadow-sm border border-border flex justify-between items-center relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 h-1 bg-muted w-full"></div>
                            <div
                                className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-500"
                                style={{ width: `${(step / 3) * 100}%` }}
                            ></div>

                            <div className={cn("flex flex-col gap-1 z-10 transition-opacity", step >= 1 ? "opacity-100" : "opacity-40")}>
                                <span className="text-xs font-bold text-primary uppercase tracking-wider">Adım 1</span>
                                <span className="text-sm font-semibold text-foreground">Hizmet Seçimi</span>
                            </div>
                            <div className={cn("flex flex-col gap-1 z-10 transition-opacity", step >= 2 ? "opacity-100" : "opacity-40")}>
                                <span className="text-xs font-bold text-primary uppercase tracking-wider">Adım 2</span>
                                <span className="text-sm font-semibold text-foreground">Tarih & Saat</span>
                            </div>
                            <div className={cn("flex flex-col gap-1 z-10 transition-opacity", step >= 3 ? "opacity-100" : "opacity-40")}>
                                <span className="text-xs font-bold text-primary uppercase tracking-wider">Adım 3</span>
                                <span className="text-sm font-semibold text-foreground">Onay</span>
                            </div>
                        </div>

                        {/* Form Container */}
                        <div className="bg-card rounded-2xl shadow-lg border border-border p-6 md:p-8 space-y-10">
                            {/* Step 1: Services */}
                            {step === 1 && (
                                <section className="animate-in fade-in slide-in-from-right-4 duration-500">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">1</span>
                                        Hizmet Türünü Seçin
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {services.map((service) => (
                                            <label key={service.id} className="group cursor-pointer relative">
                                                <input
                                                    type="radio"
                                                    name="service"
                                                    className="peer sr-only"
                                                    checked={selectedService === service.id}
                                                    onChange={() => setSelectedService(service.id)}
                                                />
                                                <div className={cn(
                                                    "h-full p-5 rounded-xl border-2 border-transparent bg-muted/50 hover:bg-muted transition-all",
                                                    service.borderColor,
                                                    service.activeBg
                                                )}>
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className={cn(
                                                            "w-12 h-12 rounded-lg bg-background shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform",
                                                            service.color
                                                        )}>
                                                            <service.icon className="h-6 w-6" />
                                                        </div>
                                                        <CheckCircle2 className={cn(
                                                            "h-6 w-6 text-primary opacity-0 transition-opacity",
                                                            selectedService === service.id && "opacity-100"
                                                        )} />
                                                    </div>
                                                    <h4 className="font-bold text-lg text-foreground mb-1">{service.title}</h4>
                                                    <p className="text-sm text-muted-foreground">{service.description}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Step 2: Date & Time */}
                            {step === 2 && (
                                <section className="animate-in fade-in slide-in-from-right-4 duration-500">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">2</span>
                                        Tarih ve Saat Seçimi
                                    </h3>
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="flex-1">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                className="rounded-md border shadow"
                                                disabled={(date) => date < new Date()}
                                            />
                                        </div>
                                        <div className="w-full md:w-48 space-y-3">
                                            <h4 className="font-bold text-foreground mb-2 text-sm">Müsait Saatler</h4>
                                            {timeSlots.map((time) => (
                                                <button
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={cn(
                                                        "w-full py-2 px-4 rounded-lg border text-sm transition-all",
                                                        selectedTime === time
                                                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                                                            : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                                                    )}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Step 3: Information */}
                            {step === 3 && (
                                <section className="animate-in fade-in slide-in-from-right-4 duration-500">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">3</span>
                                        Kişisel Bilgiler
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Ad Soyad</Label>
                                            <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="Örn: Ahmet Yılmaz" className="h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Telefon Numarası</Label>
                                            <Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="05XX XXX XX XX" type="tel" className="h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">E-posta Adresi</Label>
                                            <Input id="email" value={formData.email} onChange={handleInputChange} placeholder="ahmet@ornek.com" type="email" className="h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="device">Cihaz Modeli</Label>
                                            <Input id="device" value={formData.device} onChange={handleInputChange} placeholder="Örn: iPhone 13 Pro" className="h-12" />
                                        </div>
                                        <div className="col-span-1 md:col-span-2 space-y-2">
                                            <Label htmlFor="note">Notunuz (Opsiyonel)</Label>
                                            <Textarea id="note" value={formData.note} onChange={handleInputChange} placeholder="Cihazınızın sorunu hakkında kısa bilgi..." rows={3} className="resize-none" />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-col md:flex-row gap-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30">
                                        <div className="flex items-center justify-between flex-1">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-background rounded-lg text-primary">
                                                    <MessageSquare className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-foreground">SMS Bildirimi</p>
                                                    <p className="text-xs text-muted-foreground">Randevu hatırlatması al.</p>
                                                </div>
                                            </div>
                                            <Checkbox />
                                        </div>
                                        <div className="w-px bg-border hidden md:block"></div>
                                        <div className="flex items-center justify-between flex-1">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-background rounded-lg text-primary">
                                                    <Mail className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-foreground">E-posta Bildirimi</p>
                                                    <p className="text-xs text-muted-foreground">Detaylı bilgi ve fatura gönderimi.</p>
                                                </div>
                                            </div>
                                            <Checkbox />
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Navigation Buttons */}
                            <div className="pt-4 flex justify-between border-t border-border mt-8">
                                {step > 1 ? (
                                    <Button variant="outline" onClick={handleBack} className="h-12 px-6">
                                        <ChevronLeft className="mr-2 h-4 w-4" /> Geri
                                    </Button>
                                ) : <div></div>}

                                {step < 3 ? (
                                    <Button onClick={handleNext} className="h-12 px-8 font-bold shadow-lg shadow-primary/20" disabled={step === 1 && !selectedService || step === 2 && (!date || !selectedTime)}>
                                        Devam Et <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button onClick={handleSubmit} disabled={isSubmitting} className="h-12 px-8 font-bold shadow-lg shadow-primary/20">
                                        {isSubmitting ? "İşleniyor..." : "Randevu Oluştur"} <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Sticky 3D Visual & Summary */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                        {/* 3D Visualization Container */}
                        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-800 to-black border border-slate-700 group perspective-container">
                            <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative w-40 h-72 border-4 border-slate-600 rounded-[2rem] bg-slate-900/80 backdrop-blur-sm shadow-2xl transform transition-transform duration-700 hover:rotate-y-12 hover:rotate-x-6 z-10 flex flex-col items-center justify-center">
                                    <div className="w-full h-full rounded-[1.7rem] bg-gradient-to-br from-primary/20 to-transparent p-4 flex flex-col justify-between overflow-hidden relative">
                                        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:16px_16px]"></div>
                                        <div className="mt-8 flex justify-center">
                                            <Smartphone className="h-16 w-16 text-primary animate-pulse drop-shadow-[0_0_10px_rgba(19,127,236,0.8)]" />
                                        </div>
                                        <div className="text-center mb-4">
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Analiz Ediliyor</p>
                                            <div className="w-full h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
                                                <div className="h-full bg-primary w-2/3 animate-[pulse_2s_infinite]"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                3D Live View
                            </div>

                            <div className="absolute bottom-6 left-6 right-6">
                                <h4 className="text-white font-bold text-lg">
                                    {selectedService ? services.find(s => s.id === selectedService)?.title : "Hizmet Seçimi"}
                                </h4>
                                <p className="text-slate-400 text-sm mt-1">Seçtiğiniz hizmet cihazınız üzerinde simüle ediliyor.</p>
                            </div>
                        </div>

                        {/* Booking Summary Card */}
                        <div className="bg-card rounded-xl shadow-lg border border-border p-6">
                            <h4 className="text-lg font-bold text-foreground mb-4">Özet</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Hizmet</span>
                                    <span className="font-medium text-foreground">
                                        {selectedService ? services.find(s => s.id === selectedService)?.title : "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Tarih</span>
                                    <span className="font-medium text-foreground">
                                        {date ? date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Saat</span>
                                    <span className="font-medium text-foreground">{selectedTime || "-"}</span>
                                </div>
                                <div className="border-t border-dashed border-border pt-3 flex justify-between items-center">
                                    <span className="text-muted-foreground">Tahmini Süre</span>
                                    <span className="font-bold text-primary">45 Dakika</span>
                                </div>
                                <div className="border-t border-dashed border-border pt-3 flex justify-between items-center">
                                    <span className="text-muted-foreground">Tahmini Tutar</span>
                                    <span className="font-bold text-xl text-foreground">₺1.250</span>
                                </div>
                            </div>
                            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex gap-2 items-start">
                                <Check className="h-4 w-4 text-primary mt-0.5" />
                                <p className="text-xs text-blue-800 dark:text-blue-200 font-medium">
                                    Fiyatlar cihaz durumuna göre değişiklik gösterebilir. Kesin fiyat arıza tespitinden sonra verilecektir.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
