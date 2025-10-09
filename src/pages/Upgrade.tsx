import React, { useState, useEffect } from 'react';
import { Crown, Check, Zap, TrendingUp, Shield, Smartphone, FileText, Headphones } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface PricingPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billing_period: string;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
}

export const Upgrade: React.FC = () => {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_packages')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPackage = (pkg: PricingPackage) => {
    alert(`Selected: ${pkg.name} - $${pkg.price}/${pkg.billing_period}\n\nPayment integration coming soon!`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 dark:text-gray-400">Loading pricing...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mb-4">
          <Crown className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Upgrade to Premium
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Take your trading to the next level with advanced features and premium signals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-transform hover:scale-105 ${
              pkg.is_popular ? 'ring-2 ring-yellow-500' : ''
            }`}
          >
            {pkg.is_popular && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                POPULAR
              </div>
            )}

            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {pkg.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {pkg.description}
              </p>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    ${pkg.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    /{pkg.billing_period === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>
                {pkg.billing_period === 'yearly' && pkg.price > 0 && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                    Save ${((pkg.price / 12) * 12 * 0.33).toFixed(2)} per year
                  </p>
                )}
              </div>

              <button
                onClick={() => handleSelectPackage(pkg)}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  pkg.is_popular
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:from-yellow-500 hover:to-yellow-700 shadow-lg hover:shadow-xl'
                    : pkg.price === 0
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {pkg.price === 0 ? 'Current Plan' : 'Get Started'}
              </button>

              <div className="mt-8 space-y-4">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Why Upgrade to Premium?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-1">Premium Signals</h3>
              <p className="text-sm text-blue-100">Access exclusive trading signals</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-1">Advanced Analytics</h3>
              <p className="text-sm text-blue-100">Detailed performance insights</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-1">Mobile Access</h3>
              <p className="text-sm text-blue-100">Trade on the go</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <Headphones className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-1">Priority Support</h3>
              <p className="text-sm text-blue-100">Get help when you need it</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Can I cancel anytime?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We accept all major credit cards, PayPal, and bank transfers for annual plans.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Is there a free trial?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              The Free plan is available forever with basic features. Upgrade anytime to access premium features.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Do you offer refunds?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
