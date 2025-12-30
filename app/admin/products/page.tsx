import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Search, Filter, UploadCloud } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getProducts } from "@/app/actions/product"
import { ProductTable } from "./ProductTable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ q?: string, status?: string, min?: string, max?: string, brand?: string }> }) {
    const { q: query, status, min, max, brand } = await searchParams
    const result = await getProducts({
        query,
        status,
        limit: 100, // Increase limit for admin
        minPrice: min ? Number(min) : undefined,
        maxPrice: max ? Number(max) : undefined,
        brand
    })

    const products = result.products.map((product) => ({
        ...product,
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
        cost: product.cost ? Number(product.cost) : null,
    }));


    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Ürünler</h2>
                    <p className="text-muted-foreground">Mağazanızdaki ürünleri buradan yönetebilirsiniz.</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Yeni Ürün Ekle
                    </Button>
                </Link>
            </div>

            <div className="bg-card p-4 rounded-lg border border-border shadow-sm space-y-4">
                <form action="/admin/products" method="GET" className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <div className="relative col-span-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            name="q"
                            defaultValue={query}
                            placeholder="Ürün adı veya kategori ara..."
                            className="pl-9 bg-background"
                        />
                    </div>

                    <select
                        name="status"
                        defaultValue={status}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="">Tüm Durumlar</option>
                        <option value="active">Aktif</option>
                        <option value="draft">Taslak</option>
                        <option value="archived">Arşiv</option>
                    </select>

                    <select
                        name="brand"
                        defaultValue={brand}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="">Tüm Markalar</option>
                        <option value="Apple">Apple</option>
                        <option value="Samsung">Samsung</option>
                        <option value="Xiaomi">Xiaomi</option>
                    </select>

                    <div className="flex gap-2">
                        <Input name="min" type="number" placeholder="Min ₺" defaultValue={min} className="w-full" />
                        <Input name="max" type="number" placeholder="Max ₺" defaultValue={max} className="w-full" />
                    </div>

                    <div className="flex gap-2 lg:col-span-5 justify-end">
                        <Button type="submit" variant="secondary" className="gap-2">
                            <Filter className="h-4 w-4" /> Filtrele
                        </Button>
                        <Link href="/admin/products">
                            <Button variant="outline" type="button">Temizle</Button>
                        </Link>
                    </div>
                </form>
            </div>

            <ProductTable products={products as any} />
        </div>
    )
}
