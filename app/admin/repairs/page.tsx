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
import { Eye, Search, Filter, Wrench, Smartphone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getRepairs } from "@/app/actions/repair"

const statusConfig: Record<string, { label: string, color: "default" | "secondary" | "destructive" | "outline" }> = {
    received: { label: "Teslim Alındı", color: "secondary" },
    diagnosing: { label: "Arıza Tespiti", color: "outline" },
    pending_approval: { label: "Onay Bekliyor", color: "destructive" },
    in_progress: { label: "İşlemde", color: "default" },
    completed: { label: "Tamamlandı", color: "default" },
    delivered: { label: "Teslim Edildi", color: "outline" }
}

export default async function AdminRepairsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q: query } = await searchParams
    const repairs = await getRepairs(query)

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Tamir Takibi</h2>
                    <p className="text-muted-foreground">Cihaz tamir durumlarını buradan yönetebilirsiniz.</p>
                </div>
                <Link href="/admin/repairs/new">
                    <Button className="gap-2">
                        <Smartphone className="h-4 w-4" /> Yeni Kayıt Oluştur
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <form action="/admin/repairs" method="GET">
                        <Input
                            name="q"
                            defaultValue={query}
                            placeholder="Takip kodu, müşteri veya cihaz ara..."
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
                            <TableHead>Takip Kodu</TableHead>
                            <TableHead>Müşteri</TableHead>
                            <TableHead>Cihaz</TableHead>
                            <TableHead>Sorun</TableHead>
                            <TableHead>Tarih</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {repairs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                    Kayıt bulunamadı.
                                </TableCell>
                            </TableRow>
                        ) : (
                            repairs.map((repair) => {
                                const status = statusConfig[repair.status] || statusConfig.received
                                return (
                                    <TableRow key={repair.id}>
                                        <TableCell className="font-mono font-medium">{repair.tracking_code}</TableCell>
                                        <TableCell>{repair.customer_name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Smartphone className="h-4 w-4 text-muted-foreground" />
                                                {repair.device_model}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Wrench className="h-4 w-4 text-muted-foreground" />
                                                <span className="truncate max-w-[200px]">{repair.issue}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{new Date(repair.createdAt).toLocaleDateString('tr-TR')}</TableCell>
                                        <TableCell>
                                            <Badge variant={status.color}>
                                                {status.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/admin/repairs/${repair.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
