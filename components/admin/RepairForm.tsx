"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { createRepair } from "@/app/actions/repair"
import { Loader2, Save, ArrowLeft, Smartphone, User, Lock, Upload, X, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export function RepairForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [lockType, setLockType] = useState<"none" | "pin" | "pattern">("none")
    const [images, setImages] = useState<string[]>([])

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            // In a real app, upload to cloud. Here, using placeholder or local object URL for demo if needed.
            // For this specific environment, we will simulate by adding a placeholder URL since we can't easily upload.
            // OR use a reliable placeholder service.
            const url = `https://picsum.photos/seed/${Math.random()}/300/300`
            setImages([...images, url])
        }
    }

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        formData.append("images", JSON.stringify(images))

        try {
            await createRepair(formData)
            router.push("/admin/repairs")
            router.refresh()
        } catch (error) {
            console.error("Failed to create repair", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/repairs">
                        <Button variant="outline" size="icon" type="button">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Yeni Tamir Kaydı</h2>
                        <p className="text-muted-foreground">Müşteri ve cihaz bilgilerini girerek yeni kayıt oluşturun.</p>
                    </div>
                </div>
                <Button type="submit" disabled={loading} size="lg" className="gap-2">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Kaydı Oluştur
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Device & Customer Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" /> Müşteri Bilgileri
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="customer_name">Ad Soyad <span className="text-red-500">*</span></Label>
                                <Input id="customer_name" name="customer_name" required placeholder="Örn: Ahmet Yılmaz" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefon Numarası <span className="text-red-500">*</span></Label>
                                <Input id="phone" name="phone" required placeholder="Örn: 0555 123 45 67" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Device Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Smartphone className="h-5 w-5 text-primary" /> Cihaz Bilgileri
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="device_model">Cihaz Modeli <span className="text-red-500">*</span></Label>
                                    <Input id="device_model" name="device_model" required placeholder="Örn: iPhone 13 Pro" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="estimated_cost">Tahmini Ücret (₺)</Label>
                                    <Input id="estimated_cost" name="estimated_cost" type="number" placeholder="0.00" />
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label htmlFor="issue">Arıza Tanımı / Şikayet <span className="text-red-500">*</span></Label>
                                <Textarea
                                    id="issue"
                                    name="issue"
                                    required
                                    className="min-h-[120px]"
                                    placeholder="Cihazdaki sorunu detaylıca açıklayın..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldAlert className="h-5 w-5 text-primary" /> Güvenlik ve Kilit
                            </CardTitle>
                            <CardDescription>Cihaz testleri için ekran kilidi gereklidir.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="receivedBy">Teslim Alan Personel</Label>
                                    <Input id="receivedBy" name="receivedBy" placeholder="Örn: Ahmet Yılmaz" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="requestedDate">Müşteri İstenen Teslim Tarihi</Label>
                                    <Input id="requestedDate" name="requestedDate" type="datetime-local" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="estimatedDate">Tahmini Teslim Tarihi</Label>
                                <Input id="estimatedDate" name="estimatedDate" type="datetime-local" />
                            </div>

                            <div className="space-y-3">
                                <Label>Ekran Kilidi Türü</Label>
                                <div className="flex gap-4">
                                    <div
                                        className={`flex-1 p-4 rounded-lg border cursor-pointer transition-all ${lockType === 'none' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                                        onClick={() => setLockType('none')}
                                    >
                                        <div className="font-semibold text-center">Yok</div>
                                    </div>
                                    <div
                                        className={`flex-1 p-4 rounded-lg border cursor-pointer transition-all ${lockType === 'pin' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                                        onClick={() => setLockType('pin')}
                                    >
                                        <div className="font-semibold text-center">PIN / Şifre</div>
                                    </div>
                                    <div
                                        className={`flex-1 p-4 rounded-lg border cursor-pointer transition-all ${lockType === 'pattern' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                                        onClick={() => setLockType('pattern')}
                                    >
                                        <div className="font-semibold text-center">Desen</div>
                                    </div>
                                </div>
                            </div>

                            {lockType === 'pin' && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <Label htmlFor="lockPassword">Ekran Şifresi / PIN</Label>
                                    <Input id="lockPassword" name="lockPassword" placeholder="Örn: 123456" />
                                </div>
                            )}

                            {lockType === 'pattern' && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <Label htmlFor="lockPattern">Desen Tanımı (Rakamlarla)</Label>
                                    <Input id="lockPattern" name="lockPattern" placeholder="Örn: 1-2-3-5-7-8-9 (Numpad düzeni)" />
                                    <p className="text-xs text-muted-foreground">
                                        1 2 3<br />
                                        4 5 6<br />
                                        7 8 9
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Images & Notes */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="h-5 w-5 text-primary" /> Cihaz Fotoğrafları
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                                        <img src={img} alt="Repair" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                    <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                    <span className="text-xs text-muted-foreground">Fotoğraf Ekle</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5 text-primary" /> Teknisyen Notları
                            </CardTitle>
                            <CardDescription>Sadece yöneticiler görebilir.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                name="privateNotes"
                                className="min-h-[150px]"
                                placeholder="Cihazın genel durumu, çizikler, eksik parçalar vb..."
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    )
}
