"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSettings() {
    try {
        const settings = await prisma.settings.findFirst();

        if (!settings) {
            // Create default settings if not exists
            const newSettings = await prisma.settings.create({
                data: {
                    siteName: "AdminOS",
                    currency: "TRY",
                    taxRate: 20,
                    maintenanceMode: false
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
        console.error("Failed to fetch settings:", error);
        // Fallback object to prevent UI crash
        return {
            siteName: "AdminOS",
            currency: "TRY",
            taxRate: 20,
            maintenanceMode: false,
            phone: "",
            address: "",
            email: "",
            // Footer Fallbacks
            facebook: "",
            instagram: "",
            twitter: "",
            youtube: "",
            linkedin: "",
            googleMaps: "",
            description: ""
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

        if (existing) {
            await prisma.settings.update({
                where: { id: existing.id },
                data: {
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
                    description
                }
            });
        } else {
            await prisma.settings.create({
                data: {
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
                    description
                }
            });
        }

        revalidatePath("/admin/settings");
        return { success: true };
    } catch (error) {
        console.error("Failed to update settings:", error);
        return { success: false, error: "Ayarlar güncellenemedi." };
    }
}
