const https = require('https');

const token = process.env.TELEGRAM_BOT_TOKEN || "8448049772:AAGIWmLXzC_FE7idZesejkhDruXNblK1GRY";

console.log("🔧 Telegram Bot Webhook Yönetimi\n");

// Webhook bilgilerini al
function getWebhookInfo() {
    return new Promise((resolve, reject) => {
        const url = `https://api.telegram.org/bot${token}/getWebhookInfo`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve(response);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// Webhook'u sil
function deleteWebhook() {
    return new Promise((resolve, reject) => {
        const url = `https://api.telegram.org/bot${token}/deleteWebhook`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve(response);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// Webhook'u ayarla
function setWebhook(webhookUrl) {
    return new Promise((resolve, reject) => {
        const url = `https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve(response);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function main() {
    try {
        // Mevcut webhook durumunu kontrol et
        console.log("📋 Mevcut webhook durumu kontrol ediliyor...");
        const currentInfo = await getWebhookInfo();

        if (currentInfo.ok) {
            console.log("\n✅ Mevcut Webhook Bilgileri:");
            console.log(`   URL: ${currentInfo.result.url || 'Ayarlanmamış'}`);
            console.log(`   Bekleyen Güncelleme: ${currentInfo.result.pending_update_count || 0}`);
            if (currentInfo.result.last_error_message) {
                console.log(`   ⚠️ Son Hata: ${currentInfo.result.last_error_message}`);
            }
        }

        // Kullanıcıdan webhook URL'i al (komut satırı argümanı)
        const args = process.argv.slice(2);

        if (args.length === 0) {
            console.log("\n💡 Kullanım:");
            console.log("   node scripts/manage_webhook.js [WEBHOOK_URL]");
            console.log("   node scripts/manage_webhook.js delete  (webhook'u silmek için)");
            console.log("\nÖrnek:");
            console.log("   node scripts/manage_webhook.js https://your-domain.com/api/telegram");
            console.log("   node scripts/manage_webhook.js delete");
            return;
        }

        if (args[0].toLowerCase() === 'delete') {
            console.log("\n🗑️ Webhook siliniyor...");
            const deleteResult = await deleteWebhook();
            if (deleteResult.ok) {
                console.log("✅ Webhook başarıyla silindi!");
                console.log("   Bot artık polling modunda çalışabilir.");
            } else {
                console.log("❌ Webhook silinemedi:", deleteResult);
            }
        } else {
            const webhookUrl = args[0];
            console.log(`\n🔗 Webhook ayarlanıyor: ${webhookUrl}`);

            const setResult = await setWebhook(webhookUrl);
            if (setResult.ok) {
                console.log("✅ Webhook başarıyla ayarlandı!");

                // Yeni durumu kontrol et
                const newInfo = await getWebhookInfo();
                if (newInfo.ok) {
                    console.log("\n📋 Güncel Webhook Bilgileri:");
                    console.log(`   URL: ${newInfo.result.url}`);
                    console.log(`   Bekleyen Güncelleme: ${newInfo.result.pending_update_count || 0}`);
                }
            } else {
                console.log("❌ Webhook ayarlanamadı:", setResult);
            }
        }

    } catch (error) {
        console.error("\n❌ Hata oluştu:", error);
    }
}

main();
