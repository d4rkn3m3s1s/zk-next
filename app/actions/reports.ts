"use server";

import { prisma } from "@/lib/prisma";
import { startOfDay, subDays, format, startOfWeek, subMonths, startOfMonth } from "date-fns";
import { tr } from "date-fns/locale";

export async function getReportStats() {
    try {
        const today = startOfDay(new Date());
        const lastMonth = subMonths(today, 1);

        // 1. Total Sales vs Profit
        const allSales = await prisma.sale.findMany({
            orderBy: { soldAt: 'asc' }
        });

        const totalRevenue = allSales.reduce((acc: number, curr: any) => acc + Number(curr.soldPrice), 0);
        const totalProfit = allSales.reduce((acc: number, curr: any) => acc + Number(curr.profit || 0), 0);
        const totalSalesCount = allSales.length;

        // NEW: Advanced Metrics
        const averageOrderValue = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;
        const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

        // NEW: Top Products (Best Sellers)
        const productPopularity: Record<string, number> = {};
        allSales.forEach((sale: any) => {
            productPopularity[sale.productName] = (productPopularity[sale.productName] || 0) + 1;
        });
        const topProducts = Object.entries(productPopularity)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        // 2. Data for Line Chart (Last 30 Days)
        const last30Days = await prisma.sale.findMany({
            where: {
                soldAt: {
                    gte: subDays(today, 30)
                }
            },
            orderBy: { soldAt: 'asc' }
        });

        const dailyStats = last30Days.reduce((acc: any, curr: any) => {
            const date = format(new Date(curr.soldAt), 'yyyy-MM-dd');
            if (!acc[date]) {
                acc[date] = { date, revenue: 0, profit: 0, count: 0 };
            }
            acc[date].revenue += Number(curr.soldPrice);
            acc[date].profit += Number(curr.profit || 0);
            acc[date].count += 1;
            return acc;
        }, {});

        // Fill missing days with 0 for smoother charts
        const chartData = [];
        for (let i = 29; i >= 0; i--) {
            const date = format(subDays(today, i), 'yyyy-MM-dd');
            if (dailyStats[date]) {
                chartData.push(dailyStats[date]);
            } else {
                chartData.push({ date, revenue: 0, profit: 0, count: 0 });
            }
        }


        // 3. Category Data (Inferred from Product Name if category not available)
        // Since Sale model doesn't strictly link to Category, we group by Product Name distinctness or basic logic
        const categoryStats = allSales.reduce((acc: any, curr: any) => {
            // Simple logic: first word of product name as category or specific keywords
            const name = curr.productName.toLowerCase();
            let category = 'Diğer';
            if (name.includes('iphone') || name.includes('samsung') || name.includes('xiaomi') || name.includes('telefon')) category = 'Telefon';
            else if (name.includes('kılıf') || name.includes('koruyucu') || name.includes('kapak')) category = 'Aksesuar';
            else if (name.includes('kablo') || name.includes('şarj')) category = 'Şarj Aleti';
            else if (name.includes('kulaklık')) category = 'Ses';
            else category = curr.productName.split(' ')[0]; // Fallback

            if (!acc[category]) {
                acc[category] = 0;
            }
            acc[category] += Number(curr.soldPrice);
            return acc;
        }, {});

        const categoryData = Object.entries(categoryStats)
            .map(([name, value]) => ({ name, value }))
            .sort((a: any, b: any) => b.value - a.value)
            .slice(0, 5); // Top 5 categories



        const insights: { type: 'success' | 'warning' | 'info' | 'danger', title: string, message: string }[] = [];

        // Profit Margin Analysis
        if (profitMargin < 15) {
            insights.push({
                type: 'warning',
                title: 'DÜŞÜK KÂRLILIK UYARISI',
                message: `Mevcut kâr marjı %${profitMargin.toFixed(1)} seviyesinde. Hedeflenen %20'nin altında.`
            });
        } else if (profitMargin > 30) {
            insights.push({
                type: 'success',
                title: 'KÂRLILIK HEDEFİ AŞILDI',
                message: `Tebrikler! %${profitMargin.toFixed(1)} kâr marjı ile hedeflerin üzerindesiniz.`
            });
        } else {
            insights.push({
                type: 'info',
                title: 'SİSTEM DURUMU: NORMAL',
                message: `Kâr marjı %${profitMargin.toFixed(1)} ile beklenen aralıkta seyrediyor.`
            });
        }

        // Sales Trend Analysis (Comparison with previous period - simplified)
        // Ideally needs previous 30 days data
        if (totalRevenue < 5000) { // Arbitrary threshold for example
            insights.push({
                type: 'info',
                title: 'SATIŞ HACMİ ANALİZİ',
                message: 'Henüz yeterli satış verisi oluşmadı. Kampanya oluşturmayı deneyin.'
            });
        }

        // Stock Analysis (Simulated for now, real implementation would query Product model)
        // In a real scenario, we would count products with stock < 5
        const lowStockCount = await prisma.product.count({
            where: { stock: { lte: 3 } }
        });

        if (lowStockCount > 0) {
            insights.push({
                type: 'danger',
                title: 'KRİTİK STOK SEVİYESİ',
                message: `${lowStockCount} adet ürünün stoğu tükenmek üzere. Acil tedarik planlaması önerilir.`
            });
        }

        return {
            success: true,
            totalRevenue,
            totalProfit,
            totalSalesCount,
            averageOrderValue,
            profitMargin,
            topProducts,
            chartData,
            categoryData,
            insights // Return the generated insights
        };

    } catch (error) {
        console.error("Report stats error:", error);
        return { success: false, error: "Rapor verileri alınamadı" };
    }
}

