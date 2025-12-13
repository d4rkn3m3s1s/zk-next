import Link from "next/link"
import {
    ChevronRight,
    Star,
    ShoppingCart,
    Heart,
    Truck,
    ShieldCheck,
    ArrowRight,
    Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getProduct } from "@/app/actions/product"
import { notFound } from "next/navigation"

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const product = await getProduct(parseInt(id))

    if (!product) {
        notFound()
    }

    const images = product.images ? JSON.parse(product.images) : []
    const mainImage = images.length > 0 ? images[0] : "https://picsum.photos/600/600"
    const thumbnails = images.length > 1 ? images.slice(1) : []

    return (
        <div className="flex flex-col min-h-screen">
            <main className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-20">
                {/* Breadcrumbs */}
                <div className="py-6 flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link href="/products" className="hover:text-primary transition-colors">Ürünler</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-foreground font-medium">{product.name}</span>
                </div>

                {/* Product Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-20">
                    {/* Left: Image Showcase */}
                    <div className="lg:col-span-7 relative group perspective-1000">
                        {/* Background Decorative Blobs */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

                        {/* Main Image Container */}
                        <div className="relative w-full aspect-square md:aspect-[4/3] flex items-center justify-center bg-card rounded-3xl border border-border overflow-hidden">
                            <div className="w-full h-full relative transition-transform duration-700 ease-out transform group-hover:scale-105">
                                <img
                                    alt={product.name}
                                    className="w-full h-full object-contain p-8 z-10"
                                    src={mainImage}
                                />
                            </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        {thumbnails.length > 0 && (
                            <div className="flex justify-center gap-4 mt-8">
                                <button className="size-16 rounded-xl border-2 border-primary p-1 bg-card overflow-hidden shadow-sm transition-all">
                                    <img className="w-full h-full object-cover rounded-lg" src={mainImage} alt="Main" />
                                </button>
                                {thumbnails.map((thumb: string, index: number) => (
                                    <button key={index} className="size-16 rounded-xl border-2 border-transparent hover:border-primary p-1 bg-card overflow-hidden shadow-sm hover:shadow-md transition-all">
                                        <img className="w-full h-full object-cover rounded-lg" src={thumb} alt={`Thumbnail ${index + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Details & Configurator */}
                    <div className="lg:col-span-5 flex flex-col gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30">
                                    {product.stock > 0 ? "Stokta" : "Tükendi"}
                                </Badge>
                                {product.isNew && (
                                    <Badge variant="default" className="bg-primary text-white">
                                        Yeni
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground mb-4">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                </div>
                                <span className="text-muted-foreground text-sm">(Henüz değerlendirme yok)</span>
                            </div>
                        </div>

                        <div className="h-px w-full bg-border"></div>

                        {/* Price */}
                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-black text-primary tracking-tight">₺{Number(product.price).toLocaleString('tr-TR')}</span>
                            {product.comparePrice && (
                                <span className="text-lg text-muted-foreground line-through">₺{Number(product.comparePrice).toLocaleString('tr-TR')}</span>
                            )}
                        </div>

                        {/* Description */}
                        <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                            <p>{product.description}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <Button size="lg" className="flex-1 h-14 text-lg font-bold shadow-lg shadow-primary/20" disabled={product.stock <= 0}>
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                {product.stock > 0 ? "Sepete Ekle" : "Stokta Yok"}
                            </Button>
                            <Button variant="secondary" size="icon" className="size-14 rounded-xl">
                                <Heart className="h-6 w-6" />
                            </Button>
                        </div>

                        {/* Short Services */}
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                                <Truck className="text-green-500 h-6 w-6" />
                                <div className="text-xs">
                                    <p className="font-bold text-foreground">Hızlı Teslimat</p>
                                    <p className="text-muted-foreground">Aynı gün kargo</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                                <ShieldCheck className="text-primary h-6 w-6" />
                                <div className="text-xs">
                                    <p className="font-bold text-foreground">ZK Garantisi</p>
                                    <p className="text-muted-foreground">Güvenli Alışveriş</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Details Section */}
                <div className="mb-20">
                    <h3 className="text-2xl font-bold mb-8 text-foreground flex items-center gap-2">
                        <span className="w-1 h-8 bg-primary rounded-full block"></span>
                        Ürün Detayları
                    </h3>
                    <div className="bg-card rounded-3xl p-8 border border-border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-lg font-bold mb-4">Özellikler</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        <span className="text-muted-foreground">Marka: {product.brand || "Belirtilmemiş"}</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        <span className="text-muted-foreground">Kategori: {product.category || "Belirtilmemiş"}</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        <span className="text-muted-foreground">Durum: {product.status === 'active' ? 'Satışta' : 'Pasif'}</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="md:col-span-2">
                                <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                                    Teknik Özellikler ve Detaylar
                                </h4>

                                {product.description && product.description.includes("-") ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {(() => {
                                            const sections: { title: string, items: string[] }[] = [];
                                            let currentSection = { title: "Diğer Özellikler", items: [] as string[] };

                                            // Handle the initial "Marka/Model" part which might be at the top
                                            const lines = product.description.split('\n').map(l => l.trim()).filter(l => l);

                                            lines.forEach(line => {
                                                if (line.endsWith(':') && !line.includes('-')) {
                                                    // This is likely a header like "Network:"
                                                    if (currentSection.items.length > 0) {
                                                        sections.push(currentSection);
                                                    }
                                                    currentSection = { title: line.replace(':', ''), items: [] };
                                                } else {
                                                    // This is a content line (or key-value)
                                                    currentSection.items.push(line);
                                                }
                                            });
                                            if (currentSection.items.length > 0) sections.push(currentSection);

                                            return sections.map((section, idx) => (
                                                <div key={idx} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-5 hover:border-primary/50 transition-colors group">
                                                    <h5 className="font-semibold text-primary mb-3 flex items-center gap-2">
                                                        {section.title}
                                                    </h5>
                                                    <ul className="space-y-2 text-sm">
                                                        {section.items.map((item, i) => {
                                                            const parts = item.split(':');
                                                            const isKeyValue = item.startsWith('-') && item.includes(':');

                                                            if (isKeyValue) {
                                                                const key = parts[0].replace('-', '').trim();
                                                                const val = parts.slice(1).join(':').trim();
                                                                return (
                                                                    <li key={i} className="flex flex-col gap-0.5">
                                                                        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{key}</span>
                                                                        <span className="text-foreground font-medium">{val}</span>
                                                                    </li>
                                                                )
                                                            } else {
                                                                return (
                                                                    <li key={i} className="text-muted-foreground pl-2 border-l-2 border-primary/20">
                                                                        {item.replace(/^-/, '').trim()}
                                                                    </li>
                                                                )
                                                            }
                                                        })}
                                                    </ul>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                ) : (
                                    <div className="bg-card rounded-xl p-6 border border-border">
                                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            {product.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Sticky Purchase Bar (Mobile/Desktop) */}
            <div className="fixed bottom-0 left-0 w-full bg-background/90 backdrop-blur-lg border-t border-border z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-10 py-4 flex items-center justify-between gap-4">
                    <div className="hidden sm:block">
                        <p className="text-sm font-bold text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {product.stock > 0 ? "Stokta Var" : "Tükendi"}
                        </p>
                    </div>
                    <div className="flex items-center gap-6 ml-auto">
                        <p className="text-xl font-black text-foreground hidden sm:block">₺{Number(product.price).toLocaleString('tr-TR')}</p>
                        <Button size="lg" className="h-12 px-8 font-bold shadow-lg shadow-primary/20" disabled={product.stock <= 0}>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Sepete Ekle
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
