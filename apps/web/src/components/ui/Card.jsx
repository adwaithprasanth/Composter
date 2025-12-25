import React, { memo } from "react";
import { cn } from "@/lib/utils";

/**
 * Reusable Card component with solid background.
 * Provides a consistent container with optional hover effects.
 */
const Card = ({
    children,
    className = "",
    width = "100%",
    height = "auto",
    hoverEffect = false,
    noPadding = false,
    ...props
}) => {
    return (
        <div
            className={cn(
                "bg-zinc-900/50 border border-border/30 rounded-xl",
                hoverEffect && "hover:border-border/50 hover:bg-zinc-900/70 cursor-pointer transition-all duration-150",
                className
            )}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
            }}
            {...props}
        >
            <div className={cn("w-full h-full relative", !noPadding && "p-5")}>
                {children}
            </div>
        </div>
    );
};

export default memo(Card);
