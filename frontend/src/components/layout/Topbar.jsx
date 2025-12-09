import React from "react";
import { Github, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useSession } from "../../lib/auth-client";
import ComposterHover from "@/components/ui/ComposterHover";

export default function Topbar() {
    const { data: session } = useSession();

    return (
        <header className="h-14 sm:h-16 fixed top-0 right-0 left-0 lg:left-64 z-30 bg-[#09090b]/90 backdrop-blur-xl border-b border-border/20">
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
                {/* Mobile Logo */}
                <Link to="/" className="flex lg:hidden items-center gap-2">
                    <ComposterHover size={24} />
                    <span className="text-sm font-semibold text-foreground">Composter</span>
                </Link>

                {/* Right Actions */}
                <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                    {/* Docs link */}
                    <Link 
                        to="/docs"
                        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 transition-colors"
                    >
                        <BookOpen size={16} />
                        <span>Docs</span>
                    </Link>

                    <a 
                        href="https://github.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 transition-colors"
                        title="GitHub"
                    >
                        <Github size={18} />
                    </a>

                    <div className="hidden sm:block h-6 w-px bg-border/30" />

                    {/* User Info */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-medium text-foreground">{session?.user?.name || "User"}</p>
                            <p className="text-xs text-muted-foreground">{session?.user?.email || ""}</p>
                        </div>
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
                            {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
