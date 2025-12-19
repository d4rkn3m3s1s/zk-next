const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const adminEmail = 'admin@zkiletisim.com';

        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingAdmin) {
            console.log('Admin user already exists. Updating password...');
            await prisma.user.update({
                where: { email: adminEmail },
                data: {
                    password: hashedPassword,
                    role: 'admin',
                    username: 'admin'
                }
            });
            console.log('Admin password updated.');
        } else {
            console.log('Creating new admin user...');
            await prisma.user.create({
                data: {
                    username: 'admin',
                    email: adminEmail,
                    password: hashedPassword,
                    role: 'admin'
                }
            });
            console.log('Admin user created successfully.');
        }
    } catch (err) {
        console.error('Error creating admin:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