import { sendTelegramMessage } from "@/lib/telegram";

export async function sendDailyReport(targetChatId?: string) {
    try {
        const today = startOfDay(new Date());

        // 1. Sales Today
        const salesToday = await prisma.sale.findMany({
            where: {
                soldAt: { gte: today }
            }
        });
        const salesRevenue = salesToday.reduce((acc, curr) => acc + Number(curr.soldPrice), 0);
        const salesProfit = salesToday.reduce((acc, curr) => acc + Number(curr.profit || 0), 0);

        // 2. Repairs Today
        const repairsToday = await prisma.repair.findMany({
            where: {
                createdAt: { gte: today }
            }
        });
        const completedRepairs = await prisma.repair.findMany({
            where: {
                updatedAt: { gte: today },
                status: 'completed'
            }
        });
        const repairRevenue = completedRepairs.reduce((acc, curr) => acc + Number(curr.estimated_cost || 0), 0);

        // 3. New Debtors/Debt
        const debtTransactions = await prisma.debtorTransaction.findMany({
            where: {
                createdAt: { gte: today },
                type: 'DEBT'
            }
        });
        const totalNewDebt = debtTransactions.reduce((acc, curr) => acc + Number(curr.amount), 0);

        // 4. Low Stock
        const lowStockCount = await prisma.product.count({ where: { stock: { lte: 3 } } });

        const message =
            `📊 <b>GÜNLÜK FİNANSAL RAPOR</b>\n` +
            `📅 <b>Tarih:</b> ${format(new Date(), 'dd.MM.yyyy')}\n\n` +
            `💰 <b>SATIŞLAR</b>\n` +
            `• Adet: ${salesToday.length}\n` +
            `• Ciro: ${salesRevenue.toFixed(2)} TL\n` +
            `• Kâr: ${salesProfit.toFixed(2)} TL\n\n` +
            `🔧 <b>TAMİR & TEKNİK SERVİS</b>\n` +
            `• Yeni Kayıt: ${repairsToday.length}\n` +
            `• Tamamlanan: ${completedRepairs.length}\n` +
            `• Servis Cirosu: ${repairRevenue.toFixed(2)} TL\n\n` +
            `📒 <b>VERESİYE & BORÇLAR</b>\n` +
            `• Yeni Borç: ${totalNewDebt.toFixed(2)} TL\n\n` +
            `📉 <b>STOKDURUMU</b>\n` +
            `• Kritik Stoklu Ürün: ${lowStockCount} adet\n\n` +
            `💵 <b>TOPLAM GÜNLÜK KÂR (Tahmini): ${(salesProfit + repairRevenue * 0.6).toFixed(2)} TL</b>`;
        // Assuming 60% profit on repair revenue for estimation

        await sendTelegramMessage(message, targetChatId);
        return { success: true };

    } catch (e) {
        console.error("Failed to send daily report:", e);
        return { success: false, error: "Rapor gönderilemedi." };
    }
}

