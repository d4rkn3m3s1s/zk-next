
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, User, MessageCircle, RefreshCw, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getWhatsAppMessages, sendWhatsAppReply } from "@/app/actions/whatsapp-chat";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
    jid?: string;
    phone: string;
    customerName?: string;
}

export function WhatsAppChat({ jid, phone, customerName }: Props) {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Prioritize passed JID, otherwise format phone to JID
    let remoteJid = jid;
    if (!remoteJid) {
        let cleanPhone = phone.replace(/[^0-9]/g, "");

        // TR format handling
        if (cleanPhone.length === 10) {
            cleanPhone = '90' + cleanPhone;
        } else if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
            cleanPhone = '90' + cleanPhone.substring(1);
        }

        remoteJid = `${cleanPhone}@s.whatsapp.net`;
    }

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const data = await getWhatsAppMessages(remoteJid);
            setMessages(data);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [remoteJid]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const result = await sendWhatsAppReply(remoteJid, newMessage);
            if (result.success) {
                setNewMessage("");
                // Immediate fetch
                const updated = await getWhatsAppMessages(remoteJid);
                setMessages(updated);
                toast.success("Mesaj gönderildi");
            } else {
                toast.error("Hata: " + result.error);
            }
        } catch (error: any) {
            console.error("Send error:", error);
            toast.error("Mesaj gönderilemedi: " + error.message);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col h-full border border-border rounded-xl overflow-hidden bg-card shadow-2xl">
            {/* Header */}
            <div className="p-4 bg-primary/5 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                        <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground truncate max-w-[200px]">{customerName || "WhatsApp Müşterisi"}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> {phone}
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={fetchMessages} disabled={loading}>
                    <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 bg-[url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e71a7b32d17e2b22e121da5ba.png')] bg-repeat opacity-90 overflow-y-auto">
                <div className="space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-muted-foreground text-sm">Henüz mesajlaşma geçmişi yok.</p>
                        </div>
                    ) : (
                        messages.slice().reverse().map((msg, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "flex flex-col max-w-[80%] rounded-2xl p-3 text-sm shadow-sm",
                                    msg.fromMe
                                        ? "ml-auto bg-green-900/40 text-white border border-green-500/30 rounded-tr-none"
                                        : "mr-auto bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-tl-none"
                                )}
                            >
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                <span className="text-[10px] opacity-50 mt-1 self-end">
                                    {new Date(msg.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))
                    )}
                    <div ref={scrollRef} />
                </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-card border-t border-border flex gap-2">
                <Input
                    placeholder="Mesajınızı yazın..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-muted/50 border-border focus:ring-green-500"
                    disabled={sending}
                />
                <Button type="submit" size="icon" className="bg-green-600 hover:bg-green-700 text-white" disabled={sending || !newMessage.trim()}>
                    {sending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </form>
        </div>
    );
}
