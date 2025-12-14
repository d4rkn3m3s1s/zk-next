require('dotenv').config();
const Firebird = require('node-firebird');

const options = {
    host: process.env.FIREBIRD_HOST,
    port: Number(process.env.FIREBIRD_PORT),
    database: process.env.FIREBIRD_DATABASE,
    user: process.env.FIREBIRD_USER,
    password: process.env.FIREBIRD_PASSWORD,
    lowercase_keys: false,
    role: undefined,
    pageSize: 4096,
    retryConnectionInterval: 1000
};

console.log("Testing product query...");

Firebird.attach(options, (err, db) => {
    if (err) {
        console.error("CONNECTION ERROR:", err);
        process.exit(1);
    }

    // 1. Get a barcode
    db.query('SELECT FIRST 1 BARKODU FROM STOK WHERE BARKODU IS NOT NULL AND BARKODU <> \'\'', (err, result) => {
        if (err || !result.length) {
            console.error("Could not find a barcode for testing.");
            db.detach();
            process.exit(1);
        }

        const barcode = result[0].BARKODU.toString().trim();
        console.log("Testing with barcode: " + barcode);

        // 2. Run the complex query
        const query = `
            SELECT 
                S.STOK_ADI, 
                (SELECT FIRST 1 F.FIYATI FROM STOK_FIYAT F WHERE F.BLSTKODU = S.BLKODU AND F.FIYAT_NO = 1 AND F.ALIS_SATIS = 2) as SATIS_FIYATI,
                (SELECT COALESCE(SUM(H.KPB_GMIK - H.KPB_CMIK), 0) FROM STOKHR H WHERE H.BLSTKODU = S.BLKODU) as BAKIYE
            FROM STOK S
            WHERE S.BARKODU = ? 
               OR EXISTS (SELECT 1 FROM STOK_BARKOD B WHERE B.BLSTKODU = S.BLKODU AND B.BARKODU = ?)
        `;

        db.query(query, [barcode, barcode], (err, productResult) => {
            db.detach();
            if (err) {
                console.error("QUERY ERROR:", err);
                process.exit(1);
            }

            console.log("Query Results:", productResult);
            process.exit(0);
        });
    });
});
