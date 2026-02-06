import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function TeacherClasses() {
    const { profile } = useAuth()
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [newClassName, setNewClassName] = useState('')
    const [newClassDesc, setNewClassDesc] = useState('')

    useEffect(() => {
        async function fetchClasses() {
            try {
                // Fetch classes and join with class_members count
                const { data, error } = await supabase
                    .from('classes')
                    .select(`
                        *,
                        class_members(count)
                    `)
                    .eq('teacher_id', profile?.id)

                if (error) throw error
                setClasses(data || [])
            } catch (error) {
                console.error('Error fetching classes:', error)
            } finally {
                setLoading(false)
            }
        }
        if (profile?.id) fetchClasses()
    }, [profile])

    const handleCreateClass = async (e) => {
        e.preventDefault()
        if (!newClassName.trim()) return

        try {
            const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase()
            const { data, error } = await supabase
                .from('classes')
                .insert({
                    name: newClassName,
                    description: newClassDesc,
                    teacher_id: profile.id,
                    join_code: joinCode
                })
                .select()
                .single()

            if (error) throw error
            setClasses([...classes, { ...data, class_members: [{ count: 0 }] }])
            setShowCreateModal(false)
            setNewClassName('')
            setNewClassDesc('')
        } catch (error) {
            console.error('Error creating class:', error)
        }
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <Sidebar />

            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <Header showCreateButton />

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-6xl mx-auto flex flex-col gap-8">
                        <section className="flex justify-between items-end">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">My Classes</h2>
                                <p className="text-slate-500 dark:text-slate-400">Manage your students and track their progress by class.</p>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm transition-all"
                            >
                                <span className="material-symbols-outlined">group_add</span>
                                Create New Class
                            </button>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <div key={i} className="bg-white dark:bg-slate-900 rounded-xl h-48 animate-pulse border border-slate-200 dark:border-slate-800"></div>
                                ))
                            ) : classes.length > 0 ? (
                                classes.map(cls => (
                                    <div key={cls.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{cls.name}</h3>
                                                <p className="text-sm text-slate-500 line-clamp-1">{cls.description || 'No description'}</p>
                                            </div>
                                            <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-xs font-bold font-mono">
                                                {cls.join_code}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                                            <div className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-base">groups</span>
                                                <span>{cls.class_members?.[0]?.count || 0} Students</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-base">calendar_today</span>
                                                <span>Created {new Date(cls.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-colors">
                                                View Students
                                            </button>
                                            <button className="flex-1 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold transition-colors">
                                                Assign Quiz
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-4">
                                        <span className="material-symbols-outlined text-3xl">groups</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No classes yet</h3>
                                    <p className="text-slate-500 dark:text-slate-400 mb-6">Create your first class to start inviting students.</p>
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                                    >
                                        Create Your First Class
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Create Class Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create New Class</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleCreateClass} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Class Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newClassName}
                                    onChange={(e) => setNewClassName(e.target.value)}
                                    placeholder="e.g. Mathematics 101"
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description (Optional)</label>
                                <textarea
                                    value={newClassDesc}
                                    onChange={(e) => setNewClassDesc(e.target.value)}
                                    placeholder="Brief description of the class..."
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-24 resize-none"
                                ></textarea>
                            </div>
                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 py-2.5 px-4 rounded-lg font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md shadow-blue-500/20 transition-all"
                                >
                                    Create Class
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
