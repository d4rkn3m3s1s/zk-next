import Link from "next/link"
import { ArrowRight, PlayCircle, ShieldCheck, BatteryCharging, Zap, Gem, Lock, Smartphone, ArrowUpRight, RefreshCw, Headphones, Building2, ShoppingBag, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProducts } from "@/app/actions/product"
import { getPosts } from "@/app/actions/blog"

import { HeroScene } from "@/components/ui/three-hero"
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { AiTriggerButton } from "@/components/home/AiTriggerButton";



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
      <section className="relative py-32 bg-[#020204] overflow-hidden" id="services">
        {/* Background Animation */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-900/20 rounded-[100%] blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
          <div className="flex flex-col gap-6 mb-20 text-center items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/30 border border-purple-500/30 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="text-xs font-bold font-mono text-purple-300 tracking-widest uppercase">SYSTEM.SERVICES_V2.0</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white drop-shadow-2xl">
              ÜST DÜZEY <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">ÇÖZÜMLER</span>
            </h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Yapay zeka destekli analizler ve <span className="text-purple-400 font-bold">mikroskobik hassasiyette</span> onarımlar.
            </p>
          </div>

          <BentoGrid className="lg:grid-rows-3">
            <BentoCard
              name="Mikro-Lehimleme"
              className="lg:row-span-3 lg:col-span-1"
              icon={<Zap className="h-full w-full" />}
              description="Anakart seviyesinde mikroskobik onarım işlemleri. Veri kaybı olmadan hayata döndürme."
              href="#"
              cta="Detayları İncele"
              background={<div className="absolute top-0 opacity-20 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-cover mix-blend-overlay" />}
            />
            <BentoCard
              name="Orijinal Parça Garantisi"
              className="lg:col-span-2 lg:row-span-1"
              icon={<ShieldCheck className="h-full w-full" />}
              description="Apple, Samsung ve Xiaomi logolu orijinal servis parçaları ile değişim."
              href="#"
              cta="Garanti Şartları"
              background={<div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-purple-500/10 to-transparent" />}
            />
            <BentoCard
              name="Hızlı Ekran Değişimi"
              className="lg:col-span-1 lg:row-span-1"
              icon={<Smartphone className="h-full w-full" />}
              description="30 Dakikada fabrika standartlarında ekran değişimi."
              href="#"
              cta="Randevu Al"
              background={<div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-transparent" />}
            />
            <BentoCard
              name="Eskiyi Getir, Yeniyi Götür"
              className="lg:col-span-1 lg:row-span-1"
              icon={<RefreshCw className="h-full w-full" />}
              description="Eski cihazınız hak ettiği değerde alınır, yeni cihaza anında geçersiniz."
              href="#"
              cta="Değer Hesapla"
              background={<div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-green-500/10 to-transparent" />}
            />
            <BentoCard
              name="Kurumsal Anlaşmalar"
              className="lg:col-span-2 lg:row-span-1"
              icon={<Building2 className="h-full w-full" />}
              description="Şirketiniz için özel fiyatlar ve yerinde servis imkanı."
              href="#"
              cta="Teklif İste"
              background={<div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent" />}
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
      {/* Holographic CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto rounded-[2.5rem] bg-[#020204] border border-white/10 overflow-hidden relative group">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-cyan-500/20 to-purple-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-12 md:p-24 gap-12">

            {/* Left Content */}
            <div className="max-w-2xl text-center md:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-md text-cyan-400 text-xs font-mono tracking-widest uppercase mb-4">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                AI Assistant Available
              </div>

              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                Aradığınızı <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Bulamadınız mı?</span>
              </h2>

              <p className="text-slate-400 text-xl font-light leading-relaxed">
                Yapay zeka asistanımız stoklarımızı saniyeler içinde tarar.
                Veya özel sipariş oluşturmak için uzmanlarımızla görüşün.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                <AiTriggerButton />
                <Button variant="outline" size="lg" className="h-14 px-8 rounded-full border-white/10 hover:bg-white/5 text-white backdrop-blur-sm transition-all" asChild>
                  <Link href="/contact">Bize Ulaşın</Link>
                </Button>
              </div>
            </div>

            {/* Right Visual - Holographic Box Projection */}
            <div className="relative group-hover:scale-105 transition-transform duration-700">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                {/* Hologram Base */}
                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-cyan-500/20 to-transparent blur-xl"></div>

                {/* Floating Cube Illustration (CSS or Image) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-48 h-48 bg-gradient-to-br from-cyan-500/30 to-purple-600/30 backdrop-blur-xl border border-white/20 rounded-3xl transform rotate-12 flex items-center justify-center shadow-2xl">
                    <div className="absolute inset-0 bg-white/5 rounded-3xl animate-pulse"></div>
                    <Bot className="w-24 h-24 text-white/80 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                  </div>
                </div>

                {/* Floating Particles */}
                <div className="absolute top-10 right-10 w-3 h-3 bg-cyan-400 rounded-full blur-[2px] animate-bounce delay-100"></div>
                <div className="absolute bottom-20 left-10 w-2 h-2 bg-purple-400 rounded-full blur-[2px] animate-bounce delay-300"></div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
