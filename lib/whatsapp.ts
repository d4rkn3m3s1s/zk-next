import { prisma } from "@/lib/prisma"

// This library communicates with the external Baileys Microservice
// running on Railway/Docker.

interface WhatsAppResponse {
    success: boolean
    jid?: string
    error?: string
}

const SERVICE_URL = process.env.WHATSAPP_SERVICE_URL || 'https://baileys-production-2826.up.railway.app/api';
const API_KEY = process.env.WHATSAPP_API_KEY || 'changeme';

export async function sendWhatsAppMessage(phone: string, message: string): Promise<WhatsAppResponse> {

    // Check if enabled in settings
    const settings = await prisma.settings.findFirst();

    try {
        const response = await fetch(`${SERVICE_URL}/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({ phone, message })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to send message');
        }

        const result = await response.json();

        if (result.success) {
            // Log outgoing message to database so it appears in Chat UI
            let cleanPhone = phone.replace(/[^0-9]/g, '');
            if (cleanPhone.startsWith('90') && cleanPhone.length === 12) {
                // already correct
            } else if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
                cleanPhone = '9' + cleanPhone;
            } else if (cleanPhone.length === 10) {
                cleanPhone = '90' + cleanPhone;
            }
            const remoteJid = `${cleanPhone}@s.whatsapp.net`;

            await prisma.whatsAppMessage.create({
                data: {
                    remoteJid,
                    fromMe: true,
                    text: message,
                    timestamp: new Date(),
                    status: 'sent'
                }
            });
        }

        return result;
    } catch (error: any) {
        console.error('WhatsApp Service Error:', error.message);
        return { success: false, error: error.message };
    }
}

export async function getWhatsAppStatus() {
    try {
        const response = await fetch(`${SERVICE_URL}/status`, {
            headers: { 'x-api-key': API_KEY }
        });
        return await response.json();
    } catch (error) {
        return { status: 'error', error };
    }
}

export async function getWhatsAppQR() {
    try {
        const response = await fetch(`${SERVICE_URL}/qr`, {
            headers: { 'x-api-key': API_KEY }
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        return null;
    }
}

export async function disconnectWhatsApp() {
    try {
        const response = await fetch(`${SERVICE_URL}/logout`, {
            method: 'POST',
            headers: { 'x-api-key': API_KEY }
        });
        return await response.json();
    } catch (error) {
        return { success: false, error };
    }
}

export async function reconnectWhatsApp() {
    try {
        const response = await fetch(`${SERVICE_URL}/reconnect`, {
            method: 'POST',
            headers: { 'x-api-key': API_KEY }
        });
        return await response.json();
    } catch (error) {
        return { success: false, error };
    }
}
