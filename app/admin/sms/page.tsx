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
import { Trash2, Search, Smartphone, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getInboundSMS, deleteInboundSMS } from "@/app/actions/sms"
import { InboundSms } from "@prisma/client"

export default async function AdminSMSPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q: query } = await searchParams
    const smsList = await getInboundSMS(query)

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Gelen SMS'ler</h2>
                <p className="text-muted-foreground">Android cihazınızdan yönlendirilen (Inbound) SMS mesajları.</p>
            </div>

            <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <form action="/admin/sms" method="GET">
                        <Input
                            name="q"
                            defaultValue={query}
                            placeholder="Gönderen veya mesaj ara..."
                            className="pl-9 bg-background"
                        />
                    </form>
                </div>
            </div>

            <div className="rounded-md border border-border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Gönderen</TableHead>
                            <TableHead>Mesaj</TableHead>
                            <TableHead>Cihaz Zamanı</TableHead>
                            <TableHead>Sistem Kayıt</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {smsList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                    Henüz gelen SMS bulunamadı.
                                </TableCell>
                            </TableRow>
                        ) : (
                            smsList.map((sms: InboundSms) => (
                                <TableRow key={sms.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <Smartphone className="h-4 w-4 text-purple-400" />
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium text-slate-200">{sms.sender}</span>
                                    </TableCell>
                                    <TableCell className="max-w-md break-words text-slate-300">
                                        {sms.message}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {sms.received_at ? new Date(sms.received_at).toLocaleString('tr-TR') : "Bilinmiyor"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {new Date(sms.created_at).toLocaleString('tr-TR')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <form action={deleteInboundSMS.bind(null, sms.id)}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-white hover:bg-destructive transition-all">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
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
