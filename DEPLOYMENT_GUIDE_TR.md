# WhatsApp'ı Vercel'de Çalıştırma ve Yayınlama Rehberi

## ÖNEMLİ BİLGİ: Sistem Nasıl Çalışıyor?
Bu proje iki parçadan oluşur:
1. **Web Sitesi (Next.js):** Sitenin ön yüzü ve veritabanı. **Vercel'de çalışır.**
2. **WhatsApp Robotu (Baileys Service):** WhatsApp'a bağlı kalan, mesajları dinleyen robot. **Vercel'de ÇALIŞMAZ.**

Çünkü Vercel "Serverless" (Sunucusuz) bir yapıdır, sürekli açık kalan bağlantıları (WhatsApp gibi) desteklemez. Bu yüzden Robot'u **Railway** gibi bir yere yüklemeniz şarttır.

---

## ADIM 1: Kodları Güncelleme (Çok Önemli)
Benim "zaman damgası" (timestamp) hatası için yaptığım düzeltmeler şuan sadece sizin bilgisayarınızda. Bunların devreye girmesi için:
1. Kodları GitHub'a gönderin (push).
2. Railway (veya kullandığınız servis) bu yeni kodları çekip tekrar kurmalı (redeploy).

## ADIM 2: Railway Ayarları (Robot Tarafı)
Robotun (Railway), mesajları nereye atacağını bilmesi gerekir.
Railway projenizin `Variables` kısmına gidin ve şunları kontrol edin:

*   **WEBHOOK_URL:** `https://sizin-siteniz.vercel.app/api/whatsapp/webhook`
    *   *(Dikkat: `localhost` yazıyorsa çalışmaz! Vercel adresiniz olmalı.)*
*   **API_KEY:** `changeme` (veya belirlediğiniz şifre)

## ADIM 3: Vercel Ayarları (Site Tarafı)
Vercel projenizin `Settings > Environment Variables` kısmında şunlar olmalı:

*   **WHATSAPP_SERVICE_URL:** `https://baileys-production-xxxx.up.railway.app/api`
    *   *(Bu adres Railway'deki robotunuzun adresi olmalı)*
*   **WHATSAPP_API_KEY:** `changeme` (Railway'deki ile AYNI olmalı)

---

## Sorun Giderme Kontrol Listesi
- [ ] Yaptığımız kod düzeltmeleri GitHub'a pushlandı mı?
- [ ] Railway'de "Deployment" (Yükleme) başarıyla bitti mi?
- [ ] Railway loglarında `Opened connection` yazıyor mu?
- [ ] Railway environment variables içinde `WEBHOOK_URL` doğru Vercel adresi mi?

Eğer hala çalışmıyorsa, Railway loglarında "Webhook failed" veya "Sending webhook to..." satırlarını kontrol edin.
