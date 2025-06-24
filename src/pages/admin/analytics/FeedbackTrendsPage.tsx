import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, MapPin, Users, Clock, BarChart3 } from 'lucide-react';
import { FeedbackService } from '../../../services/feedbackService';

const RATING_LABELS = [
  { name: 'Love it', value: 'loveit', color: '#16a34a' },
  { name: 'Great', value: 'great', color: '#0e7490' },
  { name: 'Okay', value: 'okay', color: '#eab308' },
  { name: 'Poor', value: 'poor', color: '#ea580c' },
  { name: 'Terrible', value: 'terrible', color: '#dc2626' },
];

const FeedbackTrendsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch feedback
  useEffect(() => {
    setLoading(true);
    setError('');
    FeedbackService.fetchAllFeedback()
      .then((data) => {
        setFeedback(data);
        setLoading(false);
      })
      .catch((e) => {
        setError('Failed to load feedback');
        setLoading(false);
      });
  }, []);

  // Helper: get date range for filter
  function getDateRange(timeRange: string) {
    const now = new Date();
    let start: Date;
    if (timeRange === 'week') {
      start = new Date(now);
      start.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      start = new Date(now);
      start.setMonth(now.getMonth() - 1);
    } else if (timeRange === 'quarter') {
      start = new Date(now);
      start.setMonth(now.getMonth() - 3);
    } else if (timeRange === 'year') {
      start = new Date(now);
      start.setFullYear(now.getFullYear() - 1);
    } else {
      start = new Date(0);
    }
    return { start, end: now };
  }

  // Filter feedback by date range
  const filteredFeedback = React.useMemo(() => {
    if (!feedback.length) return [];
    const { start, end } = getDateRange(timeRange);
    return feedback.filter(f => {
      const d = new Date(f.created_at);
      return d >= start && d <= end;
    });
  }, [feedback, timeRange]);

  // Helper: group feedback by period and fill missing periods
  function groupByPeriodAndFill(data: any[], period: 'week' | 'month' | 'quarter' | 'year', range: {start: Date, end: Date}) {
    const groups: Record<string, any[]> = {};
    data.forEach(fb => {
      const date = new Date(fb.created_at);
      let key = '';
      if (period === 'week') {
        const year = date.getFullYear();
        const week = Math.ceil(((Number(date) - Number(new Date(date.getFullYear(), 0, 1))) / 86400000 + new Date(date.getFullYear(), 0, 1).getDay() + 1) / 7);
        key = `${year}-W${week}`;
      } else if (period === 'month') {
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      } else if (period === 'quarter') {
        key = `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`;
      } else if (period === 'year') {
        key = `${date.getFullYear()}`;
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(fb);
    });
    // Fill missing periods
    const filled: { name: string, good: number, bad: number, total: number }[] = [];
    let cursor = new Date(range.start);
    let end = new Date(range.end);
    let periodKeys: string[] = [];
    while (cursor <= end) {
      let key = '';
      if (period === 'week') {
        const year = cursor.getFullYear();
        const week = Math.ceil(((Number(cursor) - Number(new Date(cursor.getFullYear(), 0, 1))) / 86400000 + new Date(cursor.getFullYear(), 0, 1).getDay() + 1) / 7);
        key = `${year}-W${week}`;
        cursor.setDate(cursor.getDate() + 7);
      } else if (period === 'month') {
        key = `${cursor.getFullYear()}-${(cursor.getMonth() + 1).toString().padStart(2, '0')}`;
        cursor.setMonth(cursor.getMonth() + 1);
      } else if (period === 'quarter') {
        key = `${cursor.getFullYear()}-Q${Math.floor(cursor.getMonth() / 3) + 1}`;
        cursor.setMonth(cursor.getMonth() + 3);
      } else if (period === 'year') {
        key = `${cursor.getFullYear()}`;
        cursor.setFullYear(cursor.getFullYear() + 1);
      }
      periodKeys.push(key);
    }
    periodKeys.forEach(key => {
      const items = groups[key] || [];
      const good = items.filter(f => {
        const r = f.rating ? f.rating.replace(/\s+/g, '').toLowerCase() : '';
        return r === 'loveit' || r === 'great';
      }).length;
      const bad = items.filter(f => {
        const r = f.rating ? f.rating.replace(/\s+/g, '').toLowerCase() : '';
        return r === 'poor' || r === 'terrible';
      }).length;
      filled.push({ name: key, good, bad, total: items.length });
    });
    return filled;
  }

  // Compute trend data
  const trendData = React.useMemo(() => {
    if (!filteredFeedback.length) return [];
    const { start, end } = getDateRange(timeRange);
    return groupByPeriodAndFill(filteredFeedback, timeRange, { start, end });
  }, [filteredFeedback, timeRange]);

  // Compute rating breakdown for pie chart
  const feedbackBreakdown = React.useMemo(() => {
    if (!filteredFeedback.length) return [];
    const counts: Record<string, number> = {};
    filteredFeedback.forEach(f => {
      const r = f.rating ? f.rating.replace(/\s+/g, '').toLowerCase() : '';
      counts[r] = (counts[r] || 0) + 1;
    });
    return RATING_LABELS.map(r => ({
      name: r.name,
      value: counts[r.value] || 0,
      color: r.color,
    }));
  }, [filteredFeedback]);

  // Compute location data (by table number)
  const locationData = React.useMemo(() => {
    if (!filteredFeedback.length) return [];
    const tableGroups: Record<string, any[]> = {};
    filteredFeedback.forEach(f => {
      const t = f.table_number ? String(f.table_number) : 'Unknown';
      if (!tableGroups[t]) tableGroups[t] = [];
      tableGroups[t].push(f);
    });
    return Object.entries(tableGroups).map(([table, items]) => {
      const avgRating = (() => {
        const scores: number[] = items.map(f => {
          const r = f.rating ? f.rating.replace(/\s+/g, '').toLowerCase() : '';
          if (r === 'loveit') return 5;
          if (r === 'great') return 4;
          if (r === 'okay') return 3;
          if (r === 'poor') return 2;
          if (r === 'terrible') return 1;
          return 0;
        });
        return scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : '-';
      })();
      return {
        name: `Table ${table}`,
        feedbacks: items.length,
        avgRating,
        color: '#16a34a',
      };
    });
  }, [filteredFeedback]);

  // Summary cards
  const totalFeedback = filteredFeedback.length;
  let avgPerDay = '0.0';
  let avgPerWeek = '0.0';
  if (filteredFeedback.length > 0) {
    // Find min and max date in filteredFeedback
    const dates = filteredFeedback.map(f => new Date(f.created_at));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    // Calculate days (inclusive)
    const days = Math.max(1, Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    // Calculate weeks (inclusive)
    const weeks = Math.max(1, Math.ceil(days / 7));
    avgPerDay = (totalFeedback / days).toFixed(1);
    avgPerWeek = (totalFeedback / weeks).toFixed(1);
  }
  const growthRate = trendData.length > 1 && trendData[trendData.length-2].total > 0
    ? (((trendData[trendData.length - 1].total - trendData[trendData.length - 2].total) / trendData[trendData.length - 2].total) * 100).toFixed(1)
    : '0.0';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Analytics & Reports</h1>
        <div className="flex items-center space-x-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value as any)}
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
              <p className="text-3xl font-bold text-gray-800">{growthRate}%</p>
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
                <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
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
      {loading && <div className="mt-8 text-center text-gray-500">Loading...</div>}
      {error && <div className="mt-8 text-center text-red-500">{error}</div>}
    </div>
  );
};

export default FeedbackTrendsPage; 