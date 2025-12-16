
import { prisma } from "../lib/prisma";

async function main() {
    try {
        const settings = await prisma.settings.findFirst();
        console.log("Settings found:", settings);
        const userCount = await prisma.user.count();
        console.log("User count:", userCount);
    } catch (e) {
        console.error("Error accessing settings:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
