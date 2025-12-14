const Firebird = require('node-firebird');

const options = {
    host: 'localhost',
    port: 3050,
    database: 'C:\\AKINSOFT\\Wolvox8\\Database_FB\\01\\2022\\WOLVOX.FDB',
    user: 'SYSDBA',
    password: 'masterkey',
    lowercase_keys: false,
    role: undefined,
    pageSize: 4096,
    retryConnectionInterval: 1000
};

console.log("Listing columns for STOK_BARKOD, STOK_FIYAT...");

Firebird.attach(options, (err, db) => {
    if (err) {
        console.error("CONNECTION ERROR:", err);
        process.exit(1);
    }

    const query = `
        SELECT RDB$RELATION_NAME, RDB$FIELD_NAME
        FROM RDB$RELATION_FIELDS
        WHERE RDB$RELATION_NAME IN ('STOK_BARKOD', 'STOK_FIYAT', 'STOK_DEPO')
        ORDER BY RDB$RELATION_NAME, RDB$FIELD_POSITION
    `;

    db.query(query, (err, result) => {
        db.detach();
        if (err) {
            console.error("QUERY ERROR:", err);
            process.exit(1);
        } else {
            console.log("Found " + result.length + " columns:");
            let currentTable = "";
            result.forEach(row => {
                const tableName = row.RDB$RELATION_NAME.toString().trim();
                const fieldName = row.RDB$FIELD_NAME.toString().trim();

                if (tableName !== currentTable) {
                    console.log("\nTable: " + tableName);
                    currentTable = tableName;
                }
                console.log("- " + fieldName);
            });
            process.exit(0);
        }
    });
});
