import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SidebarLayout } from './components/SidebarLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthPage } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { AddTrade } from './pages/AddTrade';
import { TradeLog } from './pages/TradeLog';
import { EditTrade } from './pages/EditTrade';
import { CompoundingChallenge } from './pages/CompoundingChallenge';
import { ForexSessionAdvisor } from './pages/ForexSessionAdvisor';
import { Profile } from './pages/Profile';
import { ForgotPassword } from './pages/ForgotPassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <SidebarLayout>
                <Dashboard />
              </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/add-trade" element={
            <ProtectedRoute>
              <SidebarLayout>
                <AddTrade />
              </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/trades" element={
            <ProtectedRoute>
              <SidebarLayout>
                <TradeLog />
              </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/edit-trade/:id" element={
            <ProtectedRoute>
              <SidebarLayout>
                <EditTrade />
              </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/compounding-challenge" element={
            <ProtectedRoute>
              <SidebarLayout>
                <CompoundingChallenge />
              </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/forex-sessions" element={
            <ProtectedRoute>
              <SidebarLayout>
                <ForexSessionAdvisor />
              </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <SidebarLayout>
                <Profile />
              </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;