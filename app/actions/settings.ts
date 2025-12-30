"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getWhatsAppStatus, getWhatsAppQR } from "@/lib/whatsapp";
// ... existing imports ...

export async function getSettings() {
    try {
        const settings = await prisma.settings.findFirst();

        if (!settings) {
            // Create default settings if not exists
            const newSettings = await (prisma.settings as any).create({
                data: {
                    siteName: "AdminOS",
                    currency: "TRY",
                    taxRate: 20,
                    maintenanceMode: false,
                    brands: "[]"
                }
            });
            return {
                ...newSettings,
                taxRate: Number(newSettings.taxRate)
            };
        }

        // Convert Decimal to number for client component compatibility
        return {
            ...settings,
            taxRate: Number(settings.taxRate)
        };
    } catch (error) {
        console.error("CRITICAL: Failed to fetch settings:", error);
        // Fallback object to prevent UI crash
        return {
            siteName: "AdminOS",
            currency: "TRY",
            taxRate: 20,
            maintenanceMode: false,
            phone: "",
            address: "",
            email: "",
            facebook: "",
            instagram: "",
            twitter: "",
            youtube: "",
            linkedin: "",
            googleMaps: "",
            description: "Zahmetsiz Çözüm Kusursuz Hizmet...",
            brands: "[]"
        };
    }
}

export async function updateSettings(formData: FormData) {
    try {
        // Check if existing first
        const existing = await prisma.settings.findFirst();

        const data: any = {};

        // Helper to safely get and set string fields
        const setString = (key: string) => {
            const val = formData.get(key);
            if (val !== null) data[key] = val as string;
        };

        // Helper to safely get and set boolean fields (switches)
        const setBool = (key: string) => {
            const val = formData.get(key);
            if (val !== null) data[key] = val === "on";
        };

        // Basic Info
        setString("siteName");
        setString("currency");
        if (formData.has("taxRate")) data.taxRate = parseFloat(formData.get("taxRate") as string) || 20;
        setBool("maintenanceMode");
        setString("phone");
        setString("address");
        setString("email");

        // Footer & Socials
        setString("facebook");
        setString("instagram");
        setString("twitter");
        setString("youtube");
        setString("linkedin");
        setString("googleMaps");
        setString("description");

        // About Section
        setString("aboutText");
        setString("vision");
        setString("mission");
        setString("careerLink");
        setString("blogLink");

        // Brands
        if (formData.has("brands")) {
            const brandsStr = formData.get("brands") as string;
            let processedBrands = "[]";
            if (brandsStr) {
                const brandArray = brandsStr.split(',').map(b => b.trim().toUpperCase()).filter(b => b !== "");
                processedBrands = JSON.stringify(brandArray);
            }
            data.brands = processedBrands;
        }

        // Email settings
        setString("emailLogo");
        setString("emailFooter");
        setString("emailSignature");

        // Telegram settings
        setBool("telegramNotificationsEnabled");
        setBool("notifyOnSale");
        setBool("notifyOnRepair");
        setBool("notifyOnDebt");
        setBool("notifyOnSystemLog");
        setBool("notifyOnAuth");

        // SMS settings
        setString("smsGatewayUrl");
        setString("smsGatewayApiKey");
        setString("smsGatewayMethod");
        setBool("notifyOnRepairSMS");

        // WhatsApp settings
        setBool("notifyOnRepairWhatsapp");
        setBool("notifyOnDebtWhatsapp");
        setBool("telegramAdminOnly");

        // Visual settings
        setString("heroBackground");

        if (existing) {
            await (prisma.settings as any).update({
                where: { id: existing.id },
                data
            });
        } else {
            await (prisma.settings as any).create({
                data
            });
        }

        console.log("Settings updated successfully:", data.siteName);
        revalidatePath("/");
        revalidatePath("/admin/settings");
        return { success: true, error: null };
    } catch (error: any) {
        console.error("Failed to update settings:", error);
        return { success: false, error: error.message };
    }
}

export async function getWhatsAppStatusAction() {
    try {
        const statusData = await getWhatsAppStatus();
        let qrImage = null;

        // If scanning, try to get QR
        if (statusData?.status === 'scanning' || statusData?.hasQr) {
            const qrData = await getWhatsAppQR();
            if (qrData?.qrImage) {
                qrImage = qrData.qrImage;
            }
        }

        return {
            status: statusData?.status || 'disconnected',
            qrImage
        };
    } catch (error) {
        console.error("Failed to get WhatsApp status:", error);
        return { status: 'error', qrImage: null };
    }
}

export async function disconnectWhatsAppAction() {
    try {
        const { disconnectWhatsApp } = await import("@/lib/whatsapp");
        const result = await disconnectWhatsApp();
        return { success: true, ...result };
    } catch (error) {
        console.error("Failed to disconnect WhatsApp:", error);
        return { success: false, error: "Bağlantı kesilemedi" };
    }
}

export async function reconnectWhatsAppAction() {
    try {
        const { reconnectWhatsApp } = await import("@/lib/whatsapp");
        const result = await reconnectWhatsApp();
        return { success: true, ...result };
    } catch (error) {
        console.error("Failed to reconnect WhatsApp:", error);
        return { success: false, error: "Yeniden bağlanılamadı" };
    }
}
