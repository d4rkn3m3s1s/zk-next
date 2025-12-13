import { getDashboardStats } from "@/app/actions/dashboard"
import {
    DollarSign,
    ShoppingBag,
    Wrench,
    Calendar,
    Box,
    Users,
    Activity,
    ArrowUpRight,
    CreditCard,
    Cpu
} from "lucide-react"

export default async function LegendaryDashboard() {
    const data = await getDashboardStats()

    const stats = [
        {
            title: "Toplam Gelir",
            value: `₺${data.totalRevenue.toLocaleString('tr-TR')}`,
            icon: DollarSign,
            color: "text-green-400",
            bg: "bg-green-500/10",
            border: "border-green-500/20",
            trend: "+12%"
        },
        {
            title: "Aktif Siparişler",
            value: data.activeOrdersCount.toString(),
            icon: ShoppingBag,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            trend: "+5"
        },
        {
            title: "Bekleyen Tamirler",
            value: data.pendingRepairsCount.toString(),
            icon: Wrench,
            color: "text-orange-400",
            bg: "bg-orange-500/10",
            border: "border-orange-500/20",
            trend: "+3"
        },
        {
            title: "Randevular",
            value: data.todayAppointmentsCount.toString(),
            icon: Calendar,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
            trend: "Bugün"
        },
    ]

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-8 font-sans selection:bg-cyan-500/30">
            {/* Background Ambient Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                                <Cpu className="w-6 h-6 text-cyan-400" />
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                KOMUTA MERKEZİ
                            </h1>
                        </div>
                        <p className="text-slate-400 font-medium">Sistem Durumu ve İstatistikler</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-green-400 text-sm font-bold">SİSTEM AKTİF</span>
                        </div>
                        <div className="text-slate-500 text-sm font-mono border-l border-white/10 pl-4">
                            v2.5.0-BETA
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className={`relative group p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${stat.bg} ${stat.border}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl bg-black/20 ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-white/5 text-white/60">
                                    {stat.trend} <ArrowUpRight className="w-3 h-3" />
                                </span>
                            </div>
                            <div>
                                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">{stat.title}</h3>
                                <div className="text-3xl font-black text-white">{stat.value}</div>
                            </div>
                            {/* Glow Effect */}
                            <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/5 to-transparent pointer-events-none`}></div>
                        </div>
                    ))}
                </div>

                {/* Dashboard Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders Table */}
                    <div className="lg:col-span-2 bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-cyan-400" />
                                Son Sipariş Aktivitesi
                            </h3>
                            <button className="text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider transition-colors">
                                Tümünü Gör
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-400 uppercase bg-black/20">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Sipariş No</th>
                                        <th className="px-6 py-4 font-bold">Müşteri</th>
                                        <th className="px-6 py-4 font-bold">Tutar</th>
                                        <th className="px-6 py-4 font-bold text-right">Durum</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {data.recentOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                                Henüz veri akışı yok.
                                            </td>
                                        </tr>
                                    ) : (
                                        data.recentOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4 font-mono text-cyan-200 group-hover:text-cyan-400">
                                                    #{order.orderNumber}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-300">
                                                    {order.customerName || order.user?.username || "Misafir"}
                                                </td>
                                                <td className="px-6 py-4 text-white font-bold">
                                                    ₺{Number(order.totalAmount).toLocaleString('tr-TR')}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${order.status === 'Completed' || order.status === 'Delivered'
                                                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                            : order.status === 'Processing'
                                                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                                : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Secondary Metrics / Quick Stats */}
                    <div className="space-y-6">
                        {/* Users Card */}
                        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-16 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-colors"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-pink-500/20 rounded-xl text-pink-400">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs font-bold uppercase">Kullanıcılar</p>
                                        <h4 className="text-2xl font-black text-white">{data.activeUsersCount}</h4>
                                    </div>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden">
                                    <div className="bg-pink-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                                <p className="text-xs text-slate-500">Aktif kullanıcı oranı %65</p>
                            </div>
                        </div>

                        {/* Stock Card */}
                        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-16 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                                        <Box className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs font-bold uppercase">Toplam Stok</p>
                                        <h4 className="text-2xl font-black text-white">{data.totalStock}</h4>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    <button className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg py-2 text-xs font-bold text-slate-300 transition-colors">
                                        Stok Girişi
                                    </button>
                                    <button className="bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-lg py-2 text-xs font-bold text-indigo-300 transition-colors">
                                        Raporlar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* System Status */}
                        <div className="bg-black/40 border border-white/5 rounded-2xl p-6">
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Servis Durumu</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-300 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        Veritabanı
                                    </span>
                                    <span className="text-green-400 font-mono text-xs">ONLINE</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-300 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        API Gateway
                                    </span>
                                    <span className="text-green-400 font-mono text-xs">ONLINE</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-300 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        Frontend
                                    </span>
                                    <span className="text-green-400 font-mono text-xs">Vercel Edge</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
