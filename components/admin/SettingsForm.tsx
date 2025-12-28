"use client";

import { useState, useEffect } from "react";
import { getWhatsAppStatusAction, updateSettings, disconnectWhatsAppAction, reconnectWhatsAppAction } from "@/app/actions/settings";
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
import { Save, Settings, DollarSign, Phone, Smartphone, Activity, Database, RefreshCw, Zap, Users, Trash2, Plus, Shield, Info, Layout, Mail, Send, MessageSquare, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function SettingsForm({ settings }: { settings: any }) {
    return <SettingsFormReal settings={settings} users={[]} />;
}

export function SettingsFormReal({ settings, users }: { settings: any, users: any[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [maintenance, setMaintenance] = useState(settings?.maintenanceMode || false);
    const [telegramEnabled, setTelegramEnabled] = useState(settings?.telegramNotificationsEnabled !== false);
    const [notifySale, setNotifySale] = useState(settings?.notifyOnSale !== false);
    const [notifyRepair, setNotifyRepair] = useState(settings?.notifyOnRepair !== false);
    const [notifyDebt, setNotifyDebt] = useState(settings?.notifyOnDebt !== false);
    const [notifyLog, setNotifyLog] = useState(settings?.notifyOnSystemLog !== false);
    const [notifyAuth, setNotifyAuth] = useState(settings?.notifyOnAuth !== false);
    const [notifyRepairSMS, setNotifyRepairSMS] = useState(settings?.notifyOnRepairSMS || false);
    const [notifyRepairWhatsapp, setNotifyRepairWhatsapp] = useState(settings?.notifyOnRepairWhatsapp || false);
    const [notifyDebtWhatsapp, setNotifyDebtWhatsapp] = useState(settings?.notifyOnDebtWhatsapp || false);
    const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "user" });
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<string>("kontrol ediliyor...");
    const [baileysLoading, setBaileysLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("general");

    // Auto-check WhatsApp status when switching to whatsapp tab
    useEffect(() => {
        if (activeTab === "whatsapp") {
            checkBaileys();
        }
    }, [activeTab]);

    const checkBaileys = async () => {
        setBaileysLoading(true);
        try {
            const res = await getWhatsAppStatusAction();
            if (res.status) setConnectionStatus(res.status);
            if (res.qrImage) setQrCode(res.qrImage);
            else setQrCode(null);
        } catch (e) {
            console.error(e);
            setConnectionStatus("error");
        } finally {
            setBaileysLoading(false);
        }
    };

    // Auto refresh status when scanning or initializing
    useEffect(() => {
        let interval: any;
        if (connectionStatus === 'scanning' || connectionStatus === 'kontrol ediliyor...' || connectionStatus === 'initializing') {
            interval = setInterval(() => {
                checkBaileys();
            }, 3000); // Poll every 3 seconds for better responsiveness
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [connectionStatus]);

    const handleReconnect = async () => {
        setBaileysLoading(true);
        setConnectionStatus("initializing");
        try {
            const res = await reconnectWhatsAppAction();
            if (res.success) {
                // Polling will take care of the rest
            } else {
                setConnectionStatus("error");
                alert("Hata: " + res.error);
            }
        } catch (e) {
            console.error(e);
            setConnectionStatus("error");
            alert("Bağlantı başlatılırken hata oluştu.");
        } finally {
            setBaileysLoading(false);
        }
    };

    const handleDisconnect = async () => {
        if (!confirm("WhatsApp bağlantısını kesmek istediğinize emin misiniz?")) return;
        setBaileysLoading(true);
        try {
            await disconnectWhatsAppAction();
            setConnectionStatus("disconnected");
            setQrCode(null);
            alert("Bağlantı kesildi. Tekrar bağlanmak için durumu kontrol edin ve QR kodu okutun.");
        } catch (e) {
            console.error(e);
            alert("Bağlantı kesilirken hata oluştu.");
        } finally {
            setBaileysLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        formData.set("maintenanceMode", maintenance ? "on" : "off");
        formData.set("telegramNotificationsEnabled", telegramEnabled ? "on" : "off");
        formData.set("notifyOnSale", notifySale ? "on" : "off");
        formData.set("notifyOnRepair", notifyRepair ? "on" : "off");
        formData.set("notifyOnDebt", notifyDebt ? "on" : "off");
        formData.set("notifyOnSystemLog", notifyLog ? "on" : "off");
        formData.set("notifyOnAuth", notifyAuth ? "on" : "off");
        formData.set("notifyOnRepairSMS", notifyRepairSMS ? "on" : "off");
        formData.set("notifyOnRepairWhatsapp", notifyRepairWhatsapp ? "on" : "off");
        formData.set("notifyOnDebtWhatsapp", notifyDebtWhatsapp ? "on" : "off");

        const res = await updateSettings(formData);
        if (res.success) {
            alert("Ayarlar başarıyla kaydedildi.");
            router.refresh();
        } else {
            alert("Hata: " + res.error);
        }
        setLoading(false);
    };

    const handleCreateUser = async () => {
        if (!newUser.username || !newUser.password) return alert("Kullanıcı adı ve şifre zorunludur.");
        const res = await createUser(newUser);
        if (res.success) {
            alert("Kullanıcı eklendi.");
            setIsUserDialogOpen(false);
            window.location.reload();
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
                                <TabsTrigger value="telegram" className="w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-sky-500/10 data-[state=active]:text-sky-400 data-[state=active]:border data-[state=active]:border-sky-500/20 transition-all">
                                    <Send className="w-4 h-4 mr-3" /> Telegram Bot
                                </TabsTrigger>
                                <TabsTrigger value="sms" className="w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-orange-500/10 data-[state=active]:text-orange-400 data-[state=active]:border data-[state=active]:border-orange-500/20 transition-all">
                                    <Smartphone className="w-4 h-4 mr-3" /> SMS Gateway
                                </TabsTrigger>
                                <TabsTrigger value="whatsapp" className="w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-green-500/10 data-[state=active]:text-green-400 data-[state=active]:border data-[state=active]:border-green-500/20 transition-all">
                                    <MessageSquare className="w-4 h-4 mr-3" /> WhatsApp
                                </TabsTrigger>
                                <TabsTrigger value="system" className="w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-red-500/10 data-[state=active]:text-red-400 data-[state=active]:border data-[state=active]:border-red-500/20 transition-all">
                                    <Activity className="w-4 h-4 mr-3" /> Sistem Durumu
                                </TabsTrigger>
                            </TabsList>

                            <div className="mt-8 pt-6 border-t border-white/5">
                                <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-6 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                                    {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                    KAYDET
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-3 space-y-6">
                    <TabsContent value="general" forceMount className="mt-0 data-[state=inactive]:hidden">
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

                    <TabsContent value="finance" forceMount className="mt-0 data-[state=inactive]:hidden">
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

                    <TabsContent value="contact" forceMount className="mt-0 data-[state=inactive]:hidden">
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

                    <TabsContent value="about" forceMount className="mt-0 data-[state=inactive]:hidden">
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

                    <TabsContent value="brands" forceMount className="mt-0 data-[state=inactive]:hidden">
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

                    <TabsContent value="email" forceMount className="mt-0 data-[state=inactive]:hidden">
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

                    <TabsContent value="users" forceMount className="mt-0 data-[state=inactive]:hidden">
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

                    <TabsContent value="telegram" forceMount className="mt-0 data-[state=inactive]:hidden">
                        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Send className="w-5 h-5 text-sky-400" /> Telegram Bildirim Detayları
                                </CardTitle>
                                <CardDescription className="text-slate-400">Hangi olayların bildirim olarak gönderileceğini seçin.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/10 flex items-center justify-between">
                                    <div>
                                        <Label className="text-sky-400 font-bold">Global Bildirim Anahtarı</Label>
                                        <p className="text-xs text-slate-400 mt-1">Tüm otomatik bot mesajlarını tamamen açar veya kapatır.</p>
                                    </div>
                                    <Switch checked={telegramEnabled} onCheckedChange={setTelegramEnabled} className="data-[state=checked]:bg-sky-500" />
                                </div>

                                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity ${telegramEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                                                <DollarSign className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <Label className="text-white text-sm">Satış Bildirimleri</Label>
                                                <p className="text-[10px] text-slate-500">Yeni satış yapıldığında</p>
                                            </div>
                                        </div>
                                        <Switch checked={notifySale} onCheckedChange={setNotifySale} />
                                    </div>

                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                <RefreshCw className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <Label className="text-white text-sm">Tamir Bildirimleri</Label>
                                                <p className="text-[10px] text-slate-500">Tamir durumu değiştiğinde</p>
                                            </div>
                                        </div>
                                        <Switch checked={notifyRepair} onCheckedChange={setNotifyRepair} />
                                    </div>

                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">
                                                <Users className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <Label className="text-white text-sm">Borç/Tahsilat</Label>
                                                <p className="text-[10px] text-slate-500">Yeni borç veya ödeme</p>
                                            </div>
                                        </div>
                                        <Switch checked={notifyDebt} onCheckedChange={setNotifyDebt} />
                                    </div>

                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">
                                                <Zap className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <Label className="text-white text-sm">Kritik Hatalar</Label>
                                                <p className="text-[10px] text-slate-500">Sistem hataları oluştuğunda</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Switch checked={notifyLog} onCheckedChange={setNotifyLog} />
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">
                                                <Shield className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <Label className="text-white text-sm">Giriş/Yetki Bildirimleri</Label>
                                                <p className="text-[10px] text-slate-500">Panele giriş yapıldığında</p>
                                            </div>
                                        </div>
                                        <Switch checked={notifyAuth} onCheckedChange={setNotifyAuth} />
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield className="w-4 h-4 text-cyan-400" />
                                        <Label className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Super Admin Bilgisi</Label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 text-sm">Sabit Admin:</span>
                                        <span className="text-white font-mono bg-black/50 px-3 py-1 rounded border border-white/10">@{settings?.telegramAdminUsername || "d4rkn3m3s1s"}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-2 italic">* Güvenlik gereği super-admin kullanıcı adı panelden değiştirilemez.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="sms" forceMount className="mt-0 data-[state=inactive]:hidden">
                        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Smartphone className="w-5 h-5 text-orange-400" /> SMS Gateway Yapılandırması
                                </CardTitle>
                                <CardDescription className="text-slate-400">Android cihazınızı SMS geçidi olarak kullanmak için gereken ayarlar.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Gateway URL (Android App Webhook)</Label>
                                    <Input name="smsGatewayUrl" defaultValue={settings?.smsGatewayUrl} className="bg-black/50 border-slate-700 text-white focus:border-orange-500 h-12" placeholder="https://api.textbee.dev/api/v1/gateway/send-message veya özel sunucu URL" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">API Key / Access Token</Label>
                                        <Input name="smsGatewayApiKey" defaultValue={settings?.smsGatewayApiKey} type="password" className="bg-black/50 border-slate-700 text-white focus:border-orange-500 h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">HTTP Method</Label>
                                        <select name="smsGatewayMethod" defaultValue={settings?.smsGatewayMethod || "POST"} className="w-full h-12 bg-black/50 border border-slate-700 rounded-md px-3 text-white focus:border-orange-500">
                                            <option value="POST">POST (Önerilen)</option>
                                            <option value="GET">GET</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-slate-800">
                                    <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 flex items-center justify-between">
                                        <div>
                                            <Label className="text-orange-400 font-bold">Tamir Durum SMS'leri</Label>
                                            <p className="text-xs text-slate-400 mt-1">Müşteriye tamir durumu güncellendiğinde otomatik SMS gönderir.</p>
                                        </div>
                                        <Switch checked={notifyRepairSMS} onCheckedChange={setNotifyRepairSMS} className="data-[state=checked]:bg-orange-500" />
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Info className="w-4 h-4 text-orange-400" />
                                        <Label className="text-orange-400 text-xs font-bold uppercase tracking-wider">SMS Entegrasyon Bilgisi</Label>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Android telefonunuzu bir SMS sunucusuna dönüştürmek için <b>TextBee</b>, <b>httpSMS</b> veya <b>SMSGate</b> gibi uygulamaları kullanabilirsiniz.
                                        Bu uygulamalar size bir API URL ve Key sağlar. Bu bilgileri yukarıya girerek sistemi aktif edebilirsiniz.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="whatsapp" forceMount className="mt-0 data-[state=inactive]:hidden">
                        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-green-400" /> WhatsApp Entegrasyonu
                                </CardTitle>
                                <CardDescription className="text-slate-400">Baileys servisi üzerinden otomatik WhatsApp mesajları.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10 space-y-4">
                                    <h3 className="text-green-400 font-bold">Otomatik Mesaj Ayarları</h3>

                                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                                        <div>
                                            <Label className="text-white">Tamir Durum Güncellemeleri</Label>
                                            <p className="text-xs text-slate-400">Tamir durumu değiştiğinde müşteriye WhatsApp mesajı gönder.</p>
                                        </div>
                                        <Switch checked={notifyRepairWhatsapp} onCheckedChange={setNotifyRepairWhatsapp} className="data-[state=checked]:bg-green-500" />
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                                        <div>
                                            <Label className="text-white">Borç Hatırlatmaları</Label>
                                            <p className="text-xs text-slate-400">Veresiye borçlularına otomatik hatırlatmalar için izni açar.</p>
                                        </div>
                                        <Switch checked={notifyDebtWhatsapp} onCheckedChange={setNotifyDebtWhatsapp} className="data-[state=checked]:bg-green-500" />
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Activity className={cn("w-4 h-4",
                                                connectionStatus === 'connected' ? "text-green-500" :
                                                    (connectionStatus === 'disconnected' || connectionStatus === 'error') ? "text-red-500" :
                                                        "text-yellow-500"
                                            )} />
                                            <Label className={cn("text-xs font-bold uppercase tracking-wider",
                                                connectionStatus === 'connected' ? "text-green-500" :
                                                    (connectionStatus === 'disconnected' || connectionStatus === 'error') ? "text-red-500" :
                                                        "text-yellow-500"
                                            )}>
                                                Durum: {
                                                    connectionStatus === 'connected' ? '✅ BAĞLI' :
                                                        connectionStatus === 'disconnected' ? '❌ BAĞLI DEĞİL' :
                                                            connectionStatus === 'scanning' ? '📱 QR BEKLİYOR' :
                                                                connectionStatus === 'initializing' ? '⏳ BAŞLATILIYOR...' :
                                                                    connectionStatus === 'error' ? '⚠️ BAĞLANTI HATASI' :
                                                                        connectionStatus.toUpperCase()
                                                }
                                            </Label>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={checkBaileys}
                                                disabled={baileysLoading}
                                                className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                                            >
                                                {baileysLoading ? <RefreshCw className="w-3 h-3 animate-spin mr-2" /> : <RefreshCw className="w-3 h-3 mr-2" />}
                                                Kontrol Et
                                            </Button>
                                            {connectionStatus === 'connected' ? (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleDisconnect}
                                                    disabled={baileysLoading}
                                                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                                >
                                                    <LogOut className="w-3 h-3 mr-2" />
                                                    Bağlantıyı Kes
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleReconnect}
                                                    disabled={baileysLoading}
                                                    className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                                                >
                                                    <Zap className="w-3 h-3 mr-2" />
                                                    Bağlantıyı Başlat
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {connectionStatus === 'scanning' && qrCode && (
                                        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl mb-4">
                                            <img src={qrCode} alt="WhatsApp QR Code" className="w-64 h-64 object-contain" />
                                            <p className="text-black font-bold mt-4 text-center">WhatsApp &gt; Ayarlar &gt; Bağlı Cihazlar &gt; Cihaz Bağla</p>
                                        </div>
                                    )}

                                    {connectionStatus === 'connected' && (
                                        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 mb-4">
                                            <p className="text-green-400 text-sm font-medium">🎉 WhatsApp bağlantısı aktif! Mesajlar otomatik olarak gönderilecek.</p>
                                        </div>
                                    )}

                                    {(connectionStatus === 'disconnected' || connectionStatus === 'error') && (
                                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
                                            <p className="text-red-400 text-sm font-medium mb-2">⚠️ WhatsApp servisi bağlı değil.</p>
                                            <p className="text-slate-400 text-xs">
                                                İşlemi başlatmak için <b>Bağlantıyı Başlat</b> butonuna basın.
                                                Hala sorun yaşıyorsanız <b>baileys-service</b> sunucusunu kontrol edin.
                                            </p>
                                        </div>
                                    )}

                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        WhatsApp servisinin çalışabilmesi için <b>baileys-service</b> modülünün aktif olması ve QR kodunun okutulmuş olması gerekir.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="system" forceMount className="mt-0 data-[state=inactive]:hidden">
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
