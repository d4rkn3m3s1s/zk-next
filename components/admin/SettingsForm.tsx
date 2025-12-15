"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Globe, Mail, Search, Shield, Loader2 } from "lucide-react"
import { updateSettings } from "@/app/actions/settings"
import { useRouter } from "next/navigation"

export function SettingsForm({ settings }: { settings: any }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        try {
            await updateSettings(formData)
            router.refresh()
            // Could add toast here
        } catch (error) {
            console.error("Settings update failed", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit}>
            <div className="flex items-center justify-between mb-8">
                <div className="h-1 w-1"></div> {/* Spacer using header from page */}
                <Button type="submit" disabled={loading} className="gap-2">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Değişiklikleri Kaydet
                </Button>
            </div>

            <Tabs defaultValue="general" className="space-y-8">
                <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                    <TabsTrigger value="general">Genel</TabsTrigger>
                    <TabsTrigger value="contact">İletişim</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                    {/* Security is handled separately typically, but let's keep visual for now (backend logic for password not implemented in this quick pass) */}
                    <TabsTrigger value="security">Güvenlik</TabsTrigger>
                </TabsList>

                <TabsContent value="general" forceMount={true} className="space-y-8 data-[state=inactive]:hidden">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" /> Site Bilgileri
                            </CardTitle>
                            <CardDescription>
                                Sitenizin temel kimlik bilgilerini buradan düzenleyin.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="site_name">Site Adı</Label>
                                    <Input id="site_name" name="site_name" defaultValue={settings?.site_name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="site_url">Site URL</Label>
                                    <Input id="site_url" name="site_url" defaultValue={settings?.site_url} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Site Açıklaması</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={settings?.description || "Kadıköy'de güvenilir telefon tamiri..."}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="contact" forceMount={true} className="space-y-8 data-[state=inactive]:hidden">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" /> İletişim Bilgileri
                            </CardTitle>
                            <CardDescription>
                                Müşterilerinizin size ulaşacağı kanalları yönetin.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-posta Adresi</Label>
                                    <Input id="email" name="email" defaultValue={settings?.email} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefon Numarası</Label>
                                    <Input id="phone" name="phone" defaultValue={settings?.phone} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp">WhatsApp Hattı</Label>
                                    <Input id="whatsapp" name="whatsapp" defaultValue={settings?.whatsapp} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="instagram">Instagram</Label>
                                    <Input id="instagram" name="instagram" defaultValue={settings?.instagram} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Adres</Label>
                                <Textarea
                                    id="address"
                                    name="address"
                                    defaultValue={settings?.address}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maps_embed">Google Maps Embed Kodu</Label>
                                <Textarea
                                    id="maps_embed"
                                    name="maps_embed"
                                    className="font-mono text-xs"
                                    defaultValue={settings?.maps_embed}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="seo" forceMount={true} className="space-y-8 data-[state=inactive]:hidden">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="h-5 w-5" /> SEO Ayarları
                            </CardTitle>
                            <CardDescription>
                                Arama motoru optimizasyonu için varsayılan değerler.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="meta_title">Varsayılan Meta Başlık</Label>
                                <Input id="meta_title" name="meta_title" defaultValue={settings?.meta_title} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="meta_keywords">Anahtar Kelimeler</Label>
                                <Input id="meta_keywords" name="meta_keywords" defaultValue={settings?.meta_keywords} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="robots_txt">Robots.txt İçeriği</Label>
                                <Textarea
                                    id="robots_txt"
                                    name="robots_txt"
                                    className="font-mono"
                                    defaultValue={settings?.robots_txt || "User-agent: *\nAllow: /"}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" forceMount={true} className="space-y-8 data-[state=inactive]:hidden">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" /> Güvenlik Ayarları
                            </CardTitle>
                            <CardDescription>
                                Şifre işlemleri için lütfen profil ayarlarınızı kullanın. Bu alan yakında güncellenecektir.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">Güvenlik ayarları, kullanıcı yönetimi sayfasından yapılmaktadır.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </form>
    )
}
