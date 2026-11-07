import { Navigate } from "react-router-dom";
import { useAuth } from "#/context/AuthContext";

export default function PrivateRoute({ children, allowedRole }) {
    const { currentUser, role, loading } = useAuth()
    if(loading){
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
                <p className="text-sm text-zinc-400 animate-pulse">Loading session...</p>
            </div>
        )
    }
    if(!currentUser){
        return <Navigate to="/login" replace />
    }
    if(allowedRole && role !== allowedRole){
        return <Navigate to={role === "agent" ? "/agent-dashboard" : "/client-dashboard"} replace />
    }
    return children
}