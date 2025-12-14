import Firebird from 'node-firebird';

const options: Firebird.Options = {
    host: process.env.FIREBIRD_HOST || 'localhost',
    port: Number(process.env.FIREBIRD_PORT) || 3050,
    database: process.env.FIREBIRD_DATABASE || 'C:\\AKINSOFT\\Wolvox8\\Database_FB\\01\\2022\\WOLVOX.FDB',
    user: process.env.FIREBIRD_USER || 'SYSDBA',
    password: process.env.FIREBIRD_PASSWORD || 'masterkey',
    lowercase_keys: false,
    role: undefined,
    pageSize: 4096,
    retryConnectionInterval: 1000
};

export const queryWolvox = async (query: string, params: any[] = []) => {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error("Veritabanı bağlantısı zaman aşımına uğradı (5 saniye). Güvenlik duvarını kontrol edin."));
        }, 5000);

        Firebird.attach(options, (err, db) => {
            clearTimeout(timeout);
            if (err) {
                console.error("Firebird Error:", err);
                reject(err);
                return;
            }

            db.query(query, params, (err, result) => {
                db.detach();
                if (err) {
                    console.error("Query Error:", err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    });
};
