import { prisma } from "@/lib/prisma"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

export async function sendTelegramMessage(text: string, specificChatId?: string) {
    if (!TELEGRAM_BOT_TOKEN) {
        console.warn("TELEGRAM_BOT_TOKEN is not set")
        return
    }

    try {
        let targets: string[] = []

        if (specificChatId) {
            targets = [specificChatId]
        } else {
            const subscribers = await prisma.telegramSubscriber.findMany({
                where: { isActive: true }
            })
            targets = subscribers.map(s => s.chatId)
        }

        if (targets.length === 0) return

        const promises = targets.map(chatId =>
            fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                    parse_mode: "HTML"
                })
            })
        )

        await Promise.all(promises)
    } catch (error) {
        console.error("Failed to send telegram message:", error)
    }
}

export async function sendTelegramPhoto(caption: string, photoUrl: string) {
    if (!TELEGRAM_BOT_TOKEN) {
        return
    }

    try {
        const subscribers = await prisma.telegramSubscriber.findMany({
            where: { isActive: true }
        })

        if (subscribers.length === 0) return

        const promises = subscribers.map(sub =>
            fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: sub.chatId,
                    photo: photoUrl,
                    caption: caption,
                    parse_mode: "HTML"
                })
            })
        )

        await Promise.all(promises)
    } catch (error) {
        console.error("Failed to send telegram photo:", error)
    }
}
