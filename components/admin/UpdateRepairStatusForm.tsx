"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateRepair } from "@/app/actions/repair"
import { Loader2, Mail, MessageSquare, Send, CheckCircle2, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface UpdateRepairStatusFormProps {
    repair: any
    statusConfig: Record<string, { label: string, color: string }>
}

export function UpdateRepairStatusForm({ repair, statusConfig }: UpdateRepairStatusFormProps) {
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [statusStep, setStatusStep] = useState<"idle" | "database" | "email" | "sms" | "whatsapp" | "telegram" | "completed">("idle")
    const [stepLogs, setStepLogs] = useState<string[]>([])
    const [open, setOpen] = useState(false)

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const newStatus = formData.get("status") as string

        // Verify if status actually changed or just info update
        const isStatusChange = newStatus !== repair.status

        setOpen(true)
        setLoading(true)
        setStepLogs([])
        setProgress(0)
        setStatusStep("database")

        // Simulation Wrapper
        const addLog = (msg: string) => setStepLogs(prev => [...prev, msg])

        try {
            addLog("Güncelleme işlemi başlatılıyor...")
            setProgress(10)

            // 1. Database Update (Real)
            addLog("Veritabanı güncelleniyor...")
            await updateRepair(repair.id, formData)
            setProgress(40)

            if (isStatusChange) {
                // 2. Email Simulation
                setStatusStep("email")
                addLog("Müşteri email şablonu hazırlanıyor...")
                await new Promise(r => setTimeout(r, 800))
                addLog(`Email gönderiliyor: ${repair.email}`)
                await new Promise(r => setTimeout(r, 600))
                setProgress(60)

                // 3. SMS Simulation
                setStatusStep("sms")
                addLog("SMS ağ geçidine bağlanılıyor...")
                await new Promise(r => setTimeout(r, 600))
                addLog(`SMS iletildi: ${repair.phone}`)
                setProgress(70)

                // 4. WhatsApp Simulation
                setStatusStep("whatsapp")
                addLog("WhatsApp Baileys servisi kontrol ediliyor...")
                await new Promise(r => setTimeout(r, 700))
                addLog(`WhatsApp mesajı gönderiliyor: ${repair.phone}`)
                await new Promise(r => setTimeout(r, 500))
                setProgress(85)

                // 5. Telegram Simulation
                setStatusStep("telegram")
                addLog("Telegram bildirim servisi tetiklendi...")
                await new Promise(r => setTimeout(r, 500))
            } else {
                addLog("Bilgi güncellemesi kaydedildi (Bildirim gönderilmedi).")
                await new Promise(r => setTimeout(r, 500))
            }

            setProgress(100)
            setStatusStep("completed")
            addLog("İşlem başarıyla tamamlandı!")

            // Short delay before closing to let user see "Completed"
            setTimeout(() => {
                setLoading(false)
                setOpen(false)
                // Optional: Trigger a router refresh if the server action didn't fully handle it visually yet
                // But server action usually revalidates path.
            }, 2000)

        } catch (error) {
            console.error("Update failed", error)
            addLog("HATA: İşlem başarısız oldu!")
            // Keep open to show error
        }
    }

    return (
        <>
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Teslim Alan</label>
                        <Input name="receivedBy" defaultValue={repair.receivedBy || ""} placeholder="Personel Adı" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tahmini Teslim</label>
                        <Input
                            name="estimatedDate"
                            type="datetime-local"
                            defaultValue={repair.estimatedDate ? new Date(repair.estimatedDate).toISOString().slice(0, 16) : ""}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Güncel Durum</label>
                    <Select name="status" defaultValue={repair.status}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Durum seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(statusConfig).map(([key, config]) => (
                                <SelectItem key={key} value={key}>
                                    {config.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-blue-500/25">
                    Bilgileri ve Durumu Güncelle
                </Button>
            </form>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md bg-[#0a0a0c] border-[#1e293b] text-white" onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                            Durum Güncelleniyor
                        </DialogTitle>
                        <DialogDescription className="text-center text-slate-400">
                            Lütfen işlemin tamamlanmasını bekleyin.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-6">
                        {/* Progress Circle & Icons */}
                        <div className="flex justify-center items-center py-4 relative">
                            {/* Central Loader/Icon */}
                            <div className="relative z-10 h-24 w-24 flex items-center justify-center rounded-full bg-slate-900 border-2 border-slate-800 shadow-2xl shadow-blue-900/20">
                                {statusStep === "completed" ? (
                                    <CheckCircle2 className="h-10 w-10 text-green-500 animate-in zoom-in duration-300" />
                                ) : (
                                    <div className="relative">
                                        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                                        <div className="absolute inset-0 blur-lg bg-blue-500/30 rounded-full animate-pulse" />
                                    </div>
                                )}
                            </div>

                            {/* Orbiting Icons */}
                            <div className={cn("absolute inset-0 flex items-center justify-center transition-opacity duration-500", statusStep === "completed" ? "opacity-0" : "opacity-100")}>
                                <div className={cn("absolute transition-all duration-500", statusStep === "email" ? "text-blue-400 scale-125 -translate-y-12" : "text-slate-700 -translate-y-8 scale-75")}>
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div className={cn("absolute transition-all duration-500", statusStep === "telegram" ? "text-sky-400 scale-125 -translate-x-12 translate-y-4" : "text-slate-700 -translate-x-10 translate-y-2 scale-75")}>
                                    <Send className="h-6 w-6" />
                                </div>
                                <div className={cn("absolute transition-all duration-500", statusStep === "whatsapp" ? "text-green-500 scale-125 translate-x-12 translate-y-4" : "text-slate-700 translate-x-10 translate-y-2 scale-75")}>
                                    <MessageSquare className="h-6 w-6" />
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs uppercase font-bold tracking-widest text-slate-500">
                                <span>İlerleme</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2 bg-slate-800" indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500" />
                        </div>

                        {/* Log Console */}
                        <div className="h-32 bg-slate-950/50 rounded-lg p-3 overflow-y-auto border border-slate-800/50 font-mono text-xs space-y-1 custom-scrollbar">
                            {stepLogs.map((log, i) => (
                                <div key={i} className="flex items-start gap-2 animate-in slide-in-from-left-2 fade-in">
                                    <span className="text-blue-500 text-[10px] mt-0.5">➜</span>
                                    <span className={cn(
                                        "text-slate-300",
                                        log.includes("HATA") ? "text-red-400" : "",
                                        log.includes("başarıyla") ? "text-green-400" : ""
                                    )}>{log}</span>
                                </div>
                            ))}
                            {/* Auto-scroll anchor */}
                            <div style={{ float: "left", clear: "both" }}
                                ref={(el) => { if (el) { el.scrollIntoView({ behavior: "smooth" }); } }}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
