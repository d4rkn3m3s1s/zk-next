"use client";

import { useState } from "react";
import { updateSettings } from "@/app/actions/settings";
import { createUser, deleteUser } from "@/app/actions/user";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Save, Settings, DollarSign, Phone, Activity, Database, RefreshCw, Zap, Users, Trash2, Plus, Shield, Info, Layout, Mail } from "lucide-react";

export function SettingsForm({ settings }: { settings: any }) {
    return <SettingsFormReal settings={settings} users={[]} />;
}

export function SettingsFormReal({ settings, users }: { settings: any, users: any[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [maintenance, setMaintenance] = useState(settings?.maintenanceMode || false);
    const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "user" });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        formData.set("maintenanceMode", maintenance ? "on" : "off");

        await updateSettings(formData);
        router.refresh();
        setLoading(false);
        alert("Ayarlar başarıyla kaydedildi.");
    };

    const handleCreateUser = async () => {
        if (!newUser.username || !newUser.password) return alert("Kullanıcı adı ve şifre zorunludur.");
        const res = await createUser(newUser);
        if (res.success) {
            alert("Kullanıcı eklendi.");
            setIsUserDialogOpen(false);
            window.location.reload(); // Refresh to show new user
        } else {
            alert("Hata: " + res.error);
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
        const res = await deleteUser(id);
        if (res.success) {
            window.location.reload();
        } else {
            alert("Silinemedi.");
        }
    };

    return (
        <Tabs defaultValue="general" className="w-full">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <Card className="bg-black/40 border-slate-800 backdrop-blur-xl sticky top-8 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none"></div>
                        <CardContent className="p-4">
                            <TabsList className="flex flex-col h-auto bg-transparent gap-2 space-y-1">
                                <TabsTrigger value="general" className="w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400 data-[state=active]:border data-[state=active]:border-cyan-500/20 transition-all">
                                    <Settings className="w-4 h-4 mr-3" /> Genel Ayarlar
                                </TabsTrigger>
                                <TabsTrigger value="finance" className="w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-green-500/10 data-[state=active]:text-green-400 data-[state=active]:border data-[state=active]:border-green-500/20 transition-all">
                                    <DollarSign className="w-4 h-4 mr-3" /> Finans & Vergi
                                </TabsTrigger>
                                <TabsTrigger value="contact" className="w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-400 data-[state=active]:border data-[state=active]:border-purple-500/20 transition-all">
                                    <Phone className="w-4 h-4 mr-3" /> İletişim Bilgileri
                                </TabsTrigger>
                                <TabsTrigger value="about" className="w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400 data-[state=active]:border data-[state=active]:border-blue-500/20 transition-all">
                                    <Info className="w-4 h-4 mr-3" /> Hakkımızda & Vizyon
                                </TabsTrigger>
                                <TabsTrigger value="brands" className="w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-400 data-[state=active]:border data-[state=active]:border-indigo-500/20 transition-all">
                                    <Layout className="w-4 h-4 mr-3" /> Çalışılan Markalar
                                </TabsTrigger>
                                <TabsTrigger value="email" className="w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-pink-500/10 data-[state=active]:text-pink-400 data-[state=active]:border data-[state=active]:border-pink-500/20 transition-all">
                                    <Mail className="w-4 h-4 mr-3" /> Email Şablonu
                                </TabsTrigger>
                                <TabsTrigger value="users" className="w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-orange-500/10 data-[state=active]:text-orange-400 data-[state=active]:border data-[state=active]:border-orange-500/20 transition-all">
                                    <Users className="w-4 h-4 mr-3" /> Ekip Yönetimi
                                </TabsTrigger>
                                <TabsTrigger value="system" className="w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-red-500/10 data-[state=active]:text-red-400 data-[state=active]:border data-[state=active]:border-red-500/20 transition-all">
                                    <Activity className="w-4 h-4 mr-3" /> Sistem Durumu
                                </TabsTrigger>
                            </TabsList>

                            <div className="mt-8 pt-6 border-t border-white/5">
                                <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-6 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                                    {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                    DEĞİŞİKLİKLERİ KAYDET
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    <TabsContent value="general" className="mt-0">
                        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-cyan-400" /> Genel Yapılandırma
                                </CardTitle>
                                <CardDescription className="text-slate-400">Temel site ayarlarını yapılandırın.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Site Başlığı (Brand Name)</Label>
                                    <Input name="siteName" defaultValue={settings?.siteName} className="bg-black/50 border-slate-700 text-white focus:border-cyan-500 transition-colors h-12" placeholder="Örn: AdminOS" />
                                </div>
                                <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10 flex items-center justify-between">
                                    <div>
                                        <Label className="text-yellow-400 font-bold">Bakım Modu</Label>
                                        <p className="text-xs text-slate-400 mt-1">Aktif edildiğinde sadece yöneticiler siteye erişebilir.</p>
                                    </div>
                                    <Switch checked={maintenance} onCheckedChange={setMaintenance} className="data-[state=checked]:bg-yellow-500" />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="finance" className="mt-0">
                        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-green-400" /> Finansal Ayarlar
                                </CardTitle>
                                <CardDescription className="text-slate-400">Para birimi ve vergi oranlarını yönetin.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Para Birimi</Label>
                                        <Input name="currency" defaultValue={settings?.currency} className="bg-black/50 border-slate-700 text-white focus:border-green-500 h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Varsayılan KDV Oranı (%)</Label>
                                        <div className="relative">
                                            <Input name="taxRate" type="number" defaultValue={settings?.taxRate?.toString()} className="bg-black/50 border-slate-700 text-white focus:border-green-500 h-12 pl-4" />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contact" className="mt-0">
                        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-purple-400" /> İletişim & Footer Ayarları
                                </CardTitle>
                                <CardDescription className="text-slate-400">Site alt kısmı ve sosyal medya bağlantıları.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Telefon Numarası</Label>
                                        <Input name="phone" defaultValue={settings?.phone} className="bg-black/50 border-slate-700 text-white focus:border-purple-500 h-12" placeholder="+90 555 ..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">E-posta Adresi</Label>
                                        <Input name="email" defaultValue={settings?.email} className="bg-black/50 border-slate-700 text-white focus:border-purple-500 h-12" placeholder="info@zkiletisim.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Açık Adres</Label>
                                    <Input name="address" defaultValue={settings?.address} className="bg-black/50 border-slate-700 text-white focus:border-purple-500 h-12" placeholder="Mahalle, Cadde, No..." />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Footer Açıklama Metni</Label>
                                    <Input name="description" defaultValue={settings?.description} className="bg-black/50 border-slate-700 text-white focus:border-purple-500 h-12" placeholder="Sitenin en altında görünecek kısa açıklama..." />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Google Maps Embed Linki</Label>
                                    <Input name="googleMaps" defaultValue={settings?.googleMaps} className="bg-black/50 border-slate-700 text-white focus:border-purple-500 h-12" placeholder="https://www.google.com/maps/embed?..." />
                                </div>

                                <div className="pt-4 border-t border-slate-800">
                                    <Label className="text-purple-400 font-bold mb-4 block">Sosyal Medya Bağlantıları</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input name="instagram" defaultValue={settings?.instagram} placeholder="Instagram URL" className="bg-black/50 border-slate-700 text-white focus:border-purple-500" />
                                        <Input name="facebook" defaultValue={settings?.facebook} placeholder="Facebook URL" className="bg-black/50 border-slate-700 text-white focus:border-purple-500" />
                                        <Input name="twitter" defaultValue={settings?.twitter} placeholder="Twitter / X URL" className="bg-black/50 border-slate-700 text-white focus:border-purple-500" />
                                        <Input name="youtube" defaultValue={settings?.youtube} placeholder="YouTube URL" className="bg-black/50 border-slate-700 text-white focus:border-purple-500" />
                                        <Input name="linkedin" defaultValue={settings?.linkedin} placeholder="LinkedIn URL" className="bg-black/50 border-slate-700 text-white focus:border-purple-500" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="about" className="mt-0">
                        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Info className="w-5 h-5 text-blue-400" /> Hakkımızda Sayfası Ayarları
                                </CardTitle>
                                <CardDescription className="text-slate-400">Vizyon, misyon ve kurumsal metinleri yönetin.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Hakkımızda Ana Metni</Label>
                                    <textarea name="aboutText" defaultValue={settings?.aboutText} className="w-full min-h-[120px] bg-black/50 border border-slate-700 rounded-md p-3 text-white focus:border-blue-500 transition-colors" placeholder="Hakkımızda sayfası için ana açıklama metni..." />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Vizyonumuz</Label>
                                        <textarea name="vision" defaultValue={settings?.vision} className="w-full min-h-[100px] bg-black/50 border border-slate-700 rounded-md p-3 text-white focus:border-blue-500 transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Misyonumuz</Label>
                                        <textarea name="mission" defaultValue={settings?.mission} className="w-full min-h-[100px] bg-black/50 border border-slate-700 rounded-md p-3 text-white focus:border-blue-500 transition-colors" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Kariyer Sayfası Linki</Label>
                                        <Input name="careerLink" defaultValue={settings?.careerLink} className="bg-black/50 border-slate-700 text-white focus:border-blue-500" placeholder="https://..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Blog Sayfası Linki</Label>
                                        <Input name="blogLink" defaultValue={settings?.blogLink} className="bg-black/50 border-slate-700 text-white focus:border-blue-500" placeholder="https://..." />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="brands" className="mt-0">
                        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Layout className="w-5 h-5 text-indigo-400" /> Çalışılan Markalar
                                </CardTitle>
                                <CardDescription className="text-slate-400">Footer ve Hakkımızda kısmında görünecek markalar.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Markalar Listesi (Virgülle ayırın)</Label>
                                    <textarea
                                        name="brands"
                                        defaultValue={settings?.brands ? JSON.parse(settings.brands).join(', ') : 'APPLE, SAMSUNG, XIAOMI, HUAWEI, OPPO, DYSON'}
                                        className="w-full min-h-[150px] bg-black/50 border border-slate-700 rounded-md p-3 text-white font-mono text-sm focus:border-indigo-500 transition-colors"
                                        placeholder="APPLE, SAMSUNG, XIAOMI..."
                                    />
                                    <p className="text-xs text-slate-500">Not: Kaydedilirken otomatik olarak JSON formatına dönüştürülecektir.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="email" className="mt-0">
                        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-pink-400" /> Email Şablon Ayarları
                                </CardTitle>
                                <CardDescription className="text-slate-400">Gönderilen e-postaların görünümünü özelleştirin.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Email Logo URL</Label>
                                    <Input name="emailLogo" defaultValue={settings?.emailLogo} className="bg-black/50 border-slate-700 text-white focus:border-pink-500" placeholder="https://..." />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Email Footer Metni</Label>
                                    <textarea name="emailFooter" defaultValue={settings?.emailFooter} className="w-full min-h-[100px] bg-black/50 border border-slate-700 rounded-md p-3 text-white focus:border-pink-500 transition-colors" placeholder="© 2025 ZK İletişim. Tüm hakları saklıdır." />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Email İmzası (Signature)</Label>
                                    <textarea name="emailSignature" defaultValue={settings?.emailSignature} className="w-full min-h-[100px] bg-black/50 border border-slate-700 rounded-md p-3 text-white focus:border-pink-500 transition-colors" placeholder="ZK İletişim Destek Ekibi" />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="users" className="mt-0">
                        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Users className="w-5 h-5 text-orange-400" /> Ekip & Kullanıcılar
                                    </CardTitle>
                                    <CardDescription className="text-slate-400">Yönetim paneline erişimi olan kullanıcılar.</CardDescription>
                                </div>
                                <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-orange-600 hover:bg-orange-500 text-white"><Plus className="w-4 h-4 mr-2" /> Yeni Kullanıcı</Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-slate-900 border-slate-800 text-white">
                                        <DialogHeader>
                                            <DialogTitle>Yeni Ekip Üyesi Ekle</DialogTitle>
                                            <DialogDescription>
                                                Kullanıcı adı ve şifre belirleyerek yeni bir yönetici ekleyin.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Kullanıcı Adı</Label>
                                                <Input onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} className="bg-black/50 border-slate-700" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>E-posta</Label>
                                                <Input onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="bg-black/50 border-slate-700" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Şifre</Label>
                                                <Input type="password" onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="bg-black/50 border-slate-700" />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleCreateUser} className="bg-orange-600 hover:bg-orange-500">Kullanıcıyı Oluştur</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {users && users.length > 0 ? (
                                        users.map((user: any) => (
                                            <div key={user.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-orange-500/30 transition group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-medium flex items-center gap-2">
                                                            {user.username}
                                                            {user.role === 'admin' && <Shield className="w-3 h-3 text-cyan-400" />}
                                                        </h4>
                                                        <p className="text-xs text-slate-400">{user.email || "No email"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 uppercase">{user.role}</span>
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)} className="text-red-400 hover:text-red-300 hover:bg-red-950/50">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-slate-500 py-8">Henüz hiç kullanıcı yok.</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="system" className="mt-0">
                        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Database className="w-5 h-5 text-red-400" /> Sistem Yönetimi
                                </CardTitle>
                                <CardDescription className="text-slate-400">Veritabanı ve performans araçları.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition cursor-pointer group">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition">
                                                <RefreshCw className="w-5 h-5" />
                                            </div>
                                            <h4 className="text-white font-medium">Önbelleği Temizle</h4>
                                        </div>
                                        <p className="text-xs text-slate-400">Sistem önbelleğini temizler ve verileri yeniler.</p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-green-500/50 transition cursor-pointer group">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-green-500/20 rounded-lg text-green-400 group-hover:bg-green-500 group-hover:text-white transition">
                                                <Database className="w-5 h-5" />
                                            </div>
                                            <h4 className="text-white font-medium">Veritabanı Yedeği</h4>
                                        </div>
                                        <p className="text-xs text-slate-400">Anlık veritabanı yedeği indir (.sql)</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                    <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2"><Zap className="w-4 h-4" /> Tehlikeli Bölge</h4>
                                    <p className="text-xs text-slate-400 mb-4">Bu işlemler geri alınamaz, dikkatli olun.</p>
                                    <div className="flex gap-3">
                                        <Button type="button" variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">Tüm Logları Temizle</Button>
                                        <Button type="button" variant="outline" size="sm" className="border-red-900/50 text-red-500 hover:bg-red-950">Test Verilerini Sil</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </form>
        </Tabs>
    );
}
