
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

async function main() {
    console.log("Checking Prisma Client v3...");

    // Explicitly import "clean" instance or just use generics
    const prisma = new PrismaClient();

    // Check Debtor
    if ('debtor' in prisma) {
        console.log("SUCCESS: prisma.debtor exists.");
        await prisma.$disconnect();
    } else {
        console.error("FAILURE: prisma.debtor is undefined.");
    }
}

main().catch(console.error).finally(() => process.exit(0));
