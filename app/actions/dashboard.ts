'use server'

import { prisma } from "@/lib/prisma"

export async function getDashboardStats() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

        // Fetch Data in Parallel
        const [
            // 1. Sales for Profit & Revenue (This Month & Last Month)
            salesThisMonth,
            salesLastMonth,
            allSalesProfit, // Total Lifetime Profit if needed? Or just this month? Usually Total for card.
            // Other Stats - Keep using Order/Repair counts as they track workflow, not just ledger
            activeOrdersCount,
            pendingRepairsCount,
            todayAppointmentsCount,
            totalStockAgg,
            lowStockProducts,
            recentRepairs,
            todayAppointments,
            unreadMessages
        ] = await Promise.all([
            prisma.sale.findMany({
                where: { soldAt: { gte: startOfMonth } }
            }),
            prisma.sale.findMany({
                where: { soldAt: { gte: startOfLastMonth, lte: endOfLastMonth } }
            }),
            prisma.sale.aggregate({ _sum: { profit: true, soldPrice: true } }),

            prisma.order.count({ where: { status: { in: ['Processing', 'Shipped', 'Delivered'] } } }),
            prisma.repair.count({ where: { status: { not: 'completed' } } }),
            prisma.appointment.count({ where: { date: { gte: today, lt: tomorrow } } }),
            prisma.product.aggregate({ _sum: { stock: true } }),
            prisma.product.findMany({ where: { stock: { lt: 3 } }, take: 5, orderBy: { stock: 'asc' }, select: { id: true, name: true, stock: true, images: true } }),
            prisma.repair.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, device_model: true, issue: true, status: true, customer_name: true } }),
            prisma.appointment.findMany({ where: { date: { gte: today, lt: tomorrow } }, orderBy: { time: 'asc' } }),
            prisma.message.findMany({ where: { is_read: false }, take: 5, orderBy: { createdAt: 'desc' } })
        ]);

        // Helper to sum fields
        const sumProfit = (sales: any[]) => sales.reduce((acc, curr) => acc + Number(curr.profit || 0), 0);
        //const sumRevenue = (sales: any[]) => sales.reduce((acc, curr) => acc + Number(curr.soldPrice || 0), 0);

        // Calculate Trends (This Month vs Last Month)
        const profitThisMonth = sumProfit(salesThisMonth);
        const profitLastMonth = sumProfit(salesLastMonth);

        const calculateTrend = (current: number, previous: number) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        const profitTrend = calculateTrend(profitThisMonth, profitLastMonth);

        // 7-day Sales Chart Data directly from Sale table
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const last7DaysSalesRaw = await prisma.sale.findMany({
            where: {
                soldAt: { gte: sevenDaysAgo }
            },
            orderBy: { soldAt: 'asc' }
        });

        // Group by Date for Chart
        const salesMap: Record<string, number> = {};
        last7DaysSalesRaw.forEach((sale: any) => {
            const date = sale.soldAt.toISOString().split('T')[0];
            // Chart shows Profit or Revenue? User said "karlılık defterinden çek karı". 
            // Usually charts show Sales Volume (Revenue). But maybe they want Profit Chart?
            // "Günlük Satış Grafiği" usually means Sales amount. 
            // But user said "karlılık defterinden cek karı" (fetch profit from profitability ledger).
            // It's ambiguous if they mean fetch profit FOR THE TOTAL CARD or for the CHART too.
            // Given "Günlük Satış Grafiği" (Daily Sales Chart), I will start with Revenue (soldPrice).
            // If they want Profit Chart, they will say.
            salesMap[date] = (salesMap[date] || 0) + Number(sale.soldPrice);
        });

        const last7DaysSales = Object.entries(salesMap)
            .map(([date, amount]) => ({ date, amount }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return {
            totalRevenue: Number(allSalesProfit._sum.soldPrice) || 0, // Total Revenue from Sales Ledger
            totalProfit: Number(allSalesProfit._sum.profit) || 0,     // Total Profit from Sales Ledger
            revenueTrend: 0, // Not calculating revenue trend strictly now, or use same logic as profit
            profitTrend,
            activeOrdersCount,
            pendingRepairsCount,
            todayAppointmentsCount,
            totalStock: totalStockAgg._sum.stock || 0,
            activeUsersCount: 0,
            last7DaysSales,
            dbStatus: true,
            lowStockProducts,
            recentRepairs,
            todayAppointments,
            unreadMessages
        }

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return {
            totalRevenue: 0,
            totalProfit: 0,
            revenueTrend: 0,
            profitTrend: 0,
            activeOrdersCount: 0,
            pendingRepairsCount: 0,
            todayAppointmentsCount: 0,
            totalStock: 0,
            activeUsersCount: 0,
            last7DaysSales: [],
            dbStatus: false,
            lowStockProducts: [],
            recentRepairs: [],
            todayAppointments: [],
            unreadMessages: []
        };
    }
}
