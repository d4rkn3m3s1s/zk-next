import Link from "next/link"
import { Heart, Battery, ShieldCheck, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductCardProps {
    id: string
    name: string
    description: string
    price: number
    originalPrice?: number
    image: string
    condition: "Mükemmel" | "Çok İyi" | "İyi" | "Outlet"
    batteryHealth?: number
    warrantyMonths?: number
    isNew?: boolean
    isDiscounted?: boolean
}

export function ProductCard({
    id,
    name,
    description,
    price,
    originalPrice,
    image,
    condition,
    batteryHealth,
    warrantyMonths = 12,
    isNew,
    isDiscounted
}: ProductCardProps) {

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/5 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">

            {/* Holographic Glow on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                <div className="absolute inset-0 ring-1 ring-cyan-500/30 rounded-2xl"></div>
                <div className="absolute -inset-[1px] bg-gradient-to-br from-cyan-500/30 to-purple-600/30 rounded-2xl blur-sm"></div>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-white/10 bg-black/40 backdrop-blur-md text-white shadow-lg">
                    {condition}
                </span>
                {isNew && (
                    <span className="inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-purple-500/30 bg-purple-500/20 text-purple-200 backdrop-blur-md shadow-[0_0_10px_rgba(168,85,247,0.4)] animate-pulse-slow">
                        YENİ
                    </span>
                )}
                {isDiscounted && (
                    <span className="inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-red-500/30 bg-red-500/20 text-red-200 backdrop-blur-md">
                        % İNDİRİM
                    </span>
                )}
            </div>

            <Button variant="ghost" size="icon" className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-cyan-500 hover:border-cyan-400 hover:text-black transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                <Heart className="h-4 w-4" />
            </Button>

            <Link href={`/products/${id}`} className="relative aspect-square overflow-hidden bg-black/40 z-10 p-4">
                <div
                    className="h-full w-full bg-contain bg-no-repeat bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
            </Link>

            <div className="flex flex-1 flex-col p-5 relative z-10">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <Link href={`/products/${id}`}>
                            <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors duration-300 line-clamp-1">
                                {name}
                            </h3>
                        </Link>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-1">{description}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 py-3 border-y border-white/5 my-2">
                    {batteryHealth && (
                        <div className="flex items-center gap-1.5">
                            <Battery className={`h-3.5 w-3.5 ${batteryHealth > 90 ? 'text-green-400' : 'text-yellow-400'}`} />
                            <span className="text-[10px] font-mono text-slate-300">BATARYA %{batteryHealth}</span>
                        </div>
                    )}
                    <div className="h-3 w-px bg-white/10"></div>
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
                        <span className="text-[10px] font-mono text-slate-300">{warrantyMonths} AY GARANTİ</span>
                    </div>
                </div>

                <div className="mt-auto pt-2 flex items-end justify-between">
                    <div className="flex flex-col">
                        {originalPrice && (
                            <span className="text-xs text-slate-500 line-through font-mono decoration-red-500/50">{originalPrice.toLocaleString('tr-TR')} ₺</span>
                        )}
                        <span className="text-xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">
                            {price.toLocaleString('tr-TR')} ₺
                        </span>
                    </div>

                    <Button size="icon" className="h-10 w-10 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-cyan-500 hover:text-black hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-300">
                        <Zap className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
