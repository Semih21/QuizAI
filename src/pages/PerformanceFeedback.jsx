import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function PerformanceFeedback() {
    const { attemptId } = useParams()
    const [attempt, setAttempt] = useState(null)
    const [responses, setResponses] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const { data: attemptData } = await supabase
                    .from('quiz_attempts')
                    .select('*, quizzes(title, subjects(name))')
                    .eq('id', attemptId)
                    .single()

                const { data: responsesData } = await supabase
                    .from('question_responses')
                    .select('*, questions(question_text, explanation, question_options(*))')
                    .eq('attempt_id', attemptId)

                setAttempt(attemptData)
                setResponses(responsesData || [])
            } catch (error) {
                console.error('Error fetching feedback:', error)
            } finally {
                setLoading(false)
            }
        }
        if (attemptId) fetchData()
    }, [attemptId])

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
        )
    }

    if (!attempt) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">error</span>
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Attempt not found</h2>
                    <Link to="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">Go to Dashboard</Link>
                </div>
            </div>
        )
    }

    const percentage = attempt.percentage || 0
    const grade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'F'
    const gradeColor = percentage >= 80 ? 'text-green-600' : percentage >= 60 ? 'text-amber-600' : 'text-red-600'
    const correctCount = responses.filter(r => r.is_correct).length
    const incorrectCount = responses.length - correctCount

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 dark:text-white">{attempt.quizzes?.title || 'Quiz Results'}</h1>
                            <p className="text-xs text-slate-500">{attempt.quizzes?.subjects?.name || 'General'}</p>
                        </div>
                    </div>
                    <Link to="/student/quiz-management" className="text-sm font-semibold text-blue-600 hover:underline">
                        Back to Quizzes
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">
                {/* Score Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-8 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        {/* Score Circle */}
                        <div className="flex flex-col items-center">
                            <div className="relative w-40 h-40">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" className="dark:stroke-slate-700" />
                                    <circle
                                        cx="50" cy="50" r="45" fill="none"
                                        stroke={percentage >= 80 ? '#22c55e' : percentage >= 60 ? '#f59e0b' : '#ef4444'}
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        strokeDasharray={`${percentage * 2.83} 283`}
                                        className="transition-all duration-1000"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-4xl font-bold ${gradeColor}`}>{percentage}%</span>
                                    <span className="text-sm text-slate-500">Score</span>
                                </div>
                            </div>
                            <div className={`mt-4 text-6xl font-black ${gradeColor}`}>{grade}</div>
                        </div>

                        {/* Stats */}
                        <div className="flex-1 grid grid-cols-2 gap-4 max-w-sm">
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
                                <span className="material-symbols-outlined text-green-600 text-3xl mb-2 block">check_circle</span>
                                <p className="text-2xl font-bold text-green-600">{correctCount}</p>
                                <p className="text-xs text-green-600/80">Correct</p>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center">
                                <span className="material-symbols-outlined text-red-600 text-3xl mb-2 block">cancel</span>
                                <p className="text-2xl font-bold text-red-600">{incorrectCount}</p>
                                <p className="text-xs text-red-600/80">Incorrect</p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                                <span className="material-symbols-outlined text-blue-600 text-3xl mb-2 block">timer</span>
                                <p className="text-2xl font-bold text-blue-600">{Math.round((attempt.time_spent_seconds || 0) / 60)}m</p>
                                <p className="text-xs text-blue-600/80">Time Spent</p>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
                                <span className="material-symbols-outlined text-purple-600 text-3xl mb-2 block">quiz</span>
                                <p className="text-2xl font-bold text-purple-600">{responses.length}</p>
                                <p className="text-xs text-purple-600/80">Questions</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Feedback */}
                <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
                    <div className="flex items-start gap-4">
                        <div className="bg-white/20 p-3 rounded-xl shrink-0">
                            <span className="material-symbols-outlined text-2xl">psychology</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-2">AI Feedback</h3>
                            <p className="text-blue-100 leading-relaxed">
                                {percentage >= 80
                                    ? "Excellent work! You've demonstrated a strong understanding of the material. Keep up the great effort!"
                                    : percentage >= 60
                                        ? "Good effort! You're on the right track. Consider reviewing the topics where you made mistakes to solidify your understanding."
                                        : "This topic needs more practice. Don't worry - review the explanations below and try again. Every attempt helps you learn!"
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Question Review */}
                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Question Review</h2>
                    <div className="flex flex-col gap-4">
                        {responses.map((response, index) => {
                            const question = response.questions
                            const selectedOption = question?.question_options?.find(o => o.id === response.selected_option_id)
                            const correctOption = question?.question_options?.find(o => o.is_correct)

                            return (
                                <div
                                    key={response.id}
                                    className={`bg-white dark:bg-slate-900 rounded-xl border-2 p-6 transition-all ${response.is_correct
                                            ? 'border-green-200 dark:border-green-800'
                                            : 'border-red-200 dark:border-red-800'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="flex items-start gap-3">
                                            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${response.is_correct
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                                                    : 'bg-red-100 dark:bg-red-900/30 text-red-600'
                                                }`}>
                                                <span className="material-symbols-outlined text-sm">
                                                    {response.is_correct ? 'check' : 'close'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Question {index + 1}</p>
                                                <h4 className="font-bold text-slate-900 dark:text-white">{question?.question_text}</h4>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ml-11 space-y-2">
                                        {selectedOption && !response.is_correct && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-red-600 font-medium">Your answer:</span>
                                                <span className="text-slate-700 dark:text-slate-300">{selectedOption.option_text}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-green-600 font-medium">Correct answer:</span>
                                            <span className="text-slate-700 dark:text-slate-300">{correctOption?.option_text}</span>
                                        </div>
                                        {question?.explanation && (
                                            <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                <p className="text-xs font-semibold text-slate-500 mb-1">Explanation</p>
                                                <p className="text-sm text-slate-700 dark:text-slate-300">{question.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to={`/quiz/active/${attempt.quiz_id}`}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold text-center hover:bg-blue-700 transition-colors"
                    >
                        Retake Quiz
                    </Link>
                    <Link
                        to="/student/quiz-management"
                        className="px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white rounded-lg font-bold text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        Explore More Quizzes
                    </Link>
                </div>
            </main>
        </div>
    )
}
