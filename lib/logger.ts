
import { prisma } from "@/lib/prisma";

export async function logAction(
    action: string,
    entity: string,
    entityId: string | number,
    details: any,
    username: string = "System"
) {
    try {
        const detailString = typeof details === "string" ? details : JSON.stringify(details);
        const idString = String(entityId);

        await prisma.auditLog.create({
            data: {
                action,
                entity,
                entityId: idString,
                details: detailString,
                username,
            },
        });
    } catch (error) {
        console.error("Failed to write audit log:", error);
        // Fail silently to not block the main action
    }
}
