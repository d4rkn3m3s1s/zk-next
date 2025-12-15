"use client";

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Chatbot } from '@/components/chat/Chatbot';

export function MainLayout({ children, settings }: { children: React.ReactNode, settings?: any }) {
    const pathname = usePathname();
    const isSpecialPage = pathname?.startsWith('/admin') || pathname?.startsWith('/auth');

    if (isSpecialPage) {
        return <>{children}</>;
    }

    return (
        <>
            <Header settings={settings} />
            <main className="min-h-screen pt-[72px]">
                {children}
            </main>
            <Footer settings={settings} />
            <Chatbot />
        </>
    );
}
