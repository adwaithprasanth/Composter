import { Navigate } from "react-router-dom";
import { useSession } from "../lib/auth-client";
import ComposterLoading from "./ui/ComposterLoading.jsx";

export default function ProtectedRoute({ children }) {
    const { data: session, isPending } = useSession();

    if (isPending) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-[#050505]">
                <ComposterLoading size={64} />
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
