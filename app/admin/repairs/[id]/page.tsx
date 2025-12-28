import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UpdateRepairStatusForm } from "@/components/admin/UpdateRepairStatusForm"
import {
    ArrowLeft, Printer, Smartphone, Wrench, User, CheckCircle2,
    Calendar,
    Shield,
    Hash,
    Phone as PhoneIcon
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { getRepair, updateRepair } from "@/app/actions/repair"
import { getRepairEmailHistory } from "@/app/actions/email"
import { EmailHistory } from "@/components/admin/EmailHistory"
import { notFound } from "next/navigation"


const statusConfig: Record<string, { label: string, color: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
    received: { label: "Cihaz Teslim Alındı", color: "secondary" },
    diagnosing: { label: "Arıza Tespiti", color: "info" },
    price_pending: { label: "Fiyat Verildi / Onay Bekliyor", color: "warning" },
    parts_ordered: { label: "Parça Bekleniyor", color: "outline" },
    in_progress: { label: "Onarım Süreci", color: "default" },
    testing: { label: "Test Aşamasında", color: "info" },
    completed: { label: "İşlem Tamamlandı", color: "success" },
    delivered: { label: "Teslim Edildi", color: "secondary" },
    cancelled: { label: "İptal / İade", color: "destructive" }
}

export default async function RepairDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const repair = await getRepair(parseInt(id)) as any

    if (!repair) {
        notFound()
    }

    // Fetch email history
    const emailHistory = await getRepairEmailHistory(parseInt(id))

    const status = statusConfig[repair.status] || statusConfig.received

    async function handleStatusChange(formData: FormData) {
        "use server"
        const status = formData.get("status") as string
        await updateRepair(repair!.id, formData)
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/repairs">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Tamir Kaydı</h2>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <Hash className="h-3 w-3" /> {repair.tracking_code}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Printer className="h-4 w-4" /> Form Yazdır
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                        <h3 className="text-lg font-semibold">Durum ve Bilgi Güncelle</h3>
                        <UpdateRepairStatusForm
                            repair={repair}
                            statusConfig={statusConfig}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                            <Smartphone className="h-5 w-5 text-primary" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Cihaz Modeli</p>
                                <p className="font-semibold">{repair.device_model}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                            <Calendar className="h-5 w-5 text-primary" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Kayıt Tarihi</p>
                                <p className="font-semibold">{new Date(repair.createdAt).toLocaleDateString('tr-TR')}</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                            <Wrench className="h-4 w-4" /> Arıza Tanımı
                        </h4>
                        <p className="text-muted-foreground bg-muted/30 p-4 rounded-lg">
                            {repair.issue}
                        </p>
                    </div>

                    <Separator />

                    {/* Security Info */}
                    {(repair.lockPassword || repair.lockPattern) && (
                        <div className="space-y-2">
                            <h4 className="font-medium flex items-center gap-2">
                                <Shield className="h-4 w-4" /> Güvenlik Bilgileri
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {repair.lockPassword && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                        <span className="text-xs text-red-600 font-bold uppercase block">Ekran Şifresi / PIN</span>
                                        <span className="font-mono text-lg font-bold text-red-700 dark:text-red-400">{repair.lockPassword}</span>
                                    </div>
                                )}
                                {repair.lockPattern && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                        <span className="text-xs text-red-600 font-bold uppercase block mb-1">Desen Kilidi</span>
                                        <span className="font-mono text-sm font-medium text-red-700 dark:text-red-400 tracking-widest">{repair.lockPattern}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Images */}
                    {repair.images && (
                        <div className="space-y-3">
                            <h4 className="font-medium flex items-center gap-2">
                                <Smartphone className="h-4 w-4" /> Cihaz Fotoğrafları
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {JSON.parse(repair.images).map((img: string, i: number) => (
                                    <div key={i} className="aspect-square rounded-lg overflow-hidden border bg-muted">
                                        <img src={img} alt={`Repair ${i}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Private Notes (If any) */}
                    {repair.privateNotes && (
                        <div className="space-y-2">
                            <h4 className="font-medium text-amber-600 flex items-center gap-2">
                                <User className="h-4 w-4" /> Teknisyen Notları
                            </h4>
                            <p className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 p-4 rounded-lg text-amber-900 dark:text-amber-100 italic text-sm">
                                "{repair.privateNotes}"
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <h4 className="font-medium">Tahmini Ücret</h4>
                        <p className="text-2xl font-bold text-primary">
                            {repair.estimated_cost ? `₺${repair.estimated_cost}` : "Belirlenmedi"}
                        </p>
                    </div>
                </div>

                {/* Dates & Personnel */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                    <h3 className="text-lg font-semibold">Cihaz Takip Bilgileri</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Teslim Alan</p>
                            <p className="font-medium">{repair.receivedBy || "-"}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">İstenen Teslim Tarihi</p>
                            <p className="font-medium">
                                {repair.requestedDate ? new Date(repair.requestedDate).toLocaleDateString('tr-TR') : "-"}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Tahmini Teslim Tarihi</p>
                            <p className="font-medium">
                                {repair.estimatedDate ? new Date(repair.estimatedDate).toLocaleDateString('tr-TR') : "-"}
                            </p>
                        </div>
                    </div>
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
                                <p className="font-medium">{repair.customer_name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <PhoneIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Telefon</p>
                                <p className="font-medium">{repair.phone}</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Button className="w-full gap-2" variant="outline" asChild>
                            <a href={`tel:${repair.phone}`}>
                                <PhoneIcon className="h-4 w-4" /> Ara
                            </a>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Email History Section */}
            <EmailHistory
                repairId={repair.id}
                customerName={repair.customer_name}
                trackingCode={repair.tracking_code}
                deviceModel={repair.device_model}
                estimatedCost={repair.estimated_cost ? Number(repair.estimated_cost) : undefined}
                emails={emailHistory}
            />
        </div >
    )
}
