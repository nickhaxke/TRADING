# Trading Journal App

A comprehensive full-stack trading journal application built with React, TypeScript, Tailwind CSS, and Supabase. Track your trades, analyze performance, and improve your trading strategy.

## Features

### 🔐 Authentication
- Secure user registration and login
- Email/password authentication via Supabase Auth
- Protected routes and user-specific data

### 📊 Trade Management
- Comprehensive trade entry form with all essential fields
- Auto-calculated Risk/Reward (RR) ratio
- Support for major currency pairs
- Optional lot size and screenshot URL fields
- Full CRUD operations (Create, Read, Update, Delete)

### 📈 Analytics Dashboard
- Real-time trading statistics
- Profit curve visualization
- Win rate tracking
- Monthly P/L breakdown
- Interactive charts using Recharts

### 📋 Trade Log
- Sortable and filterable trade table
- Search functionality across pairs, reasons, and notes
- Pagination for large datasets
- Export to PDF functionality

### 🎨 Modern UI/UX
- Beautiful, responsive design
- Dark/light theme toggle
- Smooth animations and transitions
- Mobile-first approach
- Professional trading theme

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Recharts** - Interactive charts and data visualization
- **Lucide React** - Beautiful icons
- **jsPDF** - PDF generation for reports

### Backend
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Database
- **Row Level Security (RLS)** - Data security
- **Real-time subscriptions** - Live data updates

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new Supabase project
   - Copy your project URL and anon key
   - Click "Connect to Supabase" in the top-right corner of the app
   - Or manually create a `.env` file with your credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Run the development server:
   ```bash
   npm run dev
   ```

### Database Setup

The application includes a migration file that will create the necessary database schema:

- `trades` table with all required fields
- Row Level Security (RLS) policies
- Proper indexes for performance

The migration will be automatically applied when you connect to Supabase.

## Usage

### Adding Trades
1. Navigate to "Add Trade" from the main menu
2. Fill in the trade details (date, pair, entry, stop loss, take profit, etc.)
3. The RR ratio is automatically calculated
4. Add your trade reason and optional notes
5. Submit the trade

### Viewing Analytics
1. The Dashboard shows key statistics and performance metrics
2. Interactive charts display profit curves and monthly performance
3. Recent trades are displayed in a summary table

### Managing Trades
1. Navigate to "Trade Log" to view all your trades
2. Use filters to find specific trades
3. Sort by any column
4. Export your data to PDF for reporting

### Dark Mode
Toggle between light and dark themes using the moon/sun icon in the navigation.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout wrapper
│   └── ProtectedRoute.tsx # Route protection
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── hooks/              # Custom React hooks
│   ├── useTrades.ts    # Trade management logic
│   └── useTheme.ts     # Theme management
├── lib/                # Utility libraries
│   └── supabase.ts     # Supabase client
├── pages/              # Page components
│   ├── Landing.tsx     # Landing page
│   ├── Auth.tsx        # Login/register pages
│   ├── Dashboard.tsx   # Analytics dashboard
│   ├── AddTrade.tsx    # Trade entry form
│   └── TradeLog.tsx    # Trade management table
└── App.tsx             # Main app component
```

## Database Schema

### trades table
- `id` (uuid) - Primary key
- `user_id` (uuid) - Foreign key to auth.users
- `date` (date) - Trade date
- `pair` (text) - Currency pair
- `entry_price` (decimal) - Entry price
- `stop_loss` (decimal) - Stop loss price
- `take_profit` (decimal) - Take profit price
- `rr_ratio` (decimal) - Risk/reward ratio
- `lot_size` (decimal, nullable) - Position size
- `outcome` (decimal) - Trade result in dollars
- `reason` (text) - Trade setup/reason
- `notes` (text, nullable) - Additional notes
- `screenshot_url` (text, nullable) - Screenshot URL
- `created_at` (timestamptz) - Creation timestamp
- `updated_at` (timestamptz) - Last update timestamp

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.