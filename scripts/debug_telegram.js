const { PrismaClient } = require('@prisma/client');
const https = require('https');

const prisma = new PrismaClient();
const token = process.env.TELEGRAM_BOT_TOKEN;

async function debug() {
    console.log("🔍 Starting Telegram Debug...");

    // 1. Check Env
    if (!token) {
        console.error("❌ TELEGRAM_BOT_TOKEN is missing in process.env");
        console.log("👉 Please restart your Next.js server/terminal to load the new .env file.");
        return;
    }
    console.log("✅ Token found in env:", token.substring(0, 10) + "...");

    // 2. Check Database
    try {
        const subscriber = await prisma.telegramSubscriber.findFirst();
        if (!subscriber) {
            console.error("❌ No subscribers found in database.");
        } else {
            console.log("✅ Found subscriber:", subscriber.username, "(ID:", subscriber.chatId, ")");

            // 3. Try Sending
            console.log("Attempting to send test message...");
            const url = `https://api.telegram.org/bot${token}/sendMessage`;
            const body = JSON.stringify({
                chat_id: subscriber.chatId,
                text: "🔔 Test notification from Debug Script. If you see this, sending works!",
                parse_mode: "HTML"
            });

            const req = https.request(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': body.length
                }
            }, (res) => {
                let data = '';
                res.on('data', d => data += d);
                res.on('end', () => {
                    const response = JSON.parse(data);
                    if (response.ok) {
                        console.log("✅ Message sent successfully!");
                    } else {
                        console.error("❌ Telegram API Error:", response);
                    }
                });
            });

            req.on('error', (e) => {
                console.error("❌ Request Error:", e);
            });

            req.write(body);
            req.end();
        }
    } catch (e) {
        console.error("❌ Database Error:", e);
    }
}

debug();
