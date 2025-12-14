"use client";

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { ReactNode, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export const BentoGrid = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "grid w-full auto-rows-[22rem] grid-cols-1 gap-6 md:grid-cols-3",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoCard = ({
    name,
    className,
    background,
    icon,
    description,
    href,
    cta,
}: {
    name: string;
    className: string;
    background: ReactNode;
    icon: ReactNode;
    description: string;
    href: string;
    cta: string;
}) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(1);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-3xl",
                "bg-black border border-white/10 shadow-2xl transition-transform duration-500 hover:scale-[1.01]",
                className
            )}
        >
            {/* Spotlight Effect */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(168,85,247,0.15), transparent 40%)`,
                }}
            />
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(168,85,247,0.4), transparent 40%)`,
                    maskImage: `radial-gradient(300px circle at ${position.x}px ${position.y}px, black, transparent)`,
                    WebkitMaskImage: `radial-gradient(300px circle at ${position.x}px ${position.y}px, black, transparent)`,
                }}
            >
                <div className="absolute inset-0 border border-purple-500/50 rounded-3xl"></div>
            </div>

            <div className="absolute inset-0 z-0">{background}</div>

            <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-8 transition-all duration-300 group-hover:-translate-y-10">
                <div className="mb-4 h-12 w-12 origin-left transform-gpu text-purple-400 transition-all duration-300 ease-in-out group-hover:scale-75 group-hover:text-purple-300 bg-purple-500/10 p-2 rounded-xl border border-purple-500/20 backdrop-blur-md">
                    {icon}
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-purple-200 transition-colors">
                    {name}
                </h3>
                <p className="max-w-lg text-slate-400 group-hover:text-slate-300 transition-colors text-base leading-relaxed">
                    {description}
                </p>
            </div>

            <div
                className={cn(
                    "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-20",
                )}
            >
                <Button variant="ghost" asChild size="sm" className="pointer-events-auto bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 rounded-xl px-6">
                    <a href={href}>
                        {cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                </Button>
            </div>
            <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-500 group-hover:bg-purple-900/[0.03]" />
        </div>
    );
};
