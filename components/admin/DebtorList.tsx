"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Phone, MapPin, Wallet, ArrowUpRight, AlertCircle, Shield, Plus, X } from "lucide-react";
import { Debtor, createDebtor } from "@/app/actions/debtors";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

interface DebtorListProps {
    initialDebtors: Debtor[];
}

export function DebtorList({ initialDebtors }: DebtorListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [debtors, setDebtors] = useState<Debtor[]>(initialDebtors);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        balance: "",
        city: "",
        district: "",
        notes: ""
    });

    const filteredDebtors = debtors.filter((d) =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalDebt = debtors.reduce((acc, curr) => acc + curr.balance, 0);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await createDebtor({
                name: formData.name,
                phone: formData.phone,
                balance: Number(formData.balance),
                city: formData.city,
                district: formData.district,
                notes: formData.notes
            });

            if (res.success) {
                setIsAddOpen(false);
                setFormData({ name: "", phone: "", balance: "", city: "", district: "", notes: "" });
                // In a real app we might re-fetch or optimistic update, but revalidatePath handles it on server.
                // For client state, we rely on page reload or we can append if we returned the new object.
                // For simplicity, let's refresh.
                window.location.reload();
            } else {
                alert("Hata: " + res.error);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Stats Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <div className="p-6 rounded-2xl bg-gradient-to-br from-red-900/40 to-black border border-red-500/20 backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-red-500/10 blur-3xl group-hover:bg-red-500/20 transition-all duration-500" />
                    <div className="relative z-10">
                        <h3 className="text-slate-400 font-medium text-sm uppercase tracking-wider mb-1">Toplam Alacak</h3>
                        <p className="text-3xl font-bold text-white tabular-nums drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                            ₺{totalDebt.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </p>
                        <div className="mt-4 flex items-center text-red-400 text-xs gap-1">
                            <AlertCircle className="size-3" />
                            <span>Tahsil edilmesi gereken</span>
                        </div>
                    </div>
                    <Wallet className="absolute right-4 bottom-4 size-12 text-red-500/20 group-hover:scale-110 transition-transform duration-500" />
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/40 to-black border border-blue-500/20 backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-500/10 blur-3xl group-hover:bg-blue-500/20 transition-all duration-500" />
                    <div className="relative z-10">
                        <h3 className="text-slate-400 font-medium text-sm uppercase tracking-wider mb-1">Borçlu Sayısı</h3>
                        <p className="text-3xl font-bold text-white tabular-nums drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            {debtors.length}
                        </p>
                        <div className="mt-4 flex items-center text-blue-400 text-xs gap-1">
                            <Shield className="size-3" />
                            <span>Aktif borçlu kaydı</span>
                        </div>
                    </div>
                    <MapPin className="absolute right-4 bottom-4 size-12 text-blue-500/20 group-hover:scale-110 transition-transform duration-500" />
                </div>

                {/* Action Card */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/20 backdrop-blur-xl relative overflow-hidden group flex flex-col items-center justify-center text-center cursor-pointer h-full"
                        >
                            <div className="absolute inset-0 bg-purple-500/10 blur-3xl group-hover:bg-purple-500/20 transition-all duration-500" />
                            <div className="relative z-10 flex flex-col items-center gap-3">
                                <div className="size-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all duration-500">
                                    <Plus className="size-6" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Yeni Ekle</h3>
                                    <p className="text-slate-400 text-sm mt-1">Yeni veresiye kaydı oluştur</p>
                                </div>
                            </div>
                        </motion.button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Yeni Borçlu Ekle</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <Label>Müşteri Adı / Ünvanı</Label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-white/5 border-white/10"
                                        placeholder="Ad Soyad veya Firma"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Telefon</Label>
                                    <Input
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="bg-white/5 border-white/10"
                                        placeholder="05..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Bakiye (₺)</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.balance}
                                        onChange={e => setFormData({ ...formData, balance: e.target.value })}
                                        className="bg-white/5 border-white/10"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>İl</Label>
                                    <Input
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        className="bg-white/5 border-white/10"
                                        placeholder="Kayseri"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>İlçe</Label>
                                    <Input
                                        value={formData.district}
                                        onChange={e => setFormData({ ...formData, district: e.target.value })}
                                        className="bg-white/5 border-white/10"
                                        placeholder="Melikgazi"
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label>Notlar</Label>
                                    <Textarea
                                        value={formData.notes}
                                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                        className="bg-white/5 border-white/10"
                                        placeholder="Ek notlar..."
                                    />
                                </div>
                            </div>
                            <Button disabled={loading} type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-6">
                                {loading ? "Kaydediliyor..." : "Kaydet"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </motion.div>

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative max-w-md"
            >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="size-5 text-slate-500" />
                </div>
                <input
                    type="text"
                    placeholder="Müşteri Ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                />
            </motion.div>

            {/* Debtors Grid */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate="show"
                variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.05
                        }
                    }
                }}
            >
                <AnimatePresence mode="popLayout">
                    {filteredDebtors.map((debtor) => (
                        <motion.div
                            key={debtor.id}
                            layout
                            variants={{
                                hidden: { opacity: 0, scale: 0.9 },
                                show: { opacity: 1, scale: 1 }
                            }}
                            initial="hidden"
                            animate="show"
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="group relative rounded-2xl bg-[#0a0a0a]/80 border border-white/5 p-5 hover:border-purple-500/30 transition-colors duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 flex justify-between items-start mb-4">
                                <div>
                                    <Link href={`/admin/debtors/${debtor.id}`} className="block">
                                        <h4 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                                            {debtor.name}
                                        </h4>
                                    </Link>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="size-3" />
                                            <span className="truncate max-w-[150px]">{debtor.city || "Şehir"} / {debtor.district || "-"}</span>
                                        </div>
                                    </div>
                                </div>
                                <Link href={`/admin/debtors/${debtor.id}`} className="size-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-all">
                                    <ArrowUpRight className="size-5" />
                                </Link>
                            </div>

                            <div className="relative z-10 space-y-4">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                                    <span className="text-slate-400 text-sm">Bakiye</span>
                                    <span className="text-xl font-bold text-red-400 tabular-nums shadow-red-500/10 drop-shadow-sm">
                                        ₺{debtor.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 bg-transparent border-white/10 hover:bg-white/5 hover:text-white text-slate-400"
                                        onClick={() => window.open(`tel:${debtor.phone}`, '_self')}
                                    >
                                        <Phone className="size-4 mr-2" />
                                        Ara
                                    </Button>
                                    <Button
                                        asChild
                                        variant="default"
                                        size="sm"
                                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                        <Link href={`/admin/debtors/${debtor.id}`}>
                                            Detay
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredDebtors.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-slate-500">Kayıtlı borçlu bulunamadı.</p>
                </div>
            )}
        </div>
    );
}
