'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getPosts(options?: {
    query?: string
    status?: string
    limit?: number
}) {
    const { query, status, limit } = options || {}

    const where: any = {}

    if (query) {
        where.OR = [
            { title: { contains: query } },
            { content: { contains: query } }
        ]
    }

    if (status) {
        where.status = status
    }

    const posts = await prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit
    })
    return posts
}

export async function getPost(id: number) {
    const post = await prisma.post.findUnique({
        where: { id }
    })
    return post
}

export async function createPost(formData: FormData) {
    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const excerpt = formData.get("excerpt") as string
    const content = formData.get("content") as string
    const status = formData.get("status") as string
    const author = formData.get("author") as string
    const coverImage = formData.get("coverImage") as string

    await prisma.post.create({
        data: {
            title,
            slug,
            excerpt,
            content,
            status,
            author,
            coverImage,
            publishedAt: status === 'published' ? new Date() : null
        }
    })

    revalidatePath("/admin/blog")
    redirect("/admin/blog")
}

export async function updatePost(id: number, formData: FormData) {
    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const excerpt = formData.get("excerpt") as string
    const content = formData.get("content") as string
    const status = formData.get("status") as string
    const author = formData.get("author") as string
    const coverImage = formData.get("coverImage") as string

    await prisma.post.update({
        where: { id },
        data: {
            title,
            slug,
            excerpt,
            content,
            status,
            author,
            coverImage,
            publishedAt: status === 'published' ? new Date() : null
        }
    })

    revalidatePath("/admin/blog")
    revalidatePath(`/admin/blog/${id}`)
    redirect("/admin/blog")
}

export async function deletePost(id: number) {
    await prisma.post.delete({
        where: { id }
    })
    revalidatePath("/admin/blog")
}
