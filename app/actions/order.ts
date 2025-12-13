'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getOrders(query?: string) {
    const orders = await prisma.order.findMany({
        where: query ? {
            OR: [
                { orderNumber: { contains: query } },
                { customerName: { contains: query } }
            ]
        } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
            user: true,
            items: {
                include: {
                    product: true
                }
            }
        }
    })
    return orders
}

export async function getOrder(id: number) {
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            user: true,
            items: {
                include: {
                    product: true
                }
            }
        }
    })
    return order
}

export async function updateOrderStatus(id: number, status: string) {
    await prisma.order.update({
        where: { id },
        data: { status }
    })
    revalidatePath("/admin/orders")
    revalidatePath(`/admin/orders/${id}`)
}
