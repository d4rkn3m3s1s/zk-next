"use client";

import { useState, useEffect } from "react";
import { getSales, createSale, updateSale, deleteSale } from "@/app/actions/sales";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, X, Loader2, Edit, Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";

export default function SalesPage() {
    const [sales, setSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingSale, setEditingSale] = useState<any>(null); // New state for edit

    const fetchSales = async () => {
        const res = await getSales();
        if (res.success && res.sales) {
            setSales(res.sales);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        let res;
        if (editingSale) {
            // Update
            res = await updateSale(editingSale.id, {
                productName: formData.get("productName"),
                soldPrice: formData.get("soldPrice"),
                costPrice: formData.get("costPrice")
            });
        } else {
            // Create
            res = await createSale(formData);
        }

        if (res.success) {
            setOpen(false);
            setEditingSale(null); // Reset
            fetchSales();
        } else {
            alert(res.error || "Hata oluştu");
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;

        const res = await deleteSale(id);
        if (res.success) {
            fetchSales();
        } else {
            alert(res.error);
        }
    }

    const openNewSale = () => {
        setEditingSale(null);
        setOpen(true);
    }

    const openEditSale = (sale: any) => {
        setEditingSale(sale);
        setOpen(true);
    }

    // Calculate totals
    const totalRevenue = sales.reduce((acc, curr) => acc + Number(curr.soldPrice), 0);
    const totalProfit = sales.reduce((acc, curr) => acc + Number(curr.profit), 0);

    const chartData = [...sales].reverse().map(s => ({
        ...s,
        soldPrice: Number(s.soldPrice),
        profit: Number(s.profit),
        date: new Date(s.soldAt)
    }));

    return (
        <div className="p-8 space-y-8 bg-black min-h-screen text-white">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Kârlılık Defteri</h1>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openNewSale} className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
                            <Plus className="mr-2 h-4 w-4" /> Yeni Satış Ekle
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-700 text-white">
                        <DialogHeader>
                            <DialogTitle>{editingSale ? "Satışı Düzenle" : "Yeni Satış Kaydı"}</DialogTitle>
                            <DialogDescription>
                                {editingSale ? "Satış bilgilerini güncelleyin." : "Sisteme yeni bir satış veya tamir işlemi ekleyin."}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Ürün / Hizmet Adı</Label>
                                <Input
                                    name="productName"
                                    defaultValue={editingSale?.productName}
                                    required
                                    placeholder="Örn: iPhone 15 Ekran Değişimi"
                                    className="bg-slate-800 border-slate-700"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Satış Fiyatı (₺)</Label>
                                    <Input
                                        name="soldPrice"
                                        type="number"
                                        step="0.01"
                                        defaultValue={editingSale?.soldPrice}
                                        required
                                        placeholder="0.00"
                                        className="bg-slate-800 border-slate-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Maliyet (₺)</Label>
                                    <Input
                                        name="costPrice"
                                        type="number"
                                        step="0.01"
                                        defaultValue={editingSale?.costPrice}
                                        required
                                        placeholder="0.00"
                                        className="bg-slate-800 border-slate-700"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting} className="bg-green-500 hover:bg-green-600 text-black font-bold w-full">
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : (editingSale ? "Güncelle" : "Kaydet")}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-slate-400 text-sm">Toplam Ciro</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-green-400">
                            ₺{totalRevenue.toLocaleString('tr-TR')}
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-slate-400 text-sm">Toplam Kâr</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-cyan-400">
                            ₺{totalProfit.toLocaleString('tr-TR')}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle>Genel Bakış</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="date" tickFormatter={(date) => format(date, 'd MMM', { locale: tr })} stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#94a3b8' }}
                                    formatter={(value: any) => [`₺${(value || 0).toLocaleString()}`, '']}
                                    labelFormatter={(label) => format(new Date(label), 'd MMMM yyyy HH:mm', { locale: tr })}
                                />
                                <Line name="Kâr" type="monotone" dataKey="profit" stroke="#22d3ee" strokeWidth={2} dot={false} />
                                <Line name="Satış" type="monotone" dataKey="soldPrice" stroke="#4ade80" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-500">
                            Henüz veri yok.
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle>Son İşlemler</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-slate-800/50">
                                <TableHead className="text-slate-400">Ürün</TableHead>
                                <TableHead className="text-slate-400">Tarih</TableHead>
                                <TableHead className="text-right text-slate-400">Satış</TableHead>
                                <TableHead className="text-right text-slate-400">Kâr</TableHead>
                                <TableHead className="text-right text-slate-400 w-[100px]">İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">Yükleniyor...</TableCell>
                                </TableRow>
                            ) : sales.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">Kayıt bulunamadı.</TableCell>
                                </TableRow>
                            ) : (
                                sales.map((sale) => (
                                    <TableRow key={sale.id} className="border-slate-800 hover:bg-slate-800/50 group">
                                        <TableCell className="font-medium text-slate-200">{sale.productName}</TableCell>
                                        <TableCell className="text-slate-400">{format(new Date(sale.soldAt), 'dd MMMM HH:mm', { locale: tr })}</TableCell>
                                        <TableCell className="text-right text-green-400 font-mono">₺{Number(sale.soldPrice).toLocaleString('tr-TR')}</TableCell>
                                        <TableCell className="text-right text-cyan-400 font-mono font-bold">₺{Number(sale.profit).toLocaleString('tr-TR')}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => openEditSale(sale)} className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(sale.id)} className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
