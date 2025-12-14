import type { Metadata } from "next";
import { Space_Grotesk, Noto_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { MainLayout } from "@/components/layout/MainLayout";

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
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ZK İletişim",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: '#00F0FF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${spaceGrotesk.variable} ${notoSans.variable} font-body bg-background text-foreground antialiased`}
      >
        <Providers>
          <MainLayout>
            {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  );
}
