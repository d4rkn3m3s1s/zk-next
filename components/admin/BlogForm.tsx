"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { ImagePlus, X, Save } from "lucide-react"
import { createPost, updatePost } from "@/app/actions/blog"
import { useRouter } from "next/navigation"

interface BlogFormProps {
    post?: any
}

export function BlogForm({ post }: BlogFormProps) {
    const router = useRouter()
    const [coverImage, setCoverImage] = useState<string | null>(post?.coverImage || null)
    const [loading, setLoading] = useState(false)

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            // Mock upload
            const url = `https://picsum.photos/seed/${Math.random()}/800/400`
            setCoverImage(url)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        if (coverImage) {
            formData.append("coverImage", coverImage)
        }

        try {
            if (post) {
                await updatePost(post.id, formData)
            } else {
                await createPost(formData)
            }
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                    <h3 className="text-lg font-semibold">İçerik</h3>

                    <div className="space-y-2">
                        <Label htmlFor="title">Başlık</Label>
                        <Input id="title" name="title" defaultValue={post?.title} placeholder="Blog yazısı başlığı..." required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">URL (Slug)</Label>
                        <Input id="slug" name="slug" defaultValue={post?.slug} placeholder="blog-yazisi-basligi" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="excerpt">Özet</Label>
                        <Textarea
                            id="excerpt"
                            name="excerpt"
                            defaultValue={post?.excerpt}
                            placeholder="Yazının kısa bir özeti..."
                            className="h-24"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">İçerik</Label>
                        <Textarea
                            id="content"
                            name="content"
                            defaultValue={post?.content}
                            placeholder="Markdown formatında içerik..."
                            className="min-h-[400px] font-mono"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                    <h3 className="text-lg font-semibold">Yayın Ayarları</h3>

                    <div className="space-y-2">
                        <Label>Durum</Label>
                        <Select name="status" defaultValue={post?.status || "draft"}>
                            <SelectTrigger>
                                <SelectValue placeholder="Durum seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="published">Yayında</SelectItem>
                                <SelectItem value="draft">Taslak</SelectItem>
                                <SelectItem value="archived">Arşiv</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Kategori</Label>
                        <Select name="category" defaultValue={post?.category}>
                            <SelectTrigger>
                                <SelectValue placeholder="Kategori seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="technology">Teknoloji</SelectItem>
                                <SelectItem value="guides">Rehberler</SelectItem>
                                <SelectItem value="news">Haberler</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="author">Yazar</Label>
                        <Input id="author" name="author" defaultValue={post?.author} placeholder="Yazar adı" />
                    </div>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                    <h3 className="text-lg font-semibold">Kapak Görseli</h3>

                    <div className="space-y-4">
                        {coverImage ? (
                            <div className="relative aspect-video rounded-lg overflow-hidden border border-border group">
                                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setCoverImage(null)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-muted/50 transition-colors flex flex-col items-center justify-center cursor-pointer gap-2">
                                <ImagePlus className="h-8 w-8 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground font-medium">Görsel Yükle</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        )}
                    </div>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? "Kaydediliyor..." : "Kaydet"}
                </Button>
            </div>
        </form>
    )
}
