import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Star, TrendingUp, Calendar, ChevronsUpDown } from 'lucide-react';

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
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Rating Distribution</h1>
        <div className="relative">
          <Calendar className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
          <input type="text" placeholder="Select Date Range" className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm" />
        </div>
      </div>

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