export async function sendMonthlyReport(targetChatId?: string) {
    try {
        const today = startOfDay(new Date());
        const monthStart = startOfMonth(today);

        // Monthly Sales
        const monthlySales = await prisma.sale.findMany({
            where: {
                soldAt: { gte: monthStart }
            }
        });
        const monthlyRevenue = monthlySales.reduce((acc, curr) => acc + Number(curr.soldPrice), 0);
        const monthlyProfit = monthlySales.reduce((acc, curr) => acc + Number(curr.profit || 0), 0);
        const profitMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

        // Monthly Repairs
        const monthlyRepairs = await prisma.repair.findMany({
            where: {
                createdAt: { gte: monthStart }
            }
        });
        const completedMonthlyRepairs = monthlyRepairs.filter(r => r.status === 'completed');
        const repairRevenue = completedMonthlyRepairs.reduce((acc, curr) => acc + Number(curr.estimated_cost || 0), 0);

        // Debtor Changes
        const monthlyDebtTransactions = await prisma.debtorTransaction.findMany({
            where: {
                createdAt: { gte: monthStart }
            }
        });
        const newDebts = monthlyDebtTransactions.filter(t => t.type === 'DEBT').reduce((acc, curr) => acc + Number(curr.amount), 0);
        const payments = monthlyDebtTransactions.filter(t => t.type === 'PAYMENT').reduce((acc, curr) => acc + Number(curr.amount), 0);
        const netDebtChange = newDebts - payments;

        const message =
            `📊 <b>AYLIK FİNANSAL RAPOR</b>\n` +
            `📅 <b>Dönem:</b> ${format(monthStart, 'dd MMMM yyyy', { locale: tr })} - ${format(today, 'dd MMMM yyyy', { locale: tr })}\n\n` +
            `💰 <b>SATIŞLAR</b>\n` +
            `├─ Toplam Adet: ${monthlySales.length}\n` +
            `├─ Toplam Ciro: ₺${monthlyRevenue.toFixed(2)}\n` +
            `├─ Toplam Kâr: ₺${monthlyProfit.toFixed(2)}\n` +
            `└─ Kâr Marjı: %${profitMargin.toFixed(1)}\n\n` +
            `🔧 <b>TAMİR & SERVİS</b>\n` +
            `├─ Toplam Kayıt: ${monthlyRepairs.length}\n` +
            `├─ Tamamlanan: ${completedMonthlyRepairs.length}\n` +
            `└─ Servis Geliri: ₺${repairRevenue.toFixed(2)}\n\n` +
            `📒 <b>ALACAK DEFTERİ</b>\n` +
            `├─ Yeni Borçlar: ₺${newDebts.toFixed(2)}\n` +
            `├─ Tahsilatlar: ₺${payments.toFixed(2)}\n` +
            `└─ Net Değişim: ${netDebtChange >= 0 ? '+' : ''}₺${netDebtChange.toFixed(2)}\n\n` +
            `💵 <b>TOPLAM AYLIK KÂR: ₺${(monthlyProfit + repairRevenue * 0.6).toFixed(2)}</b>`;

        await sendTelegramMessage(message, targetChatId);
        return { success: true };

    } catch (e) {
        console.error("Failed to send monthly report:", e);
        return { success: false, error: "Aylık rapor gönderilemedi." };
    }
}

export async function sendDebtorsReport(targetChatId?: string) {
    try {
        const debtors = await prisma.debtor.findMany({
            orderBy: { balance: 'desc' }
        });

        const totalBalance = debtors.reduce((acc, curr) => acc + Number(curr.balance), 0);
        const debtorCount = debtors.filter(d => Number(d.balance) > 0).length;
        const topDebtors = debtors.filter(d => Number(d.balance) > 0).slice(0, 10);

        let debtorList = '';
        topDebtors.forEach((debtor, index) => {
            const balance = Number(debtor.balance);
            debtorList += `${index + 1}. ${debtor.name}\n   ├─ Bakiye: ₺${balance.toFixed(2)}\n   └─ Tel: ${debtor.phone || 'Yok'}\n\n`;
        });

        const message =
            `📒 <b>ALACAK DEFTERİ RAPORU</b>\n` +
            `📅 <b>Tarih:</b> ${format(new Date(), 'dd MMMM yyyy', { locale: tr })}\n\n` +
            `💰 <b>GENEL DURUM</b>\n` +
            `├─ Toplam Alacak: ₺${totalBalance.toFixed(2)}\n` +
            `├─ Borçlu Müşteri: ${debtorCount} kişi\n` +
            `└─ Toplam Kayıt: ${debtors.length}\n\n` +
            `👥 <b>EN YÜKSEK 10 BORÇLU</b>\n\n` +
            (debtorList || '• Borçlu müşteri bulunmuyor.\n\n') +
            `💡 <b>Not:</b> Detaylı bilgi için admin panelini ziyaret edin.`;

        await sendTelegramMessage(message, targetChatId);
        return { success: true };

    } catch (e) {
        console.error("Failed to send debtors report:", e);
        return { success: false, error: "Alacak defteri raporu gönderilemedi." };
    }
}

