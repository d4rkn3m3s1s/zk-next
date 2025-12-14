import { MessageCircle, Mail } from "lucide-react"
import Link from "next/link"

export function UnreadMessagesWidget({ messages }: { messages: any[] }) {
    if (!messages || messages.length === 0) return null;

    return (
        <div className="bg-slate-900/50 border border-pink-500/20 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400 animate-pulse">
                        <Mail className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-white">Yeni Mesajlar</h3>
                </div>
                <Link href="/admin/messages" className="text-xs text-pink-400 hover:text-pink-300 transition-colors">
                    Tümünü Gör
                </Link>
            </div>

            <div className="space-y-3">
                {messages.map((msg) => (
                    <Link href={`/admin/messages`} key={msg.id} className="block p-3 bg-black/40 rounded-xl border border-white/5 hover:border-pink-500/30 transition-all">
                        <p className="text-sm font-bold text-white line-clamp-1">{msg.subject || "Konusuz"}</p>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{msg.message}</p>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-[10px] text-pink-400 font-bold">{msg.name}</span>
                            <span className="text-[10px] text-slate-600">{new Date(msg.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
