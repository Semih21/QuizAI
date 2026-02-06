import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { generateQuizWithAI } from '../lib/aiService'
import Sidebar from '../components/Sidebar'
import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

export default function AIQuizCreator() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [topic, setTopic] = useState('')
    const [numQuestions, setNumQuestions] = useState(10)
    const [difficulty, setDifficulty] = useState('intermediate')
    const [questionType, setQuestionType] = useState('multiple_choice')
    const [generating, setGenerating] = useState(false)
    const [generatedQuiz, setGeneratedQuiz] = useState(null)
    const [error, setError] = useState('')
    const [retryAfter, setRetryAfter] = useState(0)
    const [file, setFile] = useState(null)
    const [fileContent, setFileContent] = useState('')
    const [processingFile, setProcessingFile] = useState(false)

    useEffect(() => {
        let interval
        if (retryAfter > 0) {
            interval = setInterval(() => {
                setRetryAfter(prev => prev - 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [retryAfter])

    const handleGenerate = async () => {
        if (!topic.trim() && !fileContent) {
            setError('Please enter a topic or upload a source material.')
            return
        }

        setGenerating(true)
        setError('')

        try {
            const quiz = await generateQuizWithAI({
                topic: topic.trim() || file?.name || 'Uploaded Material',
                numQuestions,
                difficulty,
                questionType,
                sourceText: fileContent
            })
            setGeneratedQuiz(quiz)
        } catch (err) {
            console.error('Error generating quiz:', err)
            if (err.message.includes('Too many requests')) {
                setRetryAfter(30) // Wait 30 seconds
            }
            setError(err.message || 'Failed to generate quiz. Please try again.')
        } finally {
            setGenerating(false)
        }
    }

    const handleSaveQuiz = async () => {
        if (!generatedQuiz) return

        try {
            // Create quiz
            const { data: quiz, error: quizError } = await supabase
                .from('quizzes')
                .insert({
                    title: generatedQuiz.title,
                    description: generatedQuiz.description,
                    difficulty: generatedQuiz.difficulty,
                    estimated_minutes: generatedQuiz.estimated_minutes,
                    created_by: user?.id,
                    is_ai_generated: true,
                    is_published: false
                })
                .select()
                .single()

            if (quizError) throw quizError

            // Create questions
            for (const q of generatedQuiz.questions) {
                const { data: question, error: qError } = await supabase
                    .from('questions')
                    .insert({
                        quiz_id: quiz.id,
                        question_text: q.question_text,
                        question_type: q.question_type,
                        points: q.points,
                        order_index: q.order_index
                    })
                    .select()
                    .single()

                if (qError) throw qError

                // Create options
                for (const opt of q.options) {
                    await supabase.from('question_options').insert({
                        question_id: question.id,
                        option_text: opt.option_text,
                        is_correct: opt.is_correct
                    })
                }
            }

            navigate('/teacher')
        } catch (error) {
            console.error('Error saving quiz:', error)
        }
    }

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0]
        if (!selectedFile) return

        setProcessingFile(true)
        setError('')
        setFile(selectedFile)

        try {
            if (selectedFile.type === 'application/pdf') {
                const text = await extractTextFromPDF(selectedFile)
                setFileContent(text)
                if (text.trim().length < 50) {
                    setError('The PDF seems to have very little text. Please ensure it\'s not just images (scanned PDF).')
                }
            } else if (selectedFile.type === 'text/plain') {
                const text = await selectedFile.text()
                setFileContent(text)
            } else {
                setError('Unsupported file type. Please upload a PDF or TXT file.')
                setFile(null)
            }
        } catch (err) {
            console.error('Error processing file:', err)
            setError('Failed to process the file. Please try again.')
            setFile(null)
        } finally {
            setProcessingFile(false)
        }
    }

    const extractTextFromPDF = async (file) => {
        const arrayBuffer = await file.arrayBuffer()
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
        const pdf = await loadingTask.promise
        let fullText = ''

        for (let i = 1; i <= Math.min(pdf.numPages, 15); i++) {
            const page = await pdf.getPage(i)
            const textContent = await page.getTextContent()
            const pageText = textContent.items.map(item => item.str).join(' ')
            fullText += pageText + '\n'
        }
        return fullText
    }

    const clearFile = () => {
        setFile(null)
        setFileContent('')
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
                            <h1 className="text-lg font-bold text-slate-900 dark:text-white">AI Quiz Creator</h1>
                            <p className="text-xs text-slate-500">Generate quizzes from any topic</p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-4xl mx-auto">
                        {!generatedQuiz ? (
                            /* Generation Form */
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
                                <div className="flex items-center gap-3 mb-6 text-blue-600">
                                    <span className="material-symbols-outlined text-3xl">auto_awesome</span>
                                    <h2 className="text-2xl font-bold">Generate AI Quiz</h2>
                                </div>

                                <div className="space-y-6">
                                    {/* Topic Input */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Topic or Subject
                                        </label>
                                        <input
                                            type="text"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            placeholder="e.g., Photosynthesis, World War II, Quadratic Equations"
                                            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Options Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Number of Questions */}
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                Number of Questions
                                            </label>
                                            <select
                                                value={numQuestions}
                                                onChange={(e) => setNumQuestions(Number(e.target.value))}
                                                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value={5}>5 Questions</option>
                                                <option value={10}>10 Questions</option>
                                                <option value={15}>15 Questions</option>
                                                <option value={20}>20 Questions</option>
                                                <option value={30}>30 Questions</option>
                                            </select>
                                        </div>

                                        {/* Difficulty */}
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                Difficulty Level
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

                                        {/* Question Type */}
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                Question Type
                                            </label>
                                            <select
                                                value={questionType}
                                                onChange={(e) => setQuestionType(e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="multiple_choice">Multiple Choice</option>
                                                <option value="true_false">True/False</option>
                                                <option value="short_answer">Short Answer</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* File Upload */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Or Upload Source Material (Optional)
                                        </label>

                                        {!file ? (
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-colors">
                                                <div className="flex flex-col items-center justify-center">
                                                    {processingFile ? (
                                                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mb-2"></div>
                                                    ) : (
                                                        <span className="material-symbols-outlined text-3xl text-slate-400 mb-2">cloud_upload</span>
                                                    )}
                                                    <p className="text-sm text-slate-500">
                                                        {processingFile ? 'Processing document...' : 'Click to upload PDF, DOCX, or TXT'}
                                                    </p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".pdf,.docx,.txt"
                                                    onChange={handleFileChange}
                                                    disabled={processingFile}
                                                />
                                            </label>
                                        ) : (
                                            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <span className="material-symbols-outlined text-blue-600">
                                                        {file.type === 'application/pdf' ? 'picture_as_pdf' : 'description'}
                                                    </span>
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                                                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={clearFile}
                                                    className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-full text-blue-600 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-xl">close</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    {/* Generate Button */}
                                    <button
                                        onClick={handleGenerate}
                                        disabled={!topic.trim() || generating || retryAfter > 0}
                                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                                    >
                                        {generating ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                                Generating Quiz with AI...
                                            </>
                                        ) : retryAfter > 0 ? (
                                            <>
                                                <span className="material-symbols-outlined">timer</span>
                                                Retry in {retryAfter}s
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined">auto_awesome</span>
                                                Generate Quiz with AI
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Preview Generated Quiz */
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{generatedQuiz.title}</h2>
                                            <p className="text-slate-500">{generatedQuiz.description}</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setGeneratedQuiz(null)}
                                                className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                Regenerate
                                            </button>
                                            <button
                                                onClick={handleSaveQuiz}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-sm transition-colors flex items-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-sm">save</span>
                                                Save Quiz
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 mb-6">
                                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full text-sm font-medium capitalize">{difficulty}</span>
                                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full text-sm font-medium">{numQuestions} Questions</span>
                                        <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-600 rounded-full text-sm font-medium">{generatedQuiz.estimated_minutes} mins</span>
                                    </div>
                                </div>

                                {/* Questions Preview */}
                                <div className="space-y-4">
                                    {generatedQuiz.questions.map((q, idx) => (
                                        <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                                            <div className="flex items-start gap-4">
                                                <span className="shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                    {idx + 1}
                                                </span>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-slate-900 dark:text-white mb-4">{q.question_text}</p>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {q.options.map((opt, optIdx) => (
                                                            <div
                                                                key={optIdx}
                                                                className={`p-3 rounded-lg border-2 ${opt.is_correct
                                                                    ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
                                                                    : 'border-slate-200 dark:border-slate-700'
                                                                    }`}
                                                            >
                                                                <span className="text-sm text-slate-700 dark:text-slate-300">{opt.option_text}</span>
                                                                {opt.is_correct && (
                                                                    <span className="ml-2 text-green-600 text-xs font-semibold">✓ Correct</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
