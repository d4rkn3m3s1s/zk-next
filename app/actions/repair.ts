'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Repair } from "@prisma/client"
import { sendRepairStatusEmail } from "@/lib/email"
import { sendTelegramMessage } from "@/lib/telegram"
import { createLog } from "@/lib/logger"
import { sendSMS, getStatusSMSTemplate } from "@/lib/sms"

export async function getPublicRepairStatus(trackingCode: string) {
    if (!trackingCode) return null

    const repair = await prisma.repair.findUnique({
        where: { tracking_code: trackingCode },
        select: {
            id: true,
            tracking_code: true,
            device_model: true,
            issue: true,
            status: true,
            estimated_cost: true,
            receivedBy: true,
            requestedDate: true,
            estimatedDate: true,
            createdAt: true,
            updatedAt: true,
            // Explicitly excluding privateNotes, lockPassword, lockPattern, images etc if not needed
        }
    })

    if (!repair) return null

    return {
        ...repair,
        estimated_cost: repair.estimated_cost ? Number(repair.estimated_cost) : null
    }
}

export async function getRepairs(query?: string) {
    const repairs = await prisma.repair.findMany({
        where: query ? {
            OR: [
                { customer_name: { contains: query } },
                { tracking_code: { contains: query } },
                { device_model: { contains: query } }
            ]
        } : undefined,
        orderBy: { createdAt: 'desc' }
    })
    return repairs.map((repair: any) => ({
        ...repair,
        estimated_cost: repair.estimated_cost ? Number(repair.estimated_cost) : null
    }))
}

export async function getRepair(id: number) {
    const repair = await prisma.repair.findUnique({
        where: { id }
    })
    if (!repair) return null
    return {
        ...repair,
        estimated_cost: repair.estimated_cost ? Number(repair.estimated_cost) : null
    }
}

export async function updateRepairStatus(id: number, status: string) {
    const currentRepair = await prisma.repair.findUnique({
        where: { id },
        select: {
            status: true,
            customer_name: true,
            phone: true,
            email: true,
            device_model: true,
            tracking_code: true,
            estimated_cost: true
        }
    })

    if (!currentRepair) throw new Error("Repair record not found")
    if (currentRepair.status === status) return

    await prisma.repair.update({
        where: { id },
        data: { status }
    })

    // 1. Email Notification
    if (currentRepair.email) {
        try {
            await sendRepairStatusEmail({
                repairId: id,
                customerName: currentRepair.customer_name,
                customerEmail: currentRepair.email,
                trackingCode: currentRepair.tracking_code,
                deviceModel: currentRepair.device_model,
                estimatedCost: currentRepair.estimated_cost ? Number(currentRepair.estimated_cost) : undefined,
                status: status
            })
        } catch (e) {
            console.error("Email failed:", e)
        }
    }

    // 2. Telegram Notification
    try {
        await sendTelegramMessage(
            `🔄 <b>Tamir Durumu Güncellendi</b>\n\n` +
            `🎫 <b>Takip Kodu:</b> ${currentRepair.tracking_code}\n` +
            `📱 <b>Cihaz:</b> ${currentRepair.device_model}\n` +
            `🆕 <b>Yeni Durum:</b> ${status}`,
            undefined,
            false,
            'repair'
        )
    } catch (e) {
        console.error("Telegram failed:", e)
    }

    // 3. SMS Notification (Specifically for completed or cancelled)
    if (status === 'completed' || status === 'cancelled') {
        try {
            const settings = await prisma.settings.findFirst()
            if (settings?.notifyOnRepairSMS && currentRepair.phone) {
                const smsMessage = getStatusSMSTemplate(status, currentRepair.tracking_code, currentRepair.device_model)
                await sendSMS(currentRepair.phone, smsMessage)
            }
        } catch (e) {
            console.error("SMS notification failed:", e)
        }
    }

    // 4. System Log
    await createLog(
        'STATUS_CHANGE',
        'Repair',
        `Tamir ${currentRepair.tracking_code} durumu ${currentRepair.status} -> ${status} olarak değiştirildi`,
        'Admin',
        'INFO',
        currentRepair.tracking_code
    )

    revalidatePath("/admin/repairs")
    revalidatePath(`/admin/repairs/${id}`)
    revalidatePath("/repair-tracking")
}

