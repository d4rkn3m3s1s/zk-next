"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus, Loader2, Trash2 } from "lucide-react";
import { addDebt, processPayment, deleteDebtor } from "@/app/actions/debtors";
import { useRouter } from "next/navigation";

export function DebtorActions({ id, currentBalance }: { id: number, currentBalance: number }) {
    const [loading, setLoading] = useState(false);
    const [actionType, setActionType] = useState<'debt' | 'payment' | 'delete' | null>(null);
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const router = useRouter();

    const handleAction = async (e: React.FormEvent) => {
        e.preventDefault();

        if (actionType === 'delete') {
            setLoading(true);
            try {
                await deleteDebtor(id);
                router.push('/admin/debtors');
                return;
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        const val = parseFloat(amount);
        if (!val || val <= 0) return;

        setLoading(true);
        try {
            if (actionType === 'debt') {
                await addDebt(id, val, description);
            } else {
                await processPayment(id, val, description);
            }
            setActionType(null); // Close dialog
            setAmount("");
            setDescription("");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            <Dialog open={actionType === 'debt'} onOpenChange={(o) => { if (!o) { setActionType(null); setDescription(""); } }}>
                <DialogTrigger asChild>
                    <Button
                        onClick={() => setActionType('debt')}
                        className="h-auto py-4 bg-red-600/10 border border-red-600/20 text-red-500 hover:bg-red-600 hover:text-white"
                    >
                        <div className="flex flex-col items-center gap-1">
                            <Plus className="size-5" />
                            <span className="font-semibold">Borç Ekle</span>
                        </div>
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0a0a0a] border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Borç Ekle</DialogTitle>
                        <DialogDescription>
                            Müşterinin bakiyesine yeni bir borç tutarı ekleyin.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAction} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>Eklenecek Tutar (₺)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                autoFocus
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-white/5 border-white/10 text-2xl font-bold py-6"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Açıklama (İsteğe Bağlı)</Label>
                            <Input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="bg-white/5 border-white/10"
                                placeholder="Örn: Telefon Tamiri, Aksesuar vs."
                            />
                        </div>
                        <Button disabled={loading || !amount} type="submit" className="w-full bg-red-600 hover:bg-red-700 py-6">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Borcu Kaydet
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={actionType === 'payment'} onOpenChange={(o) => { if (!o) { setActionType(null); setDescription(""); } }}>
                <DialogTrigger asChild>
                    <Button
                        onClick={() => setActionType('payment')}
                        className="h-auto py-4 bg-green-600/10 border border-green-600/20 text-green-500 hover:bg-green-600 hover:text-white"
                    >
                        <div className="flex flex-col items-center gap-1">
                            <Minus className="size-5" />
                            <span className="font-semibold">Ödeme Al</span>
                        </div>
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0a0a0a] border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Ödeme Al / Borç Düş</DialogTitle>
                        <DialogDescription>
                            Müşteriden alınan ödemeyi girerek güncel bakiyeyi azaltın.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAction} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>Alınan Tutar (₺)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                autoFocus
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-white/5 border-white/10 text-2xl font-bold py-6 text-green-400"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Açıklama (İsteğe Bağlı)</Label>
                            <Input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="bg-white/5 border-white/10"
                                placeholder="Örn: Nakit, Havale vs."
                            />
                        </div>
                        <Button disabled={loading || !amount} type="submit" className="w-full bg-green-600 hover:bg-green-700 py-6">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Ödemeyi Kaydet
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={actionType === 'delete'} onOpenChange={(o) => !o && setActionType(null)}>
                <DialogTrigger asChild>
                    <Button
                        onClick={() => setActionType('delete')}
                        variant="outline"
                        className="col-span-2 h-auto py-3 border-red-900/30 text-red-700 hover:bg-red-950 hover:text-red-500 hover:border-red-900/50 mt-2"
                    >
                        <div className="flex items-center gap-2">
                            <Trash2 className="size-4" />
                            <span className="font-medium">Kaydı Sil</span>
                        </div>
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0a0a0a] border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Müşteri Kaydını Sil</DialogTitle>
                        <DialogDescription>
                            Bu işlem müşteriyi ve tüm geçmişini kalıcı olarak siler.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <p className="text-slate-400">
                            Bu müşteriyi ve tüm işlem geçmişini silmek istediğinize emin misiniz? <br />
                            <span className="text-red-500 font-bold">Bu işlem geri alınamaz.</span>
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="flex-1 bg-transparent border-white/10 hover:bg-white/5"
                                onClick={() => setActionType(null)}
                            >
                                İptal
                            </Button>
                            <Button
                                disabled={loading}
                                onClick={handleAction}
                                className="flex-1 bg-red-600 hover:bg-red-700"
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Evet, Sil
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div >
    )
}
