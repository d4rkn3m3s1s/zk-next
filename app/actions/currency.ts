"use server";

export async function getExchangeRates() {
    try {
        const responses = await Promise.allSettled([
            fetch("https://doviz.dev/v1/usd.json", { next: { revalidate: 0 } }),
            fetch("https://doviz.dev/v1/eur.json", { next: { revalidate: 0 } }),
            fetch("https://doviz.dev/v1/gram-altin.json", { next: { revalidate: 0 } })
        ]);

        const rates: { code: string, value: number, change: number }[] = [];
        const [usd, eur, gold] = responses;

        const parseRate = async (response: PromiseSettledResult<Response>, code: string, fallback: number) => {
            if (response.status === 'fulfilled' && response.value.ok) {
                try {
                    const data = await response.value.json();
                    const val = parseFloat(data.selling || data.EURTRY || data.USDTRY || fallback.toString());
                    if (isNaN(val)) return { code, value: fallback, change: 0 };
                    return { code, value: val, change: parseFloat(data.change_rate || "0") };
                } catch (e) {
                    console.error(`Error parsing ${code}:`, e);
                    return { code, value: fallback, change: 0 };
                }
            }
            return { code, value: fallback, change: 0 };
        };

        rates.push(await parseRate(usd, "USD", 35.80));
        rates.push(await parseRate(eur, "EUR", 38.20));
        rates.push(await parseRate(gold, "GOLD", 3250.00));

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
