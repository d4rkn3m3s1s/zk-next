import { prisma } from "@/lib/prisma"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

export async function sendTelegramMessage(
    text: string,
    specificChatId?: string,
    bypassSettings: boolean = false,
    notificationType?: 'sale' | 'repair' | 'debt' | 'system' | 'auth'
) {
    if (!TELEGRAM_BOT_TOKEN) {
        console.warn("TELEGRAM_BOT_TOKEN is not set")
        return
    }

    try {
        // Check if notifications are enabled
        if (!bypassSettings) {
            const settings = await prisma.settings.findFirst()
            if (!settings) return;

            // Global toggle
            if (!settings.telegramNotificationsEnabled) {
                console.log("Telegram notifications are globally disabled")
                return
            }

            // Granular toggles (using any cast to ignore temporary lint issues before generation)
            const s = settings as any;
            if (notificationType === 'sale' && !s.notifyOnSale) return;
            if (notificationType === 'repair' && !s.notifyOnRepair) return;
            if (notificationType === 'debt' && !s.notifyOnDebt) return;
            if (notificationType === 'system' && !s.notifyOnSystemLog) return;
            if (notificationType === 'auth' && !s.notifyOnAuth) return;
        }

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
                headers: { "Content-Type": "application/json" },
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

export async function sendTelegramPhoto(
    caption: string,
    photoUrl: string,
    bypassSettings: boolean = false
) {
    if (!TELEGRAM_BOT_TOKEN) {
        return
    }

    try {
        if (!bypassSettings) {
            const settings = await prisma.settings.findFirst()
            if (settings && !settings.telegramNotificationsEnabled) return
        }

        const subscribers = await prisma.telegramSubscriber.findMany({
            where: { isActive: true }
        })

        if (subscribers.length === 0) return

        const promises = subscribers.map(sub =>
            fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
