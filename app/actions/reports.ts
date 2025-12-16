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


        return {
            success: true,
            totalRevenue,
            totalProfit,
            totalSalesCount,
            averageOrderValue,
            profitMargin,
            topProducts,
            chartData,
            categoryData
        };

    } catch (error) {
        console.error("Report stats error:", error);
        return { success: false, error: "Rapor verileri alınamadı" };
    }
}
