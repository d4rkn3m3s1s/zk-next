const https = require('https');

const token = "8448049772:AAGIWmLXzC_FE7idZesejkhDruXNblK1GRY";

const url = `https://api.telegram.org/bot${token}/getMe`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log("Telegram API Response:");
        console.log(JSON.parse(data));
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
