const https = require('https');

const token = process.env.TELEGRAM_BOT_TOKEN || "8448049772:AAGIWmLXzC_FE7idZesejkhDruXNblK1GRY";

console.log("🤖 Telegram Bot Test Başlatılıyor...\n");

// Test 1: Bot bilgilerini kontrol et
function testBotInfo() {
    return new Promise((resolve, reject) => {
        const url = `https://api.telegram.org/bot${token}/getMe`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.ok) {
                        console.log("✅ Bot Bilgileri:");
                        console.log(`   - İsim: ${response.result.first_name}`);
                        console.log(`   - Kullanıcı Adı: @${response.result.username}`);
                        console.log(`   - ID: ${response.result.id}`);
                        resolve(response.result);
                    } else {
                        console.log("❌ Bot bilgileri alınamadı:", response);
                        reject(response);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// Test 2: Webhook durumunu kontrol et
function testWebhook() {
    return new Promise((resolve, reject) => {
        const url = `https://api.telegram.org/bot${token}/getWebhookInfo`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.ok) {
                        console.log("\n✅ Webhook Durumu:");
                        console.log(`   - URL: ${response.result.url || 'Ayarlanmamış'}`);
                        console.log(`   - Bekleyen Güncelleme: ${response.result.pending_update_count || 0}`);
                        console.log(`   - Son Hata: ${response.result.last_error_message || 'Yok'}`);
                        if (response.result.last_error_date) {
                            const errorDate = new Date(response.result.last_error_date * 1000);
                            console.log(`   - Son Hata Tarihi: ${errorDate.toLocaleString('tr-TR')}`);
                        }
                        resolve(response.result);
                    } else {
                        console.log("❌ Webhook bilgileri alınamadı:", response);
                        reject(response);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// Test 3: Son mesajları kontrol et
function testRecentMessages() {
    return new Promise((resolve, reject) => {
        const url = `https://api.telegram.org/bot${token}/getUpdates?limit=5`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.ok) {
                        console.log("\n✅ Son Mesajlar:");
                        if (response.result.length === 0) {
                            console.log("   - Henüz mesaj yok");
                        } else {
                            response.result.forEach((update, index) => {
                                if (update.message) {
                                    const msg = update.message;
                                    console.log(`   ${index + 1}. ${msg.from.first_name}: ${msg.text || '[Metin değil]'}`);
                                }
                            });
                        }
                        resolve(response.result);
                    } else {
                        console.log("❌ Mesajlar alınamadı:", response);
                        reject(response);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// Test 4: Komutları listele
function listCommands() {
    console.log("\n📋 Kullanılabilir Komutlar:");
    console.log("\n🔐 Kurulum:");
    console.log("   /start - Botu başlat");
    console.log("   /abone [ŞİFRE] - Bildirimlere abone ol");
    console.log("   /aboneiptal - Abonelikten çık");

    console.log("\n📊 Rapor Komutları:");
    console.log("   /gunlukrapor - Günlük finansal rapor");
    console.log("   /aylikrapor - Aylık finansal rapor");
    console.log("   /alacaklar - Alacak defteri raporu");
    console.log("   /stokrapor - Stok durumu raporu");
    console.log("   /tamirler - Tamir işlemleri raporu");
    console.log("   /satislar - Günlük satış raporu");

    console.log("\nℹ️ Diğer:");
    console.log("   /yardim - Yardım mesajı");
}

// Ana test fonksiyonu
async function runTests() {
    try {
        await testBotInfo();
        await testWebhook();
        await testRecentMessages();
        listCommands();

        console.log("\n" + "=".repeat(60));
        console.log("🎉 Tüm testler tamamlandı!");
        console.log("=".repeat(60));

        console.log("\n💡 Sonraki Adımlar:");
        console.log("1. Telegram'da bot'u bulun: @" + (process.env.TELEGRAM_BOT_USERNAME || "[BOT_USERNAME]"));
        console.log("2. /start komutu gönderin");
        console.log("3. /abone zk-secure-admin-2025 komutu ile abone olun");
        console.log("4. Rapor komutlarını test edin");

    } catch (error) {
        console.error("\n❌ Test sırasında hata oluştu:", error);
    }
}

runTests();
