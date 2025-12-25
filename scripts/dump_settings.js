const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const settings = await prisma.settings.findMany()
    console.log('--- ALL SETTINGS RECORDS ---')
    console.log(JSON.stringify(settings, null, 2))
    console.log('---------------------------')
}

main().finally(() => prisma.$disconnect())
