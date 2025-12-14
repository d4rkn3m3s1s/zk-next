"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, Users, Settings, Wrench, Calendar, LogOut, Search, Bell, DollarSign, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div className="flex items-center justify-center min-h-screen bg-black text-white">Yükleniyor...</div>;
    }

    if (!session || session.user.role !== "admin") {
        redirect("/auth/login");
    }

    const menuItems = [
        { icon: LayoutDashboard, label: "Panel", href: "/admin/dashboard" },
        { icon: DollarSign, label: "Kârlılık Defteri", href: "/admin/sales" },
        { icon: Smartphone, label: "Cihaz Karşılaştırma", href: "/compare" }, // Added
        { icon: Calendar, label: "Randevular", href: "/admin/appointments" },
        { icon: Package, label: "Ürünler", href: "/admin/products" },
        { icon: Wrench, label: "Tamirler", href: "/admin/repairs" },
        { icon: Users, label: "Kullanıcılar", href: "/admin/users" },
        { icon: Settings, label: "Ayarlar", href: "/admin/settings" },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[#0a0a0a]/90 backdrop-blur-xl border-r border-white/5">
            <div className="h-16 flex items-center px-6 border-b border-white/5">
                <div className="size-8 rounded bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold mr-3 shadow-lg shadow-purple-500/20">
                    zk
                </div>
                <span className="font-bold text-lg tracking-tight text-white">Admin<span className="text-purple-500">OS</span></span>
            </div>

            <div className="p-4 space-y-1 flex-1 overflow-y-auto">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Menu</div>
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
                    >
                        <item.icon className="size-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
                        {item.label}
                    </Link>
                ))}
            </div>

            <div className="p-4 border-t border-white/5 mt-auto">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5">
                    <Avatar className="size-8">
                        <AvatarImage src={session.user.image || undefined} />
                        <AvatarFallback className="bg-purple-600 text-white">AD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-purple-500/30">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col border-r border-white/5 bg-[#0a0a0a]/50 backdrop-blur-xl h-screen sticky top-0 shrink-0 z-50">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen relative">
                {/* Background Noise/Grid */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none mix-blend-overlay fixed"></div>

                {/* Header */}
                <header className="h-16 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Trigger */}
                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                                        <LayoutDashboard className="size-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="p-0 border-none w-72 bg-transparent">
                                    <SidebarContent />
                                </SheetContent>
                            </Sheet>
                        </div>

                        <div className="relative w-full max-w-sm md:w-96 hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Global Search + K (Cmd)"
                                className="w-full h-9 pl-10 pr-4 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-full relative">
                            <Bell className="size-5" />
                            <span className="absolute top-2 right-2 size-2 bg-purple-500 rounded-full animate-pulse"></span>
                        </Button>
                    </div>
                </header>

                {/* Content Wrapper */}
                <div className="p-4 md:p-8 relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
