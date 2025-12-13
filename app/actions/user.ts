'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getUsers(options?: { query?: string, role?: string, isActive?: boolean }) {
    const { query, role, isActive } = options || {}

    const where: any = {}

    if (query) {
        where.OR = [
            { username: { contains: query } },
            { email: { contains: query } }
        ]
    }

    if (role) {
        where.role = role
    }

    if (isActive !== undefined) {
        where.isActive = isActive
    }

    const users = await prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            orders: true
        }
    })
    return users
}

export async function getUser(id: number) {
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            orders: true
        }
    })
    return user
}

export async function updateUserRole(id: number, role: string) {
    await prisma.user.update({
        where: { id },
        data: { role }
    })
    revalidatePath("/admin/users")
    revalidatePath(`/admin/users/${id}`)
}

export async function bulkDeleteUsers(ids: number[]) {
    await prisma.user.deleteMany({
        where: {
            id: {
                in: ids
            }
        }
    })
    revalidatePath("/admin/users")
}

export async function bulkUpdateUserStatus(ids: number[], isActive: boolean) {
    await prisma.user.updateMany({
        where: {
            id: {
                in: ids
            }
        },
        data: {
            isActive
        }
    })
    revalidatePath("/admin/users")
}
