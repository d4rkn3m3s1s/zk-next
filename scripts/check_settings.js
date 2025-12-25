const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const settings = await prisma.settings.findFirst()
    console.log('--- DATABASE SETTINGS ---')
    console.log(JSON.stringify(settings, null, 2))
    console.log('------------------------')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
