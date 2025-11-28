import React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signOut, useSession } from "../../lib/auth-client.ts";

export default function Topbar() {
    const navigate = useNavigate();
    const { data: session } = useSession();

    const handleLogout = async () => {
        await signOut();
        navigate("/");
    };
    return (
        <div className="h-20 fixed top-0 right-0 left-64 z-30 p-4">
            <div className="h-full bg-[#060010] border border-white/10 rounded-2xl">
                <div className="flex items-center justify-end h-full px-6 text-white relative">
                    {/* Actions */}
                    <div className="flex items-center gap-4">

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-white">{session?.user?.name || "User"}</p>
                                <p className="text-xs text-white/50">{session?.user?.email || ""}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-lg shadow-violet-500/20">
                                {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-full hover:bg-red-500/10 text-white/70 hover:text-red-400 transition-colors"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
