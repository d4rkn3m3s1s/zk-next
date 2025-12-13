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

    const { products, totalPages } = await getProducts({
        query,
        category,
        brand,
        minPrice,
        maxPrice,
        sort,
        page
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
            {/* Hero Section */}
            <section className="relative overflow-hidden py-16 lg:py-24 bg-background">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"></div>

                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
                        <div className="flex flex-col gap-6">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm">
                                <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                                Yenilenmiş Teknolojide Yeni Dönem
                            </div>
                            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-foreground lg:text-6xl">
                                Teknolojiyi <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Yeniden</span> Keşfedin.
                            </h1>
                            <p className="text-lg leading-relaxed text-muted-foreground max-w-lg">
                                Ödüllü 3D inceleme deneyimi ile cihazları en ince ayrıntısına kadar keşfedin. 1 yıl Zk garantisi ve 30 nokta kontrolü ile güvenli alışveriş.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Button size="lg" className="h-12 px-8 rounded-xl font-bold shadow-[0_0_20px_rgba(19,127,236,0.3)] hover:scale-105 transition-all">
                                    Hemen Al <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                <Button variant="outline" size="lg" className="h-12 px-8 rounded-xl font-bold">
                                    Cihazını Sat
                                </Button>
                            </div>
                        </div>

                        {/* 3D Visual Area */}
                        <div className="relative flex items-center justify-center lg:h-[600px] animate-float">
                            <div className="relative z-10 w-full max-w-md aspect-[4/5] rounded-[3rem] border border-border bg-black shadow-2xl overflow-hidden group">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBZl8SVhgt95yd99RpYPlbKIK6r6qkicnQ5QyniNwPmyGR65azzhX5VTHJYmwRCUJkhJhZmKqXOpwEtad0GycADzTRT16-dG562imPxR1tMrJgbkK3hYyoCVY_vMP4MT8vZay0EiaP9kDzczQXu1DK6WsL-Z6xp6EYQKBoXpbqA1bpbSsnqkaLGMJoSenYoJq39gPekITlp81qwNheJystzf6MrOqsqExE-broleo18W9XKidvGd5CTfFZaAPV-p1okXpMNFP_LKw")' }}
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-primary">Öne Çıkan</p>
                                            <h3 className="text-xl font-bold text-white">iPhone 14 Pro</h3>
                                        </div>
                                    </div>
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
