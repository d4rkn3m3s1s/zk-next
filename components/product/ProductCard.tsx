"use client";

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
        <Link href={`/products/${id}`} className="block h-full">
            <CardContainer className="inter-var w-full p-2 h-full">
                <CardBody className="group/card relative w-full h-auto rounded-3xl border border-white/10 p-0 bg-black/40 backdrop-blur-3xl flex flex-col justify-between overflow-hidden">
                    {/* Animated Holographic Border */}
                    <div className="absolute inset-0 p-[1px] rounded-3xl overflow-hidden pointer-events-none">
                        <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_150deg,rgba(6,182,212,0.5)_180deg,transparent_210deg,transparent_360deg)] animate-[spin_4s_linear_infinite] opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                    </div>

                    {/* Holographic Glow on Hover */}
                    <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-500/10 blur-[100px] rounded-full"></div>
                    </div>

                    {/* Premium Badges */}
                    <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                        <CardItem translateZ="50" className="inline-flex items-center rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] border border-white/20 bg-black/60 text-white backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            {condition}
                        </CardItem>
                        {isNew && (
                            <CardItem translateZ="60" className="inline-flex items-center rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] border border-purple-500/40 bg-purple-500/20 text-purple-300 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.3)] animate-pulse-slow">
                                PREMİUM
                            </CardItem>
                        )}
                        {isDiscounted && (
                            <CardItem translateZ="60" className="inline-flex items-center rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] border border-red-500/40 bg-red-500/20 text-red-300 backdrop-blur-md">
                                FIRSAT
                            </CardItem>
                        )}
                    </div>

                    <CardItem translateZ="30" className="absolute top-4 right-4 z-20">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-full bg-white/5 text-white border border-white/10 hover:bg-cyan-500 hover:border-cyan-400 hover:text-black transition-all duration-500 group/heart"
                            onClick={(e) => e.preventDefault()}
                        >
                            <Heart className="h-4 w-4 transition-transform group-hover/heart:scale-125" />
                        </Button>
                    </CardItem>

                    {/* Image Section - Interactive Sizing */}
                    <div className="relative w-full aspect-[4/5] overflow-hidden rounded-t-3xl z-10 p-8 flex items-center justify-center">
                        <CardItem translateZ="100" className="w-full h-full flex items-center justify-center">
                            <img
                                src={image}
                                alt={name}
                                className="max-w-full max-h-full object-contain transition-all duration-1000 group-hover/card:scale-110 group-hover/card:rotate-3 drop-shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover/card:drop-shadow-[0_0_50px_rgba(6,182,212,0.3)]"
                            />
                        </CardItem>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 rounded-t-3xl pointer-events-none"></div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-1 flex-col p-6 pt-0 relative z-10 w-full">
                        <div className="mb-4">
                            <CardItem translateZ="50" className="text-2xl font-black text-white group-hover/card:text-cyan-400 transition-colors duration-500 tracking-tighter decoration-cyan-500/50 underline-offset-4 line-clamp-1">
                                {name}
                            </CardItem>
                            <CardItem as="p" translateZ="40" className="text-xs text-slate-500 line-clamp-1 mt-1 font-medium tracking-tight">
                                {description}
                            </CardItem>
                        </div>

                        <div className="flex items-center gap-4 py-4 border-y border-white/5 mb-4 w-full">
                            {batteryHealth && (
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Battery className={`h-4 w-4 ${batteryHealth > 90 ? 'text-green-500' : 'text-yellow-500'}`} />
                                        <div className={`absolute inset-0 blur-sm ${batteryHealth > 90 ? 'bg-green-500/30' : 'bg-yellow-500/30'}`}></div>
                                    </div>
                                    <span className="text-[10px] font-black font-mono text-slate-400">%{batteryHealth} SAĞLIK</span>
                                </div>
                            )}
                            <div className="h-4 w-px bg-white/10"></div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-cyan-500" />
                                <span className="text-[10px] font-black font-mono text-slate-400">{warrantyMonths} AY ZK GARANTİ</span>
                            </div>
                        </div>

                        <div className="mt-auto flex items-end justify-between w-full">
                            <div className="flex flex-col">
                                {originalPrice && (
                                    <CardItem translateZ="30" className="text-[10px] text-slate-500 line-through font-black tracking-widest decoration-red-500/50 mb-1">
                                        {originalPrice.toLocaleString('tr-TR')} ₺
                                    </CardItem>
                                )}
                                <CardItem translateZ="80" className="text-3xl font-black text-white tracking-tighter group-hover/card:text-cyan-400 transition-all">
                                    {price.toLocaleString('tr-TR')} <span className="text-lg text-slate-400 group-hover/card:text-cyan-600 transition-all">₺</span>
                                </CardItem>
                            </div>

                            <CardItem translateZ="100">
                                <Button size="icon" className="h-12 w-12 rounded-2xl bg-white/5 text-white border border-white/10 hover:bg-cyan-500 hover:text-black hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-500">
                                    <Zap className="h-6 w-6" />
                                </Button>
                            </CardItem>
                        </div>
                    </div>
                </CardBody>
            </CardContainer>
        </Link>
    )
}
