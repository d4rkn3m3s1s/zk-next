const https = require('https');
const token = process.env.TELEGRAM_BOT_TOKEN || "8448049772:AAGIWmLXzC_FE7idZesejkhDruXNblK1GRY";

const url = `https://api.telegram.org/bot${token}/getWebhookInfo`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log(data);
    });
}).on('error', (err) => {
    console.error(err);
});
