"use client";

import { useEffect, useState } from "react";
import { getDailyHadith } from "@/app/actions/hadith";
import { BookOpen, RefreshCw } from "lucide-react";

export function DailyHadithWidget() {
    const [hadith, setHadith] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchHadith = async () => {
        setLoading(true);
        const data = await getDailyHadith();
        // Adjust based on actual API response structure
        // Assuming data might have body/text or similar fields
        setHadith(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchHadith();
    }, []);

    return (
        <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 p-20 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>

            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-white">Günün Hadisi</h3>
                </div>
                <button onClick={fetchHadith} disabled={loading} className="text-emerald-400 hover:text-emerald-300 transition-colors">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="relative z-10">
                {loading ? (
                    <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-white/5 rounded w-3/4"></div>
                        <div className="h-4 bg-white/5 rounded w-1/2"></div>
                    </div>
                ) : hadith ? (
                    <div className="space-y-3">
                        <blockquote className="text-lg font-medium text-slate-200 italic font-serif leading-relaxed">
                            "{hadith.body || hadith.hadithEnglish || hadith.hadithArabic || "Hadis yüklenemedi."}"
                        </blockquote>
                        <div className="flex flex-col gap-1">
                            <cite className="text-xs font-bold text-emerald-400 not-italic">
                                {hadith.book?.bookName || "Hadis-i Şerif"}
                            </cite>
                            {hadith.chapter && (
                                <span className="text-[10px] text-slate-500">
                                    {hadith.chapter.chapterEnglish || hadith.chapter.chapterArabic}
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-slate-400">Hadis yüklenemedi.</p>
                )}
            </div>
        </div>
    );
}
