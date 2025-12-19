import React, { useState, useEffect } from 'react';
import { Plus, Target, Calculator, Search } from 'lucide-react';

export default function App() {
  const [calculators, setCalculators] = useState(() => {
    const initial = {};
    for (let i = 0; i < 100; i++) {
      initial[i] = { entries: [], total: 0 };
    }
    return initial;
  });
  
  const [currentInput, setCurrentInput] = useState({});
  const [expandedCalc, setExpandedCalc] = useState(null);
  const [grandTotal, setGrandTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCalcs, setFilteredCalcs] = useState(Object.keys(calculators).map(Number));

  useEffect(() => {
    const total = Object.values(calculators).reduce((sum, calc) => sum + calc.total, 0);
    setGrandTotal(total);
  }, [calculators]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredCalcs(Object.keys(calculators).map(Number));
    } else {
      const filtered = Object.keys(calculators)
        .map(Number)
        .filter(id => {
          const serialNum = id.toString().padStart(2, '0');
          return serialNum.includes(searchTerm);
        });
      setFilteredCalcs(filtered);
    }
  }, [searchTerm, calculators]);

  const addEntry = (calcId) => {
    const amount = parseFloat(currentInput[calcId] || 0);
    if (amount > 0) {
      setCalculators(prev => {
        const calc = prev[calcId];
        const newEntries = [...calc.entries, amount];
        const newTotal = newEntries.reduce((sum, val) => sum + val, 0);
        return {
          ...prev,
          [calcId]: { entries: newEntries, total: newTotal }
        };
      });
      setCurrentInput(prev => ({ ...prev, [calcId]: '' }));
    }
  };

  const clearCalculator = (calcId) => {
    setCalculators(prev => ({
      ...prev,
      [calcId]: { entries: [], total: 0 }
    }));
    setCurrentInput(prev => ({ ...prev, [calcId]: '' }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const toggleExpand = (calcId) => {
    setExpandedCalc(expandedCalc === calcId ? null : calcId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 sticky top-4 z-10">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Calculator className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">Teer Calculator</h1>
            </div>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-2 sm:p-4 rounded-t-lg cursor-pointer">
              <div className="text-sm font-medium">Grand Total</div>
              <div className="text-2xl font-bold">{formatCurrency(grandTotal)}</div>
            </div>
          </div>
          
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your number to enter the amount in..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          {filteredCalcs.length === 0 && searchTerm && (
            <div className="text-center text-gray-500 mt-2">No calculators found</div>
          )}
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
          {filteredCalcs.map((id) => {
            const calc = calculators[id];
            const serialNum = id.toString().padStart(2, '0');
            const isExpanded = expandedCalc === id;
            
            return (
              <div key={id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-t-lg cursor-pointer"
                    onClick={() => toggleExpand(id)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Target className="w-5 h-5" />
                        <span className="font-bold text-lg">#{serialNum}</span>
                      </div>
                      <div className="text-right min-w-0 flex-1">
                        <div className="text-xs opacity-90">Total</div>
                        <div className="font-bold text-sm break-words">{formatCurrency(calc.total)}</div>
                      </div>
                    </div>
                  </div>
                
                <div className="p-2 sm:p-4">
                  <div className="flex flex-col gap-1 sm:flex-row sm:gap-2 mb-2 sm:mb-3">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Amount"
                      value={currentInput[id] || ''}
                      onChange={(e) => setCurrentInput(prev => ({ ...prev, [id]: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && addEntry(id)}
                      className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => addEntry(id)}
                      className="bg-indigo-600 text-white px-3 py-1.5 sm:p-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3 h-3 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:hidden">Add</span>
                    </button>
                  </div>

                  {isExpanded && calc.entries.length > 0 && (
                    <div className="mb-2 sm:mb-3">
                      <div className="text-xs font-semibold text-gray-600 mb-1 sm:mb-2">Entries:</div>
                      <div className="max-h-32 overflow-y-auto bg-gray-50 rounded p-1 sm:p-2 space-y-1">
                        {calc.entries.map((entry, idx) => (
                          <div key={idx} className="text-xs sm:text-sm text-gray-700 flex justify-between">
                            <span>Entry {idx + 1}:</span>
                            <span className="font-medium">{formatCurrency(entry)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <div className="text-sm text-gray-600">
                      {calc.entries.length} {calc.entries.length === 1 ? 'entry' : 'entries'}
                    </div>
                    {calc.entries.length > 0 && (
                      <button
                        onClick={() => clearCalculator(id)}
                        className="ml-auto text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}