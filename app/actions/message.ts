'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { sendTelegramMessage } from "@/lib/telegram"

export async function getMessages(query?: string) {
    const messages = await prisma.message.findMany({
        where: query ? {
            OR: [
                { name: { contains: query } },
                { email: { contains: query } },
                { subject: { contains: query } }
            ]
        } : undefined,
        orderBy: { createdAt: 'desc' }
    })
    return messages
}

export async function getMessage(id: number) {
    const message = await prisma.message.findUnique({
        where: { id }
    })
    return message
}

export async function markMessageAsRead(id: number) {
    await prisma.message.update({
        where: { id },
        data: { is_read: true }
    })
    revalidatePath("/admin/messages")
    revalidatePath(`/admin/messages/${id}`)
}

export async function deleteMessage(id: number) {
    await prisma.message.delete({
        where: { id }
    })
    revalidatePath("/admin/messages")
}

export async function createMessage(formData: FormData) {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    await prisma.message.create({
        data: {
            name,
            email,
            subject,
            message,
            is_read: false
        }
    })

    // Telegram Notification
    try {
        await sendTelegramMessage(
            `📩 <b>Yeni İletişim Mesajı!</b>\n\n` +
            `👤 <b>İsim:</b> ${name}\n` +
            `📧 <b>E-posta:</b> ${email}\n` +
            `📝 <b>Konu:</b> ${subject}\n` +
            `💬 <b>Mesaj:</b> ${message}`,
            undefined,
            false,
            'system'
        )
    } catch (e) {
        console.error("Telegram notification failed:", e)
    }

    revalidatePath("/admin/messages")
    redirect("/contact?success=true")
}
