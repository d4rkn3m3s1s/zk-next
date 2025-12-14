"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, User, Mail, Shield, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export default function ProfilePage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    if (status === "loading") {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (status === "unauthenticated") {
        router.push("/auth/login")
        return null
    }

    return (
        <div className="container max-w-2xl py-20">
            <Card className="border-border shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4">
                        <Avatar className="h-24 w-24 border-4 border-primary/10">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.name}`} />
                            <AvatarFallback>{session?.user?.name?.[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>
                    <CardTitle className="text-2xl font-bold">{session?.user?.name}</CardTitle>
                    <CardDescription>Hesap Bilgileri</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Mail className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">E-Posta Adresi</p>
                            <p className="font-semibold">{session?.user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Shield className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Yetki Seviyesi</p>
                            <div className="flex items-center gap-2">
                                <p className="font-semibold capitalize">{session?.user?.role || "Kullanıcı"}</p>
                                {session?.user?.role === 'admin' && (
                                    <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-bold border border-red-500/20">ADMIN</span>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between gap-4">
                    {session?.user?.role === 'admin' && (
                        <Button variant="outline" className="w-full" onClick={() => router.push("/admin")}>
                            Admin Paneli
                        </Button>
                    )}
                    <Button variant="destructive" className="w-full" onClick={() => signOut({ callbackUrl: '/' })}>
                        <LogOut className="mr-2 h-4 w-4" /> Çıkış Yap
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
