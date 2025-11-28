import React, { memo } from "react";

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
    ...props
}) => {
    return (
        <div
            className={`
                bg-[#060010] border border-white/10 rounded-3xl
                ${hoverEffect ? 'hover:scale-[1.02] hover:bg-[#0a0018] cursor-pointer transition-all duration-150' : ''}
                ${className}
            `}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
            }}
            {...props}
        >
            <div className="w-full h-full p-6 relative">
                {children}
            </div>
        </div>
    );
};

export default memo(Card);
