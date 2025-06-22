import React, { useState } from 'react';
import { Mail, BarChart, TrendingUp, Users, Calendar, Target } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronsUpDown } from 'lucide-react';

const emailCollectionData = [
  { month: 'Jan', collected: 120, totalVisitors: 800, rate: 15.0 },
  { month: 'Feb', collected: 95, totalVisitors: 750, rate: 12.7 },
  { month: 'Mar', collected: 140, totalVisitors: 900, rate: 15.6 },
  { month: 'Apr', collected: 110, totalVisitors: 850, rate: 12.9 },
  { month: 'May', collected: 160, totalVisitors: 1000, rate: 16.0 },
  { month: 'Jun', collected: 145, totalVisitors: 950, rate: 15.3 },
];

const emailSourceData = [
  { name: 'QR Code Scan', value: 65, color: '#16a34a' },
  { name: 'Direct Input', value: 20, color: '#0e7490' },
  { name: 'Social Media', value: 10, color: '#eab308' },
  { name: 'Other', value: 5, color: '#ea580c' },
];

const EmailStatsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');

  const totalEmails = emailCollectionData.reduce((acc, item) => acc + item.collected, 0);
  const totalVisitors = emailCollectionData.reduce((acc, item) => acc + item.totalVisitors, 0);
  const avgCollectionRate = ((totalEmails / totalVisitors) * 100).toFixed(1);
  const monthlyGrowth = ((emailCollectionData[5].collected - emailCollectionData[0].collected) / emailCollectionData[0].collected * 100).toFixed(1);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Email Collection Analytics</h1>
        <div className="flex items-center space-x-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-100">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-gray-500 text-sm font-medium">Total Emails Collected</h4>
              <p className="text-3xl font-bold text-gray-800">{totalEmails.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-100">
              <Target className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-gray-500 text-sm font-medium">Collection Rate</h4>
              <p className="text-3xl font-bold text-gray-800">{avgCollectionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-purple-100">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-gray-500 text-sm font-medium">Total Visitors</h4>
              <p className="text-3xl font-bold text-gray-800">{totalVisitors.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-orange-100">
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-gray-500 text-sm font-medium">Monthly Growth</h4>
              <p className="text-3xl font-bold text-gray-800">+{monthlyGrowth}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Email Collection Trends */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Collection Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={emailCollectionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="collected" stroke="#3b82f6" strokeWidth={2} name="Emails Collected" />
              <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#16a34a" strokeWidth={2} name="Collection Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Email Source Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Source Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={emailSourceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {emailSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {emailSourceData.map((item) => (
              <div key={item.name} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{emailCollectionData[5].collected}</div>
            <div className="text-sm text-gray-600">This Month</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{emailCollectionData[5].rate}%</div>
            <div className="text-sm text-gray-600">Current Rate</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{Math.round(totalEmails / 6)}</div>
            <div className="text-sm text-gray-600">Avg. per Month</div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <div className="font-medium text-gray-800">Best Performing Month</div>
                <div className="text-sm text-gray-600">May with {emailCollectionData[4].collected} emails collected</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">{emailCollectionData[4].rate}%</div>
              <div className="text-xs text-gray-500">Collection Rate</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
              <div>
                <div className="font-medium text-gray-800">Growth Opportunity</div>
                <div className="text-sm text-gray-600">February had lowest collection rate at {emailCollectionData[1].rate}%</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-yellow-600">-2.3%</div>
              <div className="text-xs text-gray-500">vs Average</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <div className="font-medium text-gray-800">QR Code Effectiveness</div>
                <div className="text-sm text-gray-600">65% of emails collected through QR code scans</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600">65%</div>
              <div className="text-xs text-gray-500">Primary Source</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailStatsPage; 