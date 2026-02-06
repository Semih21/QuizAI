import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import QuizCard from '../components/QuizCard'

export default function QuizManagement() {
    const { user } = useAuth()
    const [searchParams] = useSearchParams()
    const initialSubject = searchParams.get('subject')

    const [quizzes, setQuizzes] = useState([])
    const [subjects, setSubjects] = useState([])
    const [selectedSubjects, setSelectedSubjects] = useState(initialSubject ? [initialSubject] : [])
    const [statusFilter, setStatusFilter] = useState('all')
    const [loading, setLoading] = useState(true)
    const [quizHistory, setQuizHistory] = useState([])

    useEffect(() => {
        async function fetchInitialData() {
            try {
                const [subjectsRes, historyRes] = await Promise.all([
                    supabase.from('subjects').select('*'),
                    supabase.from('quiz_attempts')
                        .select('*, quizzes(title, subjects(name))')
                        .eq('student_id', user?.id)
                        .eq('status', 'completed')
                        .order('completed_at', { ascending: false })
                        .limit(5)
                ])
                setSubjects(subjectsRes.data || [])
                setQuizHistory(historyRes.data || [])
            } catch (error) {
                console.error('Error fetching baseline data:', error)
            }
        }
        if (user) fetchInitialData()
    }, [user])

    useEffect(() => {
        async function fetchFilteredQuizzes() {
            setLoading(true)
            try {
                let query = supabase
                    .from('quizzes')
                    .select('*, subjects(name)')
                    .eq('is_published', true)

                if (selectedSubjects.length > 0) {
                    query = query.in('subject_id', selectedSubjects)
                }

                const { data, error } = await query.limit(12)
                if (error) throw error
                setQuizzes(data || [])
            } catch (error) {
                console.error('Error fetching filtered quizzes:', error)
            } finally {
                setLoading(false)
            }
        }
        if (user) fetchFilteredQuizzes()
    }, [user, selectedSubjects, statusFilter])

    const handleStartQuiz = (quiz) => {
        window.location.href = `/quiz/active/${quiz.id}`
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <Sidebar />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Header showCreateButton />

                <div className="flex flex-1 overflow-hidden">
                    {/* Filter Sidebar */}
                    <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 overflow-y-auto hidden lg:block">
                        {/* Subjects Filter */}
                        <nav className="flex flex-col gap-2 mb-8">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 mb-2">Subjects</p>
                            {subjects.map(subject => (
                                <label key={subject.id} className="flex items-center gap-3 px-2 py-1.5 cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                    <input
                                        type="checkbox"
                                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                                        checked={selectedSubjects.includes(subject.id)}
                                        onChange={(e) => {
                                            setSelectedSubjects(e.target.checked
                                                ? [...selectedSubjects, subject.id]
                                                : selectedSubjects.filter(s => s !== subject.id)
                                            )
                                        }}
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-600">{subject.name}</span>
                                </label>
                            ))}
                        </nav>

                        {/* Status Filter */}
                        <nav className="flex flex-col gap-2 mb-8">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 mb-2">Status</p>
                            {['all', 'in_progress', 'completed'].map(status => (
                                <label key={status} className="flex items-center gap-3 px-2 py-1.5 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                                        checked={statusFilter === status}
                                        onChange={() => setStatusFilter(status)}
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">{status.replace('_', ' ')}</span>
                                </label>
                            ))}
                        </nav>

                        {/* Weekly Goal */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">Weekly Goal</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">4 of 5 Quizzes Done</p>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-600 h-full w-[80%] rounded-full"></div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto p-6 md:p-8">
                        <div className="max-w-6xl mx-auto">
                            {/* Page Header */}
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">My Quizzes</h1>
                                    <p className="text-slate-500 dark:text-slate-400">Track your progress and take new challenges.</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                        <span className="material-symbols-outlined text-sm">filter_list</span>
                                        Sort: Recent
                                    </button>
                                </div>
                            </div>

                            {/* Featured AI Quiz Banner */}
                            <div className="mb-8">
                                <div
                                    className="relative rounded-2xl overflow-hidden shadow-lg"
                                    style={{
                                        background: 'linear-gradient(135deg, #1e40af 0%, #0891b2 100%)'
                                    }}
                                >
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800')] opacity-10 bg-cover bg-center"></div>
                                    <div className="relative p-8 flex items-center justify-between">
                                        <div className="max-w-lg">
                                            <span className="inline-block bg-teal-500 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded mb-3">New Feature</span>
                                            <h3 className="text-3xl font-bold text-white mb-2">Start New AI Quiz</h3>
                                            <p className="text-blue-100 mb-4">Input any topic or upload a PDF to generate a personalized quiz instantly.</p>
                                        </div>
                                        <Link
                                            to="/quiz/create/ai"
                                            className="shrink-0 flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-lg font-bold shadow-lg hover:bg-blue-50 transition-colors"
                                        >
                                            <span className="material-symbols-outlined">auto_awesome</span>
                                            Generate Now
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Active & New Quizzes */}
                            <section className="mb-12">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Active & New Quizzes</h2>
                                {loading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="bg-white dark:bg-slate-900 rounded-xl h-80 animate-pulse border border-slate-100 dark:border-slate-800"></div>
                                        ))}
                                    </div>
                                ) : quizzes.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {quizzes.map(quiz => (
                                            <QuizCard
                                                key={quiz.id}
                                                quiz={quiz}
                                                showProgress
                                                onStart={handleStartQuiz}
                                                onResume={handleStartQuiz}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">quiz</span>
                                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No quizzes available</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-4">Start by generating an AI quiz!</p>
                                        <Link to="/quiz/create/ai" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                                            <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                            Create Quiz
                                        </Link>
                                    </div>
                                )}
                            </section>

                            {/* Quiz History */}
                            <section>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quiz History & Performance</h2>
                                    <button className="text-sm font-semibold text-blue-600 hover:underline">View All History</button>
                                </div>
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Quiz Name</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date Completed</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Score</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                            {quizHistory.length > 0 ? quizHistory.map(attempt => (
                                                <tr key={attempt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-slate-900 dark:text-white">{attempt.quizzes?.title || 'Untitled Quiz'}</span>
                                                            <span className="text-xs text-slate-500">{attempt.quizzes?.subjects?.name || 'General'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-500">
                                                        {new Date(attempt.completed_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-base font-bold ${attempt.percentage >= 80 ? 'text-teal-600' :
                                                                attempt.percentage >= 60 ? 'text-amber-600' : 'text-red-600'
                                                                }`}>{attempt.percentage}%</span>
                                                            <span className={`material-symbols-outlined text-sm ${attempt.percentage >= 80 ? 'text-teal-600' :
                                                                attempt.percentage >= 60 ? 'text-amber-600' : 'text-red-600'
                                                                }`}>
                                                                {attempt.percentage >= 80 ? 'trending_up' : attempt.percentage >= 60 ? 'trending_flat' : 'trending_down'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Link
                                                            to={`/quiz/feedback/${attempt.id}`}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-xs">psychology</span>
                                                            View Feedback
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                                                        No completed quizzes yet. Start taking quizzes to see your history!
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
