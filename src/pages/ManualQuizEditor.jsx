import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/Sidebar'

export default function ManualQuizEditor() {
    const navigate = useNavigate()
    const { user } = useAuth()

    const [quizTitle, setQuizTitle] = useState('')
    const [quizDescription, setQuizDescription] = useState('')
    const [difficulty, setDifficulty] = useState('intermediate')
    const [questions, setQuestions] = useState([
        {
            question_text: '',
            question_type: 'multiple_choice',
            options: [
                { option_text: '', is_correct: true },
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false },
            ]
        }
    ])
    const [saving, setSaving] = useState(false)

    const addQuestion = () => {
        setQuestions([...questions, {
            question_text: '',
            question_type: 'multiple_choice',
            options: [
                { option_text: '', is_correct: true },
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false },
            ]
        }])
    }

    const removeQuestion = (index) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, i) => i !== index))
        }
    }

    const updateQuestion = (index, field, value) => {
        const updated = [...questions]
        updated[index][field] = value
        setQuestions(updated)
    }

    const updateOption = (qIndex, oIndex, field, value) => {
        const updated = [...questions]
        if (field === 'is_correct') {
            // Only one correct answer
            updated[qIndex].options = updated[qIndex].options.map((opt, i) => ({
                ...opt,
                is_correct: i === oIndex
            }))
        } else {
            updated[qIndex].options[oIndex][field] = value
        }
        setQuestions(updated)
    }

    const handleSave = async () => {
        if (!quizTitle.trim() || questions.some(q => !q.question_text.trim())) return

        setSaving(true)

        try {
            // Create quiz
            const { data: quiz, error: quizError } = await supabase
                .from('quizzes')
                .insert({
                    title: quizTitle,
                    description: quizDescription,
                    difficulty,
                    estimated_minutes: Math.ceil(questions.length * 1.5),
                    created_by: user?.id,
                    is_ai_generated: false,
                    is_published: false
                })
                .select()
                .single()

            if (quizError) throw quizError

            // Create questions
            for (let i = 0; i < questions.length; i++) {
                const q = questions[i]
                const { data: question, error: qError } = await supabase
                    .from('questions')
                    .insert({
                        quiz_id: quiz.id,
                        question_text: q.question_text,
                        question_type: q.question_type,
                        points: 1,
                        order_index: i
                    })
                    .select()
                    .single()

                if (qError) throw qError

                // Create options
                for (let j = 0; j < q.options.length; j++) {
                    const opt = q.options[j]
                    if (opt.option_text.trim()) {
                        await supabase.from('question_options').insert({
                            question_id: question.id,
                            option_text: opt.option_text,
                            is_correct: opt.is_correct,
                            order_index: j
                        })
                    }
                }
            }

            navigate('/teacher')
        } catch (error) {
            console.error('Error saving quiz:', error)
        } finally {
            setSaving(false)
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
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Manual Quiz Editor</h1>
                            <p className="text-xs text-slate-500">Create custom questions</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saving || !quizTitle.trim()}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white rounded-lg font-semibold shadow-sm transition-colors flex items-center gap-2"
                        >
                            {saving ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            ) : (
                                <span className="material-symbols-outlined text-sm">save</span>
                            )}
                            Save Quiz
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Quiz Details */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quiz Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Quiz Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={quizTitle}
                                        onChange={(e) => setQuizTitle(e.target.value)}
                                        placeholder="Enter quiz title"
                                        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={quizDescription}
                                        onChange={(e) => setQuizDescription(e.target.value)}
                                        placeholder="Brief description of the quiz"
                                        rows={2}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Difficulty
                                    </label>
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Questions */}
                        {questions.map((question, qIndex) => (
                            <div key={qIndex} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold text-sm">
                                            {qIndex + 1}
                                        </span>
                                        <h3 className="font-bold text-slate-900 dark:text-white">Question {qIndex + 1}</h3>
                                    </div>
                                    {questions.length > 1 && (
                                        <button
                                            onClick={() => removeQuestion(qIndex)}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Question Text *
                                        </label>
                                        <textarea
                                            value={question.question_text}
                                            onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                                            placeholder="Enter your question"
                                            rows={2}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Answer Options (select the correct one)
                                        </label>
                                        <div className="space-y-3">
                                            {question.options.map((option, oIndex) => (
                                                <div key={oIndex} className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => updateOption(qIndex, oIndex, 'is_correct', true)}
                                                        className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${option.is_correct
                                                                ? 'border-green-500 bg-green-500 text-white'
                                                                : 'border-slate-300 dark:border-slate-600 hover:border-green-400'
                                                            }`}
                                                    >
                                                        {option.is_correct && <span className="material-symbols-outlined text-sm">check</span>}
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={option.option_text}
                                                        onChange={(e) => updateOption(qIndex, oIndex, 'option_text', e.target.value)}
                                                        placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                                        className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add Question Button */}
                        <button
                            onClick={addQuestion}
                            className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 dark:text-slate-400 font-semibold hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Add Question
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
