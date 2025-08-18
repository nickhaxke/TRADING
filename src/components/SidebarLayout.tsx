import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { 
  TrendingUp, 
  LogOut, 
  Moon, 
  Sun, 
  PlusCircle, 
  BarChart3, 
  FileText,
  Globe,
  Menu,
  X,
  User,
  Target,
  Home
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/trades', label: 'Trade Log', icon: FileText },
    { path: '/add-trade', label: 'Add Trade', icon: PlusCircle },
    { path: '/compounding-challenge', label: 'Challenge', icon: Target },
    { path: '/forex-sessions', label: 'Sessions', icon: Globe },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <Link to="/dashboard" className="flex items-center space-x-2" onClick={closeSidebar}>
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Trading Journal
              </span>
            </Link>
            <button
              onClick={closeSidebar}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
            {/* User info */}
            <div className="flex items-center space-x-3 px-4 py-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            {/* Sign out */}
            <button
              onClick={signOut}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Mobile header */}
          <div className="lg:hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between h-16 px-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link to="/dashboard" className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  Trading Journal
                </span>
              </Link>
              <div className="w-10" /> {/* Spacer for centering */}
            </div>
          </div>

          {/* Page content */}
          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};