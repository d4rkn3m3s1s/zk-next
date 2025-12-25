"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Package,
    Users,
    Settings,
    Wrench,
    Calendar,
    DollarSign,
    Smartphone,
    ChevronLeft,
    ChevronRight,
    BarChart3,
    Megaphone,
    UploadCloud
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: "Panel", href: "/admin/dashboard" },
        { icon: BarChart3, label: "Raporlar", href: "/admin/reports" }, // Added
        { icon: DollarSign, label: "Kârlılık Defteri", href: "/admin/sales" },
        { icon: Calendar, label: "Randevular", href: "/admin/appointments" },
        { icon: Package, label: "Ürünler", href: "/admin/products" },
        { icon: Smartphone, label: "İkinci El Girişi", href: "/admin/products/new-second-hand" },
        { icon: DollarSign, label: "Alacak Defteri", href: "/admin/debtors" },
        { icon: Megaphone, label: "Kampanyalar", href: "/admin/marketing" },
        { icon: Wrench, label: "Tamirler", href: "/admin/repairs" },
        { icon: Users, label: "Kullanıcılar", href: "/admin/users" },
        { icon: LayoutDashboard, label: "Sistem Kayıtları", href: "/admin/logs" },
        { icon: Settings, label: "Ayarlar", href: "/admin/settings" },
    ];

    return (
        <aside
            className={cn(
                "group/sidebar relative flex flex-col h-screen border-r border-white/5 bg-[#0a0a0a]/50 backdrop-blur-xl transition-all duration-300 ease-in-out shrink-0 z-50",
                collapsed ? "w-20" : "w-64",
                className
            )}
        >
            {/* Toggle Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-8 size-6 rounded-full border border-white/10 bg-[#0a0a0a] text-slate-400 hover:text-white z-50 opacity-0 group-hover/sidebar:opacity-100 transition-opacity"
            >
                {collapsed ? <ChevronRight className="size-3" /> : <ChevronLeft className="size-3" />}
            </Button>

            {/* Logo Area */}
            <div className={cn(
                "h-16 flex items-center border-b border-white/5 transition-all duration-300",
                collapsed ? "justify-center px-0" : "px-6"
            )}>
                <div className="size-8 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20 shrink-0">
                    zk
                </div>
                {!collapsed && (
                    <span className="ml-3 font-display font-bold text-lg tracking-tight text-white animate-in fade-in slide-in-from-left-2 duration-300">
                        Admin<span className="text-purple-500">OS</span>
                    </span>
                )}
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-none">
                {!collapsed && (
                    <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider animate-in fade-in slide-in-from-left-2">
                        Menu
                    </div>
                )}

                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative overflow-hidden",
                                isActive
                                    ? "text-white bg-white/5 shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                                    : "text-slate-400 hover:text-white hover:bg-white/5",
                                collapsed && "justify-center px-0"
                            )}
                        >
                            {/* Active glow indicator */}
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-r-full shadow-[0_0_10px_#a855f7]" />
                            )}

                            <item.icon className={cn(
                                "size-5 shrink-0 transition-colors",
                                isActive ? "text-purple-400" : "text-slate-500 group-hover:text-purple-400"
                            )} />

                            {!collapsed && (
                                <span className="animate-in fade-in slide-in-from-left-2 duration-200">
                                    {item.label}
                                </span>
                            )}

                            {/* Tooltip for collapsed state would go here */}
                        </Link>
                    );
                })}
            </div>

            {/* User Profile */}
            <div className="p-3 border-t border-white/5 mt-auto">
                <div className={cn(
                    "flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5 overflow-hidden transition-all",
                    collapsed ? "justify-center px-2" : ""
                )}>
                    <Avatar className="size-8 shrink-0 border border-white/10">
                        <AvatarImage src={session?.user?.image || undefined} />
                        <AvatarFallback className="bg-purple-600 text-white text-xs">A</AvatarFallback>
                    </Avatar>

                    {!collapsed && (
                        <div className="flex-1 overflow-hidden animate-in fade-in slide-in-from-left-2">
                            <p className="text-sm font-medium text-white truncate">{session?.user?.name || "Admin"}</p>
                            <p className="text-[10px] text-slate-500 truncate">{session?.user?.email || "admin@zk.com"}</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
