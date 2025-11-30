import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({
    isOpen,
    onClose,
    children,
    title,
    maxWidth = "520px",
    className = ""
}) => {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        return () => (document.body.style.overflow = '');
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div 
                className={`relative z-10 w-full bg-[#0d0d0d] border border-border/30 rounded-2xl shadow-2xl ${className}`}
                style={{ maxWidth }}
            >
                <div className="w-full p-6 text-foreground">
                    <div className="flex items-center justify-between mb-6">
                        {title && <h3 className="text-xl font-semibold">{title}</h3>}
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors text-muted-foreground hover:text-foreground"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
