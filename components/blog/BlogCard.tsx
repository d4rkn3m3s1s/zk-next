import Link from "next/link"
import { ArrowRight, Calendar, Clock, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface BlogPost {
    id: string
    title: string
    excerpt: string
    image: string
    category: string
    date: string
    author?: string
    readTime?: string
    slug: string
}

interface BlogCardProps {
    post: BlogPost
    featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
    if (featured) {
        return (
            <div className="group relative overflow-hidden rounded-3xl bg-card border border-border aspect-[16/9] md:aspect-[21/9] shadow-2xl mb-12 cursor-pointer">
                {/* Image */}
                <div className="absolute inset-0">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col items-start gap-4">
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/20 hover:bg-primary/30 backdrop-blur-md">
                        Öne Çıkan İnceleme
                    </Badge>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-4xl leading-tight group-hover:text-primary transition-colors">
                        {post.title}
                    </h2>
                    <div className="flex items-center gap-4 text-gray-300 text-sm">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{post.date}</span>
                        </div>
                        {post.author && (
                            <>
                                <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                                <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    <span>{post.author}</span>
                                </div>
                            </>
                        )}
                        {post.readTime && (
                            <>
                                <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{post.readTime}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <article className="group relative flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="aspect-[4/3] w-full overflow-hidden relative">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-black/50 backdrop-blur-md text-white border-white/10 hover:bg-black/60">
                        {post.category}
                    </Badge>
                </div>
            </div>
            <div className="flex flex-col flex-1 p-5 gap-3">
                <h4 className="text-xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                    {post.title}
                </h4>
                <p className="text-muted-foreground text-sm line-clamp-2">
                    {post.excerpt}
                </p>
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-border">
                    <span className="text-xs text-muted-foreground font-medium">{post.date}</span>
                    <Link href={`/blog/${post.slug}`} className="text-primary text-sm font-bold flex items-center gap-1 group/btn">
                        Oku <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                </div>
            </div>
        </article>
    )
}