export async function getRepairByTrackingCode(trackingCode: string) {
    const repair = await prisma.repair.findUnique({
        where: { tracking_code: trackingCode }
    })
    if (!repair) return null
    return {
        ...repair,
        estimated_cost: repair.estimated_cost ? Number(repair.estimated_cost) : null
    }
}

export async function createRepair(formData: FormData) {
    const customer_name = formData.get("customer_name") as string
    let phone = formData.get("phone") as string

    // Normalize phone
    phone = phone.trim().replace(/\s/g, '');
    if (!phone.startsWith('+90')) {
        if (phone.startsWith('0')) {
            phone = '+9' + phone;
        } else if (phone.startsWith('90')) {
            phone = '+' + phone;
        } else if (phone.length === 10) {
            phone = '+90' + phone;
        }
        // If unusual format, leave as is, validation might happen elsewhere or just try best effort
    }
    const email = formData.get("email") as string
    const device_model = formData.get("device_model") as string
    const issue = formData.get("issue") as string
    const estimated_cost = formData.get("estimated_cost") ? Number(formData.get("estimated_cost")) : null
    const lockPassword = formData.get("lockPassword") as string || null
    const lockPattern = formData.get("lockPattern") as string || null
    const images = formData.get("images") as string || null
    const privateNotes = formData.get("privateNotes") as string || null
    const receivedBy = formData.get("receivedBy") as string || null
    const requestedDate = formData.get("requestedDate") ? new Date(formData.get("requestedDate") as string) : null
    const estimatedDate = formData.get("estimatedDate") ? new Date(formData.get("estimatedDate") as string) : null

    // Generate simple tracking code: ZK-XXXX
    const code = `ZK-${Math.floor(1000 + Math.random() * 9000)}`

    await prisma.repair.create({
        data: {
            customer_name,
            phone,
            email,
            device_model,
            issue,
            estimated_cost,
            tracking_code: code,
            status: "received",
            lockPassword,
            lockPattern,
            images,
            privateNotes,
            receivedBy,
            requestedDate,
            estimatedDate
        } as any
    })

    // Telegram Notification
    try {
        await sendTelegramMessage(
            `🔧 <b>Yeni Tamir Kaydı</b>\n\n` +
            `🎫 <b>Takip Kodu:</b> ${code}\n` +
            `📱 <b>Cihaz:</b> ${device_model}\n` +
            `👤 <b>Müşteri:</b> ${customer_name}\n` +
            `📝 <b>Sorun:</b> ${issue}`,
            undefined,
            false,
            'repair'
        )
    } catch (e) {
        console.error("Failed to send telegram notification:", e)
    }

    // SMS Notification
    try {
        const settings = await prisma.settings.findFirst()
        if (settings?.notifyOnRepairSMS && phone) {
            const smsMessage = getStatusSMSTemplate("received", code, device_model)
            await sendSMS(phone, smsMessage)
        }
    } catch (e) {
        console.error("SMS notification failed:", e)
    }

    // System Log
    await createLog('CREATE', 'Repair', `Yeni tamir kaydı oluşturuldu: ${device_model} - ${code}`, 'Sistem', 'INFO', code)

    revalidatePath("/admin/repairs")
}

