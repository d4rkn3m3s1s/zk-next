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
import { ExchangeRateWidget } from "@/components/admin/widgets/ExchangeRateWidget"
import { WeatherWidget } from "@/components/admin/widgets/WeatherWidget"
import { KdvCalculator } from "@/components/admin/widgets/KdvCalculator"
import { InstallmentCalculator } from "@/components/admin/widgets/InstallmentCalculator"
import { DigitalClockWidget } from "@/components/admin/widgets/DigitalClockWidget"
import { StockTicker } from "@/components/admin/widgets/StockTicker"
import { TodoListWidget } from "@/components/admin/widgets/TodoListWidget"
import { MarginCalculatorWidget } from "@/components/admin/widgets/MarginCalculatorWidget"
import { DashboardBackground } from "@/components/admin/DashboardBackground"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Meteors } from "@/components/ui/meteors";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { TelegramReportButton } from "@/components/admin/TelegramReportButton"


export default function LegendaryDashboard() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        getDashboardStats().then(setData);
    }, []);

    if (!data) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Yükleniyor...</div>;

    const stats = [
        {
            title: "Toplam Kâr", // Changed from Gelir
            value: `₺${data.totalProfit ? data.totalProfit.toLocaleString('tr-TR') : '0'}`,
            icon: DollarSign,
            color: "text-green-400",
            bg: "bg-green-500/10",
            border: "border-green-500/20",
            trend: `${data.profitTrend > 0 ? '+' : ''}${data.profitTrend}%`
        },
        {
            title: "Aktif Siparişler",
            value: data.activeOrdersCount.toString(),
            icon: ShoppingBag,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            trend: "Siparişler"
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
            title: "Bugünkü Randevular",
            value: data.todayAppointmentsCount.toString(),
            icon: Calendar,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
            trend: "Günlük"
        },
    ]

    return (
        <div className="relative z-20 w-full px-2 md:px-0 pb-10 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
            {/* Background Ambient Glow - Keep subtle or remove if GridBackground is enough */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px]"></div>
                <DashboardBackground />
                <Meteors number={20} />
            </div>

            {/* Stock Ticker Area */}
            <div className="relative z-20 mb-6 border-b border-white/10 bg-black/50 backdrop-blur-sm">
                <StockTicker lowStockProducts={data.lowStockProducts} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-8 px-6 md:px-8">
                {/* Header with Clock */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                                <Cpu className="w-6 h-6 text-cyan-400" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                KOMUTA MERKEZİ
                            </h1>
                        </div>
                        <p className="text-slate-400 font-medium">Sistem Durumu ve İstatistikler</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
                        <DigitalClockWidget />
                        <div className="flex items-center gap-3">
                            <TelegramReportButton />
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-green-400 text-sm font-bold">SİSTEM AKTİF</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, idx) => (
                        <SpotlightCard
                            key={idx}
                            className={`group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${stat.bg} ${stat.border}`}
                            spotlightColor="rgba(255, 255, 255, 0.15)"
                        >
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className={`p-3 rounded-xl bg-black/20 ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-white/5 text-white/60">
                                    {stat.trend} <ArrowUpRight className="w-3 h-3" />
                                </span>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">{stat.title}</h3>
                                <div className="text-3xl font-black text-white">{stat.value}</div>
                            </div>
                        </SpotlightCard>
                    ))}
                </div>

                {/* Operations & Utilities Row - BENTO GRID LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* LEFT COLUMN: Main Operations (Span 3) */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* 1. Quick Info & Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <QuickActionsWidget />
                            <RecentRepairsWidget repairs={data.recentRepairs} />
                        </div>

                        {/* 2. Main Chart */}
                        <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
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
                            <div className="p-6 h-[400px]">
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
                                                formatter={(value: any) => [`₺${(value || 0).toLocaleString()}`, 'Satış']}
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

                        {/* 3. Bottom Row within Left Col */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <LowStockWidget products={data.lowStockProducts} />
                            <UnreadMessagesWidget messages={data.unreadMessages} />
                        </div>

                        {/* 4. Financial Tools Row (Fits 3 cols perfectly in Span 3) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <ExchangeRateWidget />
                            <KdvCalculator />
                            <InstallmentCalculator />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar Utilities (Span 1) */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        {/* Weather - Moved to top */}
                        <div className="flex-none">
                            <WeatherWidget />
                        </div>

                        {/* Margin Calculator */}
                        <div className="flex-none">
                            <MarginCalculatorWidget />
                        </div>

                        {/* Todo List - Flex Grow to fill height if needed or fixed height */}
                        <div className="flex-1 min-h-[400px]">
                            <TodoListWidget />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
