import { useState } from 'react'

export default function QuizConfigModal({ isOpen, onClose, onSave, quiz }) {
    const [config, setConfig] = useState({
        timeLimit: quiz?.estimated_minutes || 20,
        shuffleQuestions: false,
        shuffleOptions: false,
        showFeedback: true,
        allowRetakes: true,
        passingScore: 60,
        isPublished: quiz?.is_published || false
    })

    if (!isOpen) return null

    const handleSave = () => {
        onSave?.(config)
        onClose?.()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quiz Settings</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                    {/* Time Limit */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Time Limit (minutes)
                        </label>
                        <input
                            type="number"
                            value={config.timeLimit}
                            onChange={(e) => setConfig({ ...config, timeLimit: Number(e.target.value) })}
                            min={5}
                            max={180}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Passing Score */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Passing Score (%)
                        </label>
                        <input
                            type="number"
                            value={config.passingScore}
                            onChange={(e) => setConfig({ ...config, passingScore: Number(e.target.value) })}
                            min={0}
                            max={100}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Toggle Options */}
                    <div className="space-y-4">
                        {[
                            { key: 'shuffleQuestions', label: 'Shuffle Questions', desc: 'Randomize question order for each attempt' },
                            { key: 'shuffleOptions', label: 'Shuffle Options', desc: 'Randomize answer options for each question' },
                            { key: 'showFeedback', label: 'Show Feedback', desc: 'Display correct answers after submission' },
                            { key: 'allowRetakes', label: 'Allow Retakes', desc: 'Students can retake the quiz' },
                            { key: 'isPublished', label: 'Publish Quiz', desc: 'Make quiz available to students' },
                        ].map((option) => (
                            <label key={option.key} className="flex items-start gap-3 cursor-pointer group">
                                <div className="relative mt-1">
                                    <input
                                        type="checkbox"
                                        checked={config[option.key]}
                                        onChange={(e) => setConfig({ ...config, [option.key]: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm peer-checked:translate-x-4 transition-transform"></div>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{option.label}</p>
                                    <p className="text-xs text-slate-500">{option.desc}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-colors"
                    >
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    )
}
