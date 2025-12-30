
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
        // We'll trust the webhook to save the outgoing message, 
        // but if it's slow or not triggered for fromMe by our own sender, we can save it here too.
        // Actually, Baileys usually triggers messages.upsert for outgoing messages too if emitOwnEvents is true.
        // But our config has emitOwnEvents: false.

        // Let's manually save our reply
        await prisma.whatsAppMessage.create({
            data: {
                remoteJid,
                fromMe: true,
                text,
                timestamp: new Date(),
                status: 'sent'
            }
        })

        revalidatePath("/admin/whatsapp")
    }

    return result
}
