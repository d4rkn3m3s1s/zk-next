const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listSubs() {
    try {
        const subs = await prisma.telegramSubscriber.findMany();
        console.log("SUBSCRIBERS:");
        subs.forEach(s => console.log(`- ${s.firstName} (@${s.username}) ID: ${s.chatId} Active: ${s.isActive}`));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
listSubs();
