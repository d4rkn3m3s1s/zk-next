"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    MessageSquare,
    X,
    RefreshCw,
    Send,
    Mic,
    PlusCircle,
    Bot,
    Wrench,
    Calendar,
    DollarSign,
    ChevronRight,
    Check,
    CheckCheck
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
    id: string
    text: string
    sender: "bot" | "user"
    timestamp: string
    type?: "text" | "card"
    cardData?: any
}

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Merhaba! 👋 Zk İletişim'e hoş geldiniz. Cihaz durumunuzu kontrol etmenize veya randevu almanıza yardımcı olabilirim. Bugün size nasıl yardımcı olabilirim?",
            sender: "bot",
            timestamp: "14:30",
            type: "text"
        }
    ])
    const [inputValue, setInputValue] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isOpen])

    const handleSendMessage = () => {
        if (!inputValue.trim()) return

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: "user",
            timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
            type: "text"
        }

        setMessages(prev => [...prev, newMessage])
        setInputValue("")

        // Check if message looks like a tracking code (e.g. ZK-1234) or user asks for status
        const trackingMatch = inputValue.match(/ZK-\d{4}/i)

        if (trackingMatch) {
            // Call server action
            import("@/app/actions/repair").then(async (mod) => {
                try {
                    const repair = await mod.getRepairByTrackingCode(trackingMatch[0].toUpperCase()) as any

                    let responseText = ""
                    if (repair) {
                        const statusLabels: Record<string, string> = {
                            received: "Teslim Alındı",
                            diagnosing: "Arıza Tespiti Yapılıyor",
                            price_pending: "Fiyat Onayı Bekliyor",
                            parts_ordered: "Yedek Parça Bekleniyor",
                            in_progress: "Tamir İşlemi Başladı",
                            testing: "Son Testler Yapılıyor",
                            completed: "Cihazınız Hazır!",
                            delivered: "Teslim Edildi",
                            cancelled: "İptal Edildi"
                        }

                        responseText = `🔎 **Cihaz Durumu:**\n\n` +
                            `📌 **Model:** ${repair.device_model}\n` +
                            `🔧 **Durum:** ${statusLabels[repair.status] || repair.status}\n` +
                            `📅 **Kayıt Tarihi:** ${new Date(repair.createdAt).toLocaleDateString('tr-TR')}\n`

                        if (repair.receivedBy) responseText += `👤 **İlgilenen:** ${repair.receivedBy}\n`
                        if (repair.estimatedDate) responseText += `🕒 **Tahmini Teslim:** ${new Date(repair.estimatedDate).toLocaleDateString('tr-TR')}\n`

                        responseText += `\nDetaylı bilgi için bizi arayabilirsiniz.`
                    } else {
                        responseText = "⚠️ Bu takip koduyla kayıtlı bir cihaz bulunamadı. Lütfen kodu kontrol edip tekrar yazın."
                    }

                    setTimeout(() => {
                        const botResponse: Message = {
                            id: (Date.now() + 1).toString(),
                            text: responseText,
                            sender: "bot",
                            timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                            type: "text"
                        }
                        setMessages(prev => [...prev, botResponse])
                    }, 500)

                } catch (error) {
                    console.error("Chatbot error", error)
                    setTimeout(() => {
                        setMessages(prev => [...prev, {
                            id: (Date.now() + 1).toString(),
                            text: "Sistemde bir hata oluştu, lütfen daha sonra tekrar deneyin.",
                            sender: "bot",
                            timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                            type: "text"
                        }])
                    }, 500)
                }
            })
        } else {
            // Simulate default bot response for non-tracking messages
            setTimeout(() => {
                const botResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    text: "Anladım. Cihaz durumunu sorgulamak için lütfen 'ZK-XXXX' formatındaki takip kodunuzu yazın. Başka bir konuda size nasıl yardımcı olabilirim?",
                    sender: "bot",
                    timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                    type: "text"
                }
                setMessages(prev => [...prev, botResponse])
            }, 1000)
        }
    }

    return (
        <>
            {/* Trigger Button */}
            <div className={cn(
                "fixed z-50 bottom-6 right-6 transition-all duration-300",
                isOpen ? "opacity-0 pointer-events-none scale-75" : "opacity-100 scale-100"
            )}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary to-blue-700 shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-110 transition-all duration-300"
                >
                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-20 animate-ping"></span>
                    <Bot className="text-white h-8 w-8 relative z-10 transform group-hover:rotate-12 transition-transform" />

                    {/* Tooltip */}
                    <div className="absolute right-full mr-4 bg-popover text-popover-foreground text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl border border-border pointer-events-none">
                        Yardımcı olabilir miyim?
                        <div className="absolute top-1/2 -right-1 w-2 h-2 bg-popover rotate-45 border-t border-r border-border -translate-y-1/2"></div>
                    </div>
                </button>
            </div>

            {/* Chat Window */}
            <div className={cn(
                "fixed z-50 bottom-6 right-6 flex flex-col items-end gap-4 transition-all duration-300 origin-bottom-right",
                isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-75 pointer-events-none"
            )}>
                <div className="w-[380px] md:w-[420px] h-[600px] max-h-[calc(100vh-100px)] bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10">
                                <div className="absolute inset-0 bg-primary/40 rounded-full blur-md animate-pulse"></div>
                                <div className="relative w-10 h-10 rounded-full bg-background border border-primary/50 flex items-center justify-center overflow-hidden">
                                    <img
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSocXH9SpZHsDz8yOk-6iMzhUxTC7zepkACEUSPpc1ncqjbkRKA85qSh4PdYKlLPgQu7mf__owxXu02wyV51_mDN3AourPuqFApe_HzkuRvcyhqE6OyEqErNLqbirvMHo-Q3xYxRYTEVuKDliLOu8lw-RarJokuoJ2SW0OzHmrw9reU0RGAT_vXgedpCupjUXZ9X8AuOr7yk5q91FGNG3SUyozDBB9ty-OhOt_TWhGNrHgVLFDIideUgnp9DdL87nfsgfFc0ytjg"
                                        alt="Bot Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-foreground font-bold text-base leading-tight">Zk Assistant</h3>
                                <span className="text-primary text-xs font-medium tracking-wide">Yapay Zeka Destekli</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Chat Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-gradient-to-b from-background/50 to-background/80">
                        <div className="flex justify-center">
                            <span className="text-[11px] font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
                                Bugün, {new Date().toLocaleDateString()}
                            </span>
                        </div>

                        {messages.map((msg) => (
                            <div key={msg.id} className={cn("flex gap-3", msg.sender === "user" ? "justify-end" : "")}>
                                {msg.sender === "bot" && (
                                    <div className="w-8 h-8 shrink-0 rounded-full bg-muted flex items-center justify-center border border-border mt-1">
                                        <Bot className="text-primary h-4 w-4" />
                                    </div>
                                )}
                                <div className={cn("flex flex-col gap-2 max-w-[85%]", msg.sender === "user" ? "items-end" : "")}>
                                    <div className={cn(
                                        "p-3.5 rounded-2xl shadow-sm text-sm leading-relaxed",
                                        msg.sender === "bot"
                                            ? "bg-muted border border-border text-foreground rounded-tl-none"
                                            : "bg-primary text-primary-foreground rounded-tr-none shadow-primary/20"
                                    )}>
                                        {msg.text}
                                    </div>
                                    {msg.sender === "user" && (
                                        <span className="text-[10px] text-muted-foreground mr-1 flex items-center gap-1">
                                            Okundu {msg.timestamp} <CheckCheck className="h-3 w-3" />
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Quick Actions (only show if last message is from bot) */}
                        {messages[messages.length - 1]?.sender === "bot" && (
                            <div className="pl-11 flex flex-wrap gap-2">
                                <Button variant="outline" size="sm" className="rounded-xl text-xs h-8 bg-background hover:bg-primary hover:text-primary-foreground border-border">
                                    <Wrench className="mr-1 h-3 w-3" /> Tamir Sorgula
                                </Button>
                                <Button variant="outline" size="sm" className="rounded-xl text-xs h-8 bg-background hover:bg-primary hover:text-primary-foreground border-border">
                                    <Calendar className="mr-1 h-3 w-3" /> Randevu Al
                                </Button>
                                <Button variant="outline" size="sm" className="rounded-xl text-xs h-8 bg-background hover:bg-primary hover:text-primary-foreground border-border">
                                    <DollarSign className="mr-1 h-3 w-3" /> Fiyat Listesi
                                </Button>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer (Input) */}
                    <div className="p-4 bg-card border-t border-border">
                        <div className="bg-muted/50 rounded-xl p-1 flex items-end gap-1 border border-border focus-within:border-primary/50 transition-colors">
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground rounded-lg shrink-0">
                                <PlusCircle className="h-5 w-5" />
                            </Button>
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSendMessage()
                                    }
                                }}
                                className="w-full bg-transparent border-none text-sm text-foreground placeholder:text-muted-foreground focus:ring-0 resize-none py-3 max-h-24 outline-none"
                                placeholder="Bir mesaj yazın..."
                                rows={1}
                            />
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground rounded-lg shrink-0">
                                <Mic className="h-5 w-5" />
                            </Button>
                            <Button
                                onClick={handleSendMessage}
                                size="icon"
                                className="h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-sm transition-all shrink-0"
                            >
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="text-center mt-2">
                            <p className="text-[10px] text-muted-foreground">Yapay zeka hatalı bilgi verebilir.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
