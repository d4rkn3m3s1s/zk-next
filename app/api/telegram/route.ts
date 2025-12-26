import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

const TELEGRAM_ADMIN_SECRET = process.env.TELEGRAM_ADMIN_SECRET

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const update = await request.json()
        console.log("📥 Telegram Update Received:", JSON.stringify(update));

        // Handle Callback Queries (from inline buttons)
        if (update.callback_query) {
            const callback = update.callback_query
            const chatId = callback.message.chat.id.toString()
            const data = callback.data
            const username = callback.from.username

            const settings = await prisma.settings.findFirst()
            const isAdmin = username === (settings?.telegramAdminUsername || "d4rkn3m3s1s")

            if (isAdmin) {
                // Process callback data
                if (data === "ozet") {
                    const today = new Date().toISOString().split('T')[0]
                    const sales = await prisma.sale.findMany({
                        where: { soldAt: { gte: new Date(today) } }
                    })
                    const totalSales = sales.reduce((sum, s) => sum + Number(s.soldPrice), 0)
                    const totalProfit = sales.reduce((sum, s) => sum + Number(s.profit), 0)
                    const pendingRepairs = await prisma.repair.count({ where: { status: 'received' } })

                    await sendMessage(chatId, `📊 <b>Bugünkü Özet:</b>\n\n💰 Satış: ${totalSales} TL\n📈 Kar: ${totalProfit} TL\n🔧 Tamir: ${pendingRepairs}`)
                } else if (data === "hatalar") {
                    const logs = await prisma.systemLog.findMany({
                        where: { severity: 'CRITICAL' },
                        orderBy: { createdAt: 'desc' },
                        take: 5
                    })
                    let message = "🚨 <b>Son Kritik Hatalar:</b>\n\n"
                    if (logs.length === 0) message += "Hata bulunamadı."
                    else logs.forEach(log => { message += `🔴 [${log.createdAt.toLocaleString()}] ${log.action}: ${log.details}\n\n` })
                    await sendMessage(chatId, message)
                } else if (data === "users") {
                    const subscribers = await prisma.telegramSubscriber.findMany()
                    let message = "👥 <b>Abone Listesi:</b>\n\n"
                    if (subscribers.length === 0) message += "Abone yok."
                    else {
                        subscribers.forEach((sub, i) => {
                            message += `${i + 1}. ${sub.firstName || "İsimsiz"} (@${sub.username || "yok"}) - ${sub.isActive ? "✅ Aktif" : "❌ Pasif"}\n`
                        })
                    }
                    await sendMessage(chatId, message)
                } else if (data === "sustur" || data === "susturmaac") {
                    const enabled = data === "susturmaac"
                    await prisma.settings.updateMany({ data: { telegramNotificationsEnabled: enabled } })
                    await sendMessage(chatId, enabled ? "🔔 Bildirimler açıldı." : "🔕 Bildirimler susturuldu.")
                } else if (data === "bakim_ac" || data === "bakim_kapat") {
                    const mode = data === "bakim_ac"
                    await prisma.settings.updateMany({ data: { maintenanceMode: mode } })
                    await sendMessage(chatId, mode ? "🛠️ Bakım modu aktif edildi." : "✅ Bakım modu kapatıldı.")
                }
            }

            // Answer callback query to stop loading spinner on button
            await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ callback_query_id: callback.id })
            })

            return NextResponse.json({ ok: true })
        }

        if (!update.message || !update.message.text) {
            return NextResponse.json({ ok: true })
        }

        const chatId = update.message.chat.id.toString()
        const text = update.message.text.trim().toLowerCase()
        const username = update.message.from.username
        const firstName = update.message.from.first_name

        const settings = await prisma.settings.findFirst()
        const isAdmin = username === (settings?.telegramAdminUsername || "d4rkn3m3s1s")

        // 1. PUBLIC COMMANDS
        if (text === "/start") {
            let msg = "👋 <b>ZK İletişim Botuna Hoşgeldiniz!</b>\n\n" +
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
                "/aboneiptal - Bildirim aboneliğini iptal eder.";

            if (isAdmin) {
                msg += "\n\n⚡ <b>ADMİN KOMUTLARI:</b>\n" +
                    "/panel - Admin yönetim paneli\n" +
                    "/ozet - Bugünkü satış özeti\n" +
                    "/sonhatalar - Son kritik hatalar\n" +
                    "/kullanicilar - Abone listesi\n" +
                    "/sustur - Tüm bildirimleri kapat\n" +
                    "/susturmaac - Tüm bildirimleri aç\n" +
                    "/aktifet @kullanici - Kullanıcıyı aktifleştir\n" +
                    "/pasifet @kullanici - Kullanıcıyı sustur\n" +
                    "/kullanicisil @kullanici - Kullanıcıyı tamamen sil\n" +
                    "/bakim ac - Bakım modunu aç\n" +
                    "/bakim kapat - Bakım modunu kapat\n" +
                    "/duyuru [MESAJ] - Tüm abonelere duyuru\n" +
                    "/stokum [ID] [ADET] - Stok güncelle";
            }

            await sendMessage(chatId, msg)
            return NextResponse.json({ ok: true })
        }

        if (text === "/yardim") {
            let msg = "📚 <b>ZK İletişim Bot - Yardım</b>\n\n" +
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
                "💡 <b>Not:</b> Rapor komutlarını kullanmak için önce /abone komutu ile sisteme giriş yapmalısınız.";

            if (isAdmin) {
                msg += "\n\n⚡ <b>ADMİN KOMUTLARI:</b>\n" +
                    "/panel /admin - Admin kontrol paneli\n" +
                    "/ozet - Finansal özet\n" +
                    "/sonhatalar - Sistem hataları\n" +
                    "/kullanicilar - Abone yönetimi\n" +
                    "/sustur /susturmaac - Global bildirim anahtarı\n" +
                    "/aktifet @kullanici - Kullanıcı bildirimini aç\n" +
                    "/pasifet @kullanici - Kullanıcı bildirimini kapat\n" +
                    "/kullanicisil @kullanici - Kullanıcıyı tamamen sil\n" +
                    "/bakim ac/kapat - Bakım modu\n" +
                    "/duyuru [MESAJ] - Toplu mesaj\n" +
                    "/stokum [ID] [ADET] - Hızlı stok";
            }

            await sendMessage(chatId, msg)
            return NextResponse.json({ ok: true })
        }

        if (text.startsWith("/abone ")) {
            const secret = text.split(" ")[1]
            if (secret === TELEGRAM_ADMIN_SECRET) {
                const existing = await prisma.telegramSubscriber.findUnique({ where: { chatId } })
                if (!existing) {
                    await prisma.telegramSubscriber.create({ data: { chatId, username, firstName } })
                } else if (!existing.isActive) {
                    await prisma.telegramSubscriber.update({ where: { chatId }, data: { isActive: true } })
                }
                await sendMessage(chatId, "✅ Bildirimlere başarıyla abone oldunuz!")
            } else {
                await sendMessage(chatId, "❌ Geçersiz şifre. Erişim reddedildi.")
            }
            return NextResponse.json({ ok: true })
        }

        if (text === "/aboneiptal") {
            await prisma.telegramSubscriber.update({ where: { chatId }, data: { isActive: false } })
            await sendMessage(chatId, "🔕 Bildirimlerden çıkış yapıldı.")
            return NextResponse.json({ ok: true })
        }

        // 2. PROTECTED REPORT COMMANDS (Subscribers only)
        const reportCommands = ["/gunlukrapor", "/aylikrapor", "/alacaklar", "/stokrapor", "/tamirler", "/satislar"]
        if (reportCommands.includes(text)) {
            const subscriber = await prisma.telegramSubscriber.findUnique({ where: { chatId } })
            if (subscriber && subscriber.isActive) {
                await sendMessage(chatId, "⏳ Rapor hazırlanıyor, lütfen bekleyin...")
                const { sendDailyReport, sendMonthlyReport, sendDebtorsReport, sendStockReport, sendRepairsReport, sendSalesReport } = await import("@/app/actions/reports")

                if (text === "/gunlukrapor") await sendDailyReport(chatId)
                else if (text === "/aylikrapor") await sendMonthlyReport(chatId)
                else if (text === "/alacaklar") await sendDebtorsReport(chatId)
                else if (text === "/stokrapor") await sendStockReport(chatId)
                else if (text === "/tamirler") await sendRepairsReport(chatId)
                else if (text === "/satislar") await sendSalesReport(chatId)
            } else {
                await sendMessage(chatId, "⚠️ Bu komutu kullanmak için önce sisteme giriş yapmalısınız:\n/abone [ŞİFRE]")
            }
            return NextResponse.json({ ok: true })
        }

        // 3. ADMIN COMMANDS (Super Admin only)
        const adminCommands = ["/sustur", "/susturmaac", "/aktifet", "/pasifet", "/stokum", "/ozet", "/sonhatalar", "/duyuru", "/bakim", "/kullanicilar", "/kullanicisil", "/panel", "/admin"]
        const matchedAdminCmd = adminCommands.find(cmd => text.startsWith(cmd))

        if (matchedAdminCmd) {
            if (!isAdmin) {
                await sendMessage(chatId, "🚫 <b>YETKİSİZ ERİŞİM</b>\n\nÜzgünüm, bu komut sadece Super Admin (@d4rkn3m3s1s) tarafından kullanılabilir.")
                return NextResponse.json({ ok: true })
            }

            // Implementation of admin commands
            if (text === "/sustur" || text === "/susturmaac") {
                const enabled = text === "/susturmaac"
                await prisma.settings.updateMany({ data: { telegramNotificationsEnabled: enabled } })
                await sendMessage(chatId, enabled ? "🔔 Bildirimler açıldı." : "🔕 Bildirimler susturuldu.")
            } else if (text.startsWith("/stokum ")) {
                const parts = text.split(" ")
                if (parts.length === 3) {
                    const productId = parseInt(parts[1]); const stock = parseInt(parts[2])
                    await prisma.product.update({ where: { id: productId }, data: { stock } })
                    await sendMessage(chatId, `✅ Ürün #${productId} stok miktarı ${stock} olarak güncellendi.`)
                } else {
                    await sendMessage(chatId, "📝 Kullanım: /stokum [ID] [ADET]")
                }
            } else if (text === "/ozet") {
                const today = new Date().toISOString().split('T')[0]
                const sales = await prisma.sale.findMany({ where: { soldAt: { gte: new Date(today) } } })
                const totalSales = sales.reduce((sum, s) => sum + Number(s.soldPrice), 0)
                const totalProfit = sales.reduce((sum, s) => sum + Number(s.profit), 0)
                const pendingRepairs = await prisma.repair.count({ where: { status: 'received' } })
                await sendMessage(chatId, `📊 <b>Bugünkü Özet:</b>\n\n💰 Satış: ${totalSales} TL\n📈 Kar: ${totalProfit} TL\n🔧 Tamir: ${pendingRepairs}`)
            } else if (text === "/sonhatalar") {
                const logs = await prisma.systemLog.findMany({ where: { severity: 'CRITICAL' }, orderBy: { createdAt: 'desc' }, take: 5 })
                let msg = "🚨 <b>Son Kritik Hatalar:</b>\n\n"
                if (logs.length === 0) msg += "Hata bulunamadı."
                else logs.forEach(log => { msg += `🔴 [${log.createdAt.toLocaleString()}] ${log.action}: ${log.details}\n\n` })
                await sendMessage(chatId, msg)
            } else if (text.startsWith("/duyuru ")) {
                const msg = text.replace("/duyuru", "").trim()
                if (msg) {
                    const subscribers = await prisma.telegramSubscriber.findMany({ where: { isActive: true } })
                    await Promise.all(subscribers.map(sub => sendMessage(sub.chatId, `📢 <b>DUYURU</b>\n\n${msg}`)))
                    await sendMessage(chatId, `✅ Duyuru ${subscribers.length} kişiye gönderildi.`)
                }
            } else if (text.startsWith("/bakim")) {
                const mode = text.includes("ac"); await prisma.settings.updateMany({ data: { maintenanceMode: mode } })
                await sendMessage(chatId, mode ? "🛠️ Bakım modu aktif edildi." : "✅ Bakım modu kapatıldı.")
            } else if (text === "/kullanicilar") {
                const subscribers = await prisma.telegramSubscriber.findMany()
                let msg = "👥 <b>Abone Listesi:</b>\n\n"; if (subscribers.length === 0) msg += "Abone yok."
                else subscribers.forEach((sub, i) => { msg += `${i + 1}. ${sub.firstName || "İsimsiz"} (@${sub.username || "yok"}) - ${sub.isActive ? "✅" : "❌"}\n` })
                await sendMessage(chatId, msg)
            } else if (text.startsWith("/kullanicisil ")) {
                const target = text.split(" ")[1]
                if (target) {
                    const uname = target.replace("@", "")
                    await prisma.telegramSubscriber.deleteMany({ where: { username: uname } })
                    await sendMessage(chatId, `✅ @${uname} silindi.`)
                }
            } else if (text.startsWith("/aktifet ") || text.startsWith("/pasifet ")) {
                const target = text.split(" ")[1]
                const isActive = text.startsWith("/aktifet ")
                if (target) {
                    const uname = target.replace("@", "")
                    const result = await prisma.telegramSubscriber.updateMany({
                        where: { username: uname },
                        data: { isActive }
                    })
                    if (result.count > 0) {
                        await sendMessage(chatId, `✅ @${uname} için bildirimler ${isActive ? "açıldı" : "kapatıldı"}.`)
                    } else {
                        await sendMessage(chatId, `❌ @${uname} kullanıcısı bulunamadı.`)
                    }
                } else {
                    await sendMessage(chatId, `📝 Kullanım: ${isActive ? "/aktifet" : "/pasifet"} @kullanici`)
                }
            } else if (text === "/panel" || text === "/admin") {
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: "🎮 <b>Admin Kontrol Paneli</b>\n\nHızlı işlemler için butonları kullanın:",
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "📊 Özet", callback_data: "ozet" }, { text: "🚨 Hatalar", callback_data: "hatalar" }],
                                [{ text: "👥 Üyeler", callback_data: "users" }, { text: "🔕 Global Sustur", callback_data: "sustur" }],
                                [{ text: "🛠️ Bakım Aç", callback_data: "bakim_ac" }, { text: "✅ Kapat", callback_data: "bakim_kapat" }]
                            ]
                        }
                    })
                })
            }
            return NextResponse.json({ ok: true })
        }

        // 4. UNKNOWN COMMAND
        if (text.startsWith("/")) {
            await sendMessage(chatId, "❓ <b>Geçersiz Komut</b>\n\nGönderdiğiniz komutu anlayamadım. Mevcut komutları görmek için /yardim yazabilirsiniz.")
        }

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error("Telegram Webhook Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

async function sendMessage(chatId: string, text: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
        console.error("❌ sendMessage: TELEGRAM_BOT_TOKEN is missing!");
        return;
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: "HTML"
            })
        })

        if (!response.ok) {
            const errorData = await response.json();
            console.error("❌ Telegram API sendMessage error:", errorData);
        }
    } catch (error) {
        console.error("❌ fetch error in sendMessage:", error);
    }
}
