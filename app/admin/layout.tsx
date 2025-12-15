"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { LayoutDashboard, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/admin/Sidebar";
import { GridBackground } from "@/components/ui/grid-background";

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

    return (
        <div className="flex min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-purple-500/30">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
                <GridBackground className="absolute inset-0 z-0" />

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
                                    <Sidebar className="w-full h-full" />
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
                <div className="p-4 md:p-8 relative z-10 overflow-y-auto h-[calc(100vh-64px)]">
                    {children}
                </div>
            </main>
        </div>
    );
}
