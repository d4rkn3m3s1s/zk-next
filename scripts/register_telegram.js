const https = require('https');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const token = process.env.TELEGRAM_BOT_TOKEN || "8448049772:AAGIWmLXzC_FE7idZesejkhDruXNblK1GRY";
const secret = process.env.TELEGRAM_ADMIN_SECRET || "zk-secure-admin-2025";

const url = `https://api.telegram.org/bot${token}/getUpdates`;

console.log("🔍 Checking Telegram updates for subscription requests...");

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', async () => {
        try {
            const response = JSON.parse(data);
            if (!response.ok) {
                console.error("❌ Telegram API Error:", response);
                return;
            }

            const updates = response.result;
            if (updates.length === 0) {
                console.log("⚠️ No recent messages found. Please send '/subscribe " + secret + "' to the bot first.");
                return;
            }

            let registeredCount = 0;

            for (const update of updates) {
                if (update.message && update.message.text) {
                    const text = update.message.text.trim();
                    const chatId = update.message.chat.id.toString();
                    const username = update.message.from.username;
                    const firstName = update.message.from.first_name;

                    if (text.startsWith("/subscribe")) {
                        const sentSecret = text.split(" ")[1];

                        if (sentSecret === secret) {
                            // Valid secret, register user
                            try {
                                const existing = await prisma.telegramSubscriber.findUnique({
                                    where: { chatId }
                                });

                                if (!existing) {
                                    await prisma.telegramSubscriber.create({
                                        data: {
                                            chatId,
                                            username,
                                            firstName
                                        }
                                    });
                                    console.log(`✅ Registered new subscriber: ${firstName} (@${username})`);
                                    registeredCount++;
                                } else {
                                    if (!existing.isActive) {
                                        await prisma.telegramSubscriber.update({
                                            where: { chatId },
                                            data: { isActive: true }
                                        });
                                        console.log(`✅ Reactivated subscriber: ${firstName} (@${username})`);
                                        registeredCount++;
                                    } else {
                                        console.log(`ℹ️ User already registered: ${firstName} (@${username})`);
                                    }
                                }
                            } catch (dbError) {
                                console.error("Database error:", dbError);
                            }
                        }
                    }
                }
            }

            if (registeredCount > 0) {
                console.log(`\n🎉 Successfully registered ${registeredCount} user(s)! You will now receive notifications.`);
            } else {
                console.log("\nFound messages, but no new valid subscription commands.");
                console.log("Make sure you sent exactly: /subscribe " + secret);
            }

        } catch (e) {
            console.error("Error parsing response:", e);
        } finally {
            await prisma.$disconnect();
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