export async function sendStockReport(targetChatId?: string) {
    try {
        const outOfStock = await prisma.product.findMany({
            where: { stock: 0 }
        });

        const criticalStock = await prisma.product.findMany({
            where: {
                stock: { gte: 1, lte: 3 }
            }
        });

        const lowStock = await prisma.product.findMany({
            where: {
                stock: { gte: 4, lte: 5 }
            }
        });

        let outOfStockList = '';
        outOfStock.slice(0, 5).forEach((product, index) => {
            outOfStockList += `${index + 1}. ${product.name}\n`;
        });

        let criticalList = '';
        criticalStock.slice(0, 5).forEach((product, index) => {
            criticalList += `${index + 1}. ${product.name} (${product.stock} adet)\n`;
        });

        let lowStockList = '';
        lowStock.slice(0, 5).forEach((product, index) => {
            lowStockList += `${index + 1}. ${product.name} (${product.stock} adet)\n`;
        });

        const message =
            `📦 <b>STOK DURUMU RAPORU</b>\n` +
            `📅 <b>Tarih:</b> ${format(new Date(), 'dd MMMM yyyy', { locale: tr })}\n\n` +
            `🚨 <b>TÜKENEN ÜRÜNLER (${outOfStock.length})</b>\n` +
            (outOfStockList || '• Tükenen ürün yok.\n') +
            (outOfStock.length > 5 ? `\n...ve ${outOfStock.length - 5} ürün daha\n` : '') +
            `\n⚠️ <b>KRİTİK STOK (1-3 Adet) (${criticalStock.length})</b>\n` +
            (criticalList || '• Kritik stokta ürün yok.\n') +
            (criticalStock.length > 5 ? `\n...ve ${criticalStock.length - 5} ürün daha\n` : '') +
            `\n📉 <b>DÜŞÜK STOK (4-5 Adet) (${lowStock.length})</b>\n` +
            (lowStockList || '• Düşük stokta ürün yok.\n') +
            (lowStock.length > 5 ? `\n...ve ${lowStock.length - 5} ürün daha\n` : '') +
            `\n💡 <b>Öneri:</b> Kritik ve tükenen ürünler için acil tedarik planlaması yapın.`;

        await sendTelegramMessage(message, targetChatId);
        return { success: true };

    } catch (e) {
        console.error("Failed to send stock report:", e);
        return { success: false, error: "Stok raporu gönderilemedi." };
    }
}

