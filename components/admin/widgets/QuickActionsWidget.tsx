import { Zap, Tag, Plus, MessageSquare, Smartphone } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function QuickActionsWidget() {
    return (
        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                    <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white">Hızlı İşlemler</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-white/5 border-white/10 hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-all" asChild>
                    <Link href="/admin/repairs/new">
                        <Smartphone className="w-6 h-6" />
                        <span className="text-xs">Tamir Gir</span>
                    </Link>
                </Button>

                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-white/5 border-white/10 hover:bg-purple-500/10 hover:border-purple-500/50 hover:text-purple-400 transition-all" asChild>
                    <Link href="/admin/products/new-second-hand">
                        <Tag className="w-6 h-6" />
                        <span className="text-xs">2. El Ekle</span>
                    </Link>
                </Button>

                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-white/5 border-white/10 hover:bg-green-500/10 hover:border-green-500/50 hover:text-green-400 transition-all" asChild>
                    <Link href="/admin/products/new">
                        <Plus className="w-6 h-6" />
                        <span className="text-xs">Ürün Ekle</span>
                    </Link>
                </Button>

                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-white/5 border-white/10 hover:bg-pink-500/10 hover:border-pink-500/50 hover:text-pink-400 transition-all" asChild>
                    <Link href="/admin/messages">
                        <MessageSquare className="w-6 h-6" />
                        <span className="text-xs">Mesajlar</span>
                    </Link>
                </Button>
            </div>
        </div>
    )
}
