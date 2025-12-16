'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export type ImportProductData = {
    name: string
    description?: string // Specs can go here?
    price: number
    cost: number
    stock: number
    category?: string
    brand?: string
    images?: string
}

export async function importSingleProduct(data: ImportProductData) {
    try {
        // Basic duplicate check by name? Or allow duplicates?
        // User might want to update if exists.
        // For now, let's CREATE properly.

        const product = await prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                cost: data.cost,
                stock: data.stock,
                category: data.category || "Cep Telefonu",
                brand: data.brand || "Samsung", // Auto-detect later
                images: data.images || "[]",
                status: "active"
            }
        })

        revalidatePath("/admin/products")
        return { success: true, product }
    } catch (error: any) {
        console.error("Import Error:", error)
        return { success: false, error: error.message }
    }
}
