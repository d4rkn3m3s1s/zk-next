const fetch = require('node-fetch');

async function checkServiceStatus() {
    console.log("Checking WhatsApp Service Status...");

    const SERVICE_URL = 'http://localhost:3001/api/status';
    const API_KEY = 'changeme';

    try {
        const response = await fetch(SERVICE_URL, {
            headers: { 'x-api-key': API_KEY }
        });

        if (!response.ok) {
            console.log(`❌ Service responded with ${response.status}`);
            return;
        }

        const data = await response.json();
        console.log("✅ Service Status:", data);

        if (data.status !== 'connected') {
            console.log("\n⚠️ WARNING: WhatsApp is NOT connected!");
            console.log("Please go to Admin Panel > Settings > WhatsApp to scan the QR code.");
        } else {
            console.log("\n✅ WhatsApp is fully connected!");
        }

    } catch (error) {
        console.error("❌ Failed to reach service:", error.message);
        console.log("Make sure 'npm run whatsapp' is running on port 3001.");
    }
}

async function simulateWebhookTest() {
    console.log("\n--- Integrity Test: Sending Simulated Webhook ---");
    const WEBHOOK_URL = 'http://localhost:3000/api/whatsapp/webhook';
    const API_KEY = 'changeme';

    // Use a unique ID to verifying
    const randomID = Math.floor(Math.random() * 10000);
    const text = `Integrity Test Check #${randomID}`;

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({
                remoteJid: '905559998877@s.whatsapp.net',
                fromMe: false,
                text: text,
                senderName: 'System Integrity Tester',
                timestamp: Math.floor(Date.now() / 1000)
            })
        });

        const data = await response.json();
        if (response.ok && data.success) {
            console.log(`✅ Webhook Accepted! ID: ${data.id}`);
            console.log(`Payload Text: "${text}"`);
        } else {
            console.log(`❌ Webhook Rejected:`, data);
        }

    } catch (error) {
        console.error("❌ Webhook unreachable:", error.message);
    }
}

async function runDiagnostics() {
    await checkServiceStatus();
    await simulateWebhookTest();
}

runDiagnostics();
