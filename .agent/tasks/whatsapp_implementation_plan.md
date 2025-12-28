# WhatsApp (Baileys) Entegrasyon Planı

Kullanıcının belirlediği "Nihai Mimari"ye uygun olarak, Vercel'deki Next.js uygulamasından bağımsız, Railway üzerinde çalışacak bir Node.js servisi oluşturulacaktır. Bu servis, WhatsApp Web protokolünü simüle ederek (Baileys kütüphanesi ile) gerçek zamanlı mesajlaşmayı sağlayacaktır.

## 1. Mimari Genel Bakış

*   **Frontend/Backend (Mevcut)**: `zk-next` (Next.js) - Vercel üzerinde.
*   **WhatsApp Servisi (Yeni)**: `baileys-service` (Node.js + Express) - Railway üzerinde, Docker ile çalışacak.
*   **İletişim**: Next.js -> HTTPS POST -> Baileys Servisi.
*   **Güvenlik**: API Key (`X-API-KEY`) tabanlı yetkilendirme.

## 2. Adım Adım Uygulama Planı

### Faz 1: Baileys Servisinin Hazırlanması (Bağımsız Mikroservis)

Proje kök dizininde `baileys-service` adında bir klasör oluşturulacak ve ayrı bir Node.js projesi gibi yapılandırılacaktır.

1.  **Proje Yapısı Kurulumu**:
    ```text
    zk-next/
    ├── baileys-service/
    │   ├── src/
    │   │   ├── config.ts       # Ayarlar ve Env
    │   │   ├── auth.ts         # Oturum yönetimi (Multi-file auth)
    │   │   ├── whatsapp.ts     # Baileys bağlantı mantığı (Socket yönetimi)
    │   │   ├── routes.ts       # Express route'ları (/send, /status, /qr)
    │   │   └── index.ts        # Server giriş noktası
    │   ├── Dockerfile          # Railway için container yapılandırması
    │   ├── package.json
    │   └── tsconfig.json
    ```

2.  **Temel Bağımlılıklar**:
    *   `@whiskeysockets/baileys`: WhatsApp protokolü.
    *   `express`: API sunucusu.
    *   `qrcode`: Frontend'e QR kod resmi göndermek için.

3.  **Kritik Özellikler**:
    *   **Kalıcı Oturum (Railway Volume)**: Railway'de her deploy'da dosya sistemi sıfırlandığı için, oturum dosyaları (`baileys_auth_info`) kalıcı bir Volume üzerinde tutulmalıdır.
    *   **QR Kod Sunumu**: Admin panelinden QR kodu okutabilmek için `/qr` endpoint'i eklenecek.
    *   **Yeniden Bağlanma Mantığı**: Bağlantı koptuğunda otomatik tekrar deneme.

### Faz 2: Railway Dağıtım Hazırlığı

1.  **Dockerfile Oluşturma**:
    *   Node.js imajı tabanlı, production için optimize edilmiş Dockerfile.
2.  **Railway Config**:
    *   Railway'de bir Volume tanımlanması gerekecek (örn: `/data`). Auth klasörü buraya bağlanacak.

### Faz 3: Next.js (Client) Entegrasyonu

Next.js tarafında bu servisi tüketmek için gerekli altyapı kurulacak.

1.  **Env Değişkenleri**:
    *   `WHATSAPP_SERVICE_URL`: Örn. `https://xxx.railway.app`
    *   `WHATSAPP_API_KEY`: Güvenlik anahtarı.

2.  **Servis Fonksiyonu (`lib/whatsapp.ts`)**:
    *   `sendMessage(phone, text)` fonksiyonu.
    *   `getQR()` fonksiyonu (Admin paneli için).
    *   `getStatus()` fonksiyonu.

3.  **Admin Paneli Yapılandırması**:
    *   Yeni bir sayfa: `/admin/settings/whatsapp`
    *   Burada QR kod gösterilecek ve bağlantı durumu (Bağlı/Bağlı Değil) izlenecek.

### Faz 4: İş Mantığı Entegrasyonu (Kullanım Alanları)

1.  **Tamir Durum Güncellemeleri (`app/actions/repair.ts`)**:
    *   `updateRepairStatus` fonksiyonuna WhatsApp gönderim adımı eklenecek.
    *   Mesaj şablonu: "Sayın Ahmet Y., Cihazınızın durumu 'Test Ediliyor' olarak güncellenmiştir. Detaylar: [Link]"

2.  **Borç Hatırlatma (Alacak Defteri)**:
    *   Borçlular listesine "WhatsApp ile Hatırlat" butonu eklenecek.
    *   Hazır şablon mesaj ile borç bilgisi gönderilecek.

## 3. Güvenlik Notları

*   Baileys servisi public internete açık olacağı için **API Key** koruması zorunludur.
*   WhatsApp, spam/toplu mesaj konusunda hassastır. Mesajlar arasına küçük gecikmeler veya günlük limitler koymak gerekebilir (başlangıç için manuel tetikleme yeterli).

## 4. Başlangıç Komutları (Otomatik Yapılacaklar)

1.  `baileys-service` klasörünü oluştur.
2.  Gerekli paketleri kur (`npm install ...`).
3.  `src` dosyalarını kodla.
4.  Dockerfile'ı hazırla.

Kullanıcı onayı sonrası kodlamaya başlanacaktır.
