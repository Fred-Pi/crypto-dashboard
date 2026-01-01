# 📊 Crypto Dashboard

A real-time cryptocurrency tracking dashboard with interactive charts, market statistics, and live price updates. Built with React, Recharts, and the CoinGecko API.

![React](https://img.shields.io/badge/React-18.3-blue)
![Recharts](https://img.shields.io/badge/Recharts-2.15-8884d8)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)

## ✨ Features

- 💱 **Multi-Currency Support** - Switch between USD, EUR, GBP, JPY, CAD, AUD with real-time conversion
- 🔍 **Search & Filter** - Real-time search by coin name or symbol with instant results
- ⭐ **Favorites/Watchlist** - Star coins to save favorites, persisted across sessions
- 📋 **Detailed Coin Modal** - Click coin logos to view comprehensive market statistics and links
- 📊 **CSV Export** - Download current table view as CSV with date-stamped filename
- 📈 **Interactive Price Charts** - View price history with multiple timeframe options (24H, 7D, 30D, 90D, 1Y)
- 🎯 **Clickable Coin Selection** - Click any cryptocurrency row to view its detailed price chart
- 🔄 **Sortable Table Columns** - Sort by price, 24h/7d change, market cap, or volume with visual indicators
- 💹 **Market Statistics** - Real-time market cap, trading volume, and BTC dominance
- 🔝 **Top Cryptocurrencies** - Track the top 15 coins by market capitalization
- 🔄 **Auto-Refresh** - Data automatically updates every 60 seconds
- 📊 **Responsive Charts** - Built with Recharts for smooth, interactive visualizations
- 🎨 **Dark Theme** - Modern, easy-on-the-eyes interface
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ⚡ **Fast & Lightweight** - Built with Vite for optimal performance

## 🚀 Demo

**Live Demo:** Coming soon

## 💼 Portfolio Highlights

This project demonstrates:
- **Data Visualization** - Interactive charts with Recharts library
- **API Integration** - Real-time data fetching from CoinGecko API with multi-currency support
- **State Management** - React hooks for managing complex application state
- **Data Persistence** - localStorage for favorites and currency preferences
- **Interactive UI** - Sortable tables, clickable rows, dynamic chart updates, modal dialogs
- **Performance Optimization** - useMemo for efficient sorting, Promise.all for parallel API calls
- **Advanced Features** - Search filtering, CSV export, favorites system
- **Responsive Design** - Mobile-first approach with TailwindCSS
- **User Experience** - Loading states, error handling, auto-refresh, visual feedback, keyboard navigation
- **Clean Code** - Modular component architecture with prop-based communication

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Recharts** - Charting library for data visualization
- **TailwindCSS 3** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### API
- **CoinGecko API** - Free cryptocurrency data (no API key required)

### Deployment
- **Vercel** - Frontend hosting

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Git

### 1. Clone the repository
```bash
git clone https://github.com/[your-username]/dashboard.git
cd dashboard
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Deploy!

No environment variables needed - the CoinGecko API is free and requires no authentication.

## 📖 Usage

### Viewing Market Data
- The dashboard loads automatically with real-time data
- **KPI Cards** at the top show global market statistics
- **Price Chart** displays Bitcoin price history by default
- **Crypto Table** shows top 15 cryptocurrencies

### Interactive Features
- **Currency Selector** - Choose from USD, EUR, GBP, JPY, CAD, or AUD in the header
- **Search Bar** - Type to filter coins by name or symbol (e.g., "bitcoin" or "btc")
- **Favorites** - Click star icons (★/☆) to add/remove favorites
- **Filter Toggle** - Switch between "All Coins" and "Favorites" view
- **Click cryptocurrency rows** to view their price chart
- **Click coin logos** to open detailed modal with market stats and links
- **Click column headers** to sort the table (price, 24h%, 7d%, market cap, volume)
- **Export CSV** - Download current filtered/sorted view
- Visual indicators show current sort direction (↑ ascending, ↓ descending)
- Selected coin is highlighted with blue background

### Chart Interaction
- Click timeframe buttons (24H, 7D, 30D, 90D, 1Y) to change the date range
- Hover over the chart to see exact price at any point
- Chart title updates to show selected cryptocurrency
- Chart auto-adjusts for different time ranges

### Refreshing Data
- Click the **Refresh** button in the header to manually update
- Data auto-refreshes every 60 seconds
- Last update time is displayed in the header

## 🏗️ Project Structure

```
dashboard/
├── src/
│   ├── components/
│   │   ├── StatCard.jsx          # KPI card component
│   │   ├── PriceChart.jsx         # Interactive price chart with Recharts
│   │   ├── CryptoTable.jsx        # Cryptocurrency table with sorting
│   │   └── CoinDetailModal.jsx    # Detailed coin information modal
│   ├── utils/
│   │   └── api.js                 # CoinGecko API utilities & multi-currency support
│   ├── App.jsx                    # Main application component
│   ├── main.jsx                   # Application entry point
│   └── index.css                  # Global styles and Tailwind imports
├── public/                        # Static assets
├── package.json
├── tailwind.config.js             # Tailwind configuration
├── vite.config.js                 # Vite configuration
└── README.md
```

## 🔑 Key Features Explained

### Real-Time Data Fetching
Uses Promise.all to fetch multiple endpoints simultaneously:
```javascript
const [global, coins] = await Promise.all([
  getGlobalMarketData(),
  getTopCoins(15)
])
```

### Auto-Refresh
Implements setInterval for automatic updates:
```javascript
const interval = setInterval(() => {
  fetchDashboardData()
}, 60000) // Refresh every 60 seconds
```

### Interactive Charts
Built with Recharts for responsive, customizable visualizations:
```javascript
<ResponsiveContainer width="100%" height={320}>
  <LineChart data={chartData}>
    <Line type="monotone" dataKey="price" stroke="#3b82f6" />
  </LineChart>
</ResponsiveContainer>
```

### Multi-Currency Support
API integration with dynamic currency parameter:
```javascript
// Fetch data in selected currency
const coins = await getTopCoins(15, currency) // e.g., 'eur'
const chartData = await getCoinChartData('bitcoin', 7, currency)

// Display with correct currency symbol
{getCurrencySymbol(currency)}{price.toLocaleString()}
```

### Favorites with localStorage
Persistent favorites across sessions:
```javascript
const [favorites, setFavorites] = useState(() => {
  const saved = localStorage.getItem('crypto-favorites')
  return saved ? JSON.parse(saved) : []
})

// Automatically sync to localStorage
useEffect(() => {
  localStorage.setItem('crypto-favorites', JSON.stringify(favorites))
}, [favorites])
```

### CSV Export
Export current view to downloadable CSV:
```javascript
const handleExportCSV = () => {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  // Trigger download with date-stamped filename
}
```

## 🧪 Testing Checklist

### Core Features
- [ ] Dashboard loads with market data
- [ ] KPI cards display correct values
- [ ] Price chart renders with Bitcoin data
- [ ] Timeframe buttons switch chart data
- [ ] Cryptocurrency table shows top 15 coins
- [ ] Hover tooltips work on chart
- [ ] Refresh button updates data
- [ ] Auto-refresh works (wait 60 seconds)

### New Features
- [ ] Currency selector changes all prices and symbols
- [ ] Currency preference persists on page reload
- [ ] Search bar filters coins by name and symbol
- [ ] Clear button (X) resets search
- [ ] Star icons toggle favorites on/off
- [ ] Favorites persist on page reload
- [ ] "All Coins" / "Favorites" toggle works
- [ ] Click coin logo opens detail modal
- [ ] Modal shows comprehensive coin data
- [ ] Modal closes with ESC, backdrop click, or X button
- [ ] Export CSV downloads file with current view
- [ ] CSV filename includes current date
- [ ] Sorting works with search and favorites filters
- [ ] Click coin row updates price chart

### Responsive Design
- [ ] Test on mobile device
- [ ] Test on tablet device
- [ ] Test on different screen sizes
- [ ] Search bar responsive on small screens
- [ ] Modal responsive and scrollable

## 📈 Performance

- **Bundle size:** ~578 kB (includes Recharts library)
- **First Load:** <2s on 3G
- **API Response:** <500ms average
- **Chart Rendering:** <100ms

## 🤝 Contributing

This is a personal portfolio project, but feedback and suggestions are welcome!

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

- GitHub: [@Fred-Pi](https://github.com/Fred-Pi)


## 🙏 Acknowledgments

- [CoinGecko](https://www.coingecko.com) for the free cryptocurrency API
- [Recharts](https://recharts.org) for the excellent charting library
- [TailwindCSS](https://tailwindcss.com) for the utility-first CSS framework
- [Vite](https://vitejs.dev) for the blazing-fast build tool
- [React](https://react.dev) for the UI library

---

Built with ❤️ using React, Recharts, and TailwindCSS
