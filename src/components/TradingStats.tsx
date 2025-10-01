import React from 'react';
import { TrendingUp, DollarSign, Target, Award, BarChart3, Users } from 'lucide-react';

export const TradingStats: React.FC = () => {
  // Mock aggregated trading statistics
  const stats = [
    {
      label: 'Total Profit Generated',
      value: '$2,847,392',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      change: '+12.5%',
      period: 'this month'
    },
    {
      label: 'Average Win Rate',
      value: '68.4%',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      change: '+3.2%',
      period: 'vs last month'
    },
    {
      label: 'Active Traders',
      value: '1,247',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      change: '+89',
      period: 'new this week'
    },
    {
      label: 'Trades Executed',
      value: '15,632',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      change: '+1,234',
      period: 'this week'
    }
  ];

  const achievements = [
    { trader: 'ForexMaster2024', achievement: 'Reached 85% win rate', time: '2 hours ago' },
    { trader: 'PipHunter', achievement: 'Completed 100 trades milestone', time: '4 hours ago' },
    { trader: 'TradingGuru', achievement: 'Generated $10K profit', time: '6 hours ago' },
    { trader: 'MarketAnalyst', achievement: '30-day trading streak', time: '8 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Platform Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Platform Statistics
          </h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Live Data</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center text-sm">
                    <span className="text-green-600 font-medium">{stat.change}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">{stat.period}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Award className="h-5 w-5 text-yellow-500 mr-2" />
            Recent Achievements
          </h3>
        </div>
        
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {achievement.trader}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {achievement.achievement}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {achievement.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};