import axios from 'axios'

const BASE_URL = 'https://api.coingecko.com/api/v3'

// Create axios instance with base config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

// Supported currencies
export const SUPPORTED_CURRENCIES = {
  usd: { symbol: '$', name: 'US Dollar' },
  eur: { symbol: '€', name: 'Euro' },
  gbp: { symbol: '£', name: 'British Pound' },
  jpy: { symbol: '¥', name: 'Japanese Yen' },
  cad: { symbol: 'C$', name: 'Canadian Dollar' },
  aud: { symbol: 'A$', name: 'Australian Dollar' }
}

/**
 * Get currency symbol for display
 * @param {string} currency - Currency code (e.g., 'usd')
 */
export function getCurrencySymbol(currency) {
  return SUPPORTED_CURRENCIES[currency]?.symbol || '$'
}

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
 * @param {string} currency - Currency code (default 'usd')
 */
export async function getTopCoins(limit = 10, currency = 'usd') {
  try {
    const response = await api.get('/coins/markets', {
      params: {
        vs_currency: currency,
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
 * @param {string} currency - Currency code (default 'usd')
 */
export async function getCoinChartData(coinId, days = 7, currency = 'usd') {
  try {
    const response = await api.get(`/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: currency,
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
 * @param {number} num - Number to format
 * @param {string} currency - Currency code (default 'usd')
 */
export function formatNumber(num, currency = 'usd') {
  const symbol = getCurrencySymbol(currency)
  if (num >= 1e12) return `${symbol}${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `${symbol}${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `${symbol}${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `${symbol}${(num / 1e3).toFixed(2)}K`
  return `${symbol}${num.toFixed(2)}`
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

/**
 * Get detailed information for a specific coin
 * @param {string} coinId - Coin ID (e.g., 'bitcoin')
 */
export async function getCoinDetails(coinId) {
  try {
    const response = await api.get(`/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: true,
        developer_data: false,
        sparkline: true
      }
    })
    return response.data
  } catch (error) {
    console.error(`Error fetching details for ${coinId}:`, error)
    throw error
  }
}
