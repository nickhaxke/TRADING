import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { AuthPage } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { AddTrade } from './pages/AddTrade';
import { TradeLog } from './pages/TradeLog';
import { EditTrade } from './pages/EditTrade';
import { CompoundingChallenge } from './pages/CompoundingChallenge';
import { ForexSessionAdvisor } from './pages/ForexSessionAdvisor';
import { PersonalBrand } from './pages/PersonalBrand';
import { AdminPanel } from './pages/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <Router>
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
          <Route path="/forex-sessions" element={
            <ProtectedRoute>
              <Layout>
                <ForexSessionAdvisor />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/personal-brand" element={
            <ProtectedRoute>
              <Layout>
                <PersonalBrand />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Layout>
                <AdminPanel />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;