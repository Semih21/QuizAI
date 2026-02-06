import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function StudentReports() {
    const { profile } = useAuth()
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedClass, setSelectedClass] = useState('all')
    const [classes, setClasses] = useState([])

    useEffect(() => {
        async function fetchReports() {
            setLoading(true)
            try {
                // Fetch teacher's classes first to filter reports
                const { data: classesData } = await supabase
                    .from('classes')
                    .select('id, name')
                    .eq('teacher_id', profile?.id)

                setClasses(classesData || [])

                // Fetch quiz attempts for students in teacher's classes
                // Note: Simplified logic to fetch all attempts for quizzes created by this teacher
                let query = supabase
                    .from('quiz_attempts')
                    .select(`
                        id,
                        score,
                        max_score,
                        percentage,
                        completed_at,
                        status,
                        student_id,
                        profiles!quiz_attempts_student_id_fkey(full_name, email),
                        quizzes(title, created_by)
                    `)
                    .eq('status', 'completed')
                    .order('completed_at', { ascending: false })

                // Only show attempts for quizzes created by this teacher
                query = query.eq('quizzes.created_by', profile?.id)

                const { data, error } = await query

                if (error) throw error
                setReports(data || [])
            } catch (error) {
                console.error('Error fetching reports:', error)
            } finally {
                setLoading(false)
            }
        }
        if (profile?.id) fetchReports()
    }, [profile])

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <Sidebar />

            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <Header showCreateButton />

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-6xl mx-auto flex flex-col gap-8">
                        <section className="flex justify-between items-end">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">Student Reports</h2>
                                <p className="text-slate-500 dark:text-slate-400">Detailed performance analysis of your students across all quizzes.</p>
                            </div>
                            <div className="flex gap-3">
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                >
                                    <option value="all">All Classes</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                    ))}
                                </select>
                                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    <span className="material-symbols-outlined text-sm">download</span>
                                    Export CSV
                                </button>
                            </div>
                        </section>

                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Quiz</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Score</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trend</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {loading ? (
                                        [1, 2, 3, 4, 5].map(i => (
                                            <tr key={i} className="animate-pulse">
                                                <td colSpan="6" className="px-6 py-4 h-16 bg-slate-50/50 dark:bg-slate-800/20"></td>
                                            </tr>
                                        ))
                                    ) : reports.length > 0 ? (
                                        reports.map(report => (
                                            <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                                                            {report.profiles?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                                                {report.profiles?.full_name || 'Unknown Student'}
                                                            </p>
                                                            <p className="text-xs text-slate-500 truncate max-w-[150px]">{report.profiles?.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{report.quizzes?.title}</p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    {new Date(report.completed_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`text-base font-bold ${report.percentage >= 80 ? 'text-green-600' :
                                                            report.percentage >= 60 ? 'text-amber-600' : 'text-red-600'
                                                        }`}>
                                                        {report.percentage}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`material-symbols-outlined text-sm ${report.percentage >= 80 ? 'text-green-600' :
                                                            report.percentage >= 60 ? 'text-amber-600' : 'text-red-600'
                                                        }`}>
                                                        {report.percentage >= 80 ? 'trending_up' : report.percentage >= 60 ? 'trending_flat' : 'trending_down'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link
                                                        to={`/quiz/feedback/${report.id}`}
                                                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                                    >
                                                        Review <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">assessment</span>
                                                    <p className="text-lg font-bold text-slate-900 dark:text-white">No reports yet</p>
                                                    <p className="text-sm text-slate-500 max-w-xs mx-auto">Once students start taking your quizzes, their scores will appear here.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
