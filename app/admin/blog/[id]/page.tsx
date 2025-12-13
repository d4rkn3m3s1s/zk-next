import { BlogForm } from "@/components/admin/BlogForm"
import { getPost } from "@/app/actions/blog"
import { notFound } from "next/navigation"

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const post = await getPost(parseInt(id))

    if (!post) {
        notFound()
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Yazı Düzenle</h2>
                <p className="text-muted-foreground">Blog yazısını güncelleyin.</p>
            </div>

            <BlogForm post={post} />
        </div>
    )
}
