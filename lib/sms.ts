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
    const statusMap: Record<string, string> = {
        'received': 'Alındı',
        'diagnosing': 'Arıza Tespiti Yapılıyor',
        'waiting_parts': 'Parça Bekleniyor',
        'in_progress': 'Tamir Ediliyor',
        'completed': 'İşlem Tamamlandı',
        'delivered': 'Teslim Edildi',
        'cancelled': 'İptal Edildi'
    }
    const trStatus = statusMap[status] || status
    return `Sayın Müşterimiz, ${trackingCode} takip kodlu ${device} cihazınızın durumu güncellendi: ${trStatus}. Detaylar için sitemizi ziyaret edebilirsiniz. ZK İletişim.`
}

export function getDebtReminderSMSTemplate(name: string, balance: number) {
    return `Sayın ${name}, ZK İletişim'e olan ₺${balance.toLocaleString('tr-TR')} tutarındaki vadesi geçmiş borcunuzu hatırlatmak isteriz. En kısa sürede ödeme yapmanızı rica ederiz. İyi günler dileriz.`
}
