import Link from "next/link"
import { Heart, Battery, ShieldCheck, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card"

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
        <CardContainer className="inter-var w-full p-2 h-full">
            <CardBody className="group/card relative w-full h-auto rounded-3xl border border-white/10 p-0 bg-transparent flex flex-col justify-between">

                {/* Backdrop / Content Glass Container */}
                <CardItem
                    translateZ="20"
                    className="absolute inset-0 w-full h-full rounded-3xl bg-white/5 backdrop-blur-md border border-white/5 shadow-xl transition-colors duration-500 group-hover/card:bg-black/40 group-hover/card:border-cyan-500/30"
                >
                    <></>
                </CardItem>

                {/* Holographic Glow on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none z-0 rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent translate-x-[-100%] group-hover/card:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                </div>


                {/* Badges */}
                <div className="absolute top-5 left-5 z-20 flex flex-wrap gap-2">
                    <CardItem translateZ="50" className="inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-white/10 bg-black/60 backdrop-blur-md text-white shadow-lg">
                        {condition}
                    </CardItem>
                    {isNew && (
                        <CardItem translateZ="60" className="inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-purple-500/30 bg-purple-500/20 text-purple-200 backdrop-blur-md shadow-[0_0_10px_rgba(168,85,247,0.4)] animate-pulse-slow">
                            YENİ
                        </CardItem>
                    )}
                    {isDiscounted && (
                        <CardItem translateZ="60" className="inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-red-500/30 bg-red-500/20 text-red-200 backdrop-blur-md">
                            % İNDİRİM
                        </CardItem>
                    )}
                </div>

                <CardItem translateZ="30" className="absolute top-5 right-5 z-20">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-cyan-500 hover:border-cyan-400 hover:text-black transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                        <Heart className="h-4 w-4" />
                    </Button>
                </CardItem>

                {/* Image Section */}
                <Link href={`/products/${id}`} className="relative block w-full aspect-square overflow-hidden rounded-t-3xl z-10 p-4">
                    <CardItem translateZ="80" className="w-full h-full">
                        <div
                            className="h-full w-full bg-contain bg-no-repeat bg-center transition-transform duration-700"
                            style={{ backgroundImage: `url('${image}')` }}
                        />
                    </CardItem>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 rounded-t-3xl pointer-events-none"></div>
                </Link>

                {/* Content Section */}
                <div className="flex flex-1 flex-col p-6 pt-2 relative z-10 w-full">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <CardItem translateZ="50" className="text-xl font-bold text-white group-hover/card:text-cyan-400 transition-colors duration-300 line-clamp-1">
                                {name}
                            </CardItem>
                            <CardItem as="p" translateZ="40" className="text-xs text-slate-400 line-clamp-1 mt-1 font-light">
                                {description}
                            </CardItem>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 py-3 border-y border-white/5 my-2 w-full">
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

                    <div className="mt-auto pt-2 flex items-end justify-between w-full">
                        <div className="flex flex-col">
                            {originalPrice && (
                                <CardItem translateZ="30" className="text-xs text-slate-500 line-through font-mono decoration-red-500/50">
                                    {originalPrice.toLocaleString('tr-TR')} ₺
                                </CardItem>
                            )}
                            <CardItem translateZ="60" className="text-2xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] group-hover/card:drop-shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">
                                {price.toLocaleString('tr-TR')} ₺
                            </CardItem>
                        </div>

                        <CardItem translateZ="80">
                            <Button size="icon" className="h-10 w-10 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-cyan-500 hover:text-black hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-300">
                                <Zap className="h-5 w-5" />
                            </Button>
                        </CardItem>
                    </div>
                </div>
            </CardBody>
        </CardContainer>
    )
}
