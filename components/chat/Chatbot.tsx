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

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-chatbot', handleOpen);
        return () => window.removeEventListener('open-chatbot', handleOpen);
    }, []);

    const handleSendMessage = (overrideText?: string) => {
        const textToSend = overrideText || inputValue;
        if (!textToSend.trim()) return

        const newMessage: Message = {
            id: Date.now().toString(),
            text: textToSend,
            sender: "user",
            timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
            type: "text"
        }

        setMessages(prev => [...prev, newMessage])
        setInputValue("")

        // Check if message looks like a tracking code (e.g. ZK-1234) or user asks for status
        const trackingMatch = textToSend.match(/ZK-\d{4}/i)

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

                        const funnyIntros = [
                            "Dedektiflerimiz cihazını buldu! İşte son durum raporu: 🕵️‍♂️",
                            "Sanki NASA laboratuvarındaymış gibi ilgileniyoruz. Durum şöyle: 🚀",
                            "Cihazın emin ellerde, şu an spa keyfi yapıyor olabilir. Detaylar: 💆‍♂️",
                            "Sistemlerimi taradım ve cihazını yakaladım! İşte bilgileri: 🤖",
                            "Operasyon merkezinden gelen son istihbarat şöyle: 📡"
                        ];
                        const randomIntro = funnyIntros[Math.floor(Math.random() * funnyIntros.length)];

                        const statusLabel = statusLabels[repair.status] || repair.status;

                        setTimeout(() => {
                            const botResponse: Message = {
                                id: (Date.now() + 1).toString(),
                                text: randomIntro,
                                sender: "bot",
                                timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                                type: "card",
                                cardData: {
                                    device_model: repair.device_model,
                                    status: statusLabel,
                                    date: new Date(repair.createdAt).toLocaleDateString('tr-TR'),
                                    estimated: repair.estimatedDate ? new Date(repair.estimatedDate).toLocaleDateString('tr-TR') : 'Hesaplanıyor...',
                                    receivedBy: repair.receivedBy
                                }
                            }
                            setMessages(prev => [...prev, botResponse])
                        }, 500)
                    } else {
                        setTimeout(() => {
                            const botResponse: Message = {
                                id: (Date.now() + 1).toString(),
                                text: "⚠️ Bu takip koduyla kayıtlı bir cihaz bulunamadı. Lütfen kodu kontrol edip tekrar yazın.",
                                sender: "bot",
                                timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                                type: "text"
                            }
                            setMessages(prev => [...prev, botResponse])
                        }, 500)
                    }

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
            // Call Real AI
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: "Analiz ediliyor...",
                sender: "bot",
                timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                type: "text"
            }])

            import("@/app/actions/chat").then(async (mod) => {
                try {
                    const aiResponse = await mod.chatWithAI(textToSend)

                    setMessages(prev => {
                        const filtered = prev.filter(m => m.text !== "Analiz ediliyor...")
                        return [...filtered, {
                            id: (Date.now() + 2).toString(),
                            text: aiResponse,
                            sender: "bot",
                            timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                            type: "text"
                        }]
                    })
                } catch (e) {
                    setMessages(prev => {
                        const filtered = prev.filter(m => m.text !== "Analiz ediliyor...")
                        return [...filtered, {
                            id: (Date.now() + 2).toString(),
                            text: "Bağlantı hatası. Lütfen tekrar deneyin.",
                            sender: "bot",
                            timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                            type: "text"
                        }]
                    })
                }
            })
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
                                    {msg.type === "card" && msg.cardData ? (
                                        <div className="w-full">
                                            <div className={cn(
                                                "p-3.5 rounded-2xl shadow-sm text-sm leading-relaxed mb-2",
                                                "bg-muted border border-border text-foreground rounded-tl-none"
                                            )}>
                                                {msg.text}
                                            </div>

                                            {/* Legendary Repair Card */}
                                            <div className="relative group overflow-hidden rounded-xl border border-cyan-500/30 bg-black/40 backdrop-blur-md">
                                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>

                                                {/* Animated Border Glow */}
                                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-20 blur-md group-hover:opacity-40 transition-opacity"></div>

                                                <div className="relative p-4 space-y-3">
                                                    {/* Header */}
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold mb-1">Cihaz Modeli</div>
                                                            <div className="text-lg font-black text-white">{msg.cardData.device_model}</div>
                                                        </div>
                                                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                                                            <Wrench className="w-4 h-4 text-cyan-400" />
                                                        </div>
                                                    </div>

                                                    {/* Status Bar */}
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-xs text-slate-400">
                                                            <span>Durum</span>
                                                            <span className="text-white font-bold">{msg.cardData.status}</span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 animate-pulse w-2/3 rounded-full"></div>
                                                        </div>
                                                    </div>

                                                    {/* Details Grid */}
                                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                                                            <div className="text-[10px] text-slate-500 mb-0.5">Kayıt Tarihi</div>
                                                            <div className="text-xs font-medium text-slate-300">{msg.cardData.date}</div>
                                                        </div>
                                                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                                                            <div className="text-[10px] text-slate-500 mb-0.5">Tahmini Teslim</div>
                                                            <div className="text-xs font-medium text-cyan-300">{msg.cardData.estimated}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={cn(
                                            "p-3.5 rounded-2xl shadow-sm text-sm leading-relaxed",
                                            msg.sender === "bot"
                                                ? "bg-muted border border-border text-foreground rounded-tl-none"
                                                : "bg-primary text-primary-foreground rounded-tr-none shadow-primary/20"
                                        )}>
                                            {msg.text}
                                        </div>
                                    )}
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
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSendMessage("Tamir durumumu sorgulamak istiyorum.")}
                                    className="rounded-xl text-xs h-8 bg-background hover:bg-primary hover:text-primary-foreground border-border"
                                >
                                    <Wrench className="mr-1 h-3 w-3" /> Tamir Sorgula
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSendMessage("Randevu almak istiyorum.")}
                                    className="rounded-xl text-xs h-8 bg-background hover:bg-primary hover:text-primary-foreground border-border"
                                >
                                    <Calendar className="mr-1 h-3 w-3" /> Randevu Al
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSendMessage("Fiyat listesini görmek istiyorum.")}
                                    className="rounded-xl text-xs h-8 bg-background hover:bg-primary hover:text-primary-foreground border-border"
                                >
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
                                onClick={() => handleSendMessage()}
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
