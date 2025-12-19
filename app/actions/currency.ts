"use server";

export async function getExchangeRates() {
    try {
        const response = await fetch("https://finans.truncgil.com/today.json", {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) throw new Error("API response not ok");

        const data = await response.json();

        const parseValue = (val: string) => {
            if (!val) return 0;
            // Remove thousand separator if any, and replace decimal comma with dot
            return parseFloat(val.replace(/\./g, '').replace(',', '.'));
        };

        const rates = [
            {
                code: "USD",
                value: parseValue(data.USD?.Satış),
                change: parseFloat(data.USD?.Değişim?.replace('%', '').replace(',', '.') || "0")
            },
            {
                code: "EUR",
                value: parseValue(data.EUR?.Satış),
                change: parseFloat(data.EUR?.Değişim?.replace('%', '').replace(',', '.') || "0")
            },
            {
                code: "GOLD",
                value: parseValue(data["gram-altin"]?.Satış),
                change: parseFloat(data["gram-altin"]?.Değişim?.replace('%', '').replace(',', '.') || "0")
            }
        ];

        return { success: true, rates };

    } catch (error) {
        console.error("Server Action Currency Error:", error);
        return {
            success: true,
            rates: [
                { code: "USD", value: 35.80, change: 0 },
                { code: "EUR", value: 38.20, change: 0 },
                { code: "GOLD", value: 3250.00, change: 0 },
            ]
        };
    }
}
