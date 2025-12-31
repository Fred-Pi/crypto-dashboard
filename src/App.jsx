import { useState, useEffect } from 'react'
import StatCard from './components/StatCard'
import PriceChart from './components/PriceChart'
import CryptoTable from './components/CryptoTable'
import { getGlobalMarketData, getTopCoins } from './utils/api'

function App() {
  const [globalData, setGlobalData] = useState(null)
  const [topCoins, setTopCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [selectedCoin, setSelectedCoin] = useState({ id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' })

  useEffect(() => {
    fetchDashboardData()

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchDashboardData()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [global, coins] = await Promise.all([
        getGlobalMarketData(),
        getTopCoins(15)
      ])

      setGlobalData(global)
      setTopCoins(coins)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    setLoading(true)
    fetchDashboardData()
  }

  const handleCoinSelect = (coin) => {
    setSelectedCoin({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase()
    })
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Crypto Dashboard</h1>
              <p className="text-sm text-slate-400 mt-1">
                Real-time cryptocurrency market data
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-slate-500">Last updated</p>
                <p className="text-sm text-slate-300">
                  {lastUpdated.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <svg
                  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Market Cap"
            value={globalData?.total_market_cap.usd || 0}
            change={globalData?.market_cap_change_percentage_24h_usd}
          />
          <StatCard
            title="24h Volume"
            value={globalData?.total_volume.usd || 0}
          />
          <StatCard
            title="BTC Dominance"
            value={`${globalData?.market_cap_percentage.btc?.toFixed(1) || 0}%`}
          />
          <StatCard
            title="Active Cryptocurrencies"
            value={globalData?.active_cryptocurrencies?.toLocaleString() || 0}
          />
        </div>

        {/* Price Chart */}
        <div className="mb-8">
          <PriceChart
            coinId={selectedCoin.id}
            coinName={selectedCoin.name}
            coinSymbol={selectedCoin.symbol}
          />
        </div>

        {/* Top Cryptocurrencies Table */}
        <CryptoTable
          coins={topCoins}
          loading={loading}
          onCoinSelect={handleCoinSelect}
          selectedCoinId={selectedCoin.id}
        />
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm">
              Data provided by{' '}
              <a
                href="https://www.coingecko.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                CoinGecko API
              </a>
            </p>
            <p className="text-slate-500 text-sm">
              Auto-refreshes every 60 seconds
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
