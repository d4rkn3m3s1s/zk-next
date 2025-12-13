"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Smartphone, Menu, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
    const { data: session } = useSession()

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-md border-b border-white/5 px-4 md:px-10 py-3 transition-all duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-gradient-to-tr from-primary to-cyan-400 flex items-center justify-center text-white">
                        <Smartphone className="size-5" />
                    </div>
                    <h2 className="text-foreground text-xl font-bold tracking-tight">Zk İletişim</h2>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors">
                        Ana Sayfa
                    </Link>
                    <Link href="/#services" className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors">
                        Hizmetler
                    </Link>
                    <Link href="/products" className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors">
                        Ürünler
                    </Link>
                    <Link href="/repair-tracking" className="relative group">
                        <span className="text-muted-foreground group-hover:text-cyan-400 text-sm font-medium transition-colors">Cihaz Takip</span>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
                    </Link>
                    <Link href="/contact" className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors">
                        İletişim
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    {session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <User className="size-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">Profilim</Link>
                                </DropdownMenuItem>
                                {session.user.role === 'admin' && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin/dashboard">Admin Paneli</Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => signOut()}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Çıkış Yap</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button asChild className="hidden sm:flex bg-primary hover:bg-blue-600 text-white shadow-[0_0_15px_rgba(19,127,236,0.3)] hover:shadow-[0_0_25px_rgba(19,127,236,0.5)]">
                            <Link href="/auth/login">Giriş Yap</Link>
                        </Button>
                    )}

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden text-foreground">
                                <Menu className="size-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <nav className="flex flex-col gap-4 mt-8">
                                <Link href="/" className="text-lg font-medium">Ana Sayfa</Link>
                                <Link href="/#services" className="text-lg font-medium">Hizmetler</Link>
                                <Link href="/products" className="text-lg font-medium">Ürünler</Link>
                                <Link href="/repair-tracking" className="text-lg font-medium text-cyan-500">Cihaz Takip</Link>
                                <Link href="/contact" className="text-lg font-medium">İletişim</Link>
                                {!session && (
                                    <Link href="/auth/login" className="text-lg font-medium text-primary">Giriş Yap</Link>
                                )}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
