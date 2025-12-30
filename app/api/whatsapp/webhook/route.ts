
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const API_KEY = process.env.WHATSAPP_API_KEY || 'changeme';

export async function POST(req: NextRequest) {
    try {
        const apiKey = req.headers.get('x-api-key');
        if (apiKey !== API_KEY) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { remoteJid, fromMe, text, timestamp, senderName } = body;

        if (!remoteJid || !text) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        const message = await prisma.whatsAppMessage.create({
            data: {
                remoteJid,
                fromMe: !!fromMe,
                text,
                senderName,
                timestamp: new Date(timestamp * 1000), // Convert to JS date
                status: fromMe ? 'sent' : 'received'
            }
        });

        return NextResponse.json({ success: true, id: message.id });
    } catch (error: any) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
