import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trash2, Reply, Mail, Calendar, User } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { getMessage, deleteMessage, markMessageAsRead } from "@/app/actions/message"
import { notFound, redirect } from "next/navigation"

export default async function MessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const message = await getMessage(parseInt(id))

    if (!message) {
        notFound()
    }

    // Mark as read when viewed
    if (!message.is_read) {
        await markMessageAsRead(message.id)
    }

    async function handleDelete() {
        "use server"
        await deleteMessage(message!.id)
        redirect("/admin/messages")
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/messages">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Mesaj Detayı</h2>
                        <p className="text-muted-foreground">Mesajı görüntüleyin ve yanıtlayın.</p>
                    </div>
                </div>
                <form action={handleDelete}>
                    <Button variant="destructive" className="gap-2">
                        <Trash2 className="h-4 w-4" /> Sil
                    </Button>
                </form>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-card p-8 rounded-xl border border-border shadow-sm space-y-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <h3 className="text-xl font-semibold">{message.subject || "Konusuz"}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(message.createdAt).toLocaleString('tr-TR')}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="prose prose-invert max-w-none">
                            <p className="whitespace-pre-wrap">{message.message}</p>
                        </div>
                    </div>

                    <div className="bg-card p-8 rounded-xl border border-border shadow-sm space-y-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Reply className="h-5 w-5" /> Yanıtla
                        </h3>
                        <div className="space-y-4">
                            <Textarea
                                placeholder="Yanıtınızı buraya yazın..."
                                className="min-h-[150px]"
                            />
                            <div className="flex justify-end">
                                <Button className="gap-2">
                                    <Reply className="h-4 w-4" /> Gönder
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                        <h3 className="text-lg font-semibold">Gönderen Bilgileri</h3>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">İsim Soyisim</p>
                                    <p className="font-medium">{message.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">E-posta</p>
                                    <p className="font-medium">{message.email}</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Button className="w-full gap-2" variant="outline" asChild>
                                <a href={`mailto:${message.email}`}>
                                    <Mail className="h-4 w-4" /> E-posta Gönder
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