export async function sendRepairsReport(targetChatId?: string) {
    try {
        const today = startOfDay(new Date());

        const pendingRepairs = await prisma.repair.findMany({
            where: { status: 'received' },
            orderBy: { createdAt: 'desc' }
        });

        const inProgressRepairs = await prisma.repair.findMany({
            where: {
                status: { in: ['diagnosing', 'repairing', 'waiting_parts'] }
            },
            orderBy: { createdAt: 'desc' }
        });

        const completedToday = await prisma.repair.findMany({
            where: {
                updatedAt: { gte: today },
                status: 'completed'
            }
        });

        let pendingList = '';
        pendingRepairs.slice(0, 5).forEach((repair, index) => {
            pendingList += `${index + 1}. ${repair.device_model}\n   ├─ Müşteri: ${repair.customer_name}\n   ├─ Sorun: ${repair.issue.substring(0, 30)}...\n   └─ Kod: ${repair.tracking_code}\n\n`;
        });

        let inProgressList = '';
        inProgressRepairs.slice(0, 5).forEach((repair, index) => {
            const statusText = repair.status === 'diagnosing' ? 'Teşhis' :
                repair.status === 'repairing' ? 'Tamir' : 'Parça Bekliyor';
            inProgressList += `${index + 1}. ${repair.device_model} (${statusText})\n   └─ ${repair.customer_name}\n\n`;
        });

        let completedList = '';
        completedToday.slice(0, 5).forEach((repair, index) => {
            completedList += `${index + 1}. ${repair.device_model}\n   └─ ${repair.customer_name}\n\n`;
        });

        const message =
            `🔧 <b>TAMİR DURUMU RAPORU</b>\n` +
            `📅 <b>Tarih:</b> ${format(new Date(), 'dd MMMM yyyy', { locale: tr })}\n\n` +
            `⏳ <b>BEKLEYEN TAMİRLER (${pendingRepairs.length})</b>\n\n` +
            (pendingList || '• Bekleyen tamir yok.\n\n') +
            (pendingRepairs.length > 5 ? `...ve ${pendingRepairs.length - 5} tamir daha\n\n` : '') +
            `🔨 <b>DEVAM EDEN TAMİRLER (${inProgressRepairs.length})</b>\n\n` +
            (inProgressList || '• Devam eden tamir yok.\n\n') +
            (inProgressRepairs.length > 5 ? `...ve ${inProgressRepairs.length - 5} tamir daha\n\n` : '') +
            `✅ <b>BUGÜN TAMAMLANAN (${completedToday.length})</b>\n\n` +
            (completedList || '• Bugün tamamlanan tamir yok.\n\n') +
            `💡 <b>Toplam Aktif Tamir:</b> ${pendingRepairs.length + inProgressRepairs.length}`;

        await sendTelegramMessage(message, targetChatId);
        return { success: true };

    } catch (e) {
        console.error("Failed to send repairs report:", e);
        return { success: false, error: "Tamir raporu gönderilemedi." };
    }
}

export async function sendSalesReport(targetChatId?: string) {
    try {
        const today = startOfDay(new Date());

        const salesToday = await prisma.sale.findMany({
            where: {
                soldAt: { gte: today }
            },
            orderBy: { soldAt: 'desc' }
        });

        const totalRevenue = salesToday.reduce((acc, curr) => acc + Number(curr.soldPrice), 0);
        const totalProfit = salesToday.reduce((acc, curr) => acc + Number(curr.profit || 0), 0);
        const avgSaleValue = salesToday.length > 0 ? totalRevenue / salesToday.length : 0;

        let salesList = '';
        salesToday.forEach((sale, index) => {
            const time = format(new Date(sale.soldAt), 'HH:mm');
            salesList += `${index + 1}. ${sale.productName}\n   ├─ Fiyat: ₺${Number(sale.soldPrice).toFixed(2)}\n   ├─ Kâr: ₺${Number(sale.profit || 0).toFixed(2)}\n   └─ Saat: ${time}\n\n`;
        });

        const message =
            `💰 <b>GÜNLÜK SATIŞ RAPORU</b>\n` +
            `📅 <b>Tarih:</b> ${format(new Date(), 'dd MMMM yyyy', { locale: tr })}\n\n` +
            `📊 <b>ÖZET</b>\n` +
            `├─ Toplam Satış: ${salesToday.length} adet\n` +
            `├─ Toplam Ciro: ₺${totalRevenue.toFixed(2)}\n` +
            `├─ Toplam Kâr: ₺${totalProfit.toFixed(2)}\n` +
            `└─ Ortalama Satış: ₺${avgSaleValue.toFixed(2)}\n\n` +
            `🛍️ <b>SATIŞ DETAYLARI</b>\n\n` +
            (salesList || '• Bugün henüz satış yapılmadı.\n\n') +
            `💡 <b>Performans:</b> ${salesToday.length >= 10 ? 'Mükemmel! 🎉' : salesToday.length >= 5 ? 'İyi gidiyor! 👍' : 'Daha fazla satış için çaba gösterin! 💪'}`;

        await sendTelegramMessage(message, targetChatId);
        return { success: true };

    } catch (e) {
        console.error("Failed to send sales report:", e);
        return { success: false, error: "Satış raporu gönderilemedi." };
    }
}
