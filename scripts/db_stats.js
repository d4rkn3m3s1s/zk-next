const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDB() {
    try {
        const settingsCount = await prisma.settings.count();
        const settings = await prisma.settings.findFirst();
        const subCount = await prisma.telegramSubscriber.count();
        const logsCount = await prisma.systemLog.count();

        console.log("STAT_START");
        console.log("SettingsCount:", settingsCount);
        console.log("HasSettings:", !!settings);
        if (settings) {
            console.log("Settings_Enabled:", settings.telegramNotificationsEnabled);
        }
        console.log("SubscribersCount:", subCount);
        console.log("LogsCount:", logsCount);
        console.log("STAT_END");

    } catch (e) {
        console.error("FAIL:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkDB();
