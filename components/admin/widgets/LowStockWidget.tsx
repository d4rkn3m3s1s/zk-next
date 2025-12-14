import { AlertTriangle, PackageOpen } from "lucide-react"
import Link from "next/link"

export function LowStockWidget({ products }: { products: any[] }) {
    if (!products || products.length === 0) return null;

    return (
        <div className="bg-slate-900/50 border border-red-500/20 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-16 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-colors"></div>

            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-red-500/10 rounded-lg text-red-400 animate-pulse">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-white">Kritik Stok</h3>
                </div>
                <Link href="/admin/products" className="text-xs text-red-400 hover:text-red-300 transition-colors">
                    Tümünü Gör
                </Link>
            </div>

            <div className="space-y-3 relative z-10">
                {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 hover:border-red-500/30 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                                <PackageOpen className="w-4 h-4 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-200 line-clamp-1">{product.name}</p>
                                <p className="text-[10px] text-slate-500">ID: #{product.id}</p>
                            </div>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/20">
                            <span className="text-xs font-bold text-red-400">{product.stock} Adet</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
