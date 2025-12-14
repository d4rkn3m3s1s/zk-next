"use server";

import { queryWolvox } from "@/lib/firebird";

export async function getWolvoxProduct(barcode: string) {
    if (!barcode) return { success: false, error: "Barkod boş olamaz" };

    try {
        // Note: Field names might vary. Common Wolvox fields: STOK_KODU, STOK_ADI, BARKODU, SATIS_FIYAT1, BAKIYE
        // We use '?' for parameters in node-firebird (or depends on driver, usually ?)
        const query = `
            SELECT 
                S.STOK_ADI, 
                (SELECT FIRST 1 F.FIYATI FROM STOK_FIYAT F WHERE F.BLSTKODU = S.BLKODU AND F.FIYAT_NO = 1 AND F.ALIS_SATIS = 2) as SATIS_FIYATI,
                (SELECT COALESCE(SUM(H.KPB_GMIK - H.KPB_CMIK), 0) FROM STOKHR H WHERE H.BLSTKODU = S.BLKODU) as BAKIYE
            FROM STOK S
            WHERE S.BARKODU = ? 
               OR EXISTS (SELECT 1 FROM STOK_BARKOD B WHERE B.BLSTKODU = S.BLKODU AND B.BARKODU = ?)
        `;

        // node-firebird uses params array. We need to pass barcode twice because of the two ? placeholders
        const results: any = await queryWolvox(query, [barcode, barcode]);

        if (results && results.length > 0) {
            const product = results[0];

            return {
                success: true,
                product: {
                    name: product.STOK_ADI,
                    price: product.SATIS_FIYATI || 0,
                    stock: product.BAKIYE || 0
                }
            };
        } else {
            return { success: false, error: "Ürün bulunamadı" };
        }
    } catch (error: any) {
        console.error("Wolvox Fetch Error:", error);
        return { success: false, error: "Veritabanı hatası: " + error.message };
    }
}
