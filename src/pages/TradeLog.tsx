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
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const TradeLog: React.FC = () => {
  const { trades, loading, deleteTrade } = useTrades();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterPair, setFilterPair] = useState('');
  const [filterOutcome, setFilterOutcome] = useState<'all' | 'win' | 'loss'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [exporting, setExporting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const filteredAndSortedTrades = useMemo(() => {
    let filtered = trades.filter(trade => {
      const matchesSearch = trade.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          trade.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          trade.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPair = filterPair === '' || trade.pair === filterPair;
      
      const matchesOutcome = filterOutcome === 'all' ||
                           (filterOutcome === 'win' && trade.outcome > 0) ||
                           (filterOutcome === 'loss' && trade.outcome < 0);
      
      return matchesSearch && matchesPair && matchesOutcome;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortField as keyof typeof a];
      let bValue = b[sortField as keyof typeof b];

      if (sortField === 'date') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [trades, searchTerm, sortField, sortDirection, filterPair, filterOutcome]);

  const paginatedTrades = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTrades.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedTrades, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedTrades.length / itemsPerPage);
  const uniquePairs = [...new Set(trades.map(trade => trade.pair))].sort();

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      try {
        await deleteTrade(id);
      } catch (error) {
        console.error('Error deleting trade:', error);
      }
    }
  };

  const handleImagePreview = (imageUrl: string) => setImagePreview(imageUrl);
  const closeImagePreview = () => setImagePreview(null);

  // --- exportToPDF function stays the same (not dropped) ---
  // (Skipped here for brevity, but you should keep your full PDF export logic)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 dark:text-gray-400">Loading your trades...</p>
      </div>
    );
  }

  return (
    <>
      {/* Image Preview Modal */}
      {imagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="relative max-w-full max-h-full w-full sm:max-w-4xl">
            <button
              onClick={closeImagePreview}
              className="absolute -top-8 sm:-top-10 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
            <img
              src={imagePreview}
              alt="Trade screenshot"
              className="max-w-full max-h-full object-contain rounded-lg mx-auto"
            />
          </div>
        </div>
      )}

      {/* rest of your JSX unchanged (filters, table, pagination, etc.) */}
    </>
  );
};
