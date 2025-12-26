const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDB() {
    console.log("Checking Production Database...");
    try {
        const settingsCount = await prisma.settings.count();
        console.log("Settings rows:", settingsCount);

        if (settingsCount > 0) {
            const settings = await prisma.settings.findFirst();
            console.log("Settings:", JSON.stringify(settings, null, 2));
        } else {
            console.log("❌ NO SETTINGS ROW FOUND!");
        }

        const subCount = await prisma.telegramSubscriber.count();
        console.log("Telegram Subscribers:", subCount);

        const lastLogs = await prisma.systemLog.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' }
        });
        console.log("Recent Logs:", lastLogs.length);
        lastLogs.forEach(l => console.log(`- [${l.createdAt}] ${l.action} ${l.entity}: ${l.details}`));

    } catch (e) {
        console.error("Database check failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

checkDB();
