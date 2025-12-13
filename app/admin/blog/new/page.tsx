import { BlogForm } from "@/components/admin/BlogForm"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Save } from "lucide-react"
import Link from "next/link"

export default function NewBlogPostPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog">
                        <Button variant="outline" size="icon" className="h-10 w-10">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Yeni Yazı Ekle</h2>
                        <p className="text-muted-foreground">Bloga yeni bir içerik ekleyin.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">İptal</Button>
                    <Button className="gap-2">
                        <Save className="h-4 w-4" /> Yayınla
                    </Button>
                </div>
            </div>

            <BlogForm />
        </div>
    )
}
