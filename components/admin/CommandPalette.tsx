"use client";

import React, { useEffect, useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "cmdk";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import {
    Calculator,
    CreditCard,
    LayoutDashboard,
    Package,
    Settings,
    Smartphone,
    Wrench,
    Search,
    Megaphone,
} from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog"


export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    return (
        <>
            <div className="fixed bottom-4 right-4 z-50 md:hidden">
                <button onClick={() => setOpen(true)} className="bg-cyan-500 text-black p-3 rounded-full shadow-lg border border-cyan-400">
                    <Search size={24} />
                </button>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="overflow-hidden p-0 shadow-2xl bg-[#0a0a0a] border border-white/10 sm:max-w-lg">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Komut Paleti</DialogTitle>
                        <DialogDescription>
                            Sayfalar arasında gezinmek veya işlem yapmak için komut arayın.
                        </DialogDescription>
                    </DialogHeader>

                    <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-slate-500 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
                        <div className="flex items-center border-b border-white/10 px-3" cmdk-input-wrapper="">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-white" />
                            <CommandInput
                                placeholder="Komut yazın veya arayın..."
                                className="flex h-12 w-full rouned-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 text-white"
                            />
                        </div>
                        <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 text-white scrollbar-none">
                            <CommandEmpty className="py-6 text-center text-sm text-slate-500">Sonuç bulunamadı.</CommandEmpty>

                            <CommandGroup heading="Yönetim" className="text-slate-500 px-2 py-1.5 text-xs font-medium">
                                <CommandItem onSelect={() => runCommand(() => router.push('/admin/dashboard'))} className="flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white cursor-pointer data-[disabled]:opacity-50 transition-colors">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    <span>Dashboard</span>
                                </CommandItem>
                                <CommandItem onSelect={() => runCommand(() => router.push('/admin/products'))} className="flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white cursor-pointer data-[disabled]:opacity-50 transition-colors">
                                    <Package className="mr-2 h-4 w-4" />
                                    <span>Ürünler</span>
                                </CommandItem>
                                <CommandItem onSelect={() => runCommand(() => router.push('/admin/debtors'))} className="flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white cursor-pointer data-[disabled]:opacity-50 transition-colors">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    <span>Veresiye Defteri</span>
                                </CommandItem>
                                <CommandItem onSelect={() => runCommand(() => router.push('/admin/repairs'))} className="flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white cursor-pointer data-[disabled]:opacity-50 transition-colors">
                                    <Wrench className="mr-2 h-4 w-4" />
                                    <span>Tamir Takibi</span>
                                </CommandItem>
                                <CommandItem onSelect={() => runCommand(() => router.push('/admin/marketing'))} className="flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white cursor-pointer data-[disabled]:opacity-50 transition-colors">
                                    <Megaphone className="mr-2 h-4 w-4" />
                                    <span>Kampanyalar</span>
                                </CommandItem>
                            </CommandGroup>

                            <CommandSeparator className="my-1 h-px bg-white/10" />

                            <CommandGroup heading="İşlemler" className="text-slate-500 px-2 py-1.5 text-xs font-medium">
                                <CommandItem onSelect={() => runCommand(() => router.push('/admin/products/new-second-hand'))} className="flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white cursor-pointer data-[disabled]:opacity-50 transition-colors">
                                    <Smartphone className="mr-2 h-4 w-4" />
                                    <span>İkinci El Girişi</span>
                                    <span className="ml-auto text-xs tracking-widest text-slate-500">GI</span>
                                </CommandItem>
                                <CommandItem onSelect={() => runCommand(() => router.push('/admin/sales'))} className="flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white cursor-pointer data-[disabled]:opacity-50 transition-colors">
                                    <Calculator className="mr-2 h-4 w-4" />
                                    <span>Kârlılık Raporu</span>
                                </CommandItem>
                            </CommandGroup>

                            <CommandSeparator className="my-1 h-px bg-white/10" />

                            <CommandGroup heading="Sistem" className="text-slate-500 px-2 py-1.5 text-xs font-medium">
                                <CommandItem onSelect={() => runCommand(() => router.push('/admin/settings'))} className="flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white cursor-pointer data-[disabled]:opacity-50 transition-colors">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Ayarlar</span>
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </DialogContent>
            </Dialog>
        </>
    );
}
