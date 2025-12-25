"use client"

import Link from "next/link"
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, CreditCard, ShieldCheck, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

// Sample cart data - In a real app, this would come from a context/store
const initialItems = [
    {
        id: "1",
        name: "iPhone 15 Pro Max",
        price: 74999,
        image: "https://specifications-pro.com/wp-content/uploads/2023/04/Apple-iPhone-15-Pro-Max.jpg",
        color: "Natural Titanium",
        storage: "256GB"
    }
]

export default function CartPage() {
    const [items, setItems] = useState(initialItems)

    const subtotal = items.reduce((acc, item) => acc + item.price, 0)
    const shipping = subtotal > 5000 ? 0 : 150
    const total = subtotal + shipping

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id))
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#020204] text-white overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container max-w-6xl mx-auto px-4 relative z-10">
                <div className="flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                                SEPETİM<span className="text-purple-500">.</span>
                            </h1>
                            <p className="text-slate-400 text-sm font-mono tracking-widest uppercase">
                                {items.length} ÜRÜN BULUNDU
                            </p>
                        </div>
                        <Link href="/shop">
                            <Button variant="ghost" className="text-slate-400 hover:text-white transition-colors gap-2">
                                <ArrowLeft className="h-4 w-4" /> Alışverişe Devam Et
                            </Button>
                        </Link>
                    </div>

                    {items.length > 0 ? (
                        <div className="grid lg:grid-cols-12 gap-8 items-start">
                            {/* Items List */}
                            <div className="lg:col-span-8 space-y-4">
                                <AnimatePresence mode="popLayout">
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            className="group relative bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-xl flex gap-6 items-center hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 shadow-xl"
                                        >
                                            <div className="h-24 w-24 rounded-2xl bg-white flex-shrink-0 p-2 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-110">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                            </div>

                                            <div className="flex-1 min-w-0 py-1">
                                                <h3 className="text-lg font-bold text-white truncate drop-shadow-sm">{item.name}</h3>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-mono mt-1">
                                                    <span>{item.color}</span>
                                                    <span>{item.storage}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-3 px-2">
                                                <span className="text-xl font-black text-white">₺{item.price.toLocaleString('tr-TR')}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Summary */}
                            <div className="lg:col-span-4 sticky top-28 space-y-6">
                                <div className="bg-[#0f1115] border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700"></div>

                                    <h2 className="text-xl font-black tracking-tight mb-8 flex items-center gap-2">
                                        SİPARİŞ ÖZETİ <Zap className="h-4 w-4 text-purple-500 animate-pulse" />
                                    </h2>

                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                            <span className="text-slate-400 text-sm">Ara Toplam</span>
                                            <span className="text-white font-bold text-lg">₺{subtotal.toLocaleString('tr-TR')}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                            <span className="text-slate-400 text-sm">Kargo</span>
                                            <span className="text-green-400 font-bold text-sm">{shipping === 0 ? "Ücretsiz" : `₺${shipping}`}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-white font-bold opacity-70">TOPLAM</span>
                                            <span className="text-3xl font-black text-white glow-text">₺{total.toLocaleString('tr-TR')}</span>
                                        </div>

                                        <div className="pt-6">
                                            <Button className="w-full h-16 rounded-2xl bg-white hover:bg-slate-200 text-black font-black text-lg tracking-tight shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all">
                                                <CreditCard className="mr-3 h-5 w-5" /> ÖDEMEYE GEÇ
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                                    <div className="flex items-center gap-4 text-slate-400 text-xs">
                                        <div className="h-8 w-8 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <p>Tüm ürünler 12 ay ZK İletişim garantisi altındadır.</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-400 text-xs">
                                        <div className="h-8 w-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                                            <ShoppingBag className="h-5 w-5" />
                                        </div>
                                        <p>Sepetinizdeki ürünler stok garantili değildir. Tükenmeden satın alın.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
                            <div className="h-24 w-24 rounded-full bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-slate-500">
                                <ShoppingBag className="h-10 w-10" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold">Sepetiniz boş görünüyor</h2>
                                <p className="text-slate-400 max-w-sm">
                                    Henüz hiçbir harika teknoloji eklemediniz. Mağazamıza göz atıp keşfetmeye başlayın.
                                </p>
                            </div>
                            <Link href="/shop">
                                <Button className="h-14 px-8 rounded-2xl bg-white hover:bg-slate-200 text-black font-bold">
                                    ALIVERİŞE BAŞLA
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
