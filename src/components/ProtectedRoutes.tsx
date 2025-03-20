import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthProvider";

const ProtectedRoutes = () => {
    const { user, loading }: any = useAuth()

    if (loading) {
        return <div className="h-screen w-screen flex justify-center items-center">
            <div className="spinner"></div>
        </div>
    }

    return user ? <Outlet /> : <Navigate to="/login" /> // Redirect to login if not authenticated
}
export default ProtectedRoutes;