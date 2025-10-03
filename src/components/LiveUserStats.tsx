import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Activity, Clock, MapPin, Crown, Zap } from 'lucide-react';
import { useUserStats } from '../hooks/useUserStats';

export const LiveUserStats: React.FC = () => {
  const { totalUsers, activeToday, totalTrades, recentSignups, onlineUsers, premiumUsers, loading } = useUserStats();
  const [currentSignupIndex, setCurrentSignupIndex] = useState(0);

  // Rotate through recent signups every 3 seconds
  useEffect(() => {
    if (recentSignups.length > 0) {
      const interval = setInterval(() => {
        setCurrentSignupIndex((prev) => (prev + 1) % recentSignups.length);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [recentSignups.length]);

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'premium':
        return <Crown className="h-3 w-3 text-yellow-500" />;
      case 'admin':
        return <Zap className="h-3 w-3 text-purple-500" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'premium':
        return 'from-yellow-500 to-orange-500';
      case 'admin':
        return 'from-purple-500 to-indigo-500';
      default:
        return 'from-blue-500 to-purple-500';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Activity className="h-5 w-5 text-green-500 mr-2" />
          Live Community
        </h3>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
          <div className="text-lg sm:text-xl font-bold text-blue-600">
            {totalUsers.toLocaleString()}
          </div>
          <div className="text-xs text-blue-600/80">Total Traders</div>
        </div>
        
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="relative">
            <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-green-600">
            {onlineUsers}
          </div>
          <div className="text-xs text-green-600/80">Online Now</div>
        </div>
        
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <Activity className="h-5 w-5 text-purple-600 mx-auto mb-1" />
          <div className="text-lg sm:text-xl font-bold text-purple-600">
            {activeToday.toLocaleString()}
          </div>
          <div className="text-xs text-purple-600/80">Active Today</div>
        </div>

        <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <Crown className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
          <div className="text-lg sm:text-xl font-bold text-yellow-600">
            {premiumUsers}
          </div>
          <div className="text-xs text-yellow-600/80">Premium</div>
        </div>
      </div>

      {/* Recent Signups */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Recent Signups
          </h4>
          <Clock className="h-4 w-4 text-gray-400" />
        </div>
        
        {recentSignups.length > 0 && (
          <div className="space-y-2">
            {/* Current rotating signup */}
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg transition-all duration-500">
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 bg-gradient-to-r ${getRoleColor(recentSignups[currentSignupIndex]?.role)} rounded-full flex items-center justify-center relative`}>
                  <span className="text-xs font-bold text-white">
                    {recentSignups[currentSignupIndex]?.username.charAt(0).toUpperCase()}
                  </span>
                  {recentSignups[currentSignupIndex]?.role !== 'user' && (
                    <div className="absolute -top-1 -right-1">
                      {getRoleIcon(recentSignups[currentSignupIndex]?.role)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {recentSignups[currentSignupIndex]?.username}
                    </div>
                    {recentSignups[currentSignupIndex]?.role === 'premium' && (
                      <Crown className="h-3 w-3 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <MapPin className="h-3 w-3 mr-1" />
                    {recentSignups[currentSignupIndex]?.country || 'Unknown'}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {getTimeAgo(recentSignups[currentSignupIndex]?.created_at)}
              </div>
            </div>
            
            {/* Show next 2 signups */}
            {recentSignups.slice(1, 3).map((signup, index) => (
              <div key={signup.id} className="flex items-center justify-between p-2 opacity-60">
                <div className="flex items-center space-x-2">
                  <div className={`w-5 h-5 bg-gradient-to-r ${getRoleColor(signup.role)} rounded-full flex items-center justify-center relative`}>
                    <span className="text-xs font-bold text-white">
                      {signup.username.charAt(0).toUpperCase()}
                    </span>
                    {signup.role !== 'user' && (
                      <div className="absolute -top-0.5 -right-0.5">
                        {getRoleIcon(signup.role)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {signup.username}
                      </div>
                      {signup.role === 'premium' && (
                        <Crown className="h-3 w-3 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="h-3 w-3 mr-1" />
                      {signup.country || 'Unknown'}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {getTimeAgo(signup.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Join message */}
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-sm text-center">
            <span className="text-gray-700 dark:text-gray-300">
              Join <span className="font-semibold text-blue-600">{totalUsers.toLocaleString()}+</span> traders 
            </span>
            <div className="flex items-center justify-center space-x-4 mt-2 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 font-medium">{onlineUsers} online</span>
              </div>
              <div className="flex items-center space-x-1">
                <Crown className="h-3 w-3 text-yellow-500" />
                <span className="text-yellow-600 font-medium">{premiumUsers} premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};