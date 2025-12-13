import Link from "next/link"
import { Heart, Battery, ShieldCheck, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
    const getConditionColor = (condition: string) => {
        switch (condition) {
            case "Mükemmel": return "text-green-400 bg-green-500/10 border-green-500/20"
            case "Çok İyi": return "text-blue-400 bg-blue-500/10 border-blue-500/20"
            case "İyi": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
            case "Outlet": return "text-purple-400 bg-purple-500/10 border-purple-500/20"
            default: return "text-slate-400 bg-slate-500/10 border-slate-500/20"
        }
    }

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border hover:border-primary transition-all duration-300 hover:shadow-[0_0_30px_rgba(19,127,236,0.1)]">
            <div className="absolute top-3 left-3 z-20 flex gap-2">
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border backdrop-blur-sm ${getConditionColor(condition)}`}>
                    {condition}
                </span>
                {isNew && (
                    <span className="inline-flex items-center rounded-md bg-primary text-white px-2 py-1 text-xs font-bold">
                        YENİ
                    </span>
                )}
                {isDiscounted && (
                    <span className="inline-flex items-center rounded-md bg-red-500 text-white px-2 py-1 text-xs font-bold">
                        İNDİRİM
                    </span>
                )}
            </div>

            <Button variant="ghost" size="icon" className="absolute top-3 right-3 z-20 h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-primary hover:text-white transition-colors">
                <Heart className="h-4 w-4" />
            </Button>

            <Link href={`/products/${id}`} className="relative aspect-[4/3] overflow-hidden bg-muted">
                <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('${image}')` }}
                />
            </Link>

            <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <Link href={`/products/${id}`}>
                            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                                {name}
                            </h3>
                        </Link>
                        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                    {batteryHealth && (
                        <div className="flex items-center gap-1">
                            <Battery className={`h-4 w-4 ${batteryHealth > 90 ? 'text-green-400' : 'text-yellow-400'}`} />
                            <span className="text-xs text-muted-foreground">%{batteryHealth} Pil</span>
                        </div>
                    )}
                    {batteryHealth && <div className="h-3 w-px bg-border"></div>}
                    <div className="flex items-center gap-1">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span className="text-xs text-muted-foreground">{warrantyMonths} Ay</span>
                    </div>
                </div>

                <div className="mt-4 flex items-end justify-between">
                    <div className="flex flex-col">
                        {originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">{originalPrice.toLocaleString('tr-TR')} TL</span>
                        )}
                        <span className="text-lg font-bold text-foreground">{price.toLocaleString('tr-TR')} TL</span>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 opacity-100 lg:opacity-0 lg:translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-300">
                    <Button className="w-full font-bold">Sepete Ekle</Button>
                    <Button variant="outline" className="w-full font-bold">Teklif Ver</Button>
                </div>
            </div>
        </div>
    )
}
