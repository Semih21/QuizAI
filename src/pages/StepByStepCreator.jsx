import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'

const steps = [
    { id: 1, title: 'Quiz Details', icon: 'info' },
    { id: 2, title: 'Add Questions', icon: 'quiz' },
    { id: 3, title: 'Settings', icon: 'settings' },
    { id: 4, title: 'Review & Publish', icon: 'published_with_changes' },
]

export default function StepByStepCreator() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [currentStep, setCurrentStep] = useState(1)
    const [quizData, setQuizData] = useState({
        title: '',
        description: '',
        difficulty: 'intermediate',
        subject: '',
    })
    const [questions, setQuestions] = useState([])
    const [settings, setSettings] = useState({
        timeLimit: 20,
        passingScore: 60,
        allowRetakes: true,
    })

    const nextStep = () => setCurrentStep(Math.min(currentStep + 1, 4))
    const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 1))

    const addQuestion = () => {
        setQuestions([...questions, {
            question_text: '',
            options: [
                { option_text: '', is_correct: true },
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false },
            ]
        }])
    }

    const handlePublish = async () => {
        try {
            const { data: quiz } = await supabase
                .from('quizzes')
                .insert({
                    title: quizData.title,
                    description: quizData.description,
                    difficulty: quizData.difficulty,
                    estimated_minutes: settings.timeLimit,
                    created_by: user?.id,
                    is_published: true
                })
                .select()
                .single()

            for (let i = 0; i < questions.length; i++) {
                const q = questions[i]
                const { data: question } = await supabase
                    .from('questions')
                    .insert({
                        quiz_id: quiz.id,
                        question_text: q.question_text,
                        question_type: 'multiple_choice',
                        order_index: i
                    })
                    .select()
                    .single()

                for (const opt of q.options) {
                    if (opt.option_text.trim()) {
                        await supabase.from('question_options').insert({
                            question_id: question.id,
                            option_text: opt.option_text,
                            is_correct: opt.is_correct
                        })
                    }
                }
            }

            navigate('/teacher')
        } catch (error) {
            console.error('Error publishing quiz:', error)
        }
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <Sidebar />

            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="h-16 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/teacher" className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </Link>
                        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Create Quiz</h1>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-3xl mx-auto">
                        {/* Steps Indicator */}
                        <div className="flex items-center justify-between mb-8">
                            {steps.map((step, idx) => (
                                <div key={step.id} className="flex items-center">
                                    <div
                                        className={`flex flex-col items-center cursor-pointer ${currentStep >= step.id ? 'text-blue-600' : 'text-slate-400'
                                            }`}
                                        onClick={() => setCurrentStep(step.id)}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-colors ${currentStep >= step.id
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-200 dark:bg-slate-700'
                                            }`}>
                                            <span className="material-symbols-outlined text-sm">{step.icon}</span>
                                        </div>
                                        <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                                    </div>
                                    {idx < steps.length - 1 && (
                                        <div className={`w-12 sm:w-24 h-0.5 mx-2 ${currentStep > step.id ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                                            }`}></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Step Content */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm min-h-[400px]">
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quiz Details</h2>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Title</label>
                                        <input
                                            type="text"
                                            value={quizData.title}
                                            onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                                            placeholder="Enter quiz title"
                                            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                                        <textarea
                                            value={quizData.description}
                                            onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                                            placeholder="Brief description"
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
                                        <select
                                            value={quizData.difficulty}
                                            onChange={(e) => setQuizData({ ...quizData, difficulty: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Questions</h2>
                                        <button
                                            onClick={addQuestion}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-sm">add</span>
                                            Add Question
                                        </button>
                                    </div>
                                    {questions.length === 0 ? (
                                        <div className="text-center py-12 text-slate-500">
                                            <span className="material-symbols-outlined text-5xl mb-4 block">quiz</span>
                                            <p>No questions yet. Click "Add Question" to get started.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {questions.map((q, idx) => (
                                                <div key={idx} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                                                    <p className="text-sm font-semibold text-slate-500 mb-2">Question {idx + 1}</p>
                                                    <input
                                                        type="text"
                                                        value={q.question_text}
                                                        onChange={(e) => {
                                                            const updated = [...questions]
                                                            updated[idx].question_text = e.target.value
                                                            setQuestions(updated)
                                                        }}
                                                        placeholder="Enter question"
                                                        className="w-full px-3 py-2 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quiz Settings</h2>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Time Limit (minutes)</label>
                                        <input
                                            type="number"
                                            value={settings.timeLimit}
                                            onChange={(e) => setSettings({ ...settings, timeLimit: Number(e.target.value) })}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Passing Score (%)</label>
                                        <input
                                            type="number"
                                            value={settings.passingScore}
                                            onChange={(e) => setSettings({ ...settings, passingScore: Number(e.target.value) })}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Review & Publish</h2>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                            <p className="text-sm text-slate-500 mb-1">Title</p>
                                            <p className="font-semibold text-slate-900 dark:text-white">{quizData.title || 'Untitled'}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                            <p className="text-sm text-slate-500 mb-1">Questions</p>
                                            <p className="font-semibold text-slate-900 dark:text-white">{questions.length} questions</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                            <p className="text-sm text-slate-500 mb-1">Time Limit</p>
                                            <p className="font-semibold text-slate-900 dark:text-white">{settings.timeLimit} minutes</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className="px-6 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Previous
                            </button>
                            {currentStep < 4 ? (
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    onClick={handlePublish}
                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">publish</span>
                                    Publish Quiz
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
