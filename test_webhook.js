const fetch = require('node-fetch');

async function testWebhook() {
    console.log("Simulating incoming WhatsApp message...");

    const WEBHOOK_URL = 'http://localhost:3000/api/whatsapp/webhook';
    const API_KEY = 'changeme'; // Default from .env or code

    const payload = {
        remoteJid: '905551234567@s.whatsapp.net',
        fromMe: false,
        text: 'Test message from script ' + new Date().toISOString(),
        senderName: 'Test User',
        timestamp: Math.floor(Date.now() / 1000)
    };

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("Response Status:", response.status);
        console.log("Response Data:", data);

        if (response.ok) {
            console.log("\n✅ Webhook simulation SUCCESSFUL!");
            console.log("Please check your Admin Panel > WhatsApp to see if this message appeared.");
        } else {
            console.log("\n❌ Webhook simulation FAILED.");
        }

    } catch (error) {
        console.error("Error sending webhook:", error.message);
        console.log("\nMake sure your Next.js server is running on http://localhost:3000");
    }
}

testWebhook();
