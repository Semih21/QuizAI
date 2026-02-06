import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function SignUp() {
    const [step, setStep] = useState(1)
    const [role, setRole] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const { signUp } = useAuth()
    const navigate = useNavigate()

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole)
        setStep(2)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { error } = await signUp({
                email,
                password,
                fullName,
                role
            })

            if (error) throw error

            // Redirect based on role
            navigate(role === 'teacher' ? '/teacher' : '/dashboard')
        } catch (err) {
            setError(err.message || 'An error occurred during sign up')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8 flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
                {step === 1 ? (
                    <>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Join QuizAI</h1>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">Choose your role to get started</p>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => handleRoleSelect('student')}
                                className="p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all hover:shadow-md text-left group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">Student</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Start learning with AI-powered quizzes</p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => handleRoleSelect('teacher')}
                                className="p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-400 transition-all hover:shadow-md text-left group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">Teacher</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Create and manage quizzes for your class</p>
                                    </div>
                                </div>
                            </button>
                        </div>

                        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:underline font-medium">
                                Log in
                            </Link>
                        </p>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setStep(1)}
                            className="mb-6 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-2 text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>

                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Create your {role} account
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">Enter your details to get started</p>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Create a password (min. 6 characters)"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Creating account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>

                        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:underline font-medium">
                                Log in
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}
