const https = require('https');

// Get configuration from env or args
const token = process.env.TELEGRAM_BOT_TOKEN || "8448049772:AAGIWmLXzC_FE7idZesejkhDruXNblK1GRY";
const domain = process.argv[2] || process.env.NEXTAUTH_URL || "https://zcorp.vercel.app";
const webhookUrl = `${domain.replace(/\/$/, '')}/api/telegram`;

const url = `https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;

console.log("🚀 Setting Production Webhook...");
console.log(`Token: ${token.substring(0, 10)}...`);
console.log(`Domain: ${domain}`);
console.log(`Target: ${webhookUrl}`);

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const response = JSON.parse(data);
            if (response.ok) {
                console.log("\n✅ Webhook Successfully Set!");
                console.log(response.description);
                console.log("\nYour bot is now connected to:", domain);
            } else {
                console.error("\n❌ Error:", response);
            }
        } catch (e) {
            console.error("Error parsing response:", e);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
