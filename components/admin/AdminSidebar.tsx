"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Calendar,
    Wrench,
    MessageSquare,
    Settings,
    LogOut,
    FileText,
    DollarSign
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarItems = [
    {
        title: "Komuta Merkezi",
        href: "/admin/dashboard",
        icon: LayoutDashboard
    },
    {
        title: "Kârlılık Defteri",
        href: "/admin/sales",
        icon: DollarSign
    },
    {
        title: "Ürünler",
        href: "/admin/products",
        icon: ShoppingBag
    },

    {
        title: "Siparişler",
        href: "/admin/orders",
        icon: ShoppingBag
    },
    {
        title: "Randevular",
        href: "/admin/appointments",
        icon: Calendar
    },
    {
        title: "Tamir Takip",
        href: "/admin/repairs",
        icon: Wrench
    },
    {
        title: "Kullanıcılar",
        href: "/admin/users",
        icon: Users
    },
    {
        title: "Blog",
        href: "/admin/blog",
        icon: FileText
    },
    {
        title: "Mesajlar",
        href: "/admin/messages",
        icon: MessageSquare
    },
    {
        title: "Ayarlar",
        href: "/admin/settings",
        icon: Settings
    }
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <div className="w-64 bg-card border-r border-border h-screen sticky top-0 flex flex-col">
            <div className="p-6 border-b border-border">
                <h1 className="text-2xl font-black tracking-tighter text-foreground">
                    ZK<span className="text-primary">ADMIN</span>
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.title}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <Button variant="outline" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900">
                    <LogOut className="h-5 w-5" />
                    Çıkış Yap
                </Button>
            </div>
        </div>
    )
}
