import Link from "next/link"
import { PlayCircle, Award, ShieldCheck, Cpu, Heart, Store, Building2, Wrench, Trophy, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <section className="relative pt-12 pb-20 md:py-24 px-4 md:px-10 lg:px-40 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-50 animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl opacity-50"></div>

                <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 items-center perspective-container">
                    <div className="flex flex-col gap-6 z-10">
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                            <Award className="h-4 w-4" />
                            Ödüllü Teknoloji Partneriniz
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-foreground">
                            Geleceği <span className="text-primary">Güvenle</span> <br />Bağlıyoruz.
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
                            Zk İletişim olarak, teknolojiyi sadece bir araç değil, hayatı kolaylaştıran bir deneyim olarak görüyoruz. 15 yıllık tecrübemizle yanınızdayız.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <Button size="lg" className="h-12 px-8 rounded-xl bg-primary hover:bg-blue-600 text-white text-base font-bold shadow-lg shadow-primary/40 hover:scale-105 transition-transform">
                                Hikayemizi Keşfet
                            </Button>
                            <Button variant="outline" size="lg" className="h-12 px-6 rounded-xl border-border text-foreground text-base font-bold hover:bg-accent transition-colors">
                                <PlayCircle className="mr-2 h-5 w-5" />
                                Tanıtım Filmi
                            </Button>
                        </div>
                    </div>

                    {/* 3D Abstract Representation */}
                    <div className="relative flex justify-center items-center h-[400px] md:h-[500px]">
                        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl animate-float border-[8px] border-white/20 dark:border-slate-700/30">
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAIGxk3rhZyWDhRtOEKA1ZYn4162sUE4pHuwTzGfy1j1Uc8GWegQoU5AoBM9DnAXmKDsw0be0ckvXtlIEIWeMaSoKwesKpykA1fk1mzpUrWkKk4XrPQCPZbJ9tBkUkKgadvIVPmfS-sDB5P2kBCpzBi247qjXZZFIono6BbDdxAgSDtuegSPHvsSnf_gnY0NFhZgjwWIDgKr2QkGFzChRUjrBboHTYvtk3uPPDJPykMHM9WkXVWUXC6MU3eaQhx3V9XHs4fGPh1rg")' }}
                            ></div>
                            {/* Glass Overlay Card */}
                            <div className="absolute bottom-6 left-6 right-6 bg-background/60 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-4">
                                <div className="bg-primary rounded-full p-2 text-white">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">Müşteri Memnuniyeti</p>
                                    <p className="text-sm font-bold text-foreground">Sektör Lideri %99.8</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-10 px-4 md:px-10 lg:px-40 bg-card border-y border-border">
                <div className="max-w-[1200px] mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
                            <p className="text-4xl font-black text-primary tracking-tight">15+</p>
                            <p className="text-sm font-medium text-muted-foreground">Yıllık Tecrübe</p>
                        </div>
                        <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
                            <p className="text-4xl font-black text-primary tracking-tight">10k+</p>
                            <p className="text-sm font-medium text-muted-foreground">Mutlu Müşteri</p>
                        </div>
                        <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
                            <p className="text-4xl font-black text-primary tracking-tight">50k+</p>
                            <p className="text-sm font-medium text-muted-foreground">Tamamlanan İşlem</p>
                        </div>
                        <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
                            <p className="text-4xl font-black text-primary tracking-tight">24/7</p>
                            <p className="text-sm font-medium text-muted-foreground">Kesintisiz Destek</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Values */}
            <section className="py-20 px-4 md:px-10 lg:px-40 bg-background">
                <div className="max-w-[1200px] mx-auto flex flex-col gap-16">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Değerlerimiz ve Vizyonumuz</h2>
                        <p className="text-muted-foreground">
                            Zk İletişim, sektördeki standartları belirleyen, yenilikçi ve güvenilir yaklaşımıyla tanınır. İşte bizi biz yapan temel taşlar.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-container">
                        {/* Feature 1 */}
                        <div className="bg-card p-8 rounded-2xl border border-border flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                            <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Sarsılmaz Güven</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Müşteri verilerinin gizliliği ve işlem şeffaflığı bizim için her şeyden önemlidir. Her adımda dürüstlük ilkesiyle hareket ederiz.
                            </p>
                        </div>
                        {/* Feature 2 */}
                        <div className="bg-card p-8 rounded-2xl border border-border flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                            <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                                <Cpu className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">İleri Teknoloji</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                En yeni mobil teknolojileri, onarım ekipmanlarını ve yazılım çözümlerini yakından takip ediyor, anında entegre ediyoruz.
                            </p>
                        </div>
                        {/* Feature 3 */}
                        <div className="bg-card p-8 rounded-2xl border border-border flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                            <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                                <Heart className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Müşteri Odaklılık</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Satış sonrası destekten teknik servise kadar, sizlerin memnuniyeti bizim en büyük başarı kriterimiz ve motivasyon kaynağımızdır.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-20 px-4 md:px-10 lg:px-40 bg-card">
                <div className="max-w-[960px] mx-auto">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-10 w-1 bg-primary rounded-full"></div>
                        <h2 className="text-3xl font-bold text-foreground">Başarı Yolculuğumuz</h2>
                    </div>
                    <div className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr] gap-x-4 md:gap-x-8 relative">
                        {/* Line */}
                        <div className="absolute left-[29px] md:left-[39px] top-4 bottom-4 w-0.5 bg-border"></div>

                        {/* Item 1 */}
                        <div className="relative z-10 flex flex-col items-center pt-2">
                            <div className="size-14 md:size-20 rounded-full bg-background border-4 border-card shadow-sm flex items-center justify-center text-primary transition-colors hover:bg-primary hover:text-white">
                                <Store className="h-6 w-6 md:h-8 md:w-8" />
                            </div>
                        </div>
                        <div className="flex flex-col pb-12 pt-2">
                            <span className="text-primary font-bold text-sm mb-1">2008</span>
                            <h3 className="text-xl font-bold text-foreground mb-2">Kuruluş ve İlk Adım</h3>
                            <p className="text-muted-foreground">İstanbul'da küçük bir mağaza olarak yola çıktık. Vizyonumuz büyük, imkanlarımız kısıtlıydı ancak tutkumuz sınırsızdı.</p>
                        </div>

                        {/* Item 2 */}
                        <div className="relative z-10 flex flex-col items-center pt-2">
                            <div className="size-14 md:size-20 rounded-full bg-background border-4 border-card shadow-sm flex items-center justify-center text-primary transition-colors hover:bg-primary hover:text-white">
                                <Building2 className="h-6 w-6 md:h-8 md:w-8" />
                            </div>
                        </div>
                        <div className="flex flex-col pb-12 pt-2">
                            <span className="text-primary font-bold text-sm mb-1">2012</span>
                            <h3 className="text-xl font-bold text-foreground mb-2">İlk Büyük Mağaza</h3>
                            <p className="text-muted-foreground">Beşiktaş'taki amiral gemisi mağazamızı açarak müşteri deneyimini bir üst seviyeye taşıdık. Ürün çeşitliliğimizi %300 artırdık.</p>
                        </div>

                        {/* Item 3 */}
                        <div className="relative z-10 flex flex-col items-center pt-2">
                            <div className="size-14 md:size-20 rounded-full bg-background border-4 border-card shadow-sm flex items-center justify-center text-primary transition-colors hover:bg-primary hover:text-white">
                                <Wrench className="h-6 w-6 md:h-8 md:w-8" />
                            </div>
                        </div>
                        <div className="flex flex-col pb-12 pt-2">
                            <span className="text-primary font-bold text-sm mb-1">2018</span>
                            <h3 className="text-xl font-bold text-foreground mb-2">Teknik Servis Genişlemesi</h3>
                            <p className="text-muted-foreground">Kurumsal hizmetler departmanını kurduk ve profesyonel teknik servis ağımızı genişleterek yerinde onarım hizmeti vermeye başladık.</p>
                        </div>

                        {/* Item 4 */}
                        <div className="relative z-10 flex flex-col items-center pt-2">
                            <div className="size-14 md:size-20 rounded-full bg-primary border-4 border-card shadow-lg shadow-primary/30 flex items-center justify-center text-white">
                                <Trophy className="h-6 w-6 md:h-8 md:w-8" />
                            </div>
                        </div>
                        <div className="flex flex-col pt-2">
                            <span className="text-primary font-bold text-sm mb-1">2023</span>
                            <h3 className="text-xl font-bold text-foreground mb-2">Yılın İletişim Merkezi Ödülü</h3>
                            <p className="text-muted-foreground">Sektörel başarılarımız ve yüksek müşteri memnuniyeti oranımız sayesinde prestijli "Yılın İletişim Merkezi" ödülüne layık görüldük.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 px-4 md:px-10 lg:px-40 bg-background">
                <div className="max-w-[1200px] mx-auto">
                    <h2 className="text-3xl font-bold text-foreground text-center mb-12">Uzman Ekibimizle Tanışın</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Team Member 1 - Gamze Describes (Female) uses previous Elif's image */}
                        <div className="group relative rounded-2xl overflow-hidden bg-card shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="aspect-[4/5] w-full overflow-hidden">
                                <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCU_7yk0L4PtpWWalm8IvLWY1sT31ZxZHj16-hwINnFwY7_LR-o8Kg8l-xTiUYstZ638VmbfhEExVmauI_XE4ykDfn3SynghrvsM7feGl3j41t16eHkMWTFZPM4u39DwYVg1H2w-SggkyoW4NZ03WEG8U6atK4Alz2AVclZx5W_wTPdZOwuBpQUBmF-OJsziCgQpKz03dRfQ-25CmETpdxCAg-rx6MeZntGrqr8DmLt1rCajLMAPblNgWVK3wdudoJDxai-brl6XA")' }}></div>
                            </div>
                            <div className="p-4 text-center relative z-10 -mt-8 mx-4 bg-card rounded-xl shadow-md border border-border">
                                <h3 className="font-bold text-foreground">Gamze Çoksoylu</h3>
                                <p className="text-primary text-sm font-medium">Kurucu & CEO</p>
                            </div>
                        </div>
                        {/* Team Member 2 - Talha Describes (Male) uses previous Ahmet's image */}
                        <div className="group relative rounded-2xl overflow-hidden bg-card shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="aspect-[4/5] w-full overflow-hidden">
                                <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDVqwZVhZ1D1_ohdSz1_Cn96ExA83Iq6qjoY21aB3kITWlPXzm0hl8nQefhwl7MHxq0umJLQoQgaLCl80FDQnonktSn84YLDG_UARWh3-XEWbggY6gW7f_cV0iyejpOuRMnvjKYzFVdjuXPSSk625Az8XYzHYlHh8JsWzS3nNspWvwUNhxCr-R0i-9fajyzsvuAyoe6frO4PYt3-FbCKHXdpLOPxU6jfKGOgOg5HKq7SqseeXbviL8T5-BAtVXauuvEfD72dyYDpw")' }}></div>
                            </div>
                            <div className="p-4 text-center relative z-10 -mt-8 mx-4 bg-card rounded-xl shadow-md border border-border">
                                <h3 className="font-bold text-foreground">Talha Çoksoylu</h3>
                                <p className="text-primary text-sm font-medium">Operasyon Müdürü</p>
                            </div>
                        </div>
                        {/* Team Member 3 */}
                        <div className="group relative rounded-2xl overflow-hidden bg-card shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="aspect-[4/5] w-full overflow-hidden">
                                <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB5OG7QpZPTIcVksi4iquIBobC59Om0tefKDSPjpUZX4EC_JQeHrmLRX39_nD4uvoWBjXOTrfWL3_6Pq_J8JUvdPAKzkg4KsUm606LLxqWkruVbFS2M6Ij9qg9mP3yVtYPEbjL8Zcs7_K52CA730xEpvHHyuUJNEsx_ybbKOfylQYqEFwe1cHjLlCr0ASXnG3lcF9F2bx1lQ3QHAMggUQN9JhmIFJMbasx6IgWu3BRpwmnCuumN2J9jkt1rz-AQODxG5swhjBTQvg")' }}></div>
                            </div>
                            <div className="p-4 text-center relative z-10 -mt-8 mx-4 bg-card rounded-xl shadow-md border border-border">
                                <h3 className="font-bold text-foreground">Mahmut Murat Çoksoylu</h3>
                                <p className="text-primary text-sm font-medium">Teknik Servis Şefi</p>
                            </div>
                        </div>
                        {/* Team Member 4 */}
                        <div className="group relative rounded-2xl overflow-hidden bg-card shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="aspect-[4/5] w-full overflow-hidden">
                                <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDF6E60nVBHKeR_X_Yb92Kgw8eE10qYvDKwJDLV-5b-iYVftVlFMH9vbebe41wM3qwvwgej3IE5taD0ZSJHUHFcDJbspXSWbzdrQuj5G5hLVfZwbn62QED1iURgyZNIzP1NzrOYx4d8GKTsiu4fi_Ank-iUEX3sB9yeqHMDSKMqcY0kXRzprRMWd14WXgNcNDfu5XWBm8b0QtXF6fJ76GNf8tJsaPtssNT-EN_22AWyswLPkxpb2kHEAXUJbBjnOgifIUsWFO-cXg")' }}></div>
                            </div>
                            <div className="p-4 text-center relative z-10 -mt-8 mx-4 bg-card rounded-xl shadow-md border border-border">
                                <h3 className="font-bold text-foreground">Büşra Çoksoylu</h3>
                                <p className="text-primary text-sm font-medium">Müşteri İlişkileri</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 md:px-10 lg:px-40 bg-card relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none"></div>
                <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                    <div className="flex flex-col gap-4 max-w-2xl">
                        <h2 className="text-4xl font-bold text-foreground">Sizin İçin Buradayız</h2>
                        <p className="text-lg text-muted-foreground">
                            Sorularınız mı var? Teknik destek veya yeni cihaz önerileri için uzman ekibimiz bir tık uzağınızda.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Button size="lg" className="h-14 px-8 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-bold text-base">
                            Bize Ulaşın
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
