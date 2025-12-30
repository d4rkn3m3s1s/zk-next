const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const messages = await prisma.whatsAppMessage.findMany({
            orderBy: { timestamp: 'desc' },
            take: 5
        });
        console.log("Last 5 messages:", JSON.stringify(messages, null, 2));
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
