const https = require('https');

const token = "8448049772:AAGIWmLXzC_FE7idZesejkhDruXNblK1GRY";
const domain = "https://zcorp.vercel.app";
const webhookUrl = `${domain}/api/telegram`;

const url = `https://api.telegram.org/bot${token}/setWebhook?url=${webhookUrl}`;

console.log("🚀 Setting Production Webhook...");
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
