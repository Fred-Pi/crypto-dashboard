import axios from 'axios'

const BASE_URL = 'https://api.coingecko.com/api/v3'

// Create axios instance with base config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

/**
 * Get global market data
 * Returns total market cap, volume, BTC dominance, etc.
 */
export async function getGlobalMarketData() {
  try {
    const response = await api.get('/global')
    return response.data.data
  } catch (error) {
    console.error('Error fetching global market data:', error)
    throw error
  }
}

/**
 * Get top cryptocurrencies by market cap
 * @param {number} limit - Number of coins to fetch (default 10)
 */
export async function getTopCoins(limit = 10) {
  try {
    const response = await api.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
        sparkline: true, // Include 7-day price sparkline
        price_change_percentage: '24h,7d'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching top coins:', error)
    throw error
  }
}

/**
 * Get trending coins (top 7 trending searches)
 */
export async function getTrendingCoins() {
  try {
    const response = await api.get('/search/trending')
    return response.data.coins
  } catch (error) {
    console.error('Error fetching trending coins:', error)
    throw error
  }
}

/**
 * Get price chart data for a specific coin
 * @param {string} coinId - Coin ID (e.g., 'bitcoin')
 * @param {number} days - Number of days (1, 7, 30, 90, 365)
 */
export async function getCoinChartData(coinId, days = 7) {
  try {
    const response = await api.get(`/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days,
        interval: days === 1 ? 'hourly' : 'daily'
      }
    })
    return response.data
  } catch (error) {
    console.error(`Error fetching chart data for ${coinId}:`, error)
    throw error
  }
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatNumber(num) {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
  return `$${num.toFixed(2)}`
}

/**
 * Format percentage change with color
 */
export function formatPercentage(percent) {
  const formatted = percent?.toFixed(2) || '0.00'
  return {
    value: formatted,
    isPositive: percent >= 0,
    color: percent >= 0 ? 'text-green-500' : 'text-red-500'
  }
}
