import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Star, TrendingUp, Calendar, ChevronsUpDown, X } from 'lucide-react';

const ratingData = [
  { name: 'Love it', count: 384, color: '#16a34a' },
  { name: 'Great', count: 145, color: '#0e7490' },
  { name: 'Okay', count: 24, color: '#eab308' },
  { name: 'Poor', count: 5, color: '#ea580c' },
  { name: 'Terrible', count: 1, color: '#dc2626' },
];

const totalRatings = ratingData.reduce((acc, item) => acc + item.count, 0);
const weightedTotal = ratingData.reduce((acc, item, index) => acc + item.count * (5 - index), 0);
const averageRating = (weightedTotal / totalRatings).toFixed(2);

const RatingDistributionPage: React.FC = () => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleDateRangeSelect = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setIsDatePickerOpen(false);
  };

  const clearDateRange = () => {
    setStartDate('');
    setEndDate('');
  };

  const formatDateRange = () => {
    if (startDate && endDate) {
      return `${startDate} - ${endDate}`;
    }
    return 'Select Date Range';
  };

  // Generate last 30 days for quick selection
  const getLast30Days = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  };

  const getLast7Days = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  };

  const getThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date();
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Rating Distribution</h1>
        <div className="relative">
          <button
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="flex items-center pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Calendar className="w-5 h-5 text-gray-400 absolute left-3" />
            <span className={startDate && endDate ? 'text-gray-900' : 'text-gray-500'}>
              {formatDateRange()}
            </span>
            <ChevronsUpDown className="w-4 h-4 text-gray-400 ml-auto" />
          </button>
          
          {isDatePickerOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Select Date Range</h3>
                  <button
                    onClick={() => setIsDatePickerOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Quick Selection Buttons */}
                <div className="grid grid-cols-1 gap-2 mb-4">
                  <button
                    onClick={() => handleDateRangeSelect(getLast7Days().start, getLast7Days().end)}
                    className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Last 7 days
                  </button>
                  <button
                    onClick={() => handleDateRangeSelect(getLast30Days().start, getLast30Days().end)}
                    className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Last 30 days
                  </button>
                  <button
                    onClick={() => handleDateRangeSelect(getThisMonth().start, getThisMonth().end)}
                    className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    This month
                  </button>
                </div>

                {/* Custom Date Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={clearDateRange}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear
                  </button>
                  <div className="space-x-2">
                    <button
                      onClick={() => setIsDatePickerOpen(false)}
                      className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDateRangeSelect(startDate, endDate)}
                      disabled={!startDate || !endDate}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Date Range Display */}
      {startDate && endDate && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              Showing data from <strong>{startDate}</strong> to <strong>{endDate}</strong>
            </span>
            <button
              onClick={clearDateRange}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear filter
            </button>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-yellow-100">
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <h4 className="text-gray-500 text-sm font-medium">Average Rating</h4>
              <p className="text-3xl font-bold text-gray-800">{averageRating}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-100">
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <h4 className="text-gray-500 text-sm font-medium">Total Ratings</h4>
              <p className="text-3xl font-bold text-gray-800">{totalRatings}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Feedback Count by Rating</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={60} stroke="#6b7280" />
              <Tooltip cursor={{ fill: '#f3f4f6' }} />
              <Bar dataKey="count" barSize={30}>
                {ratingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Data Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Breakdown</h2>
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">Rating</th>
                <th scope="col" className="px-6 py-3 font-medium">Count</th>
                <th scope="col" className="px-6 py-3 font-medium">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {ratingData.map((item) => (
                <tr key={item.name} className="bg-white border-b">
                  <td className="px-6 py-4 font-semibold text-gray-700 flex items-center">
                    <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.count}</td>
                  <td className="px-6 py-4 text-gray-600">{((item.count / totalRatings) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RatingDistributionPage; 