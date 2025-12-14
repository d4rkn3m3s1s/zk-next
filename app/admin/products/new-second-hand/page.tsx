
import { ProductForm } from "@/components/admin/ProductForm"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Save } from "lucide-react"
import Link from "next/link"

export default function NewSecondHandProductPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products">
                        <Button variant="outline" size="icon" className="h-10 w-10">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <span className="text-cyan-500">İkinci El</span> Ürün Ekle
                        </h2>
                        <p className="text-muted-foreground">İkinci el cihaz satışı için yeni kayıt oluşturun.</p>
                    </div>
                </div>
            </div>

            {/* Pass isSecondHand prop to enable the specialized fields */}
            <ProductForm isSecondHand={true} />
        </div>
    )
}
