'use server'

import { prisma } from "@/lib/prisma"

export async function getDashboardStats() {
    // 1. Order Revenue
    const orderRevenueAggregation = await prisma.order.aggregate({
        _sum: {
            totalAmount: true
        },
        where: {
            status: {
                not: 'Cancelled'
            }
        }
    })
    const orderRevenue = Number(orderRevenueAggregation._sum.totalAmount || 0)

    // 1b. Sales Ledger Revenue (New)
    let salesRevenue = 0;
    try {
        if ((prisma as any).sale) {
            const saleAggregation = await prisma.sale.aggregate({
                _sum: {
                    soldPrice: true
                }
            })
            salesRevenue = Number(saleAggregation._sum.soldPrice || 0)
        }
    } catch (e) {
        console.error("Failed to aggregate sales:", e);
    }

    const totalRevenue = orderRevenue + salesRevenue

    // 2. Active Orders (Processing or Shipped)
    const activeOrdersCount = await prisma.order.count({
        where: {
            status: {
                in: ['Processing', 'Shipped']
            }
        }
    })

    // 3. Pending Repairs (received or diagnosing)
    // Looking at Repair model status default is 'received'.
    const pendingRepairsCount = await prisma.repair.count({
        where: {
            status: {
                not: 'completed' // Assuming 'completed' is the done state. 
                // Previous code check: status is String. 
            }
        }
    })

    // 4. Today's Appointments
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayAppointmentsCount = await prisma.appointment.count({
        where: {
            date: {
                gte: today,
                lt: tomorrow
            }
        }
    })

    // 5. Total Stock
    const totalStockAggregation = await prisma.product.aggregate({
        _sum: {
            stock: true
        }
    })
    const totalStock = totalStockAggregation._sum.stock || 0

    // 6. Active Users
    const activeUsersCount = await prisma.user.count({
        where: {
            isActive: true
        }
    })

    // 7. Recent Orders (Last 5)
    try {
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            }
        })

        return {
            totalRevenue: Number(totalRevenue),
            activeOrdersCount,
            pendingRepairsCount,
            todayAppointmentsCount,
            totalStock,
            activeUsersCount,
            recentOrders,
            dbStatus: true
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
            recentOrders: [],
            dbStatus: false
        }
    }
}
