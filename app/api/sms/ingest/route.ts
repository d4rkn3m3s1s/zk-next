import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendTelegramMessage } from "@/lib/telegram"
import { createLog } from "@/lib/logger"

export const runtime = "nodejs" // Explicitly requested Node runtime

// Function to handle the core logic for both GET and POST
async function handleSmsIngest(req: NextRequest) {
    try {
        // 1. Security Check
        const xKey = req.headers.get("x-key")
        const url = new URL(req.url)
        const queryKey = url.searchParams.get("x-key") // Allow key in query param for easier browser testing

        const secureKey = process.env.SMS_INGEST_KEY || "enstone_secret_key_2025"

        if (xKey !== secureKey && queryKey !== secureKey) {
            console.error("Unauthorized SMS Attempt: Invalid x-key")
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        // 2. Extract Data from Search Params (Primary)
        let from = url.searchParams.get("from")
        let message = url.searchParams.get("message")
        let time = url.searchParams.get("time")

        // Fallback to JSON Body if query params are missing and it's a POST request
        let bodyPayload: any = {}
        if (req.method === "POST" && (!from || !message)) {
            try {
                const body = await req.json()
                from = from || body.from || body.sender || body['in-number']
                message = message || body.message || body.msg || body.content
                time = time || body.time || body.received_at
                bodyPayload = body
            } catch (e) {
                // Empty body
            }
        }

        // 3. Validation
        // If it's a browser check (GET) without parameters, return a friendly 200 message instead of 400 error
        if (!from || !message) {
            return NextResponse.json({
                ok: true,
                status: "Endpoint Active",
                message: "SMS Ingest endpoint is ready. Use 'from' and 'message' parameters to send data.",
                debug: { from, message, time }
            }, { status: 200 })
        }

        // 4. Time Parsing
        let received_at = new Date()
        if (time) {
            const parsedTime = new Date(time)
            if (!isNaN(parsedTime.getTime())) {
                received_at = parsedTime
            }
        }

        // 5. Save to DB (Raw SQL for reliability)
        const sql = `
            INSERT INTO "InboundSms" (sender, message, received_at, raw_payload, updated_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING id
        `
        const rawPayload = {
            method: req.method,
            query: Object.fromEntries(url.searchParams),
            body: bodyPayload
        }

        const res = await db.query(sql, [from, message, received_at, JSON.stringify(rawPayload)])
        const insertedId = res.rows[0].id

        // 6. Notifications
        try {
            await sendTelegramMessage(
                `📱 <b>Inbound SMS (${req.method})</b>\n\n` +
                `👤 <b>From:</b> ${from}\n` +
                `💬 <b>MSG:</b> ${message}`,
                undefined, false, 'system'
            )

            await createLog('SMS_RECEIVED', 'InboundSms', `SMS via ${req.method} from ${from}`, 'System', 'INFO', insertedId)
        } catch (e) {
            console.warn("SMS Notifications failed:", e)
        }

        // Return the exact info for confirmation
        return NextResponse.json({
            ok: true,
            id: insertedId,
            from,
            message,
            time,
            method: req.method
        })
    } catch (error: any) {
        console.error("SMS Ingest Global Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    return handleSmsIngest(req)
}

export async function GET(req: NextRequest) {
    return handleSmsIngest(req)
}
