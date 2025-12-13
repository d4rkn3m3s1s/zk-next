import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Shield, Package } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { getUser, updateUserRole } from "@/app/actions/user"
import { notFound } from "next/navigation"

const roleConfig: Record<string, { label: string, color: "default" | "secondary" | "destructive" | "outline" }> = {
    admin: { label: "Yönetici", color: "destructive" },
    technician: { label: "Teknisyen", color: "default" },
    user: { label: "Müşteri", color: "secondary" }
}

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await getUser(parseInt(id))

    if (!user) {
        notFound()
    }

    const role = roleConfig[user.role] || roleConfig.user

    async function handleRoleChange(formData: FormData) {
        "use server"
        const role = formData.get("role") as string
        await updateUserRole(user!.id, role)
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/users">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Kullanıcı Detayı</h2>
                        <p className="text-muted-foreground">Kullanıcı bilgilerini ve geçmişini görüntüleyin.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                        <h3 className="text-lg font-semibold">Sipariş Geçmişi</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sipariş No</TableHead>
                                    <TableHead>Tarih</TableHead>
                                    <TableHead>Tutar</TableHead>
                                    <TableHead>Durum</TableHead>
                                    <TableHead className="text-right">İşlem</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {user.orders && user.orders.length > 0 ? (
                                    user.orders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">{order.orderNumber}</TableCell>
                                            <TableCell>{new Date(order.createdAt).toLocaleDateString('tr-TR')}</TableCell>
                                            <TableCell>₺{order.totalAmount.toString()}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{order.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/admin/orders/${order.id}`}>
                                                    <Button variant="ghost" size="sm">Detay</Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                            Sipariş bulunamadı.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                                <AvatarFallback className="text-2xl">{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-xl font-bold">{user.username}</h3>
                                <p className="text-muted-foreground">{user.email}</p>
                            </div>
                            <Badge variant={role.color} className="px-4 py-1">
                                {role.label}
                            </Badge>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{user.phone || "Telefon eklenmemiş"}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Adres bilgisi yok</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Kayıt: {new Date(user.createdAt).toLocaleDateString('tr-TR')}</span>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h4 className="font-medium flex items-center gap-2">
                                <Shield className="h-4 w-4" /> Rol Yönetimi
                            </h4>
                            <form action={handleRoleChange} className="flex gap-2">
                                <Select name="role" defaultValue={user.role}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Rol seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">Müşteri</SelectItem>
                                        <SelectItem value="technician">Teknisyen</SelectItem>
                                        <SelectItem value="admin">Yönetici</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button type="submit" size="sm">Kaydet</Button>
                            </form>
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Package className="h-4 w-4" /> İstatistikler
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted/50 p-3 rounded-lg text-center">
                                <p className="text-2xl font-bold">{user.orders?.length || 0}</p>
                                <p className="text-xs text-muted-foreground">Toplam Sipariş</p>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-lg text-center">
                                <p className="text-2xl font-bold">
                                    ₺{user.orders?.reduce((acc, order) => acc + Number(order.totalAmount), 0).toFixed(0) || 0}
                                </p>
                                <p className="text-xs text-muted-foreground">Toplam Harcama</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
