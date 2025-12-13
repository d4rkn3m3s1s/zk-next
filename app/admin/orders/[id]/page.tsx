import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Printer, Truck, CheckCircle, XCircle, Clock } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { getOrder, updateOrderStatus } from "@/app/actions/order"
import { notFound } from "next/navigation"

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    Processing: "secondary",
    Shipped: "default",
    Delivered: "outline",
    Cancelled: "destructive"
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const order = await getOrder(parseInt(id))

    if (!order) {
        notFound()
    }

    async function handleStatusChange(formData: FormData) {
        "use server"
        const status = formData.get("status") as string
        await updateOrderStatus(order!.id, status)
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Sipariş #{order.orderNumber}</h2>
                        <p className="text-muted-foreground">
                            {new Date(order.createdAt).toLocaleString('tr-TR')}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Printer className="h-4 w-4" /> Yazdır
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                        <h3 className="text-lg font-semibold">Sipariş İçeriği</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ürün</TableHead>
                                    <TableHead className="text-right">Birim Fiyat</TableHead>
                                    <TableHead className="text-right">Adet</TableHead>
                                    <TableHead className="text-right">Toplam</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-md bg-muted overflow-hidden">
                                                    {item.product.images ? (
                                                        <img
                                                            src={JSON.parse(item.product.images)[0]}
                                                            alt={item.product.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full bg-secondary" />
                                                    )}
                                                </div>
                                                <span className="font-medium">{item.product.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">₺{item.price.toString()}</TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell className="text-right">₺{(Number(item.price) * item.quantity).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={3} className="text-right font-medium">Ara Toplam</TableCell>
                                    <TableCell className="text-right">₺{order.totalAmount.toString()}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={3} className="text-right font-medium">Kargo</TableCell>
                                    <TableCell className="text-right">₺0.00</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={3} className="text-right font-bold text-lg">Genel Toplam</TableCell>
                                    <TableCell className="text-right font-bold text-lg">₺{order.totalAmount.toString()}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                        <h3 className="text-lg font-semibold">Sipariş Durumu</h3>
                        <div className="flex items-center gap-4">
                            <Badge variant={statusColors[order.status] || "default"} className="text-base px-4 py-1">
                                {order.status}
                            </Badge>
                            <form action={handleStatusChange} className="flex items-center gap-2">
                                <Select name="status" defaultValue={order.status}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Durum Güncelle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Processing">İşleniyor</SelectItem>
                                        <SelectItem value="Shipped">Kargolandı</SelectItem>
                                        <SelectItem value="Delivered">Teslim Edildi</SelectItem>
                                        <SelectItem value="Cancelled">İptal Edildi</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button type="submit" size="sm">Güncelle</Button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                        <h3 className="text-lg font-semibold">Müşteri Bilgileri</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Müşteri Adı</p>
                                <p className="font-medium">{order.customerName || order.user?.username || "Misafir"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">E-posta</p>
                                <p className="font-medium">{order.user?.email || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Telefon</p>
                                <p className="font-medium">{order.user?.phone || "-"}</p>
                            </div>
                        </div>

                        <Separator />

                        <h3 className="text-lg font-semibold">Teslimat Adresi</h3>
                        <p className="text-sm text-muted-foreground">
                            {/* Address is not in the schema yet, placeholder */}
                            Adres bilgisi bulunamadı.
                        </p>
                    </div>

                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                        <h3 className="text-lg font-semibold">Ödeme Bilgileri</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Ödeme Yöntemi</span>
                                <span className="font-medium">Kredi Kartı</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Ödeme Durumu</span>
                                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                    {order.paymentStatus}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
