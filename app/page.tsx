import Link from "next/link"
import { ArrowRight, PlayCircle, ShieldCheck, BatteryCharging, Zap, Gem, Lock, Smartphone, ArrowUpRight, RefreshCw, Headphones, Building2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProducts } from "@/app/actions/product"
import { getPosts } from "@/app/actions/blog"

import { HeroScene } from "@/components/ui/three-hero"
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";

export default async function Home() {
  const featuredProducts = await getProducts({ isFeatured: true, limit: 10 })
  const latestPosts = await getPosts({ status: 'published', limit: 3 })

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroScene />

      {/* Infinite Marquee */}
      <div className="w-full bg-primary py-3 overflow-hidden transform -skew-y-2 border-y-4 border-slate-900 dark:border-white/10 relative z-20">
        <div className="whitespace-nowrap flex gap-8 animate-marquee w-max">
          <span className="text-slate-900 font-bold text-xl uppercase tracking-widest flex items-center gap-8">
            <span>HIZLI TAMİR</span> <Zap className="h-5 w-5" />
            <span>ORİJİNAL PARÇA</span> <ShieldCheck className="h-5 w-5" />
            <span>PREMIUM AKSESUAR</span> <Gem className="h-5 w-5" />
            <span>GÜVENLİ ÖDEME</span> <Lock className="h-5 w-5" />
            <span>HIZLI TAMİR</span> <Zap className="h-5 w-5" />
            <span>ORİJİNAL PARÇA</span> <ShieldCheck className="h-5 w-5" />
            <span>PREMIUM AKSESUAR</span> <Gem className="h-5 w-5" />
            <span>GÜVENLİ ÖDEME</span> <Lock className="h-5 w-5" />
          </span>
          <span className="text-slate-900 font-bold text-xl uppercase tracking-widest flex items-center gap-8">
            <span>HIZLI TAMİR</span> <Zap className="h-5 w-5" />
            <span>ORİJİNAL PARÇA</span> <ShieldCheck className="h-5 w-5" />
            <span>PREMIUM AKSESUAR</span> <Gem className="h-5 w-5" />
            <span>GÜVENLİ ÖDEME</span> <Lock className="h-5 w-5" />
            <span>HIZLI TAMİR</span> <Zap className="h-5 w-5" />
            <span>ORİJİNAL PARÇA</span> <ShieldCheck className="h-5 w-5" />
            <span>PREMIUM AKSESUAR</span> <Gem className="h-5 w-5" />
            <span>GÜVENLİ ÖDEME</span> <Lock className="h-5 w-5" />
          </span>
        </div>
      </div>

      {/* Services Section - Bento Grid */}
      <section className="relative py-24 bg-[#050505] text-white" id="services">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="flex flex-col gap-4 mb-16 text-center">
            <div className="inline-block mx-auto mb-4 px-3 py-1 text-xs font-mono text-purple-400 border border-purple-500/30 rounded-full bg-purple-500/10 backdrop-blur-sm">
              SYSTEM.SERVICES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Üst Düzey Çözümler</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
              Yapay zeka destekli analizler ve mikroskobik hassasiyette onarımlar.
            </p>
          </div>

          <BentoGrid className="lg:grid-rows-3 dark">
            <BentoCard
              name="Mikro-Lehimleme"
              className="lg:row-span-3 lg:col-span-1 border-white/10 bg-neutral-900"
              icon={<Zap className="h-full w-full" />}
              description="Anakart seviyesinde mikroskobik onarım işlemleri. Veri kaybı olmadan hayata döndürme."
              href="#"
              cta="Detayları İncele"
              background={<div className="absolute top-0 opacity-20 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-cover" />}
            />
            <BentoCard
              name="Orijinal Parça Garantisi"
              className="lg:col-span-2 lg:row-span-1 border-white/10 bg-neutral-900"
              icon={<ShieldCheck className="h-full w-full" />}
              description="Apple, Samsung ve Xiaomi logolu orijinal servis parçaları ile değişim."
              href="#"
              cta="Garanti Şartları"
              background={<div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-purple-500/20 to-transparent" />}
            />
            <BentoCard
              name="Hızlı Ekran Değişimi"
              className="lg:col-span-1 lg:row-span-1 border-white/10 bg-neutral-900"
              icon={<Smartphone className="h-full w-full" />}
              description="30 Dakikada fabrika standartlarında ekran değişimi."
              href="#"
              cta="Randevu Al"
              background={<div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-transparent" />}
            />
            <BentoCard
              name="Eskiyi Getir, Yeniyi Götür"
              className="lg:col-span-1 lg:row-span-1 border-white/10 bg-neutral-900"
              icon={<RefreshCw className="h-full w-full" />}
              description="Eski cihazınız hak ettiği değerde alınır, yeni cihaza anında geçersiniz."
              href="#"
              cta="Değer Hesapla"
              background={<div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-green-500/10 to-transparent" />}
            />
            <BentoCard
              name="Kurumsal Anlaşmalar"
              className="lg:col-span-2 lg:row-span-1 border-white/10 bg-neutral-900"
              icon={<Building2 className="h-full w-full" />}
              description="Şirketiniz için özel fiyatlar ve yerinde servis imkanı."
              href="#"
              cta="Teklif İste"
              background={<div className="absolute inset-0 bg-gradient-to-r from-neutral-800/50 to-neutral-900/50" />}
            />
          </BentoGrid>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-background border-t border-border" id="products">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-foreground">Öne Çıkan Modeller</h2>
            <Link href="/products" className="flex items-center gap-1 text-primary font-bold hover:gap-2 transition-all">
              Tümünü Gör <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {/* Horizontal Scroll Container */}
          <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scroll-smooth hide-scrollbar">
            {featuredProducts.products.length > 0 ? (
              featuredProducts.products.map((product) => {
                const images = product.images ? JSON.parse(product.images) : []
                const image = images.length > 0 ? images[0] : "https://picsum.photos/400/500"
                return (
                  <Link key={product.id} href={`/products/${product.id}`} className="min-w-[280px] md:min-w-[320px] snap-center rounded-2xl bg-card p-4 border border-border shadow-lg flex flex-col group hover:-translate-y-2 transition-transform duration-300">
                    <div className="relative aspect-[4/5] bg-slate-100 dark:bg-[#0f161e] rounded-xl mb-4 overflow-hidden">
                      {product.isNew && <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded">YENİ</div>}
                      <div className="w-full h-full bg-center bg-contain bg-no-repeat transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url('${image}')` }}></div>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-1">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        {product.comparePrice && <span className="text-sm text-muted-foreground line-through mr-2">₺{product.comparePrice.toString()}</span>}
                        <span className="text-xl font-bold text-foreground">₺{product.price.toString()}</span>
                      </div>
                      <Button size="icon" variant="ghost" className="bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg">
                        <ShoppingBag className="h-5 w-5" />
                      </Button>
                    </div>
                  </Link>
                )
              })
            ) : (
              <div className="w-full text-center py-10 text-muted-foreground">
                Henüz öne çıkan ürün bulunmuyor.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      {latestPosts.length > 0 && (
        <section className="py-16 bg-background border-t border-border" id="blog">
          <div className="max-w-7xl mx-auto px-4 md:px-10">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold text-foreground">Blog'dan Son Yazılar</h2>
              <Link href="/blog" className="flex items-center gap-1 text-primary font-bold hover:gap-2 transition-all">
                Tümünü Oku <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`} className="group">
                  <div className="rounded-2xl overflow-hidden aspect-video mb-4 border border-border">
                    <img
                      src={post.coverImage || "https://picsum.photos/600/400"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA / Banner Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto rounded-[2.5rem] bg-gradient-to-b from-[#192633] to-[#0f151b] border border-[#324d67] overflow-hidden relative">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/30 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[80px]"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-10 md:p-20 gap-10">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Aradığınız Aksesuarı Bulamadınız mı?</h2>
              <p className="text-slate-400 text-lg mb-8">
                Mağazamızda binlerce çeşit ürün var. Sizin için en uygun olanı bulmamız için bize ulaşın veya mağazamızı ziyaret edin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button variant="secondary" size="lg" className="font-bold px-8 py-6 text-base">Mağazayı Ara</Button>
                <Button variant="outline" size="lg" className="font-bold px-8 py-6 text-base border-white/20 text-white hover:bg-white/10">WhatsApp Hattı</Button>
              </div>
            </div>
            <div className="relative w-full max-w-sm">
              <div className="aspect-square bg-gradient-to-tr from-primary to-cyan-400 rounded-full opacity-20 blur-2xl absolute inset-0 animate-pulse"></div>
              <div className="relative z-10 aspect-square bg-contain bg-center bg-no-repeat drop-shadow-2xl" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD8oGkFbkGIdZIg5yAnmNgK1OeHzzIfdaJXryNYgm3HEEKJ09hVq7uPDhKEL1fbuGn1HABpKZKXSdKrxLr__iw0gffa082-ojpiNoujze1FRWjFeEaOZdCIPFn8jdIN-fM-yUglnDNiZWNX99-daHizyM3t-Zp5QJsSBSHKqWpCuRgRv28y0t7gUV8nIR7DKWmIG3PUtch4L6wgSH7lOsMrFz29fBk9FkU-XCHRmpqedcdNY7AAnWgw9qMH0jNWFkSPb17CL1FZYA')" }}></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
