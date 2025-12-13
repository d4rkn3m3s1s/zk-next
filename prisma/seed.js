const { PrismaClient } = require('@prisma/client')
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
const Database = require('better-sqlite3')
const bcrypt = require('bcrypt')

// Initialize adapter
const db = new Database('prisma/dev.db')
const adapter = new PrismaBetterSqlite3(db)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('Seeding database...')
    const password = await bcrypt.hash('admin123', 10)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@zkiletisim.com' },
        update: {},
        create: {
            username: 'admin',
            email: 'admin@zkiletisim.com',
            password,
            role: 'admin',
        },
    })

    console.log({ admin })
}

main()
    .then(async () => {
        await prisma.$disconnect()
        db.close()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        db.close()
        process.exit(1)
    })
