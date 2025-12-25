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
                        "/abone [ŞİFRE] - Bildirimleri açar.\n\n" +
                        "📊 <b>Rapor Komutları:</b>\n" +
                        "/gunlukrapor - Günlük finansal rapor\n" +
                        "/aylikrapor - Aylık finansal rapor\n" +
                        "/alacaklar - Alacak defteri raporu\n" +
                        "/stokrapor - Stok durumu raporu\n" +
                        "/tamirler - Tamir işlemleri raporu\n" +
                        "/satislar - Günlük satış raporu\n\n" +
                        "ℹ️ <b>Diğer:</b>\n" +
                        "/yardim - Yardım mesajı\n" +
                        "/aboneiptal - Bildirim aboneliğini iptal eder.",
                    parse_mode: "HTML"
                })
            })
        } else if (text.startsWith("/abone")) {
            const secret = text.split(" ")[1]

            if (secret === TELEGRAM_ADMIN_SECRET) {
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
                        text: "✅ Bildirimlere başarıyla abone oldunuz!"
                    })
                })
            } else {
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "❌ Geçersiz şifre. Erişim reddedildi."
                    })
                })
            }
        } else if (text === "/aboneiptal") {
            await prisma.telegramSubscriber.update({
                where: { chatId },
                data: { isActive: false }
            })

            await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: "🔕 Bildirimlerden çıkış yapıldı."
                })
            })
        } else if (text === "/yardim") {
            await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: "📚 <b>ZK İletişim Bot - Yardım</b>\n\n" +
                        "🔐 <b>Kurulum Komutları:</b>\n" +
                        "/start - Botu başlat\n" +
                        "/abone [ŞİFRE] - Bildirimlere abone ol\n" +
                        "/aboneiptal - Abonelikten çık\n\n" +
                        "📊 <b>Rapor Komutları:</b>\n" +
                        "/gunlukrapor - Günlük satış, tamir ve borç raporu\n" +
                        "/aylikrapor - Aylık finansal özet rapor\n" +
                        "/alacaklar - Alacak defteri ve borçlu listesi\n" +
                        "/stokrapor - Stok durumu ve kritik seviyeler\n" +
                        "/tamirler - Bekleyen ve devam eden tamirler\n" +
                        "/satislar - Bugünkü satış detayları\n\n" +
                        "💡 <b>Not:</b> Rapor komutlarını kullanmak için önce /abone komutu ile sisteme giriş yapmalısınız.",
                    parse_mode: "HTML"
                })
            })
        } else if (text === "/gunlukrapor") {
            const subscriber = await prisma.telegramSubscriber.findUnique({
                where: { chatId }
            })

            if (subscriber && subscriber.isActive) {
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "⏳ Günlük rapor hazırlanıyor, lütfen bekleyin..."
                    })
                })

                const { sendDailyReport } = require("@/app/actions/reports")
                await sendDailyReport(chatId)
            } else {
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "⚠️ Bu komutu kullanmak için önce sisteme giriş yapmalısınız:\n/abone [ŞİFRE]"
                    })
                })
            }
        } else if (text === "/aylikrapor") {
            const subscriber = await prisma.telegramSubscriber.findUnique({
                where: { chatId }
            })

            if (subscriber && subscriber.isActive) {
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "⏳ Aylık rapor hazırlanıyor, lütfen bekleyin..."
                    })
                })

                const { sendMonthlyReport } = require("@/app/actions/reports")
                await sendMonthlyReport(chatId)
            } else {
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "⚠️ Bu komutu kullanmak için önce sisteme giriş yapmalısınız:\n/abone [ŞİFRE]"
                    })
                })
            }
        } else if (text === "/alacaklar") {
            const subscriber = await prisma.telegramSubscriber.findUnique({
                where: { chatId }
            })

            if (subscriber && subscriber.isActive) {
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "⏳ Alacak defteri raporu hazırlanıyor..."
                    })
                })

                const { sendDebtorsReport } = require("@/app/actions/reports")
                await sendDebtorsReport(chatId)
            } else {
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "⚠️ Bu komutu kullanmak için önce sisteme giriş yapmalısınız:\n/abone [ŞİFRE]"
                    })
                })
            }
        } else if (text === "/stokrapor") {
            const subscriber = await prisma.telegramSubscriber.findUnique({
                where: { chatId }
            })

            if (subscriber && subscriber.isActive) {
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "⏳ Stok raporu hazırlanıyor..."
                    })
                })

                const { sendStockReport } = require("@/app/actions/reports")
                await sendStockReport(chatId)
            } else {
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "⚠️ Bu komutu kullanmak için önce sisteme giriş yapmalısınız:\n/abone [ŞİFRE]"
                    })
                })
            }
        } else if (text === "/tamirler") {
            const subscriber = await prisma.telegramSubscriber.findUnique({
                where: { chatId }
            })

            if (subscriber && subscriber.isActive) {
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "⏳ Tamir raporu hazırlanıyor..."
                    })
                })

                const { sendRepairsReport } = require("@/app/actions/reports")
                await sendRepairsReport(chatId)
            } else {
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "⚠️ Bu komutu kullanmak için önce sisteme giriş yapmalısınız:\n/abone [ŞİFRE]"
                    })
                })
            }
        } else if (text === "/satislar") {
            const subscriber = await prisma.telegramSubscriber.findUnique({
                where: { chatId }
            })

            if (subscriber && subscriber.isActive) {
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "⏳ Satış raporu hazırlanıyor..."
                    })
                })

                const { sendSalesReport } = require("@/app/actions/reports")
                await sendSalesReport(chatId)
            } else {
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "⚠️ Bu komutu kullanmak için önce sisteme giriş yapmalısınız:\n/abone [ŞİFRE]"
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
