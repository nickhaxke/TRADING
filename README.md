# Forex Session Tracker

A comprehensive real-time forex session tracking application built with React, TypeScript, Tailwind CSS, and Firebase. Track global trading sessions, get smart alerts, and never miss market opportunities.

## Features

### 🔐 Authentication & Security
- Firebase Authentication with email + password
- Email verification required before login
- Secure user sessions with JWT tokens
- Password reset functionality
- Profile management with email/password updates

### 🌐 Global Session Tracking
- **Live Session Clocks**: Real-time clocks for Tokyo, London, New York, and Sydney
- **Countdown Timers**: See exactly when sessions open/close
- **Smart Pair Mapping**: Automatic session assignment for each forex pair
- **Active Pair Highlighting**: See which of your pairs are active in each session

### 📱 Smart Notifications
- **Push Alerts**: Firebase Cloud Messaging integration
- **15-Minute Warnings**: Get notified before sessions start
- **Customizable**: Toggle alerts on/off per user
- **Background Support**: Notifications work even when app is closed

### 💱 Forex Pair Management
- **10 Major Pairs**: EURUSD, GBPJPY, AUDUSD, USDJPY, GBPUSD, EURJPY, AUDJPY, NZDUSD, USDCHF, USDCAD
- **Session Mapping**: Each pair automatically mapped to relevant sessions
- **User Selection**: Choose up to 10 pairs to track
- **Visual Interface**: Easy pair selection with session indicators

### 🎨 Modern UI/UX
- **Sidebar Navigation**: Collapsible left sidebar with mobile support
- **Responsive Design**: Mobile-first approach with tablet/desktop optimization
- **Dark Mode**: Full dark theme support
- **Montserrat Typography**: Professional typography with Montserrat Bold headings
- **Real-time Updates**: Live session status with visual indicators

### ⚙️ User Settings
- **Timezone Detection**: Auto-detect with manual override option
- **Alert Preferences**: Toggle push notifications on/off
- **Profile Management**: Update username, email, and password
- **Data Privacy**: User-specific data separation

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Full type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **React Router** - Client-side routing with protected routes
- **Lucide React** - Beautiful, consistent icons

### Backend & Services
- **Firebase Auth** - Authentication with email verification
- **Firestore** - NoSQL database for user data and preferences
- **Firebase Cloud Messaging** - Push notifications
- **Firebase Cloud Functions** - Serverless functions for alerts (optional)

### Development
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing with Tailwind

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Authentication, Firestore, and FCM enabled

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Authentication with Email/Password provider
   - Enable Firestore Database
   - Enable Cloud Messaging
   - Get your Firebase configuration

4. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     VITE_FIREBASE_VAPID_KEY=your_vapid_key
     ```

5. Update Firebase service worker:
   - Edit `public/firebase-messaging-sw.js`
   - Replace placeholder values with your Firebase config

6. Run the development server:
   ```bash
   npm run dev
   ```

### Firebase Setup

#### Authentication
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable Email/Password provider
3. Configure email verification settings

#### Firestore Database
1. Go to Firebase Console → Firestore Database
2. Create database in production mode
3. Set up security rules (basic rules provided in project)

#### Cloud Messaging
1. Go to Firebase Console → Cloud Messaging
2. Generate VAPID key pair
3. Add VAPID key to environment variables

## Usage

### Getting Started
1. **Register**: Create account with email verification
2. **Select Pairs**: Choose up to 10 forex pairs to track
3. **Configure Settings**: Set timezone and enable alerts
4. **Track Sessions**: Monitor live sessions and countdowns

### Navigation
- **Dashboard**: Overview of sessions and statistics
- **Pairs**: Select and manage your forex pairs
- **Sessions**: Live session clocks and detailed view
- **Settings**: Configure alerts and timezone
- **Profile**: Manage account information

### Notifications
1. Enable alerts in Settings
2. Allow browser notifications when prompted
3. Receive alerts 15 minutes before session opens
4. Notifications work in background

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with sidebar
│   ├── Sidebar.tsx     # Navigation sidebar
│   └── ProtectedRoute.tsx # Route protection
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication & user management
├── hooks/              # Custom React hooks
│   └── useForexSessions.ts # Session tracking logic
├── lib/                # Utility libraries
│   └── firebase.ts     # Firebase configuration
├── pages/              # Page components
│   ├── Landing.tsx     # Landing page
│   ├── Auth.tsx        # Login/register/forgot password
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Pairs.tsx       # Forex pair selection
│   ├── Sessions.tsx    # Session tracking
│   ├── Settings.tsx    # User settings
│   └── Profile.tsx     # Profile management
├── types/              # TypeScript type definitions
│   └── forex.ts        # Forex-related types
└── App.tsx             # Main app component
```

## Session Mapping

Each forex pair is automatically mapped to relevant trading sessions:

- **EURUSD** → London, New York
- **GBPJPY** → Tokyo, London  
- **AUDUSD** → Sydney, New York
- **USDJPY** → Tokyo, New York
- **GBPUSD** → London, New York
- **EURJPY** → Tokyo, London
- **AUDJPY** → Sydney, Tokyo
- **NZDUSD** → Sydney, New York
- **USDCHF** → London, New York
- **USDCAD** → London, New York

## Session Times

- **Tokyo**: 09:00 - 18:00 JST
- **London**: 08:00 - 17:00 GMT
- **New York**: 08:00 - 17:00 EST
- **Sydney**: 09:00 - 18:00 AEDT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.