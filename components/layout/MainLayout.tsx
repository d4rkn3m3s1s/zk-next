"use client";

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Chatbot } from '@/components/chat/Chatbot';

export function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isSpecialPage = pathname?.startsWith('/admin') || pathname?.startsWith('/auth');

    if (isSpecialPage) {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            <main className="min-h-screen pt-[72px]">
                {children}
            </main>
            <Footer />
            <Chatbot />
        </>
    );
}
