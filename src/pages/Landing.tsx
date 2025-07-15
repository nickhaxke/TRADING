import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart3, FileText, Shield, Zap, Download } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="pt-12 sm:pt-20 pb-12 sm:pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <TrendingUp className="h-12 w-12 sm:h-16 sm:w-16 text-blue-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Trading Journal
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto px-4">
              Track your trades, analyze performance, and improve your trading strategy with our comprehensive journal application.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        <div className="py-12 sm:py-16">
          <div className="text-center mb-8 sm:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to track your trades
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive tools to help you become a better trader
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 text-center">
              <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Trade Logging
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Record all your trades with detailed information including entry, exit, and reasoning.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 text-center">
              <BarChart3 className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Analytics Dashboard
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Visualize your performance with charts, win rates, and profit curves.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 text-center sm:col-span-2 lg:col-span-1">
              <Download className="h-10 w-10 sm:h-12 sm:w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                PDF Export
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Export your trading journal and analytics to PDF for reporting.
              </p>
            </div>
          </div>
        </div>

        <div className="py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center px-4">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose Our Trading Journal?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Secure & Private</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Your trading data is encrypted and private to you only.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Fast & Responsive</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Built with modern technology for optimal performance.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <BarChart3 className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Advanced Analytics</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Detailed insights to help improve your trading performance.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 order-1 lg:order-2">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Ready to start?
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
                Join thousands of traders who are already improving their performance with our journal.
              </p>
              <Link
                to="/register"
                className="block w-full text-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};