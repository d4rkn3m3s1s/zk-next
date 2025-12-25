const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const data = {
        siteName: "AdminOS",
        phone: "+905415713850",
        email: "talha.coksoylu@gmail.com",
        address: "Sahabiye, Sivas Blv. No:15 D:E, 38010 Kocasinan/Kayseri",
        description: "Zahmetsiz Çözüm Kusursuz Hizmet...",
        instagram: "https://www.instagram.com/zkiletisim38/",
        facebook: "",
        twitter: "",
        youtube: "",
        linkedin: ""
    }

    const existing = await prisma.settings.findFirst()
    if (existing) {
        await prisma.settings.update({
            where: { id: existing.id },
            data
        })
        console.log('Updated existing record:', existing.id)
    } else {
        await prisma.settings.create({ data })
        console.log('Created new record')
    }
}

main().finally(() => prisma.$disconnect())
