import Link from "next/link"
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getPost } from "@/app/actions/blog"
import { notFound } from "next/navigation"

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const post = await getPost(parseInt(id))

    if (!post) {
        notFound()
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative h-[400px] lg:h-[500px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/50 z-10"></div>
                <img
                    src={post.coverImage || "https://picsum.photos/1200/600"}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">
                    <div className="max-w-4xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/80 backdrop-blur-sm text-white text-sm font-medium">
                            Blog
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-lg">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 text-sm md:text-base font-medium">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {post.author || "Admin"}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                5 dk okuma
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-20 relative z-30">
                <div className="bg-card rounded-3xl shadow-xl border border-border p-8 md:p-12">
                    <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Blog'a Dön
                    </Link>

                    <div className="prose dark:prose-invert max-w-none prose-lg prose-headings:font-bold prose-a:text-primary">
                        <p className="lead text-xl text-muted-foreground font-medium mb-8">
                            {post.excerpt}
                        </p>
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>

                    <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-foreground">Paylaş:</span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" className="rounded-full hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]">
                                    <Facebook className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-full hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]">
                                    <Twitter className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-full hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]">
                                    <Linkedin className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-full">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm">Etiketler:</span>
                            <div className="flex gap-2">
                                <span className="bg-muted px-2 py-1 rounded-md text-xs font-medium">Teknoloji</span>
                                <span className="bg-muted px-2 py-1 rounded-md text-xs font-medium">Mobil</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
