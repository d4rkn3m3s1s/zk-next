import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";

export type LogSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type LogAction = 'LOGIN' | 'CREATE' | 'UPDATE' | 'DELETE' | 'ERROR' | 'STATUS_CHANGE' | 'SMS_RECEIVED' | 'SMS_SENT';
export type LogEntity = 'Product' | 'Repair' | 'Sale' | 'Auth' | 'System' | 'Debtor' | 'Message' | 'Appointment' | 'InboundSms';

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
            `🚨 <b>SİSTEM LOGU: ${severity}</b>\n\n` +
            `⚡ <b>İşlem:</b> ${action}\n` +
            `📦 <b>Varlık:</b> ${entity}\n` +
            `👤 <b>Kullanıcı:</b> ${username}\n` +
            `📝 <b>Detaylar:</b> ${details}`,
            undefined,
            false,
            entity === 'Auth' ? 'auth' : 'system'
        );

    } catch (error) {
        console.error("Logger failed:", error);
    }
}
