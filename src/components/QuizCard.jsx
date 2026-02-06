import { Link } from 'react-router-dom'

const subjectColors = {
    Mathematics: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', icon: 'calculate' },
    Science: { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-600 dark:text-teal-400', icon: 'science' },
    History: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-500', icon: 'history_edu' },
    Literature: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400', icon: 'menu_book' },
    English: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', icon: 'translate' },
    Art: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400', icon: 'palette' },
}

export default function QuizCard({ quiz, showProgress = false, onStart, onResume }) {
    const subject = quiz.subjects?.name || 'General'
    const colors = subjectColors[subject] || { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', icon: 'quiz' }

    const progress = quiz.progress || 0
    const isInProgress = progress > 0 && progress < 100

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-lg transition-all group">
            {/* Image */}
            <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 relative overflow-hidden">
                {quiz.image_url ? (
                    <img src={quiz.image_url} alt={quiz.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className={`material-symbols-outlined text-5xl ${colors.text} opacity-50`}>{colors.icon}</span>
                    </div>
                )}
                <div className={`absolute top-3 right-3 ${colors.bg} backdrop-blur-sm p-1.5 rounded-lg shadow-sm`}>
                    <span className={`material-symbols-outlined text-sm ${colors.text}`}>{colors.icon}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                        {subject}
                    </span>
                    <div className="flex items-center text-slate-500 gap-1">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        <span className="text-xs font-medium">{quiz.estimated_minutes || 15} mins</span>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{quiz.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{quiz.description}</p>

                {/* Footer */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    {isInProgress && showProgress ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-medium text-blue-600">In Progress ({progress}%)</span>
                                <span className="text-slate-500">{Math.round(progress / 100 * 15)}/15 Questions</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full">
                                <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                            </div>
                            <button
                                onClick={() => onResume?.(quiz)}
                                className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            >
                                Resume Quiz
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                                <span className="material-symbols-outlined text-xs">group</span>
                                {quiz.quiz_count || 0} takes
                            </div>
                            <button
                                onClick={() => onStart?.(quiz)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                            >
                                Start Quiz
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
