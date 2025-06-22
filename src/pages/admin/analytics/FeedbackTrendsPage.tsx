import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, MapPin, AlertTriangle, Users, Clock, BarChart3 } from 'lucide-react';

const trendData = [
  { name: 'Jan', good: 40, bad: 2, total: 42 },
  { name: 'Feb', good: 30, bad: 5, total: 35 },
  { name: 'Mar', good: 50, bad: 3, total: 53 },
  { name: 'Apr', good: 45, bad: 7, total: 52 },
  { name: 'May', good: 60, bad: 4, total: 64 },
  { name: 'Jun', good: 55, bad: 2, total: 57 },
];

const locationData = [
  { name: 'Table 1', feedbacks: 45, avgRating: 4.2, color: '#16a34a' },
  { name: 'Table 2', feedbacks: 38, avgRating: 4.5, color: '#0e7490' },
  { name: 'Table 3', feedbacks: 52, avgRating: 3.8, color: '#eab308' },
  { name: 'Table 4', feedbacks: 29, avgRating: 4.1, color: '#ea580c' },
  { name: 'Table 5', feedbacks: 41, avgRating: 4.3, color: '#dc2626' },
];

const feedbackBreakdown = [
  { name: 'Love it', value: 45, color: '#16a34a' },
  { name: 'Great', value: 30, color: '#0e7490' },
  { name: 'Okay', value: 15, color: '#eab308' },
  { name: 'Poor', value: 8, color: '#ea580c' },
  { name: 'Terrible', value: 2, color: '#dc2626' },
];

const suspiciousActivity = [
  { id: 'ALERT-001', type: 'Duplicate Bill ID', description: 'Bill ID BILL-123 used 3 times', severity: 'High', time: '2 hours ago' },
  { id: 'ALERT-002', type: 'Multiple IP Feedback', description: '5 feedbacks from same IP in 1 hour', severity: 'Medium', time: '4 hours ago' },
  { id: 'ALERT-003', type: 'Duplicate Bill ID', description: 'Bill ID BILL-456 used 2 times', severity: 'Low', time: '6 hours ago' },
];

const FeedbackTrendsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');

  const totalFeedback = trendData.reduce((acc, item) => acc + item.total, 0);
  const avgPerDay = (totalFeedback / 180).toFixed(1); // Assuming 6 months
  const avgPerWeek = (totalFeedback / 26).toFixed(1);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Analytics & Reports</h1>
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

      {/* Overall Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-100">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-gray-500 text-sm font-medium">Total Feedback</h4>
              <p className="text-3xl font-bold text-gray-800">{totalFeedback}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-100">
              <Clock className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-gray-500 text-sm font-medium">Avg. per Day</h4>
              <p className="text-3xl font-bold text-gray-800">{avgPerDay}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-purple-100">
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-gray-500 text-sm font-medium">Avg. per Week</h4>
              <p className="text-3xl font-bold text-gray-800">{avgPerWeek}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-orange-100">
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-gray-500 text-sm font-medium">Growth Rate</h4>
              <p className="text-3xl font-bold text-gray-800">+12.5%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Feedback Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Feedback Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={feedbackBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {feedbackBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {feedbackBreakdown.map((item) => (
              <div key={item.name} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Trends Over Time */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Feedback Trends Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="good" stroke="#16a34a" strokeWidth={2} name="Good Feedback" />
              <Line type="monotone" dataKey="bad" stroke="#dc2626" strokeWidth={2} name="Bad Feedback" />
              <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} name="Total" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Location-wise Feedback */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex items-center mb-4">
          <MapPin className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">📍 Location-wise Feedback</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-3">Feedback Count by Location</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={locationData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={60} stroke="#6b7280" />
                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="feedbacks" barSize={20}>
                  {locationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-3">Location Performance Comparison</h3>
            <div className="space-y-3">
              {locationData.map((location) => (
                <div key={location.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: location.color }}></div>
                    <span className="font-medium text-gray-700">{location.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-800">{location.feedbacks} feedbacks</div>
                    <div className="text-xs text-gray-500">Avg: {location.avgRating}/5</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Suspicious Activity Alerts */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">🧠 Suspicious Activity Alerts</h2>
        </div>
        <div className="space-y-3">
          {suspiciousActivity.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  alert.severity === 'High' ? 'bg-red-500' : 
                  alert.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div>
                  <div className="font-medium text-gray-800">{alert.type}</div>
                  <div className="text-sm text-gray-600">{alert.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                  alert.severity === 'High' ? 'bg-red-100 text-red-800' : 
                  alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {alert.severity}
                </div>
                <div className="text-xs text-gray-500 mt-1">{alert.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackTrendsPage; 