'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { sendRepairStatusEmail } from "@/lib/email"

// Get email history for a repair
export async function getRepairEmailHistory(repairId: number) {
    const emails = await prisma.emailLog.findMany({
        where: { repairId },
        orderBy: { sentAt: 'desc' }
    })

    return emails
}

// Resend email for a specific status
export async function resendRepairEmail(repairId: number, statusType: string) {
    // Get repair data
    const repair = await prisma.repair.findUnique({
        where: { id: repairId },
        select: {
            id: true,
            customer_name: true,
            email: true,
            tracking_code: true,
            device_model: true,
            estimated_cost: true
        }
    })

    if (!repair || !repair.email) {
        return { success: false, error: 'Repair not found or no email address' }
    }

    // Send email
    const result = await sendRepairStatusEmail({
        repairId: repair.id,
        customerName: repair.customer_name,
        customerEmail: repair.email,
        trackingCode: repair.tracking_code,
        deviceModel: repair.device_model,
        estimatedCost: repair.estimated_cost ? Number(repair.estimated_cost) : undefined,
        status: statusType
    })

    revalidatePath(`/admin/repairs/${repairId}`)
    return result
}
