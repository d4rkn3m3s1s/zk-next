import Link from "next/link"
import { ArrowRight, Calendar, User, Hash } from "lucide-react"
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
            <div className="group relative overflow-hidden rounded-3xl bg-black/40 border border-white/10 aspect-[16/9] md:aspect-[21/9] shadow-2xl mb-12 hover:shadow-[0_0_50px_rgba(124,58,237,0.2)] transition-all duration-500">
                {/* Neon Border Glow */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none box-border border-2 border-purple-500/30"></div>

                {/* Image */}
                <div className="absolute inset-0">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 group-hover:rotate-1"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-purple-900/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex flex-col items-start gap-4 z-10">
                    <Badge variant="secondary" className="px-3 py-1 bg-purple-500/20 text-purple-200 border border-purple-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-pulse-slow">
                        Öne Çıkan
                    </Badge>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white max-w-5xl leading-[0.9] tracking-tighter drop-shadow-2xl">
                        {post.title} <span className="text-purple-500 inline-block translate-y-1 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">_</span>
                    </h2>

                    <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm font-mono mt-2">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-purple-400" />
                            <span>{post.date}</span>
                        </div>
                        {post.author && (
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-purple-400" />
                                <span className="uppercase tracking-widest">{post.author}</span>
                            </div>
                        )}
                        <Link href={`/blog/${post.slug}`} className="ml-auto">
                            <span className="flex items-center gap-2 text-white font-bold bg-white/10 hover:bg-purple-600 px-6 py-3 rounded-xl backdrop-blur-md border border-white/10 transition-all group/btn">
                                SİSTEME GİRİŞ <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <article className="group relative flex flex-col h-full bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/50 hover:bg-black/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] hover:-translate-y-2">
            <div className="aspect-[4/3] w-full overflow-hidden relative">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-80"></div>

                <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-black/60 backdrop-blur-md text-white border border-white/10 group-hover:border-purple-500/50 group-hover:text-purple-300 transition-colors">
                        <Hash className="w-3 h-3 mr-1" /> {post.category}
                    </Badge>
                </div>
            </div>

            <div className="flex flex-col flex-1 p-6 relative z-10 -mt-12">
                <div className="text-xs font-mono text-purple-400 mb-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    // LOG_ENTRY: {post.date}
                </div>
                <h4 className="text-xl font-bold text-white leading-tight mb-3 group-hover:text-purple-300 transition-colors line-clamp-2">
                    {post.title}
                </h4>
                <p className="text-slate-400 text-sm line-clamp-2 mb-4 group-hover:text-slate-300">
                    {post.excerpt}
                </p>
                <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                        READ_TIME: {post.readTime || "3m"}
                    </span>
                    <Link href={`/blog/${post.slug}`} className="text-white hover:text-purple-400 transition-colors">
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </article>
    )
}
