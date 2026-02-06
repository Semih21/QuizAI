import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const studentNavItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/student/quiz-management', icon: 'description', label: 'My Quizzes' },
    { path: '/student/feedback', icon: 'bar_chart', label: 'Analytics' },
]

const teacherNavItems = [
    { path: '/teacher', icon: 'dashboard', label: 'Dashboard' },
    { path: '/teacher/classes', icon: 'groups', label: 'My Classes' },
    { path: '/quiz/create/ai', icon: 'library_books', label: 'Create Quiz' },
    { path: '/teacher/reports', icon: 'analytics', label: 'Student Reports' },
]

export default function Sidebar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { profile, signOut, isTeacher } = useAuth()

    const navItems = isTeacher ? teacherNavItems : studentNavItems
    const portalLabel = isTeacher ? 'Teacher Mode' : 'Student Portal'

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    return (
        <aside className="w-64 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 transition-colors duration-200">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-md">
                    <span className="material-symbols-outlined">school</span>
                </div>
                <div>
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">QuizAI</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{portalLabel}</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive
                                ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <Link
                    to="/settings"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mb-2"
                >
                    <span className="material-symbols-outlined">settings</span>
                    <span>Settings</span>
                </Link>

                {/* User Profile */}
                <div className="flex items-center gap-3 p-3 mt-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col overflow-hidden flex-1">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {profile?.full_name || 'User'}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {profile?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                        </span>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                        title="Sign out"
                    >
                        <span className="material-symbols-outlined text-xl">logout</span>
                    </button>
                </div>
            </div>
        </aside>
    )
}
