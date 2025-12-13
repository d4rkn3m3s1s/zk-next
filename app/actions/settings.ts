'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getSettings() {
    // Try to find the first settings record
    let settings = await prisma.siteSettings.findFirst()

    // If no settings exist, create default
    if (!settings) {
        settings = await prisma.siteSettings.create({
            data: {
                site_name: "Zk İletişim",
                site_url: "https://zkiletisim.com"
            }
        })
    }

    return settings
}

export async function updateSettings(formData: FormData) {
    // Get existing settings ID or finding first
    const firstSettings = await prisma.siteSettings.findFirst()

    // Fallback ID if for some reason it doesn't exist (though getSettings ensures it does)
    // We will just do an upsert or updateFirst logic conceptually

    const data = {
        site_name: formData.get("site_name") as string,
        site_url: formData.get("site_url") as string,
        description: formData.get("description") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        whatsapp: formData.get("whatsapp") as string,
        instagram: formData.get("instagram") as string,
        address: formData.get("address") as string,
        maps_embed: formData.get("maps_embed") as string,
        meta_title: formData.get("meta_title") as string,
        meta_keywords: formData.get("meta_keywords") as string,
        robots_txt: formData.get("robots_txt") as string,
    }

    if (firstSettings) {
        await prisma.siteSettings.update({
            where: { id: firstSettings.id },
            data
        })
    } else {
        await prisma.siteSettings.create({ data })
    }

    revalidatePath("/admin/settings")
    revalidatePath("/") // Revalidate home as site name might be used there
    return { success: true }
}
