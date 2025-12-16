import { ProductCard } from "@/components/product/ProductCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Filter, Search } from "lucide-react"
import { getProducts } from "@/app/actions/product"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getActiveCampaign } from "@/app/actions/campaign"
import { CampaignPopup } from "@/components/shop/CampaignPopup"

export default async function ProductsPage({ searchParams }: {
    searchParams: Promise<{
        q?: string,
        category?: string,
        brand?: string,
        min?: string,
        max?: string,
        sort?: string,
        page?: string
    }>
}) {
    const searchParamsObj = await searchParams
    const {
        q: query,
        category,
        brand,
        min,
        max,
        sort
    } = searchParamsObj

    const minPrice = min ? parseFloat(min) : undefined
    const maxPrice = max ? parseFloat(max) : undefined

    const page = searchParamsObj.page ? parseInt(searchParamsObj.page) : 1

    const [{ products, totalPages }, activeCampaign] = await Promise.all([
        getProducts({
            query,
            category,
            brand,
            minPrice,
            maxPrice,
            sort,
            page
        }),
        getActiveCampaign()
    ])

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

        redirect(`/products?${params.toString()}`)
    }

    const createPageUrl = (newPage: number) => {
        const params = new URLSearchParams()
        if (query) params.set('q', query)
        if (category) params.set('category', category)
        if (brand) params.set('brand', brand)
        if (min) params.set('min', min)
        if (max) params.set('max', max)
        if (sort) params.set('sort', sort)
        params.set('page', newPage.toString())
        return `/products?${params.toString()}`
    }

    return (
        <div className="flex flex-col min-h-screen">
            <CampaignPopup campaign={activeCampaign} />
            {/* Legendary Hero Section */}
            <section className="relative overflow-hidden py-24 min-h-[60vh] flex items-center bg-background">
                {/* Deep Space Background Effects */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>

                <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="flex flex-col gap-8">
                            <div className="inline-flex w-fit items-center gap-3 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-4 py-1.5 text-sm font-bold text-cyan-400 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
                                <span className="tracking-widest uppercase text-xs">Yenilenmiş Teknolojide Gelecek</span>
                            </div>

                            <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-white drop-shadow-2xl">
                                TEKNOLOJİYİ <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 animate-gradient-x bg-[length:200%_auto]">YENİDEN</span> <br />
                                KEŞFET.
                            </h1>

                            <p className="text-xl leading-relaxed text-slate-400 max-w-xl font-light">
                                Sıradan olanı unutun. Ödüllü <span className="text-cyan-400 font-bold">3D İnceleme</span> teknolojisi ve kusursuz yenilenmiş cihazlarla tanışın.
                            </p>

                            <div className="flex flex-wrap gap-5 pt-4">
                                <Button size="lg" className="h-14 px-10 rounded-2xl font-black text-lg bg-cyan-500 hover:bg-cyan-400 text-black border-2 border-cyan-400 hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all">
                                    HEMEN AL <ArrowRight className="ml-2 h-6 w-6" />
                                </Button>
                                <Button variant="outline" size="lg" className="h-14 px-10 rounded-2xl font-black text-lg border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-md bg-transparent">
                                    CİHAZINI SAT
                                </Button>
                            </div>
                        </div>

                        {/* 3D Visual Area */}
                        <div className="relative flex items-center justify-center lg:h-[700px] animate-float perspective-1000">
                            {/* Floating Rings */}
                            <div className="absolute w-[500px] h-[500px] border border-cyan-500/20 rounded-full animate-spin-slow pointer-events-none"></div>
                            <div className="absolute w-[400px] h-[400px] border border-purple-500/20 rounded-full animate-reverse-spin pointer-events-none"></div>

                            <div className="relative z-10 w-full max-w-md aspect-[4/5] rounded-[3rem] border border-white/10 bg-black/40 shadow-2xl overflow-hidden group hover:shadow-[0_0_100px_rgba(6,182,212,0.2)] transition-shadow duration-700">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBZl8SVhgt95yd99RpYPlbKIK6r6qkicnQ5QyniNwPmyGR65azzhX5VTHJYmwRCUJkhJhZmKqXOpwEtad0GycADzTRT16-dG562imPxR1tMrJgbkK3hYyoCVY_vMP4MT8vZay0EiaP9kDzczQXu1DK6WsL-Z6xp6EYQKBoXpbqA1bpbSsnqkaLGMJoSenYoJq39gPekITlp81qwNheJystzf6MrOqsqExE-broleo18W9XKidvGd5CTfFZaAPV-p1okXpMNFP_LKw")' }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                                <div className="absolute bottom-8 left-8 right-8">
                                    <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Öne Çıkan</p>
                                    <h3 className="text-3xl font-black text-white leading-none">iPhone 14 Pro Max</h3>
                                    <p className="text-sm text-slate-400 mt-2">Derin Mor - 1TB</p>
                                </div>
                            </div>
                        </div>
                    </div>
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
                                    <Link href="/products" className="text-xs text-primary hover:underline">Temizle</Link>
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

                                <Button type="submit" className="w-full">Uygula</Button>
                            </form>
                        </aside>

                        {/* Product Grid */}
                        <div className="flex-1">
                            {/* Header & Sort */}
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                                <h2 className="text-2xl font-bold text-foreground">Vitrin Ürünleri</h2>
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
                                    {products.map((product: any) => {
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
