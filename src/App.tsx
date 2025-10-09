import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { Landing } from './pages/Landing';
import { AuthPage } from './pages/Auth';
import { LoadingSpinner } from './components/LoadingSpinner';

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const AddTrade = React.lazy(() => import('./pages/AddTrade').then(module => ({ default: module.AddTrade })));
const TradeLog = React.lazy(() => import('./pages/TradeLog').then(module => ({ default: module.TradeLog })));
const EditTrade = React.lazy(() => import('./pages/EditTrade').then(module => ({ default: module.EditTrade })));
const CompoundingChallenge = React.lazy(() => import('./pages/CompoundingChallenge').then(module => ({ default: module.CompoundingChallenge })));
const RiskManager = React.lazy(() => import('./pages/RiskManager').then(module => ({ default: module.RiskManager })));
const ForexSessions = React.lazy(() => import('./pages/ForexSessions').then(module => ({ default: module.ForexSessions })));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const Signals = React.lazy(() => import('./pages/Signals').then(module => ({ default: module.Signals })));
const AdminSignals = React.lazy(() => import('./pages/AdminSignals').then(module => ({ default: module.AdminSignals })));
const Upgrade = React.lazy(() => import('./pages/Upgrade').then(module => ({ default: module.Upgrade })));
const AdminSettings = React.lazy(() => import('./pages/AdminSettings').then(module => ({ default: module.AdminSettings })));
const AdminPricing = React.lazy(() => import('./pages/AdminPricing').then(module => ({ default: module.AdminPricing })));

// Suspense fallback component
const SuspenseFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
    <LoadingSpinner size="lg" />
    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <PWAInstallPrompt />
        <React.Suspense fallback={<SuspenseFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/add-trade" element={
              <ProtectedRoute>
                <Layout>
                  <AddTrade />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/trades" element={
              <ProtectedRoute>
                <Layout>
                  <TradeLog />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/edit-trade/:id" element={
              <ProtectedRoute>
                <Layout>
                  <EditTrade />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/compounding-challenge" element={
              <ProtectedRoute>
                <Layout>
                  <CompoundingChallenge />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/risk-manager" element={
              <ProtectedRoute>
                <Layout>
                  <RiskManager />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/forex-sessions" element={
              <ProtectedRoute>
                <Layout>
                  <ForexSessions />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/signals" element={
              <ProtectedRoute>
                <Layout>
                  <AdminSignals />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/signals" element={
              <ProtectedRoute>
                <Layout>
                  <Signals />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/upgrade" element={
              <ProtectedRoute>
                <Layout>
                  <Upgrade />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <Layout>
                  <AdminSettings />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/pricing" element={
              <ProtectedRoute>
                <Layout>
                  <AdminPricing />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;