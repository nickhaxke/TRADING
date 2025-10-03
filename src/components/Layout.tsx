import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, LogOut, Home, BarChart2, PlusSquare, List, Target, Calculator, Clock, Menu, X, Shield } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();
  const { signOut, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        if (data && data.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  let navigationItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/add-trade', icon: PlusSquare, label: 'Add Trade' },
    { to: '/trades', icon: List, label: 'Trade Log' },
    { to: '/compounding-challenge', icon: Target, label: 'Challenge' },
    { to: '/risk-manager', icon: Calculator, label: 'Risk Manager' },
    { to: '/forex-sessions', icon: Clock, label: 'Sessions' },
  ];

  // Add admin route if user is admin
  if (isAdmin) {
    navigationItems.push({ to: '/admin', icon: Shield, label: 'Admin' });
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <nav className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/dashboard" className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                Trading Journal Pro
            </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden lg:flex space-x-1 xl:space-x-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm xl:text-base"
                  >
                    <item.icon className="h-4 w-4 mr-1 xl:mr-2" />
                    <span className="hidden xl:inline">{item.label}</span>
                    <span className="xl:hidden">{item.label.split(' ')[0]}</span>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Right side controls */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
              
              {/* Sign Out - Desktop */}
              <button
                onClick={handleSignOut}
                className="hidden sm:flex px-2 sm:px-3 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors items-center"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="sm:hidden text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center px-3 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm col-span-2"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>
      
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-3 sm:px-4 lg:px-6 xl:px-8">
        {children}
      </main>
    </div>
  );
};