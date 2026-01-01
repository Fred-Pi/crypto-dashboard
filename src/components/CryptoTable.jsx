import { useState, useMemo } from 'react'
import { formatNumber, formatPercentage, getCurrencySymbol } from '../utils/api'

function CryptoTable({ coins, loading, onCoinSelect, selectedCoinId, currency = 'usd', favorites = [], onToggleFavorite, onShowDetails }) {
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap_rank', direction: 'asc' })

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const sortedCoins = useMemo(() => {
    if (!coins.length) return []

    const sorted = [...coins].sort((a, b) => {
      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]

      // Handle nested values
      if (sortConfig.key === 'rank') {
        aValue = a.market_cap_rank
        bValue = b.market_cap_rank
      }

      // Handle null/undefined
      if (aValue == null) return 1
      if (bValue == null) return -1

      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return sorted
  }, [coins, sortConfig])

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <span className="text-slate-500 ml-1">↕</span>
    }
    return (
      <span className="text-blue-400 ml-1">
        {sortConfig.direction === 'asc' ? '↑' : '↓'}
      </span>
    )
  }

  const handleExportCSV = () => {
    const headers = ['Rank', 'Name', 'Symbol', `Price (${currency.toUpperCase()})`, '24h %', '7d %', 'Market Cap', 'Volume (24h)']

    const rows = sortedCoins.map((coin, index) => [
      index + 1,
      coin.name,
      coin.symbol.toUpperCase(),
      coin.current_price,
      coin.price_change_percentage_24h?.toFixed(2) || '0',
      coin.price_change_percentage_7d_in_currency?.toFixed(2) || '0',
      coin.market_cap,
      coin.total_volume
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `crypto-data-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
      <div className="p-6 border-b border-slate-700 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Top Cryptocurrencies</h3>
          <p className="text-slate-400 text-sm">By Market Capitalization</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-white text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider w-12">
                ★
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-600/50 transition-colors"
                onClick={() => handleSort('market_cap_rank')}
              >
                <div className="flex items-center">
                  #<SortIcon columnKey="market_cap_rank" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Coin
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-600/50 transition-colors"
                onClick={() => handleSort('current_price')}
              >
                <div className="flex items-center justify-end">
                  Price ({currency.toUpperCase()})<SortIcon columnKey="current_price" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-600/50 transition-colors"
                onClick={() => handleSort('price_change_percentage_24h')}
              >
                <div className="flex items-center justify-end">
                  24h %<SortIcon columnKey="price_change_percentage_24h" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-600/50 transition-colors"
                onClick={() => handleSort('price_change_percentage_7d_in_currency')}
              >
                <div className="flex items-center justify-end">
                  7d %<SortIcon columnKey="price_change_percentage_7d_in_currency" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-600/50 transition-colors"
                onClick={() => handleSort('market_cap')}
              >
                <div className="flex items-center justify-end">
                  Market Cap<SortIcon columnKey="market_cap" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-600/50 transition-colors"
                onClick={() => handleSort('total_volume')}
              >
                <div className="flex items-center justify-end">
                  Volume (24h)<SortIcon columnKey="total_volume" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {sortedCoins.map((coin, index) => {
              const change24h = formatPercentage(coin.price_change_percentage_24h)
              const change7d = formatPercentage(coin.price_change_percentage_7d_in_currency)
              const isSelected = selectedCoinId === coin.id

              return (
                <tr
                  key={coin.id}
                  onClick={() => onCoinSelect(coin)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-900/30 hover:bg-blue-900/40'
                      : 'hover:bg-slate-700/30'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleFavorite(coin.id)
                      }}
                      className={`text-xl transition-colors ${
                        favorites.includes(coin.id)
                          ? 'text-yellow-400 hover:text-yellow-300'
                          : 'text-slate-500 hover:text-yellow-400'
                      }`}
                    >
                      {favorites.includes(coin.id) ? '★' : '☆'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-8 h-8 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                        onClick={(e) => {
                          e.stopPropagation()
                          onShowDetails(coin)
                        }}
                      />
                      <div>
                        <div className="text-sm font-medium text-white">{coin.name}</div>
                        <div className="text-xs text-slate-400 uppercase">{coin.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-white">
                    {getCurrencySymbol(currency)}{coin.current_price.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${change24h.color}`}>
                    {change24h.isPositive ? '↑' : '↓'} {Math.abs(change24h.value)}%
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${change7d.color}`}>
                    {change7d.isPositive ? '↑' : '↓'} {Math.abs(change7d.value)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-300">
                    {formatNumber(coin.market_cap, currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-300">
                    {formatNumber(coin.total_volume, currency)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CryptoTable
