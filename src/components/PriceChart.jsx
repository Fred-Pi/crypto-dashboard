import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { getCoinChartData } from '../utils/api'

function PriceChart({ coinId = 'bitcoin', coinName = 'Bitcoin', coinSymbol = 'BTC' }) {
  const [chartData, setChartData] = useState([])
  const [timeframe, setTimeframe] = useState(7)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChartData()
  }, [coinId, timeframe])

  const fetchChartData = async () => {
    setLoading(true)
    try {
      const data = await getCoinChartData(coinId, timeframe)

      // Transform data for Recharts
      const formattedData = data.prices.map(([timestamp, price]) => ({
        time: new Date(timestamp).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        price: price
      }))

      setChartData(formattedData)
    } catch (error) {
      console.error('Error fetching chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  const timeframes = [
    { label: '24H', days: 1 },
    { label: '7D', days: 7 },
    { label: '30D', days: 30 },
    { label: '90D', days: 90 },
    { label: '1Y', days: 365 }
  ]

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
          <p className="text-slate-300 text-sm">{payload[0].payload.time}</p>
          <p className="text-white font-bold">
            ${payload[0].value.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {coinName} ({coinSymbol}) Price Chart
          </h3>
          <p className="text-slate-400 text-sm">USD Price History</p>
        </div>

        {/* Timeframe selector */}
        <div className="flex gap-2">
          {timeframes.map(({ label, days }) => (
            <button
              key={days}
              onClick={() => setTimeframe(days)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                timeframe === days
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#3b82f6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default PriceChart
