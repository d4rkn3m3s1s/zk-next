const https = require('https');

const token = process.env.TELEGRAM_BOT_TOKEN || "8448049772:AAGIWmLXzC_FE7idZesejkhDruXNblK1GRY";

console.log("🔍 Telegram Bot Durum Kontrolü\n");
console.log("=".repeat(60));

// Bot bilgilerini al
function getBotInfo() {
    return new Promise((resolve, reject) => {
        const url = `https://api.telegram.org/bot${token}/getMe`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// Webhook bilgilerini al
function getWebhookInfo() {
    return new Promise((resolve, reject) => {
        const url = `https://api.telegram.org/bot${token}/getWebhookInfo`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function checkStatus() {
    try {
        // Bot bilgileri
        const botInfo = await getBotInfo();
        if (botInfo.ok) {
            console.log("\n✅ BOT BİLGİLERİ");
            console.log(`   İsim: ${botInfo.result.first_name}`);
            console.log(`   Kullanıcı Adı: @${botInfo.result.username}`);
            console.log(`   ID: ${botInfo.result.id}`);
            console.log(`   Komutları Destekliyor: ${botInfo.result.can_read_all_group_messages ? 'Evet' : 'Hayır'}`);
        }

        // Webhook bilgileri
        const webhookInfo = await getWebhookInfo();
        if (webhookInfo.ok) {
            const info = webhookInfo.result;
            console.log("\n✅ WEBHOOK DURUMU");
            console.log(`   URL: ${info.url || '❌ Ayarlanmamış'}`);
            console.log(`   Bekleyen Güncelleme: ${info.pending_update_count || 0}`);

            if (info.last_error_message) {
                console.log(`   ⚠️ Son Hata: ${info.last_error_message}`);
                if (info.last_error_date) {
                    const errorDate = new Date(info.last_error_date * 1000);
                    console.log(`   ⚠️ Hata Tarihi: ${errorDate.toLocaleString('tr-TR')}`);
                }
            } else {
                console.log(`   ✅ Hata Yok`);
            }

            if (info.max_connections) {
                console.log(`   Maksimum Bağlantı: ${info.max_connections}`);
            }

            if (info.ip_address) {
                console.log(`   IP Adresi: ${info.ip_address}`);
            }
        }

        console.log("\n" + "=".repeat(60));
        console.log("\n📋 KULLANILABILIR KOMUTLAR");
        console.log("\n🔐 Kurulum Komutları:");
        console.log("   /start - Botu başlat ve hoş geldin mesajı al");
        console.log("   /abone [ŞİFRE] - Bildirimlere abone ol");
        console.log("   /aboneiptal - Bildirimlerden çık");
        console.log("   /yardim - Tüm komutları listele");

        console.log("\n📊 Rapor Komutları:");
        console.log("   /gunlukrapor - Günlük satış, tamir ve borç raporu");
        console.log("   /aylikrapor - Aylık finansal özet");
        console.log("   /alacaklar - Alacak defteri ve top 10 borçlu");
        console.log("   /stokrapor - Tükenen ve kritik stok seviyeleri");
        console.log("   /tamirler - Bekleyen ve devam eden tamirler");
        console.log("   /satislar - Bugünkü satış detayları");

        console.log("\n" + "=".repeat(60));
        console.log("\n💡 TEST ADIMLARI:");
        console.log("\n1. Telegram'da botu bulun:");
        console.log(`   @${botInfo.result.username}`);

        console.log("\n2. /start komutu gönderin");
        console.log("   Türkçe hoş geldin mesajı almalısınız");

        console.log("\n3. Abone olun:");
        console.log("   /abone zk-secure-admin-2025");
        console.log("   'Bildirimlere başarıyla abone oldunuz!' mesajı almalısınız");

        console.log("\n4. Rapor komutlarını test edin:");
        console.log("   /gunlukrapor");
        console.log("   /aylikrapor");
        console.log("   /alacaklar");
        console.log("   /stokrapor");
        console.log("   /tamirler");
        console.log("   /satislar");

        console.log("\n5. Yardım komutunu kontrol edin:");
        console.log("   /yardim");

        if (info.url) {
            console.log("\n⚠️ NOT: Bot şu anda webhook modunda çalışıyor:");
            console.log(`   ${info.url}`);
            console.log("\n   Komutlar bu URL üzerinden işlenecek.");
            console.log("   Eğer local test yapmak istiyorsanız:");
            console.log("   node scripts/manage_webhook.js delete");
        }

        console.log("\n" + "=".repeat(60));

    } catch (error) {
        console.error("\n❌ Hata:", error.message || error);
    }
}

checkStatus();
