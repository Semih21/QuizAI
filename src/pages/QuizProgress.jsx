import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function QuizProgress() {
    const { isTeacher } = useAuth()
    const dashboardPath = isTeacher ? '/teacher' : '/dashboard'

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                {/* Success Animation */}
                <div className="relative mb-8">
                    <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
                            <span className="material-symbols-outlined text-5xl text-green-500">check_circle</span>
                        </div>
                    </div>
                    {/* Confetti Effect */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-yellow-300 animate-bounce absolute -top-4 left-1/4">star</span>
                        <span className="material-symbols-outlined text-3xl text-pink-300 animate-bounce absolute top-0 right-1/4" style={{ animationDelay: '0.1s' }}>celebration</span>
                        <span className="material-symbols-outlined text-2xl text-cyan-300 animate-bounce absolute -bottom-2 left-1/3" style={{ animationDelay: '0.2s' }}>auto_awesome</span>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-white mb-2">Quiz Submitted!</h1>
                <p className="text-blue-100 mb-8">Your answers have been saved. Great job completing the quiz!</p>

                {/* Stats Preview */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-3xl font-bold text-white">15</p>
                            <p className="text-xs text-blue-200">Questions</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">12m</p>
                            <p className="text-xs text-blue-200">Time Taken</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">14</p>
                            <p className="text-xs text-blue-200">Answered</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <Link
                        to="/quiz/feedback"
                        className="w-full py-3 bg-white text-blue-600 rounded-lg font-bold shadow-lg hover:bg-blue-50 transition-colors"
                    >
                        View Results & Feedback
                    </Link>
                    <Link
                        to={dashboardPath}
                        className="w-full py-3 bg-white/10 text-white rounded-lg font-semibold border border-white/20 hover:bg-white/20 transition-colors"
                    >
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}
