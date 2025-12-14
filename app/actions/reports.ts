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

        const totalRevenue = allSales.reduce((acc, curr) => acc + Number(curr.soldPrice), 0);
        const totalProfit = allSales.reduce((acc, curr) => acc + Number(curr.profit || 0), 0);
        const totalSalesCount = allSales.length;

        // 2. Data for Line Chart (Last 30 Days)
        const last30Days = await prisma.sale.findMany({
            where: {
                soldAt: {
                    gte: subDays(today, 30)
                }
            },
            orderBy: { soldAt: 'asc' }
        });

        const dailyStats = last30Days.reduce((acc: any, curr) => {
            const date = format(new Date(curr.soldAt), 'yyyy-MM-dd');
            if (!acc[date]) {
                acc[date] = { date, revenue: 0, profit: 0, count: 0 };
            }
            acc[date].revenue += Number(curr.soldPrice);
            acc[date].profit += Number(curr.profit || 0);
            acc[date].count += 1;
            return acc;
        }, {});

        const chartData = Object.values(dailyStats).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());


        // 3. Category Data (Inferred from Product Name if category not available)
        // Since Sale model doesn't strictly link to Category, we group by Product Name distinctness or basic logic
        const categoryStats = allSales.reduce((acc: any, curr) => {
            // Simple logic: first word of product name as category
            const category = curr.productName.split(' ')[0] || 'Diğer';
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
            chartData,
            categoryData
        };

    } catch (error) {
        console.error("Report stats error:", error);
        return { success: false, error: "Rapor verileri alınamadı" };
    }
}
