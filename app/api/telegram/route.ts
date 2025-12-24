import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

const TELEGRAM_ADMIN_SECRET = process.env.TELEGRAM_ADMIN_SECRET

export async function POST(request: Request) {
    try {
        const update = await request.json()

        if (!update.message || !update.message.text) {
            return NextResponse.json({ ok: true })
        }

        const chatId = update.message.chat.id.toString()
        const text = update.message.text.trim()
        const username = update.message.from.username
        const firstName = update.message.from.first_name

        if (text === "/start") {
            await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: "👋 <b>ZK İletişim Botuna Hoşgeldiniz!</b>\n\n" +
                        "Sistem bildirimlerini almak ve raporlara erişmek için aşağıdaki komutları kullanabilirsiniz:\n\n" +
                        "🔐 <b>Kurulum:</b>\n" +
                        "/subscribe [ŞİFRE] - Bildirimleri açar.\n\n" +
                        "📊 <b>Komutlar:</b>\n" +
                        "/rapor - Günlük finansal raporu anında gönderir.\n" +
                        "/unsubscribe - Bildirim aboneliğini iptal eder.",
                    parse_mode: "HTML"
                })
            })
        } else if (text.startsWith("/subscribe")) {
            const secret = text.split(" ")[1]

            if (secret === TELEGRAM_ADMIN_SECRET) {
                // Check if already subscribed
                const existing = await prisma.telegramSubscriber.findUnique({
                    where: { chatId }
                })

                if (!existing) {
                    await prisma.telegramSubscriber.create({
                        data: {
                            chatId,
                            username,
                            firstName
                        }
                    })
                } else if (!existing.isActive) {
                    await prisma.telegramSubscriber.update({
                        where: { chatId },
                        data: { isActive: true }
                    })
                }

                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "✅ Successfully subscribed to notifications!"
                    })
                })
            } else {
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "❌ Invalid secret. Access denied."
                    })
                })
            }
        } else if (text === "/unsubscribe") {
            await prisma.telegramSubscriber.update({
                where: { chatId },
                data: { isActive: false }
            })

            await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: "🔕 Unsubscribed from notifications."
                })
            })
        } else if (text === "/rapor" || text === "/report") {
            // Check if user is subscribed and active
            const subscriber = await prisma.telegramSubscriber.findUnique({
                where: { chatId }
            })

            if (subscriber && subscriber.isActive) {
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "⏳ Rapor hazırlanıyor, lütfen bekleyin..."
                    })
                })

                // Dynamically import to avoid circular dependency
                const { sendDailyReport } = require("@/app/actions/reports")
                await sendDailyReport(chatId)
            } else {
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "⚠️ Bu komutu kullanmak için önce sisteme giriş yapmalısınız: /subscribe SECRET"
                    })
                })
            }
        }

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error("Telegram Webhook Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
