'use server'

import { prisma } from "@/lib/prisma"

export async function getSystemLogs(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit

    const [logs, total] = await Promise.all([
        prisma.systemLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: skip
        }),
        prisma.systemLog.count()
    ])

    return {
        logs,
        total,
        totalPages: Math.ceil(total / limit)
    }
}
