import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Home, Box, Settings, LogOut } from "lucide-react";
import { signOut } from "../../lib/auth-client";
import ComposterHover from "@/components/ui/ComposterHover";

const Sidebar = () => {
    const navigate = useNavigate();

    const navItems = [
        { icon: Home, label: "Home", path: "/app" },
        { icon: Box, label: "My Components", path: "/app/components" },
        { icon: Settings, label: "Settings", path: "/app/settings" },
    ];

    const handleLogout = async () => {
        await signOut();
        navigate("/");
    };

    return (
        <aside className="hidden lg:block w-64 h-screen fixed left-0 top-0 z-40 border-r border-border/30 bg-[#09090b]">
            <div className="flex flex-col h-full py-6">
                {/* Logo Area */}
                <Link to="/" className="flex items-center gap-2.5 px-6 mb-8 hover:opacity-80 transition-opacity">
                    <ComposterHover size={32} />
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">Composter</h1>
                        <p className="text-[10px] text-muted-foreground -mt-0.5">Developer Vault</p>
                    </div>
                </Link>

                {/* Main Navigation */}
                <nav className="flex-1 px-3 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/app"}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-150
                                ${isActive
                                    ? "bg-primary/10 text-primary border-l-2 border-primary -ml-0.5 pl-[calc(1rem+2px)]"
                                    : "text-muted-foreground hover:text-foreground hover:bg-zinc-800/50"
                                }
                            `}
                        >
                            <item.icon size={18} />
                            <span className="text-sm font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer Actions */}
                <div className="px-3 pt-4 border-t border-border/30 mt-auto">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
                    >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
