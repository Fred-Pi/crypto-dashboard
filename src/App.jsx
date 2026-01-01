import { useState, useEffect } from 'react'
import StatCard from './components/StatCard'
import PriceChart from './components/PriceChart'
import CryptoTable from './components/CryptoTable'
import CoinDetailModal from './components/CoinDetailModal'
import { getGlobalMarketData, getTopCoins, SUPPORTED_CURRENCIES } from './utils/api'

function App() {
  const [globalData, setGlobalData] = useState(null)
  const [topCoins, setTopCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [selectedCoin, setSelectedCoin] = useState({ id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' })
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('crypto-currency') || 'usd'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('crypto-favorites')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Error loading favorites:', error)
      return []
    }
  })
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [detailModalCoin, setDetailModalCoin] = useState(null)

  useEffect(() => {
    fetchDashboardData()

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchDashboardData()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // Persist currency to localStorage
  useEffect(() => {
    localStorage.setItem('crypto-currency', currency)
  }, [currency])

  // Refetch data when currency changes
  useEffect(() => {
    fetchDashboardData()
  }, [currency])

  // Persist favorites to localStorage
  useEffect(() => {
    localStorage.setItem('crypto-favorites', JSON.stringify(favorites))
  }, [favorites])

  const fetchDashboardData = async () => {
    try {
      const [global, coins] = await Promise.all([
        getGlobalMarketData(),
        getTopCoins(15, currency)
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

  const handleToggleFavorite = (coinId) => {
    setFavorites(prev =>
      prev.includes(coinId)
        ? prev.filter(id => id !== coinId)
        : [...prev, coinId]
    )
  }

  const handleShowDetails = (coin) => {
    setDetailModalCoin(coin)
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
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search coins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-10 py-2 text-white placeholder-slate-400 w-64 sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* Search icon (left) */}
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {/* Clear button (right) */}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Currency Selector */}
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(SUPPORTED_CURRENCIES).map(([code, { symbol, name }]) => (
                  <option key={code} value={code}>
                    {symbol} {code.toUpperCase()}
                  </option>
                ))}
              </select>

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
        {/* Favorites Filter Toggle */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setShowFavoritesOnly(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !showFavoritesOnly
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            All Coins
          </button>
          <button
            onClick={() => setShowFavoritesOnly(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showFavoritesOnly
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Favorites ({favorites.length})
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Market Cap"
            value={globalData?.total_market_cap[currency] || 0}
            change={globalData?.market_cap_change_percentage_24h_usd}
            currency={currency}
          />
          <StatCard
            title="24h Volume"
            value={globalData?.total_volume[currency] || 0}
            currency={currency}
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
            currency={currency}
          />
        </div>

        {/* Top Cryptocurrencies Table */}
        <CryptoTable
          coins={(() => {
            let displayCoins = topCoins
            if (searchQuery) {
              displayCoins = displayCoins.filter(coin =>
                coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
              )
            }
            if (showFavoritesOnly) {
              displayCoins = displayCoins.filter(coin => favorites.includes(coin.id))
            }
            return displayCoins
          })()}
          loading={loading}
          onCoinSelect={handleCoinSelect}
          selectedCoinId={selectedCoin.id}
          currency={currency}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onShowDetails={handleShowDetails}
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

      {/* Coin Detail Modal */}
      {detailModalCoin && (
        <CoinDetailModal
          coin={detailModalCoin}
          onClose={() => setDetailModalCoin(null)}
          currency={currency}
        />
      )}
    </div>
  )
}

export default App
