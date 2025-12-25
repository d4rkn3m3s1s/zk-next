const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const allSettings = await prisma.settings.findMany()
    console.log('COUNT:', allSettings.length)
    allSettings.forEach((s, i) => {
        console.log(`[${i}] ID:`, s.id, 'SITE:', s.siteName, 'PHONE:', s.phone, 'UPDATED:', s.updatedAt)
    })

    if (allSettings.length > 1) {
        console.log('Cleaning up duplicates...')
        // Keep the most recently updated one
        const sorted = allSettings.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        const toKeep = sorted[0]
        const idsToDelete = sorted.slice(1).map(s => s.id)

        await prisma.settings.deleteMany({
            where: {
                id: { in: idsToDelete }
            }
        })
        console.log('Kept ID:', toKeep.id, 'Deleted:', idsToDelete)
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
