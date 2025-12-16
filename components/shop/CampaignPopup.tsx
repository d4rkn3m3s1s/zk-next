"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Sparkles } from "lucide-react";

interface Campaign {
    id: number;
    title: string;
    description: string;
    imageUrl?: string | null;
}

export function CampaignPopup({ campaign }: { campaign: Campaign | null }) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (campaign) {
            // Check session storage to not annoy user every reload
            const hasSeen = sessionStorage.getItem(`seen_campaign_${campaign.id}`);
            if (!hasSeen) {
                // Short delay for effect
                const timer = setTimeout(() => setIsOpen(true), 1500);
                return () => clearTimeout(timer);
            }
        }
    }, [campaign]);

    const handleClose = () => {
        setIsOpen(false);
        if (campaign) {
            sessionStorage.setItem(`seen_campaign_${campaign.id}`, 'true');
        }
    };

    if (!campaign) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                        style={{
                            boxShadow: "0 0 50px -12px rgba(124, 58, 237, 0.5)"
                        }}
                    >
                        {/* Background Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none" />

                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white/70 hover:bg-white hover:text-black transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-1">
                            {campaign.imageUrl && (
                                <div className="relative h-48 w-full rounded-t-xl overflow-hidden mb-6">
                                    <img src={campaign.imageUrl} alt={campaign.title} className="object-cover w-full h-full" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                                </div>
                            )}

                            <div className="px-8 pb-8 pt-4 text-center relative">
                                <div className="mx-auto mb-4 flex items-center justify-center size-16 rounded-full bg-purple-500/20 text-purple-400">
                                    <Gift size={32} />
                                </div>

                                <motion.h3
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-2xl font-bold text-white mb-2"
                                >
                                    {campaign.title}
                                </motion.h3>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-slate-400 mb-6"
                                >
                                    {campaign.description}
                                </motion.p>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleClose}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg shadow-lg shadow-purple-900/40 relative overflow-hidden group"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        Fırsatı Yakala <Sparkles size={18} />
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
