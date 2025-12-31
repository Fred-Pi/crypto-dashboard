import { formatNumber, formatPercentage } from '../utils/api'

function StatCard({ title, value, change, icon }) {
  const percentageData = change !== undefined ? formatPercentage(change) : null

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium mb-2">{title}</p>
          <p className="text-2xl font-bold text-white mb-1">
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
          {percentageData && (
            <div className="flex items-center gap-1">
              <span className={`text-sm font-medium ${percentageData.color}`}>
                {percentageData.isPositive ? '↑' : '↓'} {Math.abs(percentageData.value)}%
              </span>
              <span className="text-slate-500 text-xs">24h</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-slate-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
