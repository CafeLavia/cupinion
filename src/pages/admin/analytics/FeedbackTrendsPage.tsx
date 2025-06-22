import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const trendData = [
  { name: 'Jan', good: 40, bad: 2 },
  { name: 'Feb', good: 30, bad: 5 },
  { name: 'Mar', good: 50, bad: 3 },
  { name: 'Apr', good: 45, bad: 7 },
  { name: 'May', good: 60, bad: 4 },
  { name: 'Jun', good: 55, bad: 2 },
];

const FeedbackTrendsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Feedback Trends</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Feedback Over Time</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="good" stroke="#16a34a" strokeWidth={2} name="Good Feedback" />
            <Line type="monotone" dataKey="bad" stroke="#dc2626" strokeWidth={2} name="Bad Feedback" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FeedbackTrendsPage; 