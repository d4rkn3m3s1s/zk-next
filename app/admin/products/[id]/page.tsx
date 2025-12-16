import { ProductForm } from "@/components/admin/ProductForm"
import { getProduct } from "@/app/actions/product"
import { notFound } from "next/navigation"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const productId = parseInt(id)

    if (isNaN(productId)) {
        notFound()
    }

    const productRaw = await getProduct(productId)

    if (!productRaw) {
        notFound()
    }

    // Serialize Decimal and Date fields to plain strings/numbers for Client Component
    const product = {
        ...productRaw,
        price: productRaw.price.toString(),
        comparePrice: productRaw.comparePrice?.toString() || null,
        cost: productRaw.cost?.toString() || null,
        createdAt: productRaw.createdAt.toISOString(),
        updatedAt: productRaw.updatedAt.toISOString(),
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
