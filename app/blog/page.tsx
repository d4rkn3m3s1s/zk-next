import { BlogCard } from "@/components/blog/BlogCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Mail, ArrowRight, PlayCircle, Cpu, Rocket, ChevronDown } from "lucide-react"
import { getPosts } from "@/app/actions/blog"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q: query } = await searchParams
    const allPosts = await getPosts({ query, status: 'published' })

    // Use the first post as featured if no query is present, otherwise just list them
    const featuredPost = !query && allPosts.length > 0 ? allPosts[0] : null
    const posts = featuredPost ? allPosts.slice(1) : allPosts

    async function searchAction(formData: FormData) {
        "use server"
        const query = formData.get("q") as string
        if (query) {
            redirect(`/blog?q=${encodeURIComponent(query)}`)
        } else {
            redirect("/blog")
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Legendary Hero Section */}
            <div className="relative w-full overflow-hidden bg-background py-20 lg:py-32">
                {/* Background Elements */}
                <div className="absolute top-[-300px] right-[-100px] w-[1000px] h-[1000px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse-slow"></div>
                <div className="absolute bottom-[-200px] left-[-200px] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>

                <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="flex flex-col gap-8 text-center lg:text-left">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 w-fit mx-auto lg:mx-0 backdrop-blur-md">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
                                </span>
                                <span className="text-xs font-bold tracking-[0.2em] uppercase text-purple-300">Gelecek_Burada</span>
                            </div>

                            <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.85] tracking-tighter drop-shadow-2xl">
                                GELECEĞİ <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 animate-gradient-x">KEŞFETMEYE</span>
                                <br />
                                HAZIR MISIN?
                            </h1>

                            <p className="text-slate-400 text-xl font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                                <span className="text-white font-bold">ZK İletişim</span> farkıyla en yeni teknoloji incelemeleri, hacker ipuçları ve mobil dünyadaki son gelişmeler.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-6">
                                <Button size="lg" className="h-14 px-10 rounded-xl text-lg font-black bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:shadow-[0_0_50px_rgba(147,51,234,0.6)] hover:-translate-y-1 transition-all border border-purple-400/20">
                                    OKUMAYA BAŞLA
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                <Button variant="outline" size="lg" className="h-14 px-10 rounded-xl text-lg font-bold border-white/10 text-white hover:bg-white/10 backdrop-blur-md">
                                    <PlayCircle className="mr-2 h-5 w-5 text-purple-400" />
                                    VİDEOLAR
                                </Button>
                            </div>
                        </div>

                        {/* 3D Graphic Placeholder */}
                        <div className="relative h-[500px] lg:h-[700px] flex items-center justify-center perspective-1000">
                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
                            <div className="relative w-full h-full animate-float">
                                <img
                                    alt="3D Smartphone Tech"
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] lg:w-[95%] max-w-[700px] object-contain drop-shadow-[0_50px_100px_rgba(147,51,234,0.4)] z-20 hover:scale-105 transition-transform duration-700"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2XHUF6fowyW4LH2FPMxP9dQe3WROdR3ZX_EO8alh4dv_HTt5hEa1MV7Cydh7mM2S7Sz9A5EU5B9LViTsEPrdUj7QLG-S8x9w-l2G0pARqSvwkaM9j8uYXyL6p_hxylbwPRjdorFF6dpT9aQrXZo7b8npPN7fh3IMfu4De3aj2qGsJZ15MNw-afkLymSRK0N3UCHVWL0UALm0a_-1TCiueP4e-IYrB7MP3ydMxl4oIebeHkmOfV1yf-0HNG5d4D-r2OjFoZZeGHw"
                                />
                                {/* Floating Elements */}
                                <div className="absolute top-[15%] right-[5%] p-5 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 animate-bounce delay-700 z-30 shadow-2xl hidden sm:block hover:border-purple-500/50 transition-colors">
                                    <Cpu className="text-purple-400 h-10 w-10" />
                                </div>
                                <div className="absolute bottom-[15%] left-[0%] p-5 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 animate-bounce delay-1000 z-30 shadow-2xl hidden sm:block hover:border-pink-500/50 transition-colors">
                                    <Rocket className="text-pink-400 h-10 w-10" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Bar (Sticky) */}
            <div className="sticky top-[80px] z-40 w-full px-4 sm:px-6 lg:px-8 pb-8 pointer-events-none">
                <div className="max-w-[1400px] mx-auto pointer-events-auto">
                    <form action={searchAction} className="bg-card/80 backdrop-blur-md p-2 rounded-2xl flex flex-col md:flex-row gap-4 items-center shadow-2xl border border-border">
                        {/* Search Input */}
                        <div className="relative w-full md:w-1/3 group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            </div>
                            <Input
                                name="q"
                                defaultValue={query}
                                className="pl-10 h-12 rounded-xl bg-background/50 border-transparent focus:border-primary/50 focus:bg-background focus:ring-0 text-sm font-medium"
                                placeholder="Makale, inceleme veya ipucu ara..."
                            />
                        </div>
                        {/* Chips */}
                        <div className="flex flex-1 gap-2 overflow-x-auto no-scrollbar w-full pb-2 md:pb-0 scroll-smooth px-1">
                            <Button variant="default" className="rounded-xl font-bold shadow-lg shadow-primary/25">Tümü</Button>
                            <Button variant="ghost" className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted">Yeni Ürünler</Button>
                            <Button variant="ghost" className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted">İncelemeler</Button>
                            <Button variant="ghost" className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted">İpuçları & Taktikler</Button>
                            <Button variant="ghost" className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted">Duyurular</Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {/* Featured Article */}
                {featuredPost && (
                    <BlogCard
                        post={{
                            id: featuredPost.id.toString(),
                            title: featuredPost.title,
                            excerpt: featuredPost.excerpt || "",
                            image: featuredPost.coverImage || "https://picsum.photos/800/600",
                            category: "Öne Çıkan",
                            date: new Date(featuredPost.createdAt).toLocaleDateString('tr-TR'),
                            slug: featuredPost.id.toString(), // Using ID for now as slug might not be unique or handled in route
                            author: featuredPost.author || "Admin",
                            readTime: "5 dk"
                        }}
                        featured
                    />
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Article Grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                                <span className="w-2 h-8 rounded-full bg-primary block"></span>
                                Son Haberler
                            </h3>
                            <Button variant="link" className="text-primary font-bold hover:no-underline gap-1">
                                Tümünü Gör <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>

                        {posts.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {posts.map(post => (
                                    <BlogCard
                                        key={post.id}
                                        post={{
                                            id: post.id.toString(),
                                            title: post.title,
                                            excerpt: post.excerpt || "",
                                            image: post.coverImage || "https://picsum.photos/600/400",
                                            category: "Blog",
                                            date: new Date(post.createdAt).toLocaleDateString('tr-TR'),
                                            slug: post.id.toString(),
                                            author: post.author || "Admin",
                                            readTime: "3 dk"
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                Henüz yazı bulunmuyor.
                            </div>
                        )}

                        {/* Load More */}
                        <div className="mt-12 flex justify-center">
                            <Button variant="outline" size="lg" className="rounded-xl font-bold gap-2 group">
                                Daha Fazla Yükle
                                <ChevronDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
                            </Button>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <aside className="w-full lg:w-[350px] flex flex-col gap-8">
                        {/* Newsletter Widget */}
                        <div className="bg-gradient-to-br from-card to-muted p-6 rounded-2xl border border-border shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Mail className="h-24 w-24" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2 relative z-10">Haberdar Olun</h3>
                            <p className="text-muted-foreground text-sm mb-6 relative z-10">
                                En yeni incelemeler ve size özel indirimlerden ilk siz haberdar olun.
                            </p>
                            <form className="flex flex-col gap-3 relative z-10">
                                <Input
                                    placeholder="E-posta adresiniz"
                                    type="email"
                                    className="bg-background/50 border-border"
                                />
                                <Button className="w-full font-bold shadow-lg shadow-primary/20">
                                    Abone Ol
                                </Button>
                            </form>
                        </div>

                        {/* Trending Topics */}
                        <div className="bg-card p-6 rounded-2xl border border-border">
                            <h3 className="text-lg font-bold text-foreground mb-5 border-b border-border pb-3">Popüler Konular</h3>
                            <div className="flex flex-col gap-4">
                                {[
                                    { id: 1, title: "Xiaomi Redmi Note 13 Serisi Fiyatları", comments: 145 },
                                    { id: 2, title: "iOS 18 Güncellemesi Alacak Cihazlar", comments: 98 },
                                    { id: 3, title: "En İyi Fiyat/Performans Telefonları 2024", comments: 210 }
                                ].map((item) => (
                                    <a key={item.id} href="#" className="flex items-center gap-4 group">
                                        <span className="text-4xl font-black text-muted/20 group-hover:text-primary/20 transition-colors">{item.id}</span>
                                        <div>
                                            <h5 className="text-foreground text-sm font-bold group-hover:text-primary transition-colors line-clamp-2">
                                                {item.title}
                                            </h5>
                                            <span className="text-xs text-muted-foreground">{item.comments} Yorum</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Tags Cloud */}
                        <div className="bg-card p-6 rounded-2xl border border-border">
                            <h3 className="text-lg font-bold text-foreground mb-5 border-b border-border pb-3">Etiketler</h3>
                            <div className="flex flex-wrap gap-2">
                                {["#iPhone", "#Samsung", "#Tamir", "#Batarya", "#EkranKoruyucu", "#Yazılım", "#Teknoloji"].map((tag) => (
                                    <a
                                        key={tag}
                                        href="#"
                                        className="px-3 py-1.5 bg-muted/50 hover:bg-primary/20 hover:text-primary hover:border-primary/30 border border-border rounded-lg text-xs font-medium text-muted-foreground transition-all"
                                    >
                                        {tag}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
}
