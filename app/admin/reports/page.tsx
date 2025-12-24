"use client";

import { useEffect, useState } from "react";
import { getReportStats } from "@/app/actions/reports";
import { Meteors } from "@/components/ui/meteors";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, DollarSign, Activity, Percent, Zap, AlertCircle } from "lucide-react";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Legend
} from 'recharts';
import { motion } from "framer-motion";

const COLORS = ['#8b5cf6', '#d946ef', '#0ea5e9', '#10b981', '#f59e0b'];

export default function ReportsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const res = await getReportStats();
            if (res.success) {
                setData(res);
            }
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
                <Meteors number={20} />
                <div className="text-center z-10 space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                    <p className="text-cyan-400 font-mono text-sm tracking-widest animate-pulse">SİSTEM ANALİZİ BAŞLATILIYOR...</p>
                </div>
            </div>
        );
    }

    if (!data) return <div className="text-white text-center p-20">Veri Hatası</div>

    return (
        <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden font-sans">
            <Meteors number={40} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 max-w-7xl mx-auto space-y-8"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                            KOMUTA MERKEZİ
                        </h1>
                        <p className="text-slate-400 mt-1 font-mono text-sm">
                            <span className="text-green-500">● ONLİNE</span> // GÜNCEL FİNANSAL VERİLER
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition text-sm font-medium">Bu Ay</button>
                        <button className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 rounded-lg text-sm font-medium shadow-[0_0_15px_rgba(34,211,238,0.3)]">Son 30 Gün</button>
                        <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition text-sm font-medium">Yıl</button>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KPI
                        title="TOPLAM GELİR"
                        value={`₺${data.totalRevenue.toLocaleString()}`}
                        icon={<DollarSign className="w-5 h-5 text-green-400" />}
                        trend="+12%"
                        color="green"
                    />
                    <KPI
                        title="NET KÂR"
                        value={`₺${data.totalProfit.toLocaleString()}`}
                        icon={<TrendingUp className="w-5 h-5 text-cyan-400" />}
                        trend="+8.4%"
                        color="cyan"
                    />
                    <KPI
                        title="ORT. SEPET"
                        value={`₺${Math.round(data.averageOrderValue).toLocaleString()}`}
                        icon={<Activity className="w-5 h-5 text-purple-400" />}
                        trend="-2%"
                        color="purple"
                    />
                    <KPI
                        title="KÂR MARJI"
                        value={`%${data.profitMargin.toFixed(1)}`}
                        icon={<Percent className="w-5 h-5 text-pink-400" />}
                        trend="+1.2%"
                        color="pink"
                    />
                </div>

                {/* Main Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Area Chart */}
                    <Card className="lg:col-span-2 bg-slate-900/40 border-slate-800/60 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Zap className="w-4 h-4 text-yellow-400" /> Ciro ve Kâr Analizi
                            </CardTitle>
                            <CardDescription className="text-slate-400">Günlük performans grafiği</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.chartData}>
                                    <defs>
                                        <linearGradient id="glowRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="glowProfit" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="date" stroke="#64748b" tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                                    <YAxis stroke="#64748b" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" name="Ciro" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fill="url(#glowRev)" dot={false} activeDot={{ r: 6, fill: '#fff' }} />
                                    <Area type="monotone" name="Kâr" dataKey="profit" stroke="#06b6d4" strokeWidth={3} fill="url(#glowProfit)" dot={false} activeDot={{ r: 6, fill: '#fff' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* AI Analysis Panel */}
                    <Card className="bg-black/40 border-white/10 backdrop-blur-md flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2 font-mono">
                                <span className="animate-pulse w-2 h-2 rounded-full bg-green-500"></span>
                                AI ASİSTAN
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col gap-4 font-mono text-sm text-slate-300 overflow-y-auto max-h-[400px]">
                            {data.insights && data.insights.length > 0 ? (
                                data.insights.map((insight: any, i: number) => (
                                    <div key={i} className={`p-4 bg-white/5 rounded-lg border-l-2 ${insight.type === 'success' ? 'border-green-500' :
                                            insight.type === 'warning' ? 'border-yellow-500' :
                                                insight.type === 'danger' ? 'border-red-500' :
                                                    'border-cyan-500'
                                        }`}>
                                        <h4 className={`${insight.type === 'success' ? 'text-green-400' :
                                                insight.type === 'warning' ? 'text-yellow-400' :
                                                    insight.type === 'danger' ? 'text-red-400' :
                                                        'text-cyan-400'
                                            } font-bold mb-1`}>{insight.title}</h4>
                                        <p>{insight.message}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 bg-white/5 rounded-lg border-l-2 border-cyan-500">
                                    <h4 className="text-cyan-400 font-bold mb-1">SİSTEM ANALİZİ</h4>
                                    <p>Şu an için raporlanacak kritik bir durum bulunmuyor. Sistem stabil.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category Radar/Pie */}
                    <Card className="bg-slate-900/40 border-slate-800/60 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-white">Kategori Dağılımı</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.categoryData}
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.categoryData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Top Products List */}
                    <Card className="bg-slate-900/40 border-slate-800/60 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-white">En Çok Satanlar</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.topProducts.map((product: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition group cursor-default">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white group-hover:text-cyan-400 transition">{product.name}</div>
                                            <div className="text-xs text-slate-400">{Math.floor(Math.random() * 20) + 5} stok kaldı</div>
                                        </div>
                                    </div>
                                    <div className="font-mono text-purple-400 font-bold">
                                        {product.count} Adet
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
}

function KPI({ title, value, icon, trend, color }: any) {
    const colorClasses: any = {
        green: "text-green-400 bg-green-400/10 border-green-400/20",
        cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
        purple: "text-purple-400 bg-purple-400/10 border-purple-400/20",
        pink: "text-pink-400 bg-pink-400/10 border-pink-400/20",
    };

    return (
        <Card className="bg-slate-900/40 border-slate-800/60 backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition-all duration-300">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition duration-500 ${colorClasses[color].split(' ')[1].replace('/10', '/50')}`}></div>

            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
                    <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                        {icon}
                    </div>
                </div>
                <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold text-white font-mono">{value}</div>
                    <div className={`text-xs font-medium px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {trend}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
