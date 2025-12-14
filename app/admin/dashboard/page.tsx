"use client";

import { useEffect, useState } from "react";
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
import { LowStockWidget } from "@/components/admin/widgets/LowStockWidget"
import { RecentRepairsWidget } from "@/components/admin/widgets/RecentRepairsWidget"


import { QuickActionsWidget } from "@/components/admin/widgets/QuickActionsWidget"
import { UnreadMessagesWidget } from "@/components/admin/widgets/UnreadMessagesWidget"
import { DailyHadithWidget } from "@/components/admin/widgets/DailyHadithWidget"
import { ExchangeRateWidget } from "@/components/admin/widgets/ExchangeRateWidget"
import { WeatherWidget } from "@/components/admin/widgets/WeatherWidget"
import { KdvCalculator } from "@/components/admin/widgets/KdvCalculator"
import { InstallmentCalculator } from "@/components/admin/widgets/InstallmentCalculator"
import { DashboardBackground } from "@/components/admin/DashboardBackground"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function LegendaryDashboard() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        getDashboardStats().then(setData);
    }, []);

    if (!data) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Yükleniyor...</div>;

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
    ]

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-8 font-sans selection:bg-cyan-500/30">
            {/* Background Ambient Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150"></div>
                <DashboardBackground />
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

                {/* Widgets Row 1: Operations */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <QuickActionsWidget />
                    <RecentRepairsWidget repairs={data.recentRepairs} />
                    <div className="lg:col-span-1">
                        <WeatherWidget />
                    </div>
                </div>

                {/* Widgets Row 2: Management */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LowStockWidget products={data.lowStockProducts} />
                    <UnreadMessagesWidget messages={data.unreadMessages} />
                </div>

                {/* Existing Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ExchangeRateWidget />
                    <KdvCalculator />
                    <InstallmentCalculator />
                </div>

                {/* Dashboard Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Daily Sales Chart */}
                    <div className="lg:col-span-2 bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-cyan-400" />
                                Günlük Satış Grafiği
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                                    <ArrowUpRight className="w-3 h-3" /> Son 7 Gün
                                </span>
                            </div>
                        </div>
                        <div className="p-6 h-[300px]">
                            {data.last7DaysSales && data.last7DaysSales.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data.last7DaysSales}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#94a3b8"
                                            tickFormatter={(val) => val.split('-').slice(1).join('/')}
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                            formatter={(value: number) => [`₺${value.toLocaleString()}`, 'Satış']}
                                            labelFormatter={(label) => label.split('-').reverse().join('.')}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="#22d3ee"
                                            fillOpacity={1}
                                            fill="url(#colorSales)"
                                            strokeWidth={3}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-slate-500">
                                    <div className="text-center">
                                        <Activity className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                        <p>Henüz satış verisi bulunmuyor.</p>
                                    </div>
                                </div>
                            )}
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
