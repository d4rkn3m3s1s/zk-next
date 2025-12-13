'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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

    revalidatePath("/admin/messages")
    redirect("/contact?success=true")
}
