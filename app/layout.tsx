import type { Metadata } from "next";
import { Space_Grotesk, Noto_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Chatbot } from "@/components/chat/Chatbot";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Zk İletişim - Kadıköy Telefon Tamiri ve Aksesuar",
  description: "Kadıköy'de güvenilir telefon tamiri, teknik servis ve orijinal aksesuar satışı. iPhone, Samsung ve tüm modeller için profesyonel hizmet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${notoSans.variable} font-body bg-background text-foreground antialiased`}
      >
        <Providers>
          <Header />
          <main className="min-h-screen pt-[72px]">
            {children}
          </main>
          <Footer />
          <Chatbot />
        </Providers>
      </body>
    </html>
  );
}
