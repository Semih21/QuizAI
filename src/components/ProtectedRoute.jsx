import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, profile, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
        // Redirect to appropriate dashboard based on role
        const redirectPath = profile.role === 'teacher' ? '/teacher' : '/dashboard'
        return <Navigate to={redirectPath} replace />
    }

    return children
}
