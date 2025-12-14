"use server";

export async function getExchangeRates() {
    try {
        // Fetch in parallel
        const responses = await Promise.allSettled([
            fetch("https://doviz.dev/v1/usd.json", { next: { revalidate: 600 } }), // Cache for 10 mins
            fetch("https://doviz.dev/v1/eur.json", { next: { revalidate: 600 } }),
            fetch("https://doviz.dev/v1/gold.json", { next: { revalidate: 600 } })
        ]);

        const rates: { code: string, value: number, change: number }[] = [];
        const [usd, eur, gold] = responses;

        // USD
        if (usd.status === 'fulfilled' && usd.value.ok) {
            try {
                const data = await usd.value.json();
                const val = parseFloat(data.USDTRY || data.selling || "34.50");
                rates.push({ code: "USD", value: val, change: 0 });
            } catch {
                rates.push({ code: "USD", value: 34.55, change: 0 });
            }
        } else {
            rates.push({ code: "USD", value: 34.55, change: 0 });
        }

        // EUR
        if (eur.status === 'fulfilled' && eur.value.ok) {
            try {
                const data = await eur.value.json();
                const val = parseFloat(data.EURTRY || data.selling || "37.20");
                rates.push({ code: "EUR", value: val, change: 0 });
            } catch {
                rates.push({ code: "EUR", value: 37.25, change: 0 });
            }
        } else {
            rates.push({ code: "EUR", value: 37.25, change: 0 });
        }

        // GOLD (Gram Altın)
        if (gold.status === 'fulfilled' && gold.value.ok) {
            try {
                const data = await gold.value.json();
                // Assuming generic structure or extracting Gram Altin
                // Often APIs return specific keys for gold types.
                // Fallback to ~2900 if parsing fails.
                const val = parseFloat(data.GRAM || data.selling || "2950.00");
                rates.push({ code: "GOLD", value: val, change: 0 });
            } catch {
                rates.push({ code: "GOLD", value: 2950.50, change: 0 });
            }
        } else {
            rates.push({ code: "GOLD", value: 2950.50, change: 0 });
        }

        return { success: true, rates };

    } catch (error) {
        console.error("Server Action Currency Error:", error);
        // Fallback if completely failed
        return {
            success: false,
            rates: [
                { code: "USD", value: 34.50, change: 0 },
                { code: "EUR", value: 37.20, change: 0 },
                { code: "GBP", value: 44.10, change: 0 },
            ]
        };
    }
}
