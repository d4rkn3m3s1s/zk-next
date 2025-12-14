"use client";

import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

export function AiTriggerButton() {
    return (
        <Button
            size="lg"
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold h-14 px-8 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all"
            onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new Event('open-chatbot'))}
        >
            <Bot className="mr-2 h-5 w-5" />
            Yapay Zeka'ya Sor
        </Button>
    );
}
