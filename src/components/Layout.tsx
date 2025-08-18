import React from 'react';
import { useState } from 'react';
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
  Menu,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/trades', label: 'Trade Log', icon: FileText },
    { path: '/add-trade', label: 'Add Trade', icon: PlusCircle },
    { path: '/compounding-challenge', label: 'Challenge', icon: TrendingUp },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4 lg:space-x-8">
                <Link to="/dashboard" className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                    Trading Journal
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white sm:hidden">
                    TJ
                  </span>
                </Link>
                
                {user && (
                  <div className="hidden lg:flex space-x-4 xl:space-x-6">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeMobileMenu}
                        className={`flex items-center space-x-1 px-2 xl:px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive(item.path)
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                        }`}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="hidden xl:block">{item.label}</span>
                        <span className="xl:hidden">{item.label.split(' ')[0]}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={toggleTheme}
                  className="p-1.5 sm:p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>

                {user && (
                  <>
                    <div className="hidden sm:flex items-center space-x-4">
                      <span className="text-sm text-gray-600 dark:text-gray-300 max-w-32 lg:max-w-none truncate">
                        {user.email}
                      </span>
                      <button
                        onClick={signOut}
                        className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden lg:block">Sign Out</span>
                      </button>
                    </div>
                    
                    {/* Mobile menu button */}
                    <button
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                    >
                      {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {/* Mobile menu */}
            {user && mobileMenuOpen && (
              <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-4">
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors ${
                        isActive(item.path)
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="px-3 py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300 block truncate">
                      {user.email}
                    </span>
                  </div>
                  <div className="mt-2">
                    <button
                      onClick={signOut}
                      className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors w-full"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
};