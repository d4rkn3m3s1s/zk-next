
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

async function main() {
    console.log("Checking Prisma Client...");

    // Replicating lib/prisma.ts exactly
    const dbPath = process.env.DATABASE_URL || "file:./dev.db"
    // @ts-ignore
    const adapter = new PrismaBetterSqlite3({
        url: dbPath
    })

    const prisma = new PrismaClient({ adapter });

    // Check Debtor
    if (prisma.debtor) {
        console.log("SUCCESS: prisma.debtor exists and is not undefined.");
        try {
            const count = await prisma.debtor.count();
            console.log(`Debtor count: ${count}`);
        } catch (e: any) {
            console.error("Query failed (expected if DB not init, but client generic is safe):", e.message);
        }
    } else {
        console.error("FAILURE: prisma.debtor is undefined.");
        console.log("Keys on prisma:", Object.keys(prisma).filter(k => !k.startsWith('_')));
    }
}

main().catch(console.error).finally(() => process.exit(0));
