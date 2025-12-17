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
import { Eye, Search, Filter, Calendar, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getAppointments } from "@/app/actions/appointment"

const statusConfig: Record<string, { label: string, color: "default" | "secondary" | "destructive" | "outline", icon: any }> = {
    confirmed: { label: "Onaylandı", color: "default", icon: CheckCircle2 },
    pending: { label: "Bekliyor", color: "secondary", icon: AlertCircle },
    cancelled: { label: "İptal", color: "destructive", icon: XCircle },
    completed: { label: "Tamamlandı", color: "outline", icon: CheckCircle2 }
}

export default async function AdminAppointmentsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q: query } = await searchParams
    const appointments = await getAppointments(query)

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Randevular</h2>
                <p className="text-muted-foreground">Teknik servis randevularını buradan yönetebilirsiniz.</p>
            </div>

            <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <form action="/admin/appointments" method="GET">
                        <Input
                            name="q"
                            defaultValue={query}
                            placeholder="İsim veya telefon ara..."
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
                            <TableHead>Müşteri</TableHead>
                            <TableHead>Telefon</TableHead>
                            <TableHead>Tarih & Saat</TableHead>
                            <TableHead>Hizmet</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {appointments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                    Randevu bulunamadı.
                                </TableCell>
                            </TableRow>
                        ) : (
                            appointments.map((appointment: any) => {
                                const status = statusConfig[appointment.status] || statusConfig.pending
                                const StatusIcon = status.icon
                                return (
                                    <TableRow key={appointment.id}>
                                        <TableCell className="font-medium">{appointment.name}</TableCell>
                                        <TableCell>{appointment.phone}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                    {new Date(appointment.date).toLocaleDateString('tr-TR')}
                                                </span>
                                                <span className="flex items-center gap-1 text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    {appointment.time}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{appointment.description || "Genel Servis"}</TableCell>
                                        <TableCell>
                                            <Badge variant={status.color} className="gap-1">
                                                <StatusIcon className="h-3 w-3" />
                                                {status.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/admin/appointments/${appointment.id}`}>
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
