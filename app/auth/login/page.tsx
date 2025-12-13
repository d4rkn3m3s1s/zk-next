"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
        setError(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.email || !formData.password) {
            setError("Lütfen e-posta ve şifrenizi giriniz.")
            return
        }

        setIsLoading(true)
        try {
            const res = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false
            })

            if (res?.error) {
                setError("Giriş yapılamadı. Bilgilerinizi kontrol ediniz.")
            } else {
                router.push("/admin")
                router.refresh()
            }
        } catch (error) {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
            <Card className="w-full max-w-sm rounded-2xl shadow-xl border-border/50 bg-card">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Admin Girişi</CardTitle>
                    <CardDescription className="text-center">
                        Yönetim paneline erişmek için giriş yapın
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 p-3 text-sm text-red-500 bg-red-500/10 rounded-lg border border-red-500/20">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">E-Posta Adresi</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@zkiletisim.com"
                                    className="pl-10 h-10"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Şifre</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    className="pl-10 h-10"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <Button className="w-full font-bold" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Giriş Yapılıyor...
                                </>
                            ) : "Giriş Yap"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="text-center text-xs text-muted-foreground">
                    &copy; 2025 Zk İletişim. Tüm hakları saklıdır.
                </CardFooter>
            </Card>
        </div>
    )
}
