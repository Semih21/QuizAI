import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header({ title, subtitle, showCreateButton = false }) {
    const { profile, isTeacher } = useAuth()

    return (
        <header className="h-16 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 flex items-center justify-between z-10 sticky top-0">
            {/* Left: Title or Search */}
            <div className="flex items-center gap-4 w-full max-w-xl">
                <div className="relative w-full">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                    <input
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-slate-400 dark:text-white transition-all"
                        placeholder="Search for quizzes, topics, or questions..."
                        type="text"
                    />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-slate-900"></span>
                </button>

                {/* Create Quiz Button */}
                {showCreateButton && isTeacher && (
                    <Link
                        to="/quiz/create/ai"
                        className="flex items-center justify-center h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-500/30 transition-all gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Create Quiz
                    </Link>
                )}

                {showCreateButton && !isTeacher && (
                    <Link
                        to="/student/quiz-management"
                        className="flex items-center justify-center h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-500/30 transition-all gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                        Start Quiz
                    </Link>
                )}
            </div>
        </header>
    )
}
