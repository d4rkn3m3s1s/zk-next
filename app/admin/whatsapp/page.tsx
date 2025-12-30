
import { getWhatsAppChats } from "@/app/actions/whatsapp-chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Search, User } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { WhatsAppChat } from "@/components/admin/WhatsAppChat";

export default async function WhatsAppAdminPage({ searchParams }: { searchParams: Promise<{ jid?: string }> }) {
    const { jid } = await searchParams;
    const chats = await getWhatsAppChats();

    const activeChat = chats.find(c => c.remoteJid === jid);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <MessageCircle className="size-8 text-green-500" />
                        WhatsApp Mesajları
                    </h2>
                    <p className="text-muted-foreground">Müşterilerinizle olan WhatsApp sohbetlerini buradan yönetin.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Chat List */}
                <Card className="md:col-span-1 bg-[#0a0a0a] border-white/10 h-[700px] flex flex-col">
                    <CardHeader className="border-b border-white/5">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Sohbetlerde ara..." className="pl-8 bg-white/5 border-white/10" />
                        </div>
                    </CardHeader>
                    <div className="flex-1 overflow-y-auto">
                        {chats.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-sm">
                                Henüz sohbet kaydı bulunamadı.
                            </div>
                        ) : (
                            chats.map((chat) => (
                                <Link
                                    key={chat.remoteJid}
                                    href={`/admin/whatsapp?jid=${chat.remoteJid}`}
                                    className={`p-4 flex items-center gap-3 hover:bg-white/5 transition-colors border-b border-white/5 group ${jid === chat.remoteJid ? 'bg-white/5 border-r-2 border-r-green-500' : ''}`}
                                >
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${jid === chat.remoteJid ? 'bg-green-500 text-white' : 'bg-green-500/10 text-green-500 group-hover:bg-green-500/20'}`}>
                                        <User className="size-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <p className="font-medium text-sm text-white truncate">{chat.senderName || chat.remoteJid.split('@')[0]}</p>
                                            <span className="text-[10px] text-muted-foreground">
                                                {new Date(chat.timestamp).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </Card>

                {/* Chat Detail */}
                <div className="md:col-span-3">
                    {jid ? (
                        <div className="h-[700px]">
                            <WhatsAppChat
                                phone={jid.split('@')[0]}
                                customerName={activeChat?.senderName}
                            />
                        </div>
                    ) : (
                        <Card className="bg-[#0a0a0a] border-white/10 h-[700px] flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center text-slate-500 mx-auto">
                                    <MessageCircle className="size-10" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Sohbet Seçin</h3>
                                    <p className="text-muted-foreground max-w-xs mx-auto">Mesajlaşmaya başlamak için sol taraftaki listeden bir müşteri seçin.</p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
