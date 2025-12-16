"use client";

import { useEffect, useState } from "react";
import { getCampaigns, saveCampaign, toggleCampaignStatus, deleteCampaign } from "@/app/actions/campaign";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Plus, Megaphone, Calendar } from "lucide-react";

export default function MarketingPage() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        loadCampaigns();
    }, []);

    const loadCampaigns = async () => {
        const data = await getCampaigns();
        setCampaigns(data);
        setLoading(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        await saveCampaign({
            title,
            description,
            imageUrl,
            isActive: false // Default inactive
        });
        setIsCreateOpen(false);
        setTitle("");
        setDescription("");
        setImageUrl("");
        loadCampaigns();
    };

    const handleToggle = async (id: number, current: boolean) => {
        // Optimistic update
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, isActive: !current } : c));
        await toggleCampaignStatus(id, !current);
        loadCampaigns(); // Sync
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Silmek istediğinize emin misiniz?")) return;
        setCampaigns(prev => prev.filter(c => c.id !== id));
        await deleteCampaign(id);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Kampanya & İndirim Modülü</h2>
                    <p className="text-muted-foreground">Sitede görünecek pop-up kampanyalarını yönetin.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-purple-600 hover:bg-purple-700">
                            <Plus className="mr-2 size-4" /> Yeni Kampanya
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0a0a0a] border-white/10">
                        <DialogHeader>
                            <DialogTitle>Yeni Kampanya Oluştur</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Başlık</Label>
                                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Örn: Hafta Sonu İndirimi" className="bg-white/5 border-white/10" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Açıklama</Label>
                                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Kampanya detayları..." className="bg-white/5 border-white/10" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Görsel URL (Opsiyonel)</Label>
                                <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." className="bg-white/5 border-white/10" />
                            </div>
                            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">Oluştur</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((camp) => (
                    <div key={camp.id} className={`rounded-xl border ${camp.isActive ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/10 bg-white/5'} p-6 transition-all`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-white/10">
                                <Megaphone className="size-5 text-white" />
                            </div>
                            <Switch
                                checked={camp.isActive}
                                onCheckedChange={() => handleToggle(camp.id, camp.isActive)}
                            />
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2">{camp.title}</h3>
                        <p className="text-sm text-slate-400 mb-4 line-clamp-2">{camp.description}</p>

                        {camp.imageUrl && (
                            <div className="aspect-video w-full rounded-lg bg-black/40 mb-4 overflow-hidden">
                                <img src={camp.imageUrl} alt="" className="w-full h-full object-cover opacity-70" />
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <div className="flex items-center text-xs text-slate-500">
                                <Calendar className="mr-1 size-3" />
                                {new Date(camp.createdAt).toLocaleDateString()}
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(camp.id)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
