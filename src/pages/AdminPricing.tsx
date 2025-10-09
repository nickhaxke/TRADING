import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Edit, Trash2, Save, X, Crown, ToggleLeft, ToggleRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';

interface PricingPackage {
  id?: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  billing_period: string;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
  sort_order: string;
}

const emptyPackage: PricingPackage = {
  name: '',
  description: '',
  price: '0.00',
  currency: 'USD',
  billing_period: 'monthly',
  features: [],
  is_popular: false,
  is_active: true,
  sort_order: '0'
};

export const AdminPricing: React.FC = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PricingPackage>(emptyPackage);
  const [newFeature, setNewFeature] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_packages')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const packageData = {
        name: editingPackage.name,
        description: editingPackage.description,
        price: parseFloat(editingPackage.price),
        currency: editingPackage.currency,
        billing_period: editingPackage.billing_period,
        features: editingPackage.features,
        is_popular: editingPackage.is_popular,
        is_active: editingPackage.is_active,
        sort_order: parseInt(editingPackage.sort_order)
      };

      if (editingPackage.id) {
        const { error } = await supabase
          .from('pricing_packages')
          .update(packageData)
          .eq('id', editingPackage.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('pricing_packages')
          .insert([packageData]);

        if (error) throw error;
      }

      setShowForm(false);
      setEditingPackage(emptyPackage);
      fetchPackages();
    } catch (error: any) {
      console.error('Error saving package:', error);
      alert('Error saving package: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (pkg: any) => {
    setEditingPackage({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description || '',
      price: pkg.price.toString(),
      currency: pkg.currency,
      billing_period: pkg.billing_period,
      features: pkg.features || [],
      is_popular: pkg.is_popular,
      is_active: pkg.is_active,
      sort_order: pkg.sort_order.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      const { error } = await supabase
        .from('pricing_packages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setEditingPackage({
        ...editingPackage,
        features: [...editingPackage.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setEditingPackage({
      ...editingPackage,
      features: editingPackage.features.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 dark:text-gray-400">Loading packages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-green-600" />
            Pricing Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage pricing packages for your platform
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Back to Admin
          </Link>
          <button
            onClick={() => {
              setEditingPackage(emptyPackage);
              setShowForm(true);
            }}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Package
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full my-8">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center rounded-t-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingPackage.id ? 'Edit Package' : 'New Package'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingPackage(emptyPackage);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPackage.name}
                    onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Premium, Pro, Enterprise"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingPackage.description}
                    onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Brief description of the package..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingPackage.price}
                    onChange={(e) => setEditingPackage({ ...editingPackage, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="29.99"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Currency
                  </label>
                  <select
                    value={editingPackage.currency}
                    onChange={(e) => setEditingPackage({ ...editingPackage, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="TZS">TZS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Billing Period
                  </label>
                  <select
                    value={editingPackage.billing_period}
                    onChange={(e) => setEditingPackage({ ...editingPackage, billing_period: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingPackage.sort_order}
                    onChange={(e) => setEditingPackage({ ...editingPackage, sort_order: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Features
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Add a feature..."
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {editingPackage.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingPackage({ ...editingPackage, is_popular: !editingPackage.is_popular })}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                      editingPackage.is_popular
                        ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Crown className="h-5 w-5" />
                    <span>Popular</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingPackage({ ...editingPackage, is_active: !editingPackage.is_active })}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                      editingPackage.is_active
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                    }`}
                  >
                    {editingPackage.is_active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                    <span>{editingPackage.is_active ? 'Active' : 'Inactive'}</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPackage(emptyPackage);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${
              !pkg.is_active ? 'opacity-60' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {pkg.name}
                  {pkg.is_popular && <Crown className="h-5 w-5 text-yellow-500" />}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {pkg.description}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ${pkg.price}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                /{pkg.billing_period === 'yearly' ? 'year' : 'month'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {pkg.features.slice(0, 3).map((feature: string, index: number) => (
                <div key={index} className="text-sm text-gray-700 dark:text-gray-300">
                  • {feature}
                </div>
              ))}
              {pkg.features.length > 3 && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  +{pkg.features.length - 3} more features
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className={`text-sm font-medium ${
                pkg.is_active
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {pkg.is_active ? 'Active' : 'Inactive'}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(pkg)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {packages.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No packages yet. Create your first one!</p>
        </div>
      )}
    </div>
  );
};
