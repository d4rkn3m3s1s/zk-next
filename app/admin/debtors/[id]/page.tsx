import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Wallet, Calendar, Phone, MapPin, Plus, Minus } from "lucide-react"
import Link from "next/link"
import { DebtorActions } from "@/components/admin/DebtorActions"

// Server Component
export default async function DebtorDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const debtorId = parseInt(id)

    if (isNaN(debtorId)) notFound()

    const debtor = await prisma.debtor.findUnique({
        where: { id: debtorId },
        include: {
            transactions: {
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!debtor) notFound()

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/debtors">
                        <ArrowLeft className="size-5" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        {debtor.name}
                        <span className="text-sm font-normal text-muted-foreground bg-white/5 px-2 py-1 rounded-md border border-white/5">
                            #{debtor.id}
                        </span>
                    </h2>
                    <p className="text-muted-foreground">Müşteri Hareket Detayları</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Info Card */}
                <Card className="md:col-span-2 bg-[#0a0a0a] border-white/10">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-400">İletişim & Bakiye</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                                <span className="text-xs text-slate-500 uppercase tracking-wider">Güncel Bakiye</span>
                                <div className={`text-3xl font-bold tabular-nums ${Number(debtor.balance) > 0 ? "text-red-500" : "text-green-500"}`}>
                                    ₺{Number(debtor.balance).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                                <span className="text-xs text-slate-500 uppercase tracking-wider">Telefon</span>
                                <div className="text-xl font-medium text-white flex items-center gap-2">
                                    <Phone className="size-4 text-slate-400" />
                                    {debtor.phone || "-"}
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1 sm:col-span-2">
                                <span className="text-xs text-slate-500 uppercase tracking-wider">Konum / Adres</span>
                                <div className="text-base text-slate-300 flex items-center gap-2">
                                    <MapPin className="size-4 text-slate-400" />
                                    {debtor.city} / {debtor.district}
                                </div>
                                {debtor.notes && (
                                    <div className="mt-2 text-sm text-slate-500 border-t border-white/5 pt-2">
                                        Not: {debtor.notes}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons (Client Component) */}
                        <DebtorActions id={debtor.id} currentBalance={Number(debtor.balance)} />

                    </CardContent>
                </Card>

                {/* Quick Stats or Notes */}
                <Card className="bg-[#0a0a0a] border-white/10">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-400">Vergi Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <span className="text-xs text-slate-500">Vergi Dairesi</span>
                            <div className="text-white">{debtor.taxOffice || "-"}</div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-slate-500">Vergi No</span>
                            <div className="text-white font-mono">{debtor.taxNumber || "-"}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Transaction History */}
            <Card className="bg-[#0a0a0a] border-white/10">
                <CardHeader>
                    <CardTitle className="text-lg text-slate-400 flex items-center gap-2">
                        <Calendar className="size-4" />
                        Hareket Geçmişi
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border border-white/5 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-white/5">
                                <tr>
                                    <th className="px-4 py-3">Tarih</th>
                                    <th className="px-4 py-3">İşlem</th>
                                    <th className="px-4 py-3">Açıklama</th>
                                    <th className="px-4 py-3 text-right">Tutar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {debtor.transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                                            Henüz kayıtlı işlem yok.
                                        </td>
                                    </tr>
                                ) : (
                                    debtor.transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 font-mono text-slate-400">
                                                {tx.createdAt.toLocaleDateString('tr-TR')} {tx.createdAt.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tx.type === 'DEBT'
                                                        ? 'bg-red-500/10 text-red-400'
                                                        : 'bg-green-500/10 text-green-400'
                                                    }`}>
                                                    {tx.type === 'DEBT' ? 'Borç Eklendi' : 'Ödeme Alındı'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-300">
                                                {tx.description || "-"}
                                            </td>
                                            <td className={`px-4 py-3 text-right font-medium tabular-nums ${tx.type === 'DEBT' ? 'text-red-400' : 'text-green-400'
                                                }`}>
                                                {tx.type === 'DEBT' ? '+' : '-'}
                                                ₺{Number(tx.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
