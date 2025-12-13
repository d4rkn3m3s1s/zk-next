import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Eye, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getOrders } from "@/app/actions/order"

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    Processing: "secondary",
    Shipped: "default",
    Delivered: "outline",
    Cancelled: "destructive"
}

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q: query } = await searchParams
    const orders = await getOrders(query)

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Siparişler</h2>
                <p className="text-muted-foreground">Gelen siparişleri buradan takip edip yönetebilirsiniz.</p>
            </div>

            <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <form action="/admin/orders" method="GET">
                        <Input
                            name="q"
                            defaultValue={query}
                            placeholder="Sipariş no veya müşteri ara..."
                            className="pl-9 bg-background"
                        />
                    </form>
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" /> Filtrele
                </Button>
            </div>

            <div className="rounded-md border border-border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sipariş No</TableHead>
                            <TableHead>Müşteri</TableHead>
                            <TableHead>Tarih</TableHead>
                            <TableHead>Tutar</TableHead>
                            <TableHead>Ödeme</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                    Sipariş bulunamadı.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                                    <TableCell>{order.customerName || order.user?.username || "Misafir"}</TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleDateString('tr-TR')}</TableCell>
                                    <TableCell>₺{order.totalAmount.toString()}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                            {order.paymentStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusColors[order.status] || "default"}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/admin/orders/${order.id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
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
