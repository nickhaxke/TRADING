import React, { useState, useMemo } from 'react';
import { useTrades } from '../hooks/useTrades';
import { 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Plus,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Image as ImageIcon,
  Target,
  CheckCircle,
  X, // fixed missing import
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function TradeLog() {
  const { trades, loading, deleteTrade } = useTrades();
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTrades = useMemo(() => {
    return trades.filter(trade =>
      trade.pair.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [trades, searchQuery]);

  const totalPages = Math.ceil(filteredTrades.length / itemsPerPage);
  const displayedTrades = filteredTrades.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this trade?')) {
      await deleteTrade(id);
    }
  };

  const handleImagePreview = (url: string) => {
    setImagePreview(url);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search pair..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <Link
          to="/add-trade"
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-1"
        >
          <Plus className="h-4 w-4" />
          <span>Add Trade</span>
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="px-4 py-2">Pair</th>
              <th className="px-4 py-2">Result</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedTrades.map((trade) => (
              <tr key={trade.id} className="border-t">
                <td className="px-4 py-2">{trade.pair}</td>
                <td className="px-4 py-2">{trade.result}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center space-x-2">
                    {/* Screenshot */}
                    {trade.screenshot_url && (
                      <button
                        onClick={() => handleImagePreview(trade.screenshot_url!)}
                        className="text-blue-600 hover:text-blue-500 transition-colors p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="View screenshot"
                      >
                        <ImageIcon className="h-4 w-4" />
                      </button>
                    )}

                    {/* Trading Steps Validation Badge */}
                    {(trade as any).trading_steps && (() => {
                      try {
                        const steps = JSON.parse((trade as any).trading_steps);
                        const completedSteps = steps.filter((s: any) => s.completed).length;
                        const totalSteps = steps.length;
                        const percentage = totalSteps > 0 
                          ? Math.round((completedSteps / totalSteps) * 100) 
                          : 0;

                        if (totalSteps > 0) {
                          return (
                            <div
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                percentage === 100
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                  : percentage >= 75
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              }`}
                              title={`Setup validation: ${completedSteps}/${totalSteps} criteria (${percentage}%)`}
                            >
                              <Target className="h-3 w-3 mr-1" />
                              {percentage}%
                            </div>
                          );
                        }
                      } catch {
                        return null;
                      }
                      return null;
                    })()}

                    {/* Before/After Images */}
                    {((trade as any).before_image || (trade as any).after_image) && (
                      <button
                        onClick={() => {
                          console.log('Show before/after images for trade:', trade.id);
                        }}
                        className="text-purple-600 hover:text-purple-500 transition-colors p-1 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        title="View before/after comparison"
                      >
                        <div className="flex items-center">
                          <ImageIcon className="h-4 w-4" />
                          <span className="text-xs ml-1">B/A</span>
                        </div>
                      </button>
                    )}

                    {/* Edit & Delete */}
                    <Link
                      to={`/edit-trade/${trade.id}`}
                      className="text-green-600 hover:text-green-500 transition-colors p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
                      title="Edit trade"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() => handleDelete(trade.id)}
                      className="text-red-600 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete trade"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Image Preview Modal */}
      {imagePreview && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white p-4 rounded shadow relative max-w-3xl">
            <button
              onClick={() => setImagePreview(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              <X className="h-5 w-5" />
            </button>
            <img src={imagePreview} alt="Screenshot Preview" className="max-h-[80vh] mx-auto" />
          </div>
        </div>
      )}
    </div>
  );
}
