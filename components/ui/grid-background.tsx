"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const GridBackground = ({
    children,
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("h-full w-full bg-[#020204] relative", className)}>
            <div className="absolute inset-0 w-full h-full bg-[#020204] z-0 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-50"></div>

            {/* Shooting Star Effect Overlay (Simplified as absolute div for performance) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[2px] h-[100px] bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-0 animate-meteor" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-[50%] right-[30%] w-[2px] h-[150px] bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-0 animate-meteor" style={{ animationDelay: '5s' }}></div>
                <div className="absolute bottom-[20%] left-[40%] w-[2px] h-[80px] bg-gradient-to-b from-transparent via-white to-transparent opacity-0 animate-meteor" style={{ animationDelay: '8s' }}></div>
            </div>

            <div className="relative z-20 w-full">
                {children}
            </div>
        </div>
    );
}
