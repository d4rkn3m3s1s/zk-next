"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendTelegramMessage } from "@/lib/telegram";

export async function getSales() {
    try {
        const sales = await prisma.sale.findMany({
            orderBy: {
                soldAt: 'desc'
            }
        });

        // Convert Decimals to numbers for client components
        const serializedSales = sales.map((sale: any) => ({
            ...sale,
            soldPrice: Number(sale.soldPrice),
            costPrice: Number(sale.costPrice),
            profit: Number(sale.profit)
        }));

        return { success: true, sales: serializedSales };
    } catch (error) {
        console.error("Failed to fetch sales:", error);
        return { success: false, sales: [] };
    }
}

export async function createSale(formData: FormData) {
    const productName = formData.get("productName") as string;
    const soldPrice = parseFloat(formData.get("soldPrice") as string);
    const costPrice = parseFloat(formData.get("costPrice") as string);
    const profit = soldPrice - costPrice;

    try {
        await prisma.sale.create({
            data: {
                productName,
                soldPrice,
                costPrice,
                profit
            }
        });



        // Telegram Notification
        try {
            await sendTelegramMessage(
                `💰 <b>New Sale Recorded!</b>\n\n` +
                `🛍️ <b>Product:</b> ${productName}\n` +
                `💵 <b>Price:</b> ${soldPrice} TL\n` +
                `📈 <b>Profit:</b> ${profit} TL`
            );
        } catch (e) {
            console.error("Telegram notification failed:", e);
        }

        revalidatePath("/admin/sales");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to create sale:", error);
        return { success: false, error: error.message || "Satış eklenirken bir hata oluştu." };
    }
}

export async function deleteSale(id: number) {
    try {
        await prisma.sale.delete({
            where: { id }
        });
        revalidatePath("/admin/sales");
        return { success: true };
    } catch (error) {
        console.error("Delete sale error:", error);
        return { success: false, error: "Silme işlemi başarısız." };
    }
}

export async function updateSale(id: number, data: any) {
    try {
        const profit = parseFloat(data.soldPrice) - parseFloat(data.costPrice);
        await prisma.sale.update({
            where: { id },
            data: {
                productName: data.productName,
                soldPrice: parseFloat(data.soldPrice),
                costPrice: parseFloat(data.costPrice),
                profit
            }
        });
        revalidatePath("/admin/sales");
        return { success: true };
    } catch (error) {
        console.error("Update sale error:", error);
        return { success: false, error: "Güncelleme başarısız." };
    }
}
