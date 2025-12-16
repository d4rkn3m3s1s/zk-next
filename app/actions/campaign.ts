"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getActiveCampaign() {
    try {
        // Get the most recent active campaign
        const campaign = await prisma.campaign.findFirst({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });
        return campaign;
    } catch (error) {
        return null;
    }
}

export async function getCampaigns() {
    try {
        return await prisma.campaign.findMany({
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        return [];
    }
}

export async function saveCampaign(data: {
    title: string;
    description: string;
    imageUrl?: string;
    isActive: boolean;
    startDate?: Date;
    endDate?: Date;
}) {
    try {
        // Ensure only one active campaign if we want strictness, or just create new
        // Ideally we might want to EDIT an existing one or Create new.
        // For simplicity, let's treat it as "Settings" style or List style?
        // User asked for "Module". Let's assume a list of campaigns, pick one to active.

        const campaign = await prisma.campaign.create({
            data: {
                title: data.title,
                description: data.description,
                imageUrl: data.imageUrl,
                isActive: data.isActive,
                startDate: data.startDate,
                endDate: data.endDate
            }
        });

        revalidatePath('/');
        return { success: true, campaign };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function toggleCampaignStatus(id: number, isActive: boolean) {
    try {
        await prisma.campaign.update({
            where: { id },
            data: { isActive }
        });
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteCampaign(id: number) {
    try {
        await prisma.campaign.delete({ where: { id } });
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
