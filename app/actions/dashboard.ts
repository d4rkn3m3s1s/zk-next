'use server'

import { prisma } from "@/lib/prisma"

export async function getDashboardStats() {
    try {
        // 0. Date Bounds for "Today"
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        // Parallelize all queries for performance
        const [
            orderRevAgg,
            activeOrdersCount,
            pendingRepairsCount,
            todayAppointmentsCount,
            activeUsersCount,
            totalStockAgg,
            lowStockProducts,
            recentRepairs,
            todayAppointments,
            unreadMessages
        ] = await Promise.all([
            // 1. Order Revenue
            prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: { not: 'Cancelled' } } }),

            // 2. Active Orders
            prisma.order.count({ where: { status: { in: ['Processing', 'Shipped'] } } }),
            // 3. Pending Repairs
            prisma.repair.count({ where: { status: { not: 'completed' } } }),
            // 4. Today Apt Count
            prisma.appointment.count({ where: { date: { gte: today, lt: tomorrow } } }),
            // 6. Active Users
            prisma.user.count({ where: { isActive: true } }),
            // 5. Total Stock
            prisma.product.aggregate({ _sum: { stock: true } }),

            // 9. NEW: Low Stock Products (<3)
            prisma.product.findMany({
                where: { stock: { lt: 3 } },
                take: 5,
                orderBy: { stock: 'asc' },
                select: { id: true, name: true, stock: true, images: true }
            }),
            // 10. NEW: Recent Repairs (Last 5)
            prisma.repair.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, device_model: true, issue: true, status: true, customer_name: true }
            }),
            // 11. NEW: Today's Appointments Details
            prisma.appointment.findMany({
                where: { date: { gte: today, lt: tomorrow } },
                orderBy: { time: 'asc' }
            }),
            // 12. NEW: Unread Messages
            prisma.message.findMany({
                where: { is_read: false },
                take: 5,
                orderBy: { createdAt: 'desc' }
            })
        ])

        // Process aggregated numbers
        const totalRevenue = Number(orderRevAgg._sum.totalAmount) || 0
        const totalStock = totalStockAgg._sum.stock || 0

        // Process Chart Data (Using Sale model from Profitability Ledger)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const last7DaysSalesRaw = await prisma.sale.findMany({
            where: {
                soldAt: { gte: sevenDaysAgo }
            },
            orderBy: { soldAt: 'asc' }
        });

        const last7DaysSalesMap = last7DaysSalesRaw.reduce((acc: Record<string, number>, curr) => {
            const date = curr.soldAt.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + Number(curr.soldPrice);
            return acc;
        }, {});

        const last7DaysSales = Object.entries(last7DaysSalesMap).map(([date, amount]) => ({ date, amount }));

        return {
            totalRevenue,
            activeOrdersCount,
            pendingRepairsCount,
            todayAppointmentsCount,
            totalStock,
            activeUsersCount,
            last7DaysSales,
            dbStatus: true,
            // New Data
            lowStockProducts,
            recentRepairs,
            todayAppointments,
            unreadMessages
        }
    } catch (error) {
        console.error("Dashboard Stats Error:", error)
        return {
            totalRevenue: 0,
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
        }
    }
}
