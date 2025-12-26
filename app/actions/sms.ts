'use server'

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getInboundSMS(query?: string) {
    let sql = 'SELECT * FROM "InboundSms"'
    let params: any[] = []

    if (query) {
        sql += ' WHERE "sender" ILIKE $1 OR "message" ILIKE $2'
        params = [`%${query}%`, `%${query}%`]
    }

    sql += ' ORDER BY "created_at" DESC'

    const res = await db.query(sql, params)
    return res.rows
}

export async function deleteInboundSMS(id: string) {
    await db.query('DELETE FROM "InboundSms" WHERE "id" = $1', [id])
    revalidatePath("/admin/sms")
}
