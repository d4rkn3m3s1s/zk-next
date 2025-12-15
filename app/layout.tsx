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
  title: {
    default: "ZK İletişim",
    template: "%s | ZK İletişim"
  },
  description: "Kadıköy'ün en güvenilir, ödüllü teknik servisi. iPhone, Samsung tamiri ve premium aksesuarlar.",
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

import { getSettings } from "@/app/actions/settings";

// ... (existing imports)

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="tr" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${spaceGrotesk.variable} ${notoSans.variable} font-body bg-background text-foreground antialiased`}
      >
        <Providers>
          <MainLayout settings={settings}>
            {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  );
}
