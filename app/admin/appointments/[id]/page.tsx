import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, Phone, User, CheckCircle2, XCircle, AlertCircle, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { getAppointment, updateAppointmentStatus, deleteAppointment } from "@/app/actions/appointment"
import { notFound, redirect } from "next/navigation"

const statusConfig: Record<string, { label: string, color: "default" | "secondary" | "destructive" | "outline", icon: any }> = {
    confirmed: { label: "Onaylandı", color: "default", icon: CheckCircle2 },
    pending: { label: "Bekliyor", color: "secondary", icon: AlertCircle },
    cancelled: { label: "İptal", color: "destructive", icon: XCircle },
    completed: { label: "Tamamlandı", color: "outline", icon: CheckCircle2 }
}

export default async function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const appointment = await getAppointment(parseInt(id))

    if (!appointment) {
        notFound()
    }

    const status = statusConfig[appointment.status] || statusConfig.pending
    const StatusIcon = status.icon

    async function handleStatusChange(formData: FormData) {
        "use server"
        const status = formData.get("status") as string
        await updateAppointmentStatus(appointment!.id, status)
    }

    async function handleDelete() {
        "use server"
        await deleteAppointment(appointment!.id)
        redirect("/admin/appointments")
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/appointments">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Randevu Detayı</h2>
                        <p className="text-muted-foreground">Randevu bilgilerini görüntüleyin ve yönetin.</p>
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
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Randevu Bilgileri</h3>
                            <Badge variant={status.color} className="gap-1 text-base px-3 py-1">
                                <StatusIcon className="h-4 w-4" />
                                {status.label}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                                <Calendar className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Tarih</p>
                                    <p className="font-semibold">{new Date(appointment.date).toLocaleDateString('tr-TR')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                                <Clock className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Saat</p>
                                    <p className="font-semibold">{appointment.time}</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <h4 className="font-medium">Hizmet / Açıklama</h4>
                            <p className="text-muted-foreground bg-muted/30 p-4 rounded-lg">
                                {appointment.description || "Açıklama belirtilmemiş."}
                            </p>
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                        <h3 className="text-lg font-semibold">Durum Güncelle</h3>
                        <form action={handleStatusChange} className="flex items-end gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium">Yeni Durum</label>
                                <Select name="status" defaultValue={appointment.status}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Durum seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Bekliyor</SelectItem>
                                        <SelectItem value="confirmed">Onaylandı</SelectItem>
                                        <SelectItem value="completed">Tamamlandı</SelectItem>
                                        <SelectItem value="cancelled">İptal Edildi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit">Güncelle</Button>
                        </form>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                        <h3 className="text-lg font-semibold">Müşteri Bilgileri</h3>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">İsim Soyisim</p>
                                    <p className="font-medium">{appointment.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Telefon</p>
                                    <p className="font-medium">{appointment.phone}</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Button className="w-full gap-2" variant="outline" asChild>
                                <a href={`tel:${appointment.phone}`}>
                                    <Phone className="h-4 w-4" /> Ara
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
