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
  CheckCircle
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

  const exportToPDF = () => {
    setExporting(true);
    
    setTimeout(async () => {
      try {
        // Dynamic import of jsPDF and autoTable
        const { default: jsPDF } = await import('jspdf');
        const autoTable = (await import('jspdf-autotable')).default;
        
        const doc = new jsPDF();
        let yPosition = 22;
      
        // Title
        doc.setFontSize(20);
        doc.text('Trading Journal Report', 14, yPosition);
        yPosition += 10;
      
        // Date
        doc.setFontSize(12);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, yPosition);
        yPosition += 10;
      
        // Summary stats
        const totalTrades = trades.length;
        const totalProfit = trades.reduce((sum, trade) => sum + trade.outcome, 0);
        const winningTrades = trades.filter(trade => trade.outcome > 0).length;
        const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
      
        doc.text(`Total Trades: ${totalTrades}`, 14, yPosition);
        yPosition += 8;
        doc.text(`Total Profit: $${totalProfit.toFixed(2)}`, 14, yPosition);
        yPosition += 8;
        doc.text(`Win Rate: ${winRate.toFixed(1)}%`, 14, yPosition);
        yPosition += 15;
      
        // Process each trade with details
        for (let i = 0; i < filteredAndSortedTrades.length; i++) {
          const trade = filteredAndSortedTrades[i];
          
          // Check if we need a new page
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          
          // Trade header
          doc.setFontSize(14);
          doc.setFont(undefined, 'bold');
          doc.text(`Trade ${i + 1}: ${trade.pair} (${trade.trade_type || 'N/A'})`, 14, yPosition);
          yPosition += 8;
          
          // Trade details
          doc.setFontSize(10);
          doc.setFont(undefined, 'normal');
          doc.text(`Date: ${new Date(trade.date).toLocaleDateString()}`, 14, yPosition);
          doc.text(`Entry: ${trade.entry_price.toFixed(5)}`, 80, yPosition);
          doc.text(`Outcome: $${trade.outcome.toFixed(2)}`, 140, yPosition);
          yPosition += 6;
          
          doc.text(`Stop Loss: ${trade.stop_loss.toFixed(5)}`, 14, yPosition);
          doc.text(`Take Profit: ${trade.take_profit.toFixed(5)}`, 80, yPosition);
          doc.text(`RR Ratio: ${trade.rr_ratio.toFixed(2)}`, 140, yPosition);
          yPosition += 6;
          
          if (trade.lot_size) {
            doc.text(`Lot Size: ${trade.lot_size}`, 14, yPosition);
            yPosition += 6;
          }
          
          // Reason
          doc.text(`Reason: ${trade.reason}`, 14, yPosition);
          yPosition += 6;
          
          // Notes
          if (trade.notes) {
            const noteLines = doc.splitTextToSize(`Notes: ${trade.notes}`, 180);
            doc.text(noteLines, 14, yPosition);
            yPosition += noteLines.length * 6;
          }
          
          // Add image if available
          if (trade.screenshot_url) {
            try {
              // Try to fetch image as blob first (better CORS handling)
              let imageDataUrl: string | null = null;
              
              try {
                const response = await fetch(trade.screenshot_url, {
                  mode: 'cors',
                  credentials: 'omit'
                });
                
                if (response.ok) {
                  const blob = await response.blob();
                  
                  // Convert blob to data URL
                  imageDataUrl = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                  });
                }
              } catch (fetchError) {
                console.warn('Fetch method failed, trying Image element:', fetchError);
                
                // Fallback to Image element method
                try {
                  const img = new Image();
                  img.crossOrigin = 'anonymous';
                  
                  await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = trade.screenshot_url!;
                  });
                  
                  // Convert image to canvas then to data URL
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  canvas.width = img.width;
                  canvas.height = img.height;
                  ctx?.drawImage(img, 0, 0);
                  imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                } catch (imgError) {
                  console.warn('Image element method also failed:', imgError);
                }
              }
              
              if (imageDataUrl) {
                // Create temporary image to get dimensions
                const tempImg = new Image();
                await new Promise((resolve) => {
                  tempImg.onload = resolve;
                  tempImg.src = imageDataUrl!;
                });
                
                // Calculate image dimensions to fit in PDF
                const maxWidth = 180;
                const maxHeight = 80;
                let { width, height } = tempImg;
                
                if (width > maxWidth) {
                  height = (height * maxWidth) / width;
                  width = maxWidth;
                }
                
                if (height > maxHeight) {
                  width = (width * maxHeight) / height;
                  height = maxHeight;
                }
                
                // Check if image fits on current page
                if (yPosition + height > 280) {
                  doc.addPage();
                  yPosition = 20;
                }
                
                // Add image to PDF
                doc.addImage(imageDataUrl, 'JPEG', 14, yPosition, width, height);
                yPosition += height + 5;
              } else {
                // If image loading failed, show URL as text
                console.warn('Could not load image for PDF, showing URL instead:', trade.screenshot_url);
                doc.text(`Screenshot: ${trade.screenshot_url}`, 14, yPosition);
                yPosition += 6;
              }
              
            } catch (error) {
              console.warn('Error processing image for PDF:', error);
              doc.text(`Screenshot: ${trade.screenshot_url}`, 14, yPosition);
              yPosition += 6;
            }
          }
          
          // Add separator line
          doc.setDrawColor(200, 200, 200);
          doc.line(14, yPosition, 196, yPosition);
          yPosition += 10;
        }
        
        // Summary table on last page
        if (filteredAndSortedTrades.length > 0) {
          doc.addPage();
          doc.setFontSize(16);
          doc.setFont(undefined, 'bold');
          doc.text('Trade Summary', 14, 20);
          
          const tableColumns = ['Date', 'Pair', 'Type', 'Entry', 'SL', 'TP', 'RR', 'Outcome'];
          const tableRows = filteredAndSortedTrades.map(trade => [
            new Date(trade.date).toLocaleDateString(),
            trade.pair,
            trade.trade_type || 'N/A',
            trade.entry_price.toFixed(5),
            trade.stop_loss.toFixed(5),
            trade.take_profit.toFixed(5),
            trade.rr_ratio.toFixed(2),
            `$${trade.outcome.toFixed(2)}`
          ]);
          
          autoTable(doc, {
            head: [tableColumns],
            body: tableRows,
            startY: 30,
            styles: { fontSize: 8 },
            columnStyles: { 
              0: { cellWidth: 22 },
              1: { cellWidth: 18 },
              2: { cellWidth: 15 },
              3: { cellWidth: 22 },
              4: { cellWidth: 22 },
              5: { cellWidth: 22 },
              6: { cellWidth: 18 },
              7: { cellWidth: 22 }
            }
          });
        }
      
        doc.save(`trading-journal-${new Date().toISOString().split('T')[0]}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
      } finally {
        setExporting(false);
      }
    }, 500);
  };

  const handleImagePreview = (imageUrl: string) => {
    setImagePreview(imageUrl);
  };

  const closeImagePreview = () => {
    setImagePreview(null);
  };

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

    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Trade Log</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={exportToPDF}
            disabled={exporting}
            className="inline-flex items-center justify-center px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-base sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {exporting ? 'Generating PDF...' : 'Export Detailed PDF'}
          </button>
          <Link
            to="/add-trade"
            className="inline-flex items-center justify-center px-4 py-2.5 sm:py-2 border border-transparent rounded-md shadow-sm text-base sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Trade
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search trades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency Pair
            </label>
            <select
              value={filterPair}
              onChange={(e) => setFilterPair(e.target.value)}
              className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base sm:text-sm"
            >
              <option value="">All Pairs</option>
              {uniquePairs.map(pair => (
                <option key={pair} value={pair}>{pair}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Outcome
            </label>
            <select
              value={filterOutcome}
              onChange={(e) => setFilterOutcome(e.target.value as 'all' | 'win' | 'loss')}
              className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base sm:text-sm"
            >
              <option value="all">All Outcomes</option>
              <option value="win">Wins</option>
              <option value="loss">Losses</option>
            </select>
          </div>

          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterPair('');
                setFilterOutcome('all');
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-base sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Trade Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {trades.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-base sm:text-lg">No trades recorded yet.</p>
            <Link
              to="/add-trade"
              className="inline-flex items-center px-4 py-2.5 sm:py-2 border border-transparent rounded-md shadow-sm text-base sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Trade
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {[
                      { key: 'date', label: 'Date' },
                      { key: 'pair', label: 'Pair' },
                      { key: 'entry_price', label: 'Entry' },
                      { key: 'stop_loss', label: 'SL' },
                      { key: 'take_profit', label: 'TP' },
                      { key: 'rr_ratio', label: 'RR' },
                      { key: 'outcome', label: 'Outcome' },
                      { key: 'reason', label: 'Reason' }
                    ].map((column) => (
                      <th
                        key={column.key}
                        className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 whitespace-nowrap"
                        onClick={() => handleSort(column.key)}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{column.label}</span>
                          {sortField === column.key && (
                            sortDirection === 'asc' ? 
                              <ChevronUp className="h-4 w-4" /> : 
                              <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedTrades.map((trade) => (
                    <tr key={trade.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(trade.date).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {trade.pair}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {trade.entry_price.toFixed(5)}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {trade.stop_loss.toFixed(5)}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {trade.take_profit.toFixed(5)}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {trade.rr_ratio.toFixed(2)}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-medium ${trade.outcome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${trade.outcome.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-900 dark:text-white max-w-32 sm:max-w-xs truncate">
                        {trade.reason}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          {trade.screenshot_url && (
                            <button
                              onClick={() => handleImagePreview(trade.screenshot_url!)}
                              className="text-blue-600 hover:text-blue-500 transition-colors p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              title="View screenshot"
                            >
                              <ImageIcon className="h-4 w-4" />
                            </button>
                          )}
                          <Link
                            to={`/edit-trade/${trade.id}`}
                            className="text-green-600 hover:text-green-500 transition-colors p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
                            title="Edit trade"
                          >
                            <Edit className="h-4 w-4" />
                        {/* Trading Steps Validation Badge */}
                        {(trade as any).trading_steps && (() => {
                          try {
                            const steps = JSON.parse((trade as any).trading_steps);
                            const completedSteps = steps.filter((step: any) => step.completed).length;
                            const totalSteps = steps.length;
                            const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
                            
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
                          } catch (e) {
                            return null;
                          }
                          return null;
                        })()}
                        
                        {/* Before/After Images */}
                        {((trade as any).before_image || (trade as any).after_image) && (
                          <button
                            onClick={() => {
                              // You can implement a modal to show before/after comparison
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
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white dark:bg-gray-800 px-3 sm:px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 lg:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      Showing{' '}
                      <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span>
                      {' '}to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, filteredAndSortedTrades.length)}
                      </span>
                      {' '}of{' '}
                      <span className="font-medium">{filteredAndSortedTrades.length}</span>
                      {' '}results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px text-sm">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-3 sm:px-4 py-2 border font-medium ${
                            currentPage === page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </>
  );
};