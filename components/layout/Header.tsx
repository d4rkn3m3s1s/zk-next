"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, User, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header({ settings }: { settings?: any }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: "Ana Sayfa", href: "/" },
        { name: "Hizmetler", href: "/services" },
        { name: "Mağaza", href: "/shop" },
        { name: "Tamir Sorgula", href: "/repair-tracking" },
        { name: "Hakkımızda", href: "/about" },
        { name: "İletişim", href: "/contact" },
    ];

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                    scrolled ? "bg-black/50 backdrop-blur-xl border-white/5 py-3" : "bg-transparent py-5"
                )}
            >
                <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="group flex items-center gap-2">
                        <div className="relative size-10 flex items-center justify-center bg-transparent border border-white/10 rounded-xl overflow-hidden group-hover:border-cyan-500/50 transition-colors duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="font-display font-bold text-xl text-white tracking-tighter">
                                {settings?.site_name?.substring(0, 2).toLowerCase() || "zk"}
                            </span>
                        </div>
                        <span className="hidden sm:block font-display font-bold text-xl tracking-tight text-white/90 group-hover:text-white transition-colors">
                            {settings?.site_name || "ZK İletişim"}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1 p-1 bg-white/5 rounded-full border border-white/5 backdrop-blur-sm">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="relative px-4 py-2 rounded-full text-sm font-medium text-slate-300 hover:text-white transition-colors group"
                            >
                                <span className="relative z-10">{item.name}</span>
                                <span className="absolute inset-0 bg-white/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out origin-center"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full w-10 h-10 transition-all duration-300"
                        >
                            <Search className="w-5 h-5" />
                        </Button>
                        <Link href="/auth/login">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full w-10 h-10 transition-all duration-300"
                            >
                                <User className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full w-10 h-10 transition-all duration-300 relative group"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-500 rounded-full group-hover:animate-pulse"></span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-slate-400 hover:text-white"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <Menu className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-x-0 top-[70px] z-40 bg-black/95 backdrop-blur-2xl border-b border-white/10 p-4 md:hidden flex flex-col gap-2 shadow-2xl shadow-cyan-900/10"
                    >
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-3 rounded-lg text-lg font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/5"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
