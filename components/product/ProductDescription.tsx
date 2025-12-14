"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface ProductDescriptionProps {
    description: string
}

export function ProductDescription({ description }: ProductDescriptionProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const maxLength = 400

    // Check if description is short enough
    if (!description || description.length <= maxLength) {
        return (
            <div className="prose dark:prose-invert max-w-none text-slate-400">
                <p className="whitespace-pre-wrap leading-relaxed">{description}</p>
            </div>
        )
    }

    return (
        <div className="relative">
            <div className={`prose dark:prose-invert max-w-none text-slate-400 transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-[3000px]' : 'max-h-[200px] mask-linear-gradient'}`}>
                <p className="whitespace-pre-wrap leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Gradient Mask for collapsed state */}
            {!isExpanded && (
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
            )}

            <Button
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-4 w-full flex items-center justify-center gap-2 text-primary hover:text-primary hover:bg-primary/10 transition-colors group"
            >
                {isExpanded ? (
                    <>
                        Daha Az Göster <ChevronUp className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
                    </>
                ) : (
                    <>
                        Devamını Oku <ChevronDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
                    </>
                )}
            </Button>
        </div>
    )
}