export async function updateRepair(id: number, formData: FormData) {
    // Get current repair data to check for status changes
    const currentRepair = await prisma.repair.findUnique({
        where: { id },
        select: {
            status: true,
            customer_name: true,
            phone: true,
            email: true,
            device_model: true,
            tracking_code: true,
            estimated_cost: true
        }
    })

    const data: any = {}

    // Only update fields that are actually present in the formData
    if (formData.has("status")) data.status = formData.get("status") as string
    if (formData.has("estimated_cost")) data.estimated_cost = formData.get("estimated_cost") ? Number(formData.get("estimated_cost")) : null
    if (formData.has("lockPassword")) data.lockPassword = formData.get("lockPassword") as string
    if (formData.has("lockPattern")) data.lockPattern = formData.get("lockPattern") as string
    if (formData.has("privateNotes")) data.privateNotes = formData.get("privateNotes") as string
    if (formData.has("receivedBy")) data.receivedBy = formData.get("receivedBy") as string
    if (formData.has("requestedDate")) data.requestedDate = formData.get("requestedDate") ? new Date(formData.get("requestedDate") as string) : null
    if (formData.has("estimatedDate")) data.estimatedDate = formData.get("estimatedDate") ? new Date(formData.get("estimatedDate") as string) : null

    // Explicitly handle images if present (usually handled separately but if added here)
    if (formData.has("images")) data.images = formData.get("images") as string

    if (Object.keys(data).length === 0) return

    await prisma.repair.update({
        where: { id },
        data
    })

    // Send email if status changed
    if (currentRepair && data.status && data.status !== currentRepair.status) {
        if (currentRepair.email) {
            await sendRepairStatusEmail({
                repairId: id,
                customerName: currentRepair.customer_name,
                customerEmail: currentRepair.email,
                trackingCode: currentRepair.tracking_code,
                deviceModel: currentRepair.device_model,
                estimatedCost: data.estimated_cost || (currentRepair.estimated_cost ? Number(currentRepair.estimated_cost) : undefined),
                status: data.status
            })
        }

        // Telegram Notification for Status Change
        try {
            await sendTelegramMessage(
                `🔄 <b>Tamir Durumu Güncellendi</b>\n\n` +
                `🎫 <b>Takip Kodu:</b> ${currentRepair.tracking_code}\n` +
                `📱 <b>Cihaz:</b> ${currentRepair.device_model}\n` +
                `🆕 <b>Yeni Durum:</b> ${data.status}`,
                undefined,
                false,
                'repair'
            )
        } catch (e) {
            console.error(e)
        }

        // SMS Notification for Status Change
        try {
            const settings = await prisma.settings.findFirst()
            if (settings?.notifyOnRepairSMS && currentRepair.phone) {
                const smsMessage = getStatusSMSTemplate(data.status, currentRepair.tracking_code, currentRepair.device_model)
                await sendSMS(currentRepair.phone, smsMessage)
            }
        } catch (e) {
            console.error("SMS notification failed:", e)
        }
    }

    // System Log for Status Change
    if (data.status && currentRepair && data.status !== currentRepair.status) {
        await createLog(
            'STATUS_CHANGE',
            'Repair',
            `Tamir ${currentRepair.tracking_code} durumu ${currentRepair.status} -> ${data.status} olarak değiştirildi`,
            'Admin',
            'INFO',
            currentRepair.tracking_code
        )
    }

    revalidatePath("/admin/repairs")
    revalidatePath(`/admin/repairs/${id}`)
    revalidatePath("/repair-tracking")
}

export async function approveRepairPrice(id: number, decision: 'approved' | 'rejected') {
    const newStatus = decision === 'approved' ? 'in_progress' : 'cancelled'

    // Get repair data for email
    const repair = await prisma.repair.findUnique({
        where: { id },
        select: {
            customer_name: true,
            phone: true,
            email: true,
            device_model: true,
            tracking_code: true,
            estimated_cost: true
        }
    })

    await prisma.repair.update({
        where: { id },
        data: { status: newStatus }
    })

    // Send confirmation email
    if (repair && repair.email) {
        await sendRepairStatusEmail({
            repairId: id,
            customerName: repair.customer_name,
            customerEmail: repair.email,
            trackingCode: repair.tracking_code,
            deviceModel: repair.device_model,
            estimatedCost: repair.estimated_cost ? Number(repair.estimated_cost) : undefined,
            status: newStatus
        })
    }

    revalidatePath("/admin/repairs")
    revalidatePath(`/admin/repairs/${id}`)
    revalidatePath("/repair-tracking")
}

export async function deleteRepair(id: number) {
    await prisma.repair.delete({ where: { id } })
    revalidatePath("/admin/repairs")
}
