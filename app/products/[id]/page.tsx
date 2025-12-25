import { getProduct, getProducts } from "@/app/actions/product"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ChevronRight,
    ShieldCheck,
    Zap,
    Battery,
    Cpu,
    HardDrive,
    Camera,
    Smartphone,
    ShoppingBag,
    CheckCircle2
} from "lucide-react"
import Link from "next/link"
import { ProductCard } from "@/components/product/ProductCard"

interface Props {
    params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: Props) {
    const { id } = await params
    const product = await getProduct(parseInt(id))

    if (!product) {
        notFound()
    }

    const images = product.images ? JSON.parse(product.images) : []
    const mainImage = images[0] || "/placeholder.png"

    // Fetch related products
    const { products: relatedProducts } = await getProducts({
        category: product.category || undefined,
        limit: 4
    })

    // Parse specs if available
    const specs = product.specsJson ? JSON.parse(product.specsJson) : null

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#020204] text-white">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none"></div>

            <div className="container max-w-7xl mx-auto px-4 relative z-10">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 font-mono">
                    <Link href="/" className="hover:text-white transition-colors">ANA SAYFA</Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link href="/shop" className="hover:text-white transition-colors">MAĞAZA</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-slate-300 uppercase">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
                    {/* Left: Image Gallery */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="aspect-[4/5] rounded-3xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center relative group">
                            <img
                                src={mainImage}
                                alt={product.name}
                                className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700"
                            />
                            {product.isNew && (
                                <Badge className="absolute top-6 left-6 bg-cyan-500 text-white border-none px-4 py-1.5 rounded-full font-bold tracking-widest text-xs">NEW_ARRIVAL</Badge>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((img: string, i: number) => (
                                    <button key={i} className="aspect-square rounded-2xl bg-white/5 border border-white/10 overflow-hidden p-2 hover:border-cyan-500/50 transition-colors">
                                        <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-contain" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Badge variant="outline" className="text-white border-white/20 px-3 py-1 font-mono uppercase tracking-widest text-[10px]">{product.brand}</Badge>
                                {product.isFeatured && <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30 font-mono text-[10px]">FEATURED</Badge>}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                                {product.name}
                            </h1>
                            <div className="flex items-end gap-4">
                                <span className="text-4xl font-black text-white">₺{Number(product.price).toLocaleString('tr-TR')}</span>
                                {product.comparePrice && (
                                    <span className="text-xl text-slate-500 line-through mb-1">₺{Number(product.comparePrice).toLocaleString('tr-TR')}</span>
                                )}
                            </div>
                        </div>

                        {/* Condition & Features (for 2nd hand) */}
                        {!product.isNew && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                                        <Battery className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-black">Pil Sağlığı</p>
                                        <p className="font-bold text-white">%{product.batteryHealth || 100}</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-black">Garanti</p>
                                        <p className="font-bold text-white">{product.warranty || "ZK Garanti"}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quick Specs */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-500 tracking-[0.2em] uppercase">Quick Specs</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.ram && (
                                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 group hover:border-cyan-500/30 transition-colors">
                                        <Cpu className="h-4 w-4 text-cyan-400" />
                                        <span className="text-sm font-bold text-slate-300">{product.ram} RAM</span>
                                    </div>
                                )}
                                {product.storage && (
                                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 group hover:border-blue-500/30 transition-colors">
                                        <HardDrive className="h-4 w-4 text-blue-400" />
                                        <span className="text-sm font-bold text-slate-300">{product.storage} Depolama</span>
                                    </div>
                                )}
                                {product.condition && (
                                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 group hover:border-green-500/30 transition-colors">
                                        <Zap className="h-4 w-4 text-green-400" />
                                        <span className="text-sm font-bold text-slate-300">{product.condition} KONDİSYON</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
                            <Button className="h-16 rounded-2xl bg-white hover:bg-slate-200 text-black font-black text-lg tracking-tight shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all" disabled={product.stock <= 0}>
                                <ShoppingBag className="mr-3 h-5 w-5" /> {product.stock > 0 ? 'ŞİMDİ SATIN AL' : 'STOKTA YOK'}
                            </Button>
                            <Button variant="outline" className="h-16 rounded-2xl border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold transition-all" disabled={product.stock <= 0}>
                                SEPETE EKLE
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-y-4 pt-4">
                            {[
                                "Ücretsiz Kargo",
                                "Orijinal Ürün",
                                "Güvenli Ödeme",
                                "Hızlı Teknik Destek"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-slate-400 text-xs">
                                    <CheckCircle2 className="h-3 w-3 text-cyan-500" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabs: Description & Specs */}
                <div className="mb-20">
                    <Tabs defaultValue="description" className="w-full">
                        <TabsList className="bg-transparent border-b border-white/10 w-full justify-start rounded-none h-auto p-0 mb-8 space-x-8">
                            <TabsTrigger value="description" className="bg-transparent border-none rounded-none px-0 py-4 text-lg font-bold data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white transition-all">Ürün Açıklaması</TabsTrigger>
                            <TabsTrigger value="specs" className="bg-transparent border-none rounded-none px-0 py-4 text-lg font-bold data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white transition-all">Teknik Özellikler</TabsTrigger>
                        </TabsList>

                        <TabsContent value="description" className="mt-0 focus-visible:outline-none">
                            <div className="max-w-4xl">
                                <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                                    {product.description || "Bu ürün hakkında detaylı açıklama bulunmamaktadır."}
                                </p>
                            </div>
                        </TabsContent>

                        <TabsContent value="specs" className="mt-0 focus-visible:outline-none">
                            {specs ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {Object.entries(specs).map(([key, value]: [string, any], i) => (
                                        <div key={i} className="space-y-3">
                                            <h4 className="text-cyan-400 font-black text-sm uppercase tracking-widest">{key}</h4>
                                            <div className="space-y-2">
                                                {Object.entries(value).map(([sKey, sValue]: [string, any], j) => (
                                                    <div key={j} className="flex justify-between border-b border-white/5 py-2">
                                                        <span className="text-slate-500 text-sm">{sKey}</span>
                                                        <span className="text-slate-300 text-sm font-medium text-right ml-4">{sValue}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                    <p className="text-slate-500">Bu ürün için teknik özellik tablosu henüz eklenmedi.</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Related Products */}
                {relatedProducts && relatedProducts.length > 1 && (
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black tracking-tighter uppercase">Benzer Ürünler</h2>
                            <Link href="/shop" className="text-cyan-400 font-mono text-sm hover:underline">TÜMÜNÜ GÖR</Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.filter(p => p.id !== product.id).map((p) => {
                                const pImages = p.images ? JSON.parse(p.images) : []
                                const pImage = pImages.length > 0 ? pImages[0] : "/placeholder.png"

                                return (
                                    <ProductCard
                                        key={p.id}
                                        id={p.id.toString()}
                                        name={p.name}
                                        description={p.description || ""}
                                        price={Number(p.price)}
                                        originalPrice={p.comparePrice ? Number(p.comparePrice) : undefined}
                                        image={pImage}
                                        condition={p.condition as any || "Mükemmel"}
                                        isNew={p.isNew}
                                        isDiscounted={!!p.comparePrice}
                                        batteryHealth={p.batteryHealth || undefined}
                                        warrantyMonths={p.warranty ? parseInt(p.warranty) : 12}
                                    />
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
