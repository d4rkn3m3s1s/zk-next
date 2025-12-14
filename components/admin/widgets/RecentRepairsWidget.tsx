import { Wrench, Clock, CheckCircle, Smartphone } from "lucide-react"
import Link from "next/link"

export function RecentRepairsWidget({ repairs }: { repairs: any[] }) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'processing': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
            case 'received': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed': return 'Tamamlandı';
            case 'processing': return 'İşlemde';
            case 'received': return 'Alındı';
            default: return status;
        }
    }

    return (
        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                        <Clock className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-white">Son İşlemler</h3>
                </div>
                <Link href="/admin/repairs" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                    Tümünü Gör
                </Link>
            </div>

            <div className="space-y-0 divide-y divide-white/5">
                {repairs.map((repair) => (
                    <Link href={`/admin/repairs/${repair.id}`} key={repair.id} className="flex items-center gap-4 py-3 hover:bg-white/5 transition-colors rounded-lg px-2 -mx-2 group">
                        <div className="p-2 rounded-full bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-cyan-500 transition-all">
                            <Smartphone className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{repair.device_model}</p>
                            <p className="text-xs text-slate-500 truncate">{repair.issue} • {repair.customer_name}</p>
                        </div>
                        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getStatusColor(repair.status)}`}>
                            {getStatusText(repair.status)}
                        </div>
                    </Link>
                ))}
                {repairs.length === 0 && (
                    <div className="py-8 text-center text-slate-500 text-sm">Hiç kayıt yok.</div>
                )}
            </div>
        </div>
    )
}
