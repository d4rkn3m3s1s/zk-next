'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getProducts(options?: {
    query?: string
    isFeatured?: boolean
    category?: string
    brand?: string
    status?: string
    minPrice?: number
    maxPrice?: number
    sort?: string
    limit?: number
    page?: number
    isSecondHand?: boolean // Added
}) {
    const { query, isFeatured, category, brand, status, minPrice, maxPrice, sort, limit, page = 1, isSecondHand } = options || {}
    const take = limit || 12
    const skip = (page - 1) * take

    const where: any = {}

    if (query) {
        where.OR = [
            { name: { contains: query } },
            { description: { contains: query } }
        ]
    }

    // Filter by Second Hand status
    if (isSecondHand) {
        where.isNew = false
    }

    if (isFeatured !== undefined) {
        where.isFeatured = isFeatured
    }

    if (category) {
        where.category = category
    }

    if (brand) {
        where.brand = brand
    }

    if (status) {
        where.status = status
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {}
        if (minPrice !== undefined) where.price.gte = minPrice
        if (maxPrice !== undefined) where.price.lte = maxPrice
    }

    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'price-asc') orderBy = { price: 'asc' }
    if (sort === 'price-desc') orderBy = { price: 'desc' }
    if (sort === 'oldest') orderBy = { createdAt: 'asc' }

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy,
            take,
            skip
        }),
        prisma.product.count({ where })
    ])

    return { products, total, totalPages: Math.ceil(total / take) }
}

export async function getProduct(id: number) {
    const product = await prisma.product.findUnique({
        where: { id }
    })
    return product
}

export async function createProduct(formData: FormData) {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = parseFloat(formData.get("price") as string)
    const comparePrice = formData.get("comparePrice") ? parseFloat(formData.get("comparePrice") as string) : null
    const cost = formData.get("cost") ? parseFloat(formData.get("cost") as string) : null
    const stock = parseInt(formData.get("stock") as string)
    const category = formData.get("category") as string
    const brand = formData.get("brand") as string
    const status = formData.get("status") as string
    const isFeatured = formData.get("isFeatured") === "on"
    const isNew = formData.get("isNew") === "on"
    const images = formData.get("images") as string // JSON string

    await prisma.product.create({
        data: {
            name,
            description,
            price,
            comparePrice,
            cost,
            stock,
            category,
            brand,
            status,
            isFeatured,
            isNew,
            images,
            batteryHealth: formData.get("batteryHealth") ? parseInt(formData.get("batteryHealth") as string) : null,
            warranty: formData.get("warranty") as string,
            condition: formData.get("condition") as string
        }
    })

    revalidatePath("/admin/products")
    redirect("/admin/products")
}

export async function updateProduct(id: number, formData: FormData) {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = parseFloat(formData.get("price") as string)
    const comparePrice = formData.get("comparePrice") ? parseFloat(formData.get("comparePrice") as string) : null
    const cost = formData.get("cost") ? parseFloat(formData.get("cost") as string) : null
    const stock = parseInt(formData.get("stock") as string)
    const category = formData.get("category") as string
    const brand = formData.get("brand") as string
    const status = formData.get("status") as string
    const isFeatured = formData.get("isFeatured") === "on"
    const isNew = formData.get("isNew") === "on"
    const images = formData.get("images") as string

    await prisma.product.update({
        where: { id },
        data: {
            name,
            description,
            price,
            comparePrice,
            cost,
            stock,
            category,
            brand,
            status,
            isFeatured,
            isNew,
            images
        }
    })

    revalidatePath("/admin/products")
    revalidatePath(`/admin/products/${id}`)
    redirect("/admin/products")
}

export async function deleteProduct(id: number) {
    await prisma.product.delete({
        where: { id }
    })
    revalidatePath("/admin/products")
}

export async function bulkDeleteProducts(ids: number[]) {
    await prisma.product.deleteMany({
        where: {
            id: {
                in: ids
            }
        }
    })
    revalidatePath("/admin/products")
}

export async function bulkUpdateProductStatus(ids: number[], status: string) {
    await prisma.product.updateMany({
        where: {
            id: {
                in: ids
            }
        },
        data: {
            status
        }
    })
    revalidatePath("/admin/products")
}
