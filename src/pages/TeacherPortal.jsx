import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import StatsCard from '../components/StatsCard'

export default function TeacherPortal() {
    const { profile } = useAuth()
    const [stats, setStats] = useState({ activeQuizzes: 24, totalStudents: 142, avgScore: 78 })
    const [recentActivity, setRecentActivity] = useState([])
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const { data: classesData } = await supabase
                    .from('classes')
                    .select('*, class_members(count)')
                    .eq('teacher_id', profile?.id)
                    .limit(4)

                setClasses(classesData || [])
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }
        if (profile?.id) fetchData()
    }, [profile])

    const firstName = profile?.full_name?.split(' ')[0] || 'Teacher'
    const greeting = new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 17 ? 'Good Afternoon' : 'Good Evening'

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <Sidebar />

            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <Header showCreateButton />

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-6xl mx-auto flex flex-col gap-8">
                        {/* Welcome Section */}
                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                                {greeting}, {firstName}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400">Here's what's happening in your classes today.</p>
                        </section>

                        {/* Stats Cards */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatsCard
                                icon="quiz"
                                iconBg="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                value={stats.activeQuizzes}
                                label="Active Quizzes"
                                change="+2"
                                changeType="positive"
                            />
                            <StatsCard
                                icon="school"
                                iconBg="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                value={stats.totalStudents}
                                label="Total Students"
                                change="+12"
                                changeType="positive"
                            />
                            <StatsCard
                                icon="monitoring"
                                iconBg="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                                value={`${stats.avgScore}%`}
                                label="Avg. Class Score"
                                change="+4%"
                                changeType="positive"
                            />
                        </section>

                        {/* AI Quiz Generator Hero */}
                        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-lg overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent pointer-events-none"></div>
                            <div className="p-6 md:p-8 relative z-10">
                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-2 text-blue-600 font-semibold">
                                            <span className="material-symbols-outlined">auto_awesome</span>
                                            <span>AI Assessment Creator</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Create your next quiz in seconds</h3>
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                                            Upload your course materials (PDF, DOCX) or paste a topic. Our AI will analyze the content and generate a comprehensive quiz tailored to your students' level.
                                        </p>
                                        <div className="pt-2">
                                            <Link
                                                to="/quiz/create/ai"
                                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
                                            >
                                                <span className="material-symbols-outlined">generating_tokens</span>
                                                Generate AI Quiz
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-[400px] flex-shrink-0">
                                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <div className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-sm mb-3 text-blue-600">
                                                    <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                                                </div>
                                                <p className="mb-1 text-sm text-slate-700 dark:text-slate-300 font-medium">Click to upload or drag and drop</p>
                                                <p className="text-xs text-slate-500">PDF, DOCX, or TXT (max. 10MB)</p>
                                            </div>
                                            <input type="file" className="hidden" accept=".pdf,.docx,.txt" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Quick Actions & Class Overview */}
                        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Quick Actions */}
                            <div className="lg:col-span-1 flex flex-col gap-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick Actions</h3>
                                <div className="flex flex-col gap-3">
                                    <Link to="/quiz/create/ai" className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                            <span className="material-symbols-outlined">auto_awesome</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Create AI Quiz</p>
                                            <p className="text-xs text-slate-500">Generate from any topic</p>
                                        </div>
                                    </Link>
                                    <Link to="/quiz/create/manual" className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                                            <span className="material-symbols-outlined">edit_note</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">Manual Quiz Editor</p>
                                            <p className="text-xs text-slate-500">Create custom questions</p>
                                        </div>
                                    </Link>
                                    <Link to="/teacher/classes" className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group">
                                        <div className="p-2 bg-teal-100 dark:bg-teal-900/30 text-teal-600 rounded-lg">
                                            <span className="material-symbols-outlined">group_add</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">Create New Class</p>
                                            <p className="text-xs text-slate-500">Invite students to join</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            {/* Class Performance Chart */}
                            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Class Performance</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Average scores by class</p>
                                    </div>
                                    <select className="text-sm bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300">
                                        <option>This Week</option>
                                        <option>This Month</option>
                                        <option>This Semester</option>
                                    </select>
                                </div>
                                <div className="h-64 flex items-end justify-around gap-4 pt-8">
                                    {['Math 101', 'Physics 201', 'Chem 101', 'Bio 301', 'Calc 102'].map((cls, idx) => {
                                        const heights = [85, 72, 78, 91, 68]
                                        const colors = ['bg-blue-500', 'bg-purple-500', 'bg-teal-500', 'bg-green-500', 'bg-orange-500']
                                        return (
                                            <div key={cls} className="flex flex-col items-center gap-2 flex-1">
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{heights[idx]}%</span>
                                                <div
                                                    className={`w-full max-w-[48px] ${colors[idx]} rounded-t-lg transition-all duration-500`}
                                                    style={{ height: `${heights[idx] * 2}px` }}
                                                ></div>
                                                <span className="text-xs text-slate-500 text-center">{cls}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </section>

                        {/* Recent Activity */}
                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Student Activity</h3>
                                <button className="text-sm font-semibold text-blue-600 hover:underline">View All</button>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800">
                                {[
                                    { name: 'Sarah Chen', action: 'completed', quiz: 'Calculus Midterm', score: 94, time: '5 min ago' },
                                    { name: 'Marcus Johnson', action: 'started', quiz: 'Physics Chapter 5', score: null, time: '12 min ago' },
                                    { name: 'Emily Rodriguez', action: 'completed', quiz: 'Chemistry Lab Quiz', score: 88, time: '23 min ago' },
                                    { name: 'James Wilson', action: 'completed', quiz: 'Algebra Practice', score: 76, time: '1 hour ago' },
                                ].map((activity, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                                {activity.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-white">{activity.name}</p>
                                                <p className="text-sm text-slate-500">
                                                    {activity.action === 'completed'
                                                        ? <span className="text-green-600">Completed</span>
                                                        : <span className="text-blue-600">Started</span>
                                                    } {activity.quiz}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {activity.score !== null && (
                                                <span className={`text-lg font-bold ${activity.score >= 80 ? 'text-green-600' : activity.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                                                    {activity.score}%
                                                </span>
                                            )}
                                            <p className="text-xs text-slate-400">{activity.time}</p>
                                        </div>
                                    </div>
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
