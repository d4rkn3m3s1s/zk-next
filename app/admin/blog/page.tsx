import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Edit, Trash2, Plus, Search, Filter, FileText, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getPosts, deletePost } from "@/app/actions/blog"

export default async function AdminBlogPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q: query } = await searchParams
    const posts = await getPosts({ query })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Blog Yazıları</h2>
                    <p className="text-muted-foreground">Blog içeriklerini buradan yönetebilirsiniz.</p>
                </div>
                <Link href="/admin/blog/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Yeni Yazı Ekle
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <form action="/admin/blog" method="GET">
                        <Input
                            name="q"
                            defaultValue={query}
                            placeholder="Başlık veya içerik ara..."
                            className="pl-9 bg-background"
                        />
                    </form>
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" /> Filtrele
                </Button>
            </div>

            <div className="rounded-md border border-border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Görsel</TableHead>
                            <TableHead>Başlık</TableHead>
                            <TableHead>Yazar</TableHead>
                            <TableHead>Tarih</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                    Yazı bulunamadı.
                                </TableCell>
                            </TableRow>
                        ) : (
                            posts.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell>
                                        <div className="h-12 w-12 rounded-md bg-muted overflow-hidden">
                                            {post.coverImage ? (
                                                <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-secondary text-secondary-foreground">
                                                    <FileText className="h-6 w-6" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{post.title}</TableCell>
                                    <TableCell>{post.author || "Admin"}</TableCell>
                                    <TableCell>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</TableCell>
                                    <TableCell>
                                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                                            {post.status === 'published' ? 'Yayında' : 'Taslak'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/blog/${post.slug}`} target="_blank">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/blog/${post.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <form action={deletePost.bind(null, post.id)}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
