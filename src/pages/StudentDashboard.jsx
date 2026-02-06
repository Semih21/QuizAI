import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import StatsCard from '../components/StatsCard'

export default function StudentDashboard() {
    const { profile } = useAuth()
    const [subjects, setSubjects] = useState([])
    const [stats, setStats] = useState({ accuracy: 82, quizzesCompleted: 14, streak: 5 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const { data: subjectsData } = await supabase
                    .from('subjects')
                    .select('*')
                    .limit(4)

                setSubjects(subjectsData || [])
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const subjectImages = {
        Mathematics: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
        Science: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
        History: 'https://images.unsplash.com/photo-1461360370896-922624d12a74?w=400',
        Literature: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        English: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400',
        Art: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
    }

    const subjectColors = {
        Mathematics: 'text-purple-600 dark:text-purple-400',
        Science: 'text-teal-600 dark:text-teal-400',
        History: 'text-amber-700 dark:text-amber-500',
        Literature: 'text-rose-600 dark:text-rose-400',
        English: 'text-emerald-600 dark:text-emerald-400',
        Art: 'text-pink-600 dark:text-pink-400',
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <Sidebar />

            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <Header showCreateButton />

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-6xl mx-auto flex flex-col gap-8">
                        {/* Welcome Section */}
                        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                                    Welcome back, {profile?.full_name?.split(' ')[0] || 'Student'}! 🎓
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400">Ready to continue your learning journey today?</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Last login: Today
                            </div>
                        </section>

                        {/* Stats Cards */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatsCard
                                icon="target"
                                iconBg="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                value={`${stats.accuracy}%`}
                                label="Average Accuracy"
                                change="+2.5%"
                                changeType="positive"
                            />
                            <StatsCard
                                icon="library_books"
                                iconBg="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                                value={stats.quizzesCompleted}
                                label="Quizzes Completed"
                                change="3 New"
                                changeType="positive"
                            />
                            <StatsCard
                                icon="local_fire_department"
                                iconBg="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                                value={`${stats.streak} Days`}
                                label="Current Streak"
                                change="Keep it up!"
                                changeType="positive"
                            />
                        </section>

                        {/* Charts & AI Recommendations */}
                        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Chart Area */}
                            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Weekly Performance</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Accuracy trends over the last 7 days</p>
                                    </div>
                                </div>
                                <div className="relative h-64 w-full">
                                    <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <line x1="0" y1="225" x2="800" y2="225" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" className="dark:stroke-slate-700" />
                                        <line x1="0" y1="150" x2="800" y2="150" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" className="dark:stroke-slate-700" />
                                        <line x1="0" y1="75" x2="800" y2="75" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" className="dark:stroke-slate-700" />
                                        <path d="M0 225 C 100 200, 150 250, 200 180 S 300 100, 400 120 S 500 80, 600 90 S 700 40, 800 60 V 300 H 0 Z" fill="url(#chartGradient)" />
                                        <path d="M0 225 C 100 200, 150 250, 200 180 S 300 100, 400 120 S 500 80, 600 90 S 700 40, 800 60" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                                        <circle cx="200" cy="180" r="4" fill="white" stroke="#3b82f6" strokeWidth="2" />
                                        <circle cx="400" cy="120" r="4" fill="white" stroke="#3b82f6" strokeWidth="2" />
                                        <circle cx="600" cy="90" r="4" fill="white" stroke="#3b82f6" strokeWidth="2" />
                                        <circle cx="800" cy="60" r="4" fill="white" stroke="#3b82f6" strokeWidth="2" />
                                    </svg>
                                </div>
                                <div className="flex justify-between mt-4 px-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                </div>
                            </div>

                            {/* AI Recommendations */}
                            <div className="lg:col-span-1 flex flex-col gap-4">
                                <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="material-symbols-outlined text-yellow-300">auto_awesome</span>
                                            <h3 className="text-base font-bold">Recommended for You</h3>
                                        </div>
                                        <p className="text-indigo-100 text-sm mb-4 leading-relaxed">
                                            Based on your recent quizzes, try exploring more <strong>Science</strong> topics.
                                        </p>
                                        <Link
                                            to="/student/quiz-management"
                                            className="block w-full py-2 bg-white text-blue-600 text-sm font-bold rounded-lg shadow-sm hover:bg-indigo-50 transition-colors text-center"
                                        >
                                            Start Review Quiz
                                        </Link>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-start gap-3">
                                    <div className="text-orange-500 bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg shrink-0">
                                        <span className="material-symbols-outlined">lightbulb</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Study Tip</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Try breaking your study sessions into 25-minute intervals for better retention.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Explore Subjects */}
                        <section>
                            <div className="flex justify-between items-center mb-6 px-1">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Explore Subjects</h3>
                                <Link to="/student/quiz-management" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
                                    View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {subjects.map((subject) => (
                                    <Link
                                        key={subject.id}
                                        to={`/student/quiz-management?subject=${subject.id}`}
                                        className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 flex flex-col"
                                    >
                                        <div className="h-32 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                            <img
                                                src={subjectImages[subject.name] || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400'}
                                                alt={subject.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/60 backdrop-blur-sm p-1.5 rounded-lg shadow-sm">
                                                <span className={`material-symbols-outlined text-sm ${subjectColors[subject.name] || 'text-blue-600'}`}>
                                                    {subject.icon || 'school'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4 flex flex-col flex-1">
                                            <div className="mb-3">
                                                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${subjectColors[subject.name] || 'text-blue-600'}`}>
                                                    {subject.name}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                                    {subject.description}
                                                </p>
                                            </div>
                                            <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                                <span className="text-xs text-slate-400 font-medium">12 Quizzes</span>
                                                <span className="text-xs font-bold text-blue-600 hover:underline">Start Now</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* Footer */}
                        <footer className="mt-8 text-center text-xs text-slate-400 pb-4">
                            <p>© 2024 QuizAI. All rights reserved.</p>
                        </footer>
                    </div>
                </div>
            </main>
        </div>
    )
}
