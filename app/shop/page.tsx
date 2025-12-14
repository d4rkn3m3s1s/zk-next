import { ProductCard } from "@/components/product/ProductCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight } from "lucide-react"
import { getProducts } from "@/app/actions/product"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function ShopPage({ searchParams }: {
    searchParams: Promise<{
        q?: string,
        category?: string,
        brand?: string,
        min?: string,
        max?: string,
        sort?: string,
        page?: string,
        isSecondHand?: string
    }>
}) {
    const searchParamsObj = await searchParams
    const {
        q: query,
        category,
        brand,
        min,
        max,
        sort,
        isSecondHand
    } = searchParamsObj

    const minPrice = min ? parseFloat(min) : undefined
    const maxPrice = max ? parseFloat(max) : undefined

    const page = searchParamsObj.page ? parseInt(searchParamsObj.page) : 1

    const { products, totalPages } = await getProducts({
        query,
        category,
        brand,
        minPrice,
        maxPrice,
        sort,
        page,
        isSecondHand: isSecondHand === 'true'
    })

    async function filterAction(formData: FormData) {
        "use server"
        const params = new URLSearchParams()

        const brand = formData.get("brand") as string
        if (brand) params.set("brand", brand)

        const min = formData.get("min") as string
        if (min) params.set("min", min)

        const max = formData.get("max") as string
        if (max) params.set("max", max)

        const sort = formData.get("sort") as string
        if (sort) params.set("sort", sort)

        const isSecondHand = formData.get("isSecondHand") as string
        if (isSecondHand) params.set("isSecondHand", isSecondHand)

        redirect(`/shop?${params.toString()}`)
    }

    const createPageUrl = (newPage: number) => {
        const params = new URLSearchParams()
        if (query) params.set('q', query)
        if (category) params.set('category', category)
        if (brand) params.set('brand', brand)
        if (min) params.set('min', min)
        if (max) params.set('max', max)
        if (sort) params.set('sort', sort)
        if (isSecondHand) params.set('isSecondHand', isSecondHand)
        params.set('page', newPage.toString())
        return `/shop?${params.toString()}`
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Legendary Shop Hero Section */}
            <section className="relative overflow-hidden py-24 min-h-[50vh] flex items-center bg-background">
                {/* Deep Space Background Effects */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>

                <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-3 rounded-full border border-purple-500/30 bg-purple-950/30 px-4 py-1.5 text-sm font-bold text-purple-400 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.2)] mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-pulse"></span>
                        <span className="tracking-widest uppercase text-xs">ONLINE MAĞAZA</span>
                    </div>

                    <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-white drop-shadow-2xl mb-8">
                        ALIŞVERİŞİN <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 animate-gradient-x bg-[length:200%_auto]">GELECEĞİ</span>
                    </h1>

                    <p className="text-xl leading-relaxed text-slate-400 max-w-2xl font-light">
                        En yeni teknolojiler, sertifikalı yenilenmiş cihazlar ve <span className="text-purple-400 font-bold">akıllı alışveriş</span> deneyimi.
                    </p>
                </div>
            </section>

            {/* Shop Section */}
            <section className="py-12 lg:py-20" id="shop">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <aside className="w-full lg:w-64 shrink-0 space-y-8">
                            <form action={filterAction} className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-foreground">Filtreler</h3>
                                    <Link href="/shop" className="text-xs text-primary hover:underline">Temizle</Link>
                                </div>

                                {/* Brand Filter */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">Marka</h4>
                                    <div className="space-y-2">
                                        {['Apple', 'Samsung', 'Xiaomi'].map((b) => (
                                            <div key={b} className="flex items-center space-x-2">
                                                <Checkbox id={b} name="brand" value={b} defaultChecked={brand === b} />
                                                <Label htmlFor={b} className="text-sm font-normal text-muted-foreground hover:text-foreground cursor-pointer flex-1">
                                                    {b}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Filter */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">Fiyat Aralığı</h4>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Input type="number" name="min" placeholder="Min" className="h-9" defaultValue={minPrice} />
                                        <span className="text-muted-foreground">-</span>
                                        <Input type="number" name="max" placeholder="Max" className="h-9" defaultValue={maxPrice} />
                                    </div>
                                </div>

                                {/* Second Hand Filter */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">Durum</h4>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="secondHand" name="isSecondHand" value="true" defaultChecked={searchParamsObj.isSecondHand === 'true'} />
                                        <Label htmlFor="secondHand" className="text-sm font-normal text-muted-foreground hover:text-foreground cursor-pointer flex-1">
                                            İkinci El
                                        </Label>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full">Uygula</Button>
                            </form>
                        </aside>

                        {/* Product Grid */}
                        <div className="flex-1">
                            {/* Header & Sort */}
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                                <h2 className="text-2xl font-bold text-foreground">Tüm Ürünler</h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Sırala:</span>
                                    <Select defaultValue={sort || "recommended"}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Sıralama" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="recommended">Önerilen</SelectItem>
                                            <SelectItem value="price-asc">Fiyat: Artan</SelectItem>
                                            <SelectItem value="price-desc">Fiyat: Azalan</SelectItem>
                                            <SelectItem value="newest">En Yeni</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Products Grid */}
                            {products.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {products.map((product) => {
                                        const images = product.images ? JSON.parse(product.images) : []
                                        const image = images.length > 0 ? images[0] : "https://picsum.photos/400/500"

                                        // Map DB product to ProductCard props
                                        const cardProps = {
                                            id: product.id.toString(),
                                            name: product.name,
                                            description: product.description || "",
                                            price: Number(product.price),
                                            originalPrice: product.comparePrice ? Number(product.comparePrice) : undefined,
                                            image: image,
                                            condition: "Mükemmel" as const, // Default for now
                                            isDiscounted: !!product.comparePrice
                                        }

                                        return <ProductCard key={product.id} {...cardProps} />
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    Aradığınız kriterlere uygun ürün bulunamadı.
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-12">
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="icon" disabled={page <= 1} asChild={page > 1}>
                                            {page > 1 ? (
                                                <Link href={createPageUrl(page - 1)}>
                                                    <ArrowRight className="h-4 w-4 rotate-180" />
                                                </Link>
                                            ) : (
                                                <span><ArrowRight className="h-4 w-4 rotate-180" /></span>
                                            )}
                                        </Button>

                                        <div className="flex items-center gap-2">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                                <Button
                                                    key={p}
                                                    variant={p === page ? "default" : "outline"}
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link href={createPageUrl(p)}>{p}</Link>
                                                </Button>
                                            ))}
                                        </div>

                                        <Button variant="outline" size="icon" disabled={page >= totalPages} asChild={page < totalPages}>
                                            {page < totalPages ? (
                                                <Link href={createPageUrl(page + 1)}>
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            ) : (
                                                <span><ArrowRight className="h-4 w-4" /></span>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
