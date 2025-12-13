"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, MoreHorizontal, Download, ChevronDown } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteProduct, bulkDeleteProducts, bulkUpdateProductStatus } from "@/app/actions/product"
// import { toast } from "sonner" 
// If no toast lib installed, we'll just use simple alert or console for now, or install one.
// The project uses shadcn, usually comes with sonner or toast. I'll rely on revalidatePath for feedback visually.

interface Product {
    id: number
    name: string
    category: string | null
    price: any // Decimal
    stock: number
    status: string
    images: string | null
}

export function ProductTable({ products }: { products: Product[] }) {
    const router = useRouter()
    const [selectedIds, setSelectedIds] = useState<number[]>([])

    const toggleSelectAll = () => {
        if (selectedIds.length === products.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(products.map(p => p.id))
        }
    }

    const toggleSelect = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id))
        } else {
            setSelectedIds([...selectedIds, id])
        }
    }

    const handleBulkDelete = async () => {
        if (!confirm(`${selectedIds.length} ürünü silmek istediğinize emin misiniz?`)) return
        await bulkDeleteProducts(selectedIds)
        setSelectedIds([])
        router.refresh()
    }

    const handleBulkStatus = async (status: string) => {
        await bulkUpdateProductStatus(selectedIds, status)
        setSelectedIds([])
        router.refresh()
    }

    const handleExport = () => {
        // Simple CSV export implementation client-side
        const headers = ["ID", "Name", "Category", "Price", "Stock", "Status"]
        const csvContent = [
            headers.join(","),
            ...products.map(p => [
                p.id,
                `"${p.name.replace(/"/g, '""')}"`,
                p.category || "",
                p.price.toString(),
                p.stock,
                p.status
            ].join(","))
        ].join("\n")

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", "products.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{products.length} ürün listeleniyor</span>
                    {selectedIds.length > 0 && (
                        <span className="text-sm font-medium text-primary">({selectedIds.length} seçildi)</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {selectedIds.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    Toplu İşlemler <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Seçili Ürünleri...</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleBulkStatus('active')}>
                                    Aktif Yap
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBulkStatus('draft')}>
                                    Taslağa Çek
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBulkStatus('archived')}>
                                    Arşivle
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleBulkDelete} className="text-destructive">
                                    Sil
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    <Button variant="outline" onClick={handleExport} className="gap-2">
                        <Download className="h-4 w-4" /> CSV İndir
                    </Button>
                </div>
            </div>

            <div className="rounded-md border border-border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    checked={products.length > 0 && selectedIds.length === products.length}
                                    onCheckedChange={toggleSelectAll}
                                />
                            </TableHead>
                            <TableHead className="w-[80px]">Görsel</TableHead>
                            <TableHead>Ürün Adı</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Fiyat</TableHead>
                            <TableHead>Stok</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                                    Ürün bulunamadı.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.includes(product.id)}
                                            onCheckedChange={() => toggleSelect(product.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="h-12 w-12 rounded-md bg-muted overflow-hidden">
                                            {product.images ? (
                                                <img
                                                    src={JSON.parse(product.images)[0]}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-secondary text-secondary-foreground text-xs">
                                                    No Img
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.category || "-"}</TableCell>
                                    <TableCell>₺{Number(product.price).toString()}</TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell>
                                        <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                                            {product.status === 'active' ? 'Aktif' : product.status === 'draft' ? 'Taslak' : 'Arşiv'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/products/${product.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                                onClick={async () => {
                                                    if (confirm("Silmek istediğinize emin misiniz?")) {
                                                        await deleteProduct(product.id)
                                                        router.refresh()
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
