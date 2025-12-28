import { prisma } from "@/lib/prisma"

export async function sendSMS(phone: string, message: string) {
    try {
        // Cast to 'any' to avoid TS errors if Prisma Client types are not yet updated in the running dev server
        const settings = await prisma.settings.findFirst() as any

        if (!settings || !settings.smsGatewayUrl) {
            console.error("SMS Gateway URL is not configured.")
            return { success: false, error: "SMS Gateway URL is not configured." }
        }

        const gatewayUrl = settings.smsGatewayUrl as string
        const apiKey = settings.smsGatewayApiKey as string | undefined
        const method = (settings.smsGatewayMethod as string) || "POST"

        // Clean phone number: international format required for TextBee (e.g. +90...)
        let cleanPhone = phone.replace(/\s+/g, '')
        if (!cleanPhone.startsWith('+')) {
            cleanPhone = `+${cleanPhone.replace(/^0+/, '90')}`
        }

        const isTextBee = gatewayUrl.includes("textbee.dev")
        const payload = isTextBee ? {
            recipients: [cleanPhone],
            message: message
        } : {
            to: cleanPhone,
            message: message
        }

        // Clean headers: Only use x-api-key for TextBee
        const headers: Record<string, string> = {
            "Content-Type": "application/json"
        }

        if (apiKey) {
            if (isTextBee) {
                headers["x-api-key"] = apiKey
            } else {
                headers["X-API-KEY"] = apiKey
                headers["Authorization"] = `Bearer ${apiKey}`
            }
        }

        const response = await fetch(gatewayUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(payload)
        })

        if (response.ok) {
            console.log(`SMS sent successfully to ${cleanPhone}`)
            return { success: true }
        } else {
            const errorText = await response.text()
            console.error(`SMS Failed: ${response.status} - ${errorText}`)
            return { success: false, error: errorText }
        }
    } catch (error: any) {
        console.error("SMS Send Error:", error)
        return { success: false, error: error.message }
    }
}

export function getStatusSMSTemplate(status: string, trackingCode: string, device: string) {
    const statusMessages: Record<string, string> = {
        'received': `📱 Merhaba! ${device} cihazınızı aldık ve kayıt altına aldık. Takip kodunuz: ${trackingCode}. En kısa sürede sizinle iletişime geçeceğiz! 🔧`,
        'diagnosing': `🔍 Merhaba! ${device} cihazınızın arıza tespiti yapılıyor. Takip: ${trackingCode}. Sonucu size bildireceğiz! 💪`,
        'waiting_parts': `📦 Merhaba! ${device} cihazınız için gerekli parça siparişi verildi. Takip: ${trackingCode}. Parça gelince hemen başlıyoruz! ⏳`,
        'in_progress': `🛠️ Harika haber! ${device} cihazınızın tamiri şu an yapılıyor. Takip: ${trackingCode}. Bitmesine az kaldı! 🎯`,
        'completed': `🎉 Müjde! ${device} cihazınızın tamiri tamamlandı! Takip: ${trackingCode}. Bizi ziyaret ederek cihazınızı teslim alabilirsiniz. Teşekkürler! ✨`,
        'delivered': `✅ ${device} cihazınız teslim edildi. Takip: ${trackingCode}. Bizi tercih ettiğiniz için teşekkür ederiz! Tekrar görüşmek üzere 👋`,
        'cancelled': `❌ ${device} cihazınızın tamir kaydı iptal edildi. Takip: ${trackingCode}. Sorularınız için bize ulaşabilirsiniz.`
    }
    return statusMessages[status] || `📱 ${device} cihazınızın durumu güncellendi. Takip: ${trackingCode}. ZK İletişim 💚`
}

export function getDebtReminderSMSTemplate(name: string, balance: number) {
    return `👋 Merhaba ${name}! ZK İletişim'e olan ₺${balance.toLocaleString('tr-TR')} tutarındaki borcunuzu hatırlatmak istedik. Ödeme için bize ulaşabilirsiniz. İyi günler dileriz! 💚`
}

export function getWhatsAppStatusTemplate(status: string, trackingCode: string, device: string) {
    const statusMessages: Record<string, string> = {
        'received': `📱 *Merhaba!*\n\n${device} cihazınızı aldık ve kayıt altına aldık.\n\n🔖 *Takip Kodunuz:* ${trackingCode}\n\nEn kısa sürede sizinle iletişime geçeceğiz! 🔧\n\n_ZK İletişim_`,
        'diagnosing': `🔍 *Merhaba!*\n\n${device} cihazınızın arıza tespiti yapılıyor.\n\n🔖 *Takip:* ${trackingCode}\n\nSonucu size bildireceğiz! 💪\n\n_ZK İletişim_`,
        'waiting_parts': `📦 *Merhaba!*\n\n${device} cihazınız için gerekli parça siparişi verildi.\n\n🔖 *Takip:* ${trackingCode}\n\nParça gelince hemen başlıyoruz! ⏳\n\n_ZK İletişim_`,
        'in_progress': `🛠️ *Harika haber!*\n\n${device} cihazınızın tamiri şu an yapılıyor.\n\n🔖 *Takip:* ${trackingCode}\n\nBitmesine az kaldı! 🎯\n\n_ZK İletişim_`,
        'completed': `🎉 *Müjde!*\n\n${device} cihazınızın tamiri *tamamlandı!*\n\n🔖 *Takip:* ${trackingCode}\n\nBizi ziyaret ederek cihazınızı teslim alabilirsiniz.\n\nTeşekkürler! ✨\n\n_ZK İletişim_`,
        'delivered': `✅ *Teslim Edildi*\n\n${device} cihazınız başarıyla teslim edildi.\n\n🔖 *Takip:* ${trackingCode}\n\nBizi tercih ettiğiniz için teşekkür ederiz!\nTekrar görüşmek üzere 👋\n\n_ZK İletişim_`,
        'cancelled': `❌ *İptal Edildi*\n\n${device} cihazınızın tamir kaydı iptal edildi.\n\n🔖 *Takip:* ${trackingCode}\n\nSorularınız için bize ulaşabilirsiniz.\n\n_ZK İletişim_`
    }
    return statusMessages[status] || `📱 ${device} cihazınızın durumu güncellendi.\n\n🔖 *Takip:* ${trackingCode}\n\n_ZK İletişim_ 💚`
}
