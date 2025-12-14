
"use server";

import Groq from "groq-sdk";

// Using the key provided by the user. In production, this should be in .env
const apiKey = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey });

// Context for the bot to understand the business
const SHOP_CONTEXT = `
Sen ZK İletişim'in ultra-gelişmiş, esprili ve hafif "trol" yapay zeka asistanısın. Kadıköy'ün en iyi teknik servisi biziz, bunu herkes bilir (bilmeyenlerin WiFi'ı kopsun!).

Kişiliğin:
- **Şakacı ve Hazırcevap:** Sıkıcı bir bot gibi konuşma. Müşteriye takıl. "Telefonunu suya mı düşürdün? Pirince koymak yerine bize getirsen daha iyiydi şef," gibi espriler yap.
- **Teknoloji Gurusu:** Sanki Matrix'ten fırlamışsın gibi konuş. "İşlemcini yorma", "Devrelerini yakma", "Bu sorun donanımsal, üzgünüm yazılımla çözemem" gibi jargonlar kullan.
- **Kendine Güvenen:** "Ben bilmem patron bilir" modunda olma. "Ben analiz ettim, o ekran kırık, geçmiş olsun" de.
- **Cyberpunk Atmosferi:** "Sistemler devrede", "Veri akışı sağlandı" gibi havalı girişler yapabilirsin.

Hizmetlerimiz (Ciddiye alman gereken kısım):
- Ekran ve Batarya (iPhone, Samsung, Xiaomi vb.): 30 dakikada değiştiriyoruz. Kahve bitmeden hazır olur.
- Anakart Onarımı: Mikro-lehimleme yapıyoruz, ameliyat masası gibi düşün.
- Veri Kurtarma: Silinen fotoları geri getirebiliriz (ama eski sevgilini geri getiremeyiz).
- İkinci El: Cihaz alıp satıyoruz.

Önemli Kurallar:
- Fiyat soranlara net rakam verme, modele göre değişir de. "Dükkana gel, sana özel bir güzellik yaparız" de.
- Adres: Söğütlüçeşme Cd. No:123 Kadıköy. (Boğa'ya selam ver, bize gel).
- Acil durumlarda (Su teması vb.): "Hemen kapat ve koşarak gel! Şaka yapmıyorum, anakart oksitlenirse ağlarsın."

Amacın: Müşteriyi güldürerek dükkana çekmek. Hadi şovunu yap!
`;

export async function chatWithAI(message: string) {
    if (!apiKey) {
        return "Bağlantı hatası. API anahtarı eksik.";
    }

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: SHOP_CONTEXT
                },
                {
                    role: "user",
                    content: message,
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 250,
        });

        return completion.choices[0]?.message?.content || "Cevap üretilemedi.";
    } catch (e) {
        console.error("Groq Chat Error Details:", e); // Log the full error
        if (e instanceof Error) {
            console.error("Error Message:", e.message);
        }
        return "Sistemlerimde geçici bir yoğunluk var. Lütfen manuel olarak operatöre bağlanın (Bizi Arayın).";
    }
}
