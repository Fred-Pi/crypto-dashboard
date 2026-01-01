import { useState, useEffect } from 'react'
import { getCoinDetails, getCurrencySymbol, formatNumber } from '../utils/api'

function CoinDetailModal({ coin, onClose, currency = 'usd' }) {
  const [detailData, setDetailData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (coin) {
      fetchDetails()
    }

    // ESC key handler
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)

    // Prevent body scroll
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [coin, onClose])

  const fetchDetails = async () => {
    try {
      setLoading(true)
      const data = await getCoinDetails(coin.id)
      setDetailData(data)
    } catch (err) {
      console.error('Error fetching coin details:', err)
      setError('Failed to load coin details')
    } finally {
      setLoading(false)
    }
  }

  if (!coin) return null

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-400">{error}</p>
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white">
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="border-b border-slate-700 p-6 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img src={detailData.image.large} alt={detailData.name} className="w-16 h-16" />
                <div>
                  <h2 className="text-2xl font-bold text-white">{detailData.name}</h2>
                  <p className="text-slate-400 uppercase">{detailData.symbol}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Price Section */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-white">
                  {getCurrencySymbol(currency)}{detailData.market_data.current_price[currency]?.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
                {detailData.market_data.price_change_percentage_24h && (
                  <span className={`text-lg font-medium ${
                    detailData.market_data.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {detailData.market_data.price_change_percentage_24h >= 0 ? '↑' : '↓'}{' '}
                    {Math.abs(detailData.market_data.price_change_percentage_24h).toFixed(2)}%
                  </span>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Market Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Market Cap</p>
                  <p className="text-white font-medium">{formatNumber(detailData.market_data.market_cap[currency], currency)}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">24h Volume</p>
                  <p className="text-white font-medium">{formatNumber(detailData.market_data.total_volume[currency], currency)}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Circulating Supply</p>
                  <p className="text-white font-medium">{detailData.market_data.circulating_supply?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total Supply</p>
                  <p className="text-white font-medium">{detailData.market_data.total_supply?.toLocaleString() || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">All-Time High</p>
                  <p className="text-white font-medium">{getCurrencySymbol(currency)}{detailData.market_data.ath[currency]?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">All-Time Low</p>
                  <p className="text-white font-medium">{getCurrencySymbol(currency)}{detailData.market_data.atl[currency]?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {detailData.description?.en && (
              <div className="p-6 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">About {detailData.name}</h3>
                <div
                  className="text-slate-300 text-sm leading-relaxed max-h-48 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: detailData.description.en.split('. ').slice(0, 3).join('. ') + '.' }}
                />
              </div>
            )}

            {/* Links */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Links</h3>
              <div className="flex flex-wrap gap-3">
                {detailData.links.homepage[0] && (
                  <a
                    href={detailData.links.homepage[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm transition-colors"
                  >
                    Website
                  </a>
                )}
                {detailData.links.whitepaper && (
                  <a
                    href={detailData.links.whitepaper}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm transition-colors"
                  >
                    Whitepaper
                  </a>
                )}
                {detailData.links.repos_url?.github[0] && (
                  <a
                    href={detailData.links.repos_url.github[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm transition-colors"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CoinDetailModal
