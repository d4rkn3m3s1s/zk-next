import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export const runtime = "nodejs"

export async function GET() {
    try {
        const res = await db.query('SELECT id, sender, message, received_at, created_at FROM "InboundSms" ORDER BY created_at DESC LIMIT 50')
        return NextResponse.json(res.rows)
    } catch (error: any) {
        console.error("SMS Fetch Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
