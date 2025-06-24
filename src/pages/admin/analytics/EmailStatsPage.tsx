import React, { useState, useEffect } from 'react';
import { Mail, TrendingUp, Calendar, Target, Download } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FeedbackService } from '../../../services/feedbackService';

const RATING_LABELS = [
  { name: 'Love it', value: 'loveit', color: '#16a34a' },
  { name: 'Great', value: 'great', color: '#0e7490' },
  { name: 'Okay', value: 'okay', color: '#eab308' },
  { name: 'Poor', value: 'poor', color: '#ea580c' },
  { name: 'Terrible', value: 'terrible', color: '#dc2626' },
];

function normalizeRating(rating: string) {
  return rating ? rating.replace(/\s+/g, '').toLowerCase() : '';
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}

const EmailStatsPage: React.FC = () => {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [emailDateStart, setEmailDateStart] = useState('');
  const [emailDateEnd, setEmailDateEnd] = useState('');

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

  // Filter feedback by time range for stats/charts
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

  const filteredFeedback = React.useMemo(() => {
    if (!feedback.length) return [];
    const { start, end } = getDateRange(timeRange);
    return feedback.filter(f => {
      const d = new Date(f.created_at);
      return d >= start && d <= end;
    });
  }, [feedback, timeRange]);

  // Emails only
  const emails = filteredFeedback.filter(f => f.customer_email && f.customer_email.trim() !== '');
  const totalEmails = emails.length;
  const totalFeedback = filteredFeedback.length;
  const collectionRate = totalFeedback ? ((totalEmails / totalFeedback) * 100).toFixed(1) : '0.0';

  // Weekly growth: compare this week vs previous week
  const now = new Date();
  const startThisWeek = new Date(now);
  startThisWeek.setDate(now.getDate() - 7);
  const startPrevWeek = new Date(now);
  startPrevWeek.setDate(now.getDate() - 14);
  const endPrevWeek = new Date(now);
  endPrevWeek.setDate(now.getDate() - 8);
  const emailsThisWeek = feedback.filter(f => {
    const d = new Date(f.created_at);
    return d >= startThisWeek && d <= now && f.customer_email && f.customer_email.trim() !== '';
  }).length;
  const emailsPrevWeek = feedback.filter(f => {
    const d = new Date(f.created_at);
    return d >= startPrevWeek && d <= endPrevWeek && f.customer_email && f.customer_email.trim() !== '';
  }).length;
  const weeklyGrowth = emailsPrevWeek > 0 ? (((emailsThisWeek - emailsPrevWeek) / emailsPrevWeek) * 100).toFixed(1) : (emailsThisWeek > 0 ? '100.0' : '0.0');

  // Trends: emails per week
  function groupByWeek(data: any[]) {
    const groups: Record<string, any[]> = {};
    data.forEach(fb => {
      const date = new Date(fb.created_at);
      const year = date.getFullYear();
      const week = Math.ceil(((Number(date) - Number(new Date(date.getFullYear(), 0, 1))) / 86400000 + new Date(date.getFullYear(), 0, 1).getDay() + 1) / 7);
      const key = `${year}-W${week}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(fb);
    });
    return groups;
  }
  const trendsData = React.useMemo(() => {
    const groups = groupByWeek(filteredFeedback);
    return Object.entries(groups).map(([week, items]) => {
      const emails = items.filter(f => f.customer_email && f.customer_email.trim() !== '').length;
      const rate = items.length ? (emails / items.length) * 100 : 0;
      return { week, emails, rate: +rate.toFixed(1) };
    }).sort((a, b) => a.week.localeCompare(b.week));
  }, [filteredFeedback]);

  // Pie chart: emails by rating
  const reviewTypeData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    emails.forEach(f => {
      const r = normalizeRating(f.rating);
      counts[r] = (counts[r] || 0) + 1;
    });
    return RATING_LABELS.map(r => ({
      name: r.name,
      value: counts[r.value] || 0,
      color: r.color,
    })).filter(r => r.value > 0);
  }, [emails]);

  // Email list table: show only emails collected today
  const today = new Date();
  today.setHours(0,0,0,0);
  const filteredEmailList = React.useMemo(() => {
    return emails.filter(f => {
      const d = new Date(f.created_at);
      d.setHours(0,0,0,0);
      return d.getTime() === today.getTime();
    });
  }, [emails]);

  // Download CSV (no date)
  function downloadCSV() {
    const rows = [
      ['Email', 'Rating'],
      ...emails.map(f => [f.customer_email, f.rating]),
    ];
    const csv = rows.map(r => r.map(x => `"${x}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emails.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Email Collection Analytics</h1>
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-100">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-gray-500 text-sm font-medium">Total Emails Collected</h4>
              <p className="text-3xl font-bold text-gray-800">{totalEmails}</p>
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
              <p className="text-3xl font-bold text-gray-800">{collectionRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-orange-100">
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-gray-500 text-sm font-medium">Weekly Growth</h4>
              <p className="text-3xl font-bold text-gray-800">{parseFloat(weeklyGrowth) > 0 ? '+' : ''}{weeklyGrowth}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Email Collection Trends */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Collection Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="emails" stroke="#3b82f6" strokeWidth={2} name="Emails Collected" />
              <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#16a34a" strokeWidth={2} name="Collection Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Review Type Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Review Type Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reviewTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {reviewTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {reviewTypeData.map((item) => (
              <div key={item.name} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Email List Table - Today Only */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Today's Collected Emails</h2>
          <div className="flex gap-2 items-center">
            <button onClick={downloadCSV} className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
              <Download className="w-4 h-4 mr-2" /> Download CSV
            </button>
            <a href="/admin/analytics/all-emails" className="ml-4 text-blue-600 hover:underline text-sm">View All</a>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmailList.map((f, idx) => (
                <tr key={idx} className="border-b hover:bg-blue-50 transition">
                  <td className="px-6 py-3">{f.customer_email}</td>
                  <td className="px-6 py-3">{f.rating}</td>
                </tr>
              ))}
              {filteredEmailList.length === 0 && (
                <tr><td colSpan={2} className="px-6 py-6 text-center text-gray-400">No emails collected today.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {loading && <div className="mt-8 text-center text-gray-500">Loading...</div>}
      {error && <div className="mt-8 text-center text-red-500">{error}</div>}
    </div>
  );
};

export default EmailStatsPage; 