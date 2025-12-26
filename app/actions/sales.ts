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
    const productIdStr = formData.get("productId") as string;
    const quantityStr = formData.get("quantity") as string;

    const productId = productIdStr ? parseInt(productIdStr) : null;
    const quantity = quantityStr ? parseInt(quantityStr) : 1;
    const profit = soldPrice - (costPrice || 0);

    try {
        await prisma.$transaction(async (tx) => {
            // Create the sale
            await tx.sale.create({
                data: {
                    productId,
                    productName,
                    soldPrice,
                    costPrice,
                    profit,
                    quantity
                }
            });

            // Decrement stock if productId is provided
            if (productId) {
                const product = await tx.product.findUnique({
                    where: { id: productId }
                });

                if (product) {
                    await tx.product.update({
                        where: { id: productId },
                        data: {
                            stock: {
                                decrement: quantity
                            }
                        }
                    });
                }
            }
        });

        // Telegram Notification (we'll update this later to respect settings)
        try {
            await sendTelegramMessage(
                `💰 <b>Yeni Satış!</b>\n\n` +
                `🛍️ <b>Ürün:</b> ${productName}\n` +
                `💵 <b>Fiyat:</b> ${soldPrice} TL\n` +
                `📈 <b>Kar:</b> ${profit} TL\n` +
                `📦 <b>Adet:</b> ${quantity}`,
                undefined,
                false,
                'sale'
            );
        } catch (e) {
            console.error("Telegram notification failed:", e);
        }

        revalidatePath("/admin/sales");
        revalidatePath("/admin/products");
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
