export default function StatsCard({ icon, iconBg, value, label, change, changeType = 'positive' }) {
    return (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${iconBg}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                {change && (
                    <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${changeType === 'positive'
                            ? 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
                            : 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400'
                        }`}>
                        <span className="material-symbols-outlined text-[14px] mr-1">
                            {changeType === 'positive' ? 'trending_up' : 'trending_flat'}
                        </span>
                        {change}
                    </span>
                )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{label}</p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
        </div>
    )
}
