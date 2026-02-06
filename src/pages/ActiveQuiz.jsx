import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function ActiveQuiz() {
    const { id: quizId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [quiz, setQuiz] = useState(null)
    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState({})
    const [flagged, setFlagged] = useState(new Set())
    const [loading, setLoading] = useState(true)
    const [timeLeft, setTimeLeft] = useState(0)
    const [attemptId, setAttemptId] = useState(null)

    useEffect(() => {
        async function fetchQuiz() {
            try {
                const { data: quizData } = await supabase
                    .from('quizzes')
                    .select('*, subjects(name)')
                    .eq('id', quizId)
                    .single()

                const { data: questionsData } = await supabase
                    .from('questions')
                    .select('*, question_options(*)')
                    .eq('quiz_id', quizId)
                    .order('order_index')

                if (quizData) {
                    setQuiz(quizData)
                    setQuestions(questionsData || [])
                    setTimeLeft((quizData.estimated_minutes || 20) * 60)

                    // Create attempt
                    const { data: attempt } = await supabase
                        .from('quiz_attempts')
                        .insert({ quiz_id: quizId, student_id: user?.id, status: 'in_progress' })
                        .select()
                        .single()

                    if (attempt) setAttemptId(attempt.id)
                }
            } catch (error) {
                console.error('Error fetching quiz:', error)
            } finally {
                setLoading(false)
            }
        }
        if (quizId && user) fetchQuiz()
    }, [quizId, user])

    // Timer
    useEffect(() => {
        if (timeLeft <= 0) return
        const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
        return () => clearInterval(timer)
    }, [timeLeft])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const currentQuestion = questions[currentIndex]
    const progress = questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0
    const answeredCount = Object.keys(answers).length

    const selectAnswer = (optionId) => {
        setAnswers({ ...answers, [currentQuestion.id]: optionId })
    }

    const toggleFlag = () => {
        const newFlagged = new Set(flagged)
        if (newFlagged.has(currentQuestion.id)) {
            newFlagged.delete(currentQuestion.id)
        } else {
            newFlagged.add(currentQuestion.id)
        }
        setFlagged(newFlagged)
    }

    const goToQuestion = (index) => {
        setCurrentIndex(index)
    }

    const handleSubmit = async () => {
        if (!attemptId) return

        // Calculate score
        let score = 0
        let maxScore = 0

        for (const question of questions) {
            const selectedOptionId = answers[question.id]
            const correctOption = question.question_options?.find(o => o.is_correct)
            maxScore += question.points || 1

            if (selectedOptionId && correctOption && selectedOptionId === correctOption.id) {
                score += question.points || 1
            }

            // Save response
            await supabase.from('question_responses').insert({
                attempt_id: attemptId,
                question_id: question.id,
                selected_option_id: selectedOptionId || null,
                is_correct: selectedOptionId === correctOption?.id
            })
        }

        const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0

        // Update attempt
        await supabase.from('quiz_attempts').update({
            score,
            max_score: maxScore,
            percentage,
            status: 'completed',
            completed_at: new Date().toISOString(),
            time_spent_seconds: (quiz?.estimated_minutes || 20) * 60 - timeLeft
        }).eq('id', attemptId)

        navigate(`/quiz/feedback/${attemptId}`)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
        )
    }

    if (!quiz || questions.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">quiz</span>
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Quiz not found</h2>
                    <p className="text-slate-500 mb-4">This quiz doesn't have any questions yet.</p>
                    <button onClick={() => navigate(-1)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">Go Back</button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-6 lg:px-10 shrink-0 z-20 shadow-sm">
                <div className="flex items-center gap-4 min-w-0">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="flex flex-col min-w-0">
                        <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">{quiz.title}</h1>
                        <span className="text-xs text-slate-500 hidden sm:block">{quiz.subjects?.name || 'General'}</span>
                    </div>
                </div>

                <div className="hidden md:flex flex-col gap-1.5 w-1/3 max-w-md mx-4">
                    <div className="flex justify-between items-end text-xs font-medium text-slate-500">
                        <span>Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${timeLeft < 60
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}>
                        <span className="material-symbols-outlined text-xl">timer</span>
                        <span className="text-sm font-bold font-mono">{formatTime(timeLeft)}</span>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors shadow-sm"
                    >
                        Submit Quiz
                    </button>
                </div>
            </header>

            {/* Main Layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Question Content */}
                <main className="flex-1 overflow-y-auto relative flex flex-col items-center">
                    <div className="w-full max-w-4xl px-6 py-8 md:py-12 flex flex-col gap-8 pb-32">
                        {/* Question Header */}
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                                Question {currentIndex + 1} of {questions.length}
                            </span>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                                {currentQuestion.question_text}
                            </h2>
                        </div>

                        {/* Answer Options */}
                        <div className="flex flex-col gap-3">
                            {currentQuestion.question_options?.map((option) => {
                                const isSelected = answers[currentQuestion.id] === option.id
                                return (
                                    <label
                                        key={option.id}
                                        className={`group relative flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all shadow-sm ${isSelected
                                                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10'
                                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${currentQuestion.id}`}
                                            className="sr-only"
                                            checked={isSelected}
                                            onChange={() => selectAnswer(option.id)}
                                        />
                                        <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 shrink-0 transition-colors ${isSelected
                                                ? 'border-blue-600 bg-blue-600 text-white'
                                                : 'border-slate-300 dark:border-slate-600'
                                            }`}>
                                            {isSelected && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                                        </div>
                                        <span className={`text-base md:text-lg font-medium ${isSelected
                                                ? 'text-blue-600 dark:text-blue-300'
                                                : 'text-slate-700 dark:text-slate-300'
                                            }`}>
                                            {option.option_text}
                                        </span>
                                    </label>
                                )
                            })}
                        </div>

                        {/* Navigation */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <button
                                onClick={toggleFlag}
                                className={`flex items-center gap-2 font-bold py-2 px-4 rounded-lg transition-colors ${flagged.has(currentQuestion.id)
                                        ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span className="material-symbols-outlined">flag</span>
                                <span className="text-sm">{flagged.has(currentQuestion.id) ? 'Flagged' : 'Flag for Review'}</span>
                            </button>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button
                                    onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                                    disabled={currentIndex === 0}
                                    className="flex-1 sm:flex-none border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white font-bold py-2.5 px-6 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                {currentIndex < questions.length - 1 ? (
                                    <button
                                        onClick={() => setCurrentIndex(currentIndex + 1)}
                                        className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-lg shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        Save & Next
                                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-sm">arrow_forward_ios</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-8 rounded-lg shadow-lg shadow-green-500/30 transition-all"
                                    >
                                        Submit Quiz
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Question Navigator Sidebar */}
                <aside className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 flex-col hidden lg:flex shadow-sm z-10">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Question Navigator</h3>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-xs text-slate-500 font-medium">Answered</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                                <span className="text-xs text-slate-500 font-medium">Current</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                                <span className="text-xs text-slate-500 font-medium">Flagged</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800"></div>
                                <span className="text-xs text-slate-500 font-medium">Not Visited</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-5 gap-3">
                            {questions.map((q, idx) => {
                                const isAnswered = answers[q.id] !== undefined
                                const isCurrent = idx === currentIndex
                                const isFlagged = flagged.has(q.id)

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => goToQuestion(idx)}
                                        className={`w-10 h-10 rounded-lg font-bold text-sm flex items-center justify-center transition-colors relative ${isCurrent
                                                ? 'bg-white dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-slate-900 shadow-lg'
                                                : isFlagged
                                                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
                                                    : isAnswered
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200'
                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        {idx + 1}
                                        {isFlagged && (
                                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-slate-500">Section Completion</span>
                            <span className="font-bold text-slate-900 dark:text-white">{answeredCount}/{questions.length}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 rounded-full transition-all"
                                style={{ width: `${questions.length > 0 ? (answeredCount / questions.length) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Mobile Footer */}
            <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4 lg:hidden z-30 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">{answeredCount} of {questions.length} Answered</span>
                <button className="text-blue-600 font-bold text-sm flex items-center gap-2">
                    View All Questions
                    <span className="material-symbols-outlined">expand_less</span>
                </button>
            </div>
        </div>
    )
}
