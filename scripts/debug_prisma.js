
const { PrismaClient } = require('@prisma/client');

async function main() {
    const prisma = new PrismaClient();
    console.log('Prisma Client Keys:', Object.keys(prisma));
    console.log('Debtor model exists?', !!prisma.debtor);

    if (prisma.debtor) {
        console.log('Debtor count:', await prisma.debtor.count());
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        // await prisma.$disconnect()
    });
