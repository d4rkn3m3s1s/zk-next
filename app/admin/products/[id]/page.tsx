import { ProductForm } from "@/components/admin/ProductForm"
import { getProduct } from "@/app/actions/product"
import { notFound } from "next/navigation"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const product = await getProduct(parseInt(id))

    if (!product) {
        notFound()
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Ürün Düzenle</h2>
                <p className="text-muted-foreground">Ürün bilgilerini güncelleyin.</p>
            </div>

            <ProductForm product={product} />
        </div>
    )
}
