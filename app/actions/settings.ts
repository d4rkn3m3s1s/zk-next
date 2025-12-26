"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
        const siteName = formData.get("siteName") as string;
        const currency = formData.get("currency") as string;
        const taxRate = parseFloat(formData.get("taxRate") as string) || 20;
        const maintenanceMode = formData.get("maintenanceMode") === "on";
        const phone = formData.get("phone") as string;
        const address = formData.get("address") as string;
        const email = formData.get("email") as string;

        // Footer & Socials
        const facebook = formData.get("facebook") as string;
        const instagram = formData.get("instagram") as string;
        const twitter = formData.get("twitter") as string;
        const youtube = formData.get("youtube") as string;
        const linkedin = formData.get("linkedin") as string;
        const googleMaps = formData.get("googleMaps") as string;
        const description = formData.get("description") as string;

        // Try to find existing first
        const existing = await prisma.settings.findFirst();

        // New fields
        const aboutText = formData.get("aboutText") as string;
        const vision = formData.get("vision") as string;
        const mission = formData.get("mission") as string;
        const brands = formData.get("brands") as string;
        const careerLink = formData.get("careerLink") as string;
        const blogLink = formData.get("blogLink") as string;

        // Email settings
        const emailLogo = formData.get("emailLogo") as string;
        const emailFooter = formData.get("emailFooter") as string;
        const emailSignature = formData.get("emailSignature") as string;

        // Process brands string to JSON array
        let processedBrands = "[]";
        if (brands) {
            const brandArray = brands.split(',').map(b => b.trim().toUpperCase()).filter(b => b !== "");
            processedBrands = JSON.stringify(brandArray);
        }

        // Telegram settings
        const telegramNotificationsEnabled = formData.get("telegramNotificationsEnabled") === "on";
        const notifyOnSale = formData.get("notifyOnSale") === "on";
        const notifyOnRepair = formData.get("notifyOnRepair") === "on";
        const notifyOnDebt = formData.get("notifyOnDebt") === "on";
        const notifyOnSystemLog = formData.get("notifyOnSystemLog") === "on";
        const notifyOnAuth = formData.get("notifyOnAuth") === "on";

        const data: any = {
            siteName,
            currency,
            taxRate,
            maintenanceMode,
            phone,
            address,
            email,
            facebook,
            instagram,
            twitter,
            youtube,
            linkedin,
            googleMaps,
            description,
            aboutText,
            vision,
            mission,
            brands: processedBrands,
            careerLink,
            blogLink,
            emailLogo,
            emailFooter,
            emailSignature,
            telegramNotificationsEnabled,
            notifyOnSale,
            notifyOnRepair,
            notifyOnDebt,
            notifyOnSystemLog,
            notifyOnAuth
        };

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
        return { success: true };
    } catch (error) {
        console.error("Failed to update settings:", error);
        return { success: false, error: "Ayarlar güncellenemedi." };
    }
}
