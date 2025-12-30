
'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { sendWhatsAppMessage as sender } from "@/lib/whatsapp"

export async function getWhatsAppMessages(remoteJid?: string) {
    return await prisma.whatsAppMessage.findMany({
        where: remoteJid ? { remoteJid } : undefined,
        orderBy: { timestamp: 'desc' },
        take: 50
    })
}

export async function getWhatsAppChats() {
    // Get unique JIDs with their last message
    const messages = await prisma.whatsAppMessage.findMany({
        orderBy: { timestamp: 'desc' },
    })

    const chats: Record<string, any> = {}
    for (const msg of messages) {
        if (!chats[msg.remoteJid]) {
            chats[msg.remoteJid] = {
                remoteJid: msg.remoteJid,
                senderName: msg.senderName,
                lastMessage: msg.text,
                timestamp: msg.timestamp,
                unreadCount: 0 // Could implement this
            }
        }
    }

    return Object.values(chats)
}

export async function sendWhatsAppReply(remoteJid: string, text: string) {
    const phone = remoteJid.split('@')[0]
    const result = await sender(phone, text)

    if (result.success) {
        revalidatePath("/admin/whatsapp")
    }

    return result
}
