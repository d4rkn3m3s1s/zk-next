import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";

export type LogSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type LogAction = 'LOGIN' | 'CREATE' | 'UPDATE' | 'DELETE' | 'ERROR' | 'STATUS_CHANGE';
export type LogEntity = 'Product' | 'Repair' | 'Sale' | 'Auth' | 'System' | 'Debtor' | 'Message' | 'Appointment';

export async function createLog(
    action: LogAction,
    entity: LogEntity,
    details: string,
    username: string = 'System',
    severity: LogSeverity = 'INFO',
    entityId?: string
) {
    try {
        // 1. Write to DB
        await prisma.systemLog.create({
            data: {
                action,
                entity,
                entityId,
                details,
                severity,
                username
            }
        });

        // 2. Alert via Telegram (ALL LOGS)
        await sendTelegramMessage(
            `🚨 <b>SYSTEM LOG: ${severity}</b>\n\n` +
            `⚡ <b>Action:</b> ${action}\n` +
            `📦 <b>Entity:</b> ${entity}\n` +
            `👤 <b>User:</b> ${username}\n` +
            `📝 <b>Details:</b> ${details}`
        );

    } catch (error) {
        console.error("Logger failed:", error);
    }
}
