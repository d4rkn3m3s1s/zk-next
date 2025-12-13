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
import { Eye, Trash2, Search, Filter, Mail, MailOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getMessages, deleteMessage } from "@/app/actions/message"

export default async function AdminMessagesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q: query } = await searchParams
    const messages = await getMessages(query)

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Mesajlar</h2>
                <p className="text-muted-foreground">İletişim formundan gelen mesajları yönetin.</p>
            </div>

            <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <form action="/admin/messages" method="GET">
                        <Input
                            name="q"
                            defaultValue={query}
                            placeholder="Gönderen veya konu ara..."
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
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Gönderen</TableHead>
                            <TableHead>Konu</TableHead>
                            <TableHead>Tarih</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {messages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                    Mesaj bulunamadı.
                                </TableCell>
                            </TableRow>
                        ) : (
                            messages.map((message) => (
                                <TableRow key={message.id} className={message.is_read ? "opacity-60" : ""}>
                                    <TableCell>
                                        {message.is_read ? (
                                            <MailOpen className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Mail className="h-4 w-4 text-primary" />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{message.name}</span>
                                            <span className="text-xs text-muted-foreground">{message.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{message.subject || "Konusuz"}</TableCell>
                                    <TableCell>{new Date(message.createdAt).toLocaleDateString('tr-TR')}</TableCell>
                                    <TableCell>
                                        <Badge variant={message.is_read ? "secondary" : "default"}>
                                            {message.is_read ? "Okundu" : "Yeni"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/messages/${message.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <form action={deleteMessage.bind(null, message.id)}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </form>
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
