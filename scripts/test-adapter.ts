
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'
import path from 'path';

async function main() {
    console.log("--- Starting Adapter Test ---");

    // 1. REPRODUCE CURRENT (Likely Broken) SETUP
    try {
        console.log("Testing current setup...");
        // Emulating lib/prisma.ts
        const dbPath = "file:./dev.db"; // This is what is in lib/prisma.ts (from default)
        // @ts-ignore
        const adapter = new PrismaBetterSqlite3({ url: dbPath }); // Using object instead of instance
        const prisma = new PrismaClient({ adapter });

        console.log("Current setup instantiated. Trying query...");
        // This will likely fail
        await prisma.user.count();
        console.log("Current setup SUCCESS???");
    } catch (e: any) {
        console.log("Current setup FAILED as expected:", e.message);
    }

    // 2. TEST CORRECT SETUP
    try {
        console.log("\nTesting CORRECT setup...");
        const dbFilePath = path.join(process.cwd(), 'dev.db');
        console.log("DB Path:", dbFilePath);

        const connection = new Database(dbFilePath);
        const adapter = new PrismaBetterSqlite3(connection);
        const prisma = new PrismaClient({ adapter });

        console.log("Correct setup instantiated. Trying query...");
        const count = await prisma.user.count();
        console.log(`Correct setup SUCCESS. User count: ${count}`);

        if (prisma.debtor) {
            console.log("Debtor model is available.");
        } else {
            console.log("Debtor model is NOT available on client.");
        }

    } catch (e: any) {
        console.error("Correct setup FAILED:", e);
    }
}

main();
