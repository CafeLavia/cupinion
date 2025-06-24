// Full email view page for all collected emails. Created by AI.
import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { FeedbackService } from '../../../services/feedbackService';

const AllEmailsPage: React.FC = () => {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const pageSize = 20;

  useEffect(() => {
    setLoading(true);
    setError('');
    FeedbackService.fetchAllFeedback()
      .then((data) => {
        setFeedback(data.filter(f => f.customer_email && f.customer_email.trim() !== ''));
        setLoading(false);
      })
      .catch((e) => {
        setError('Failed to load feedback');
        setLoading(false);
      });
  }, []);

  // Filter by date range
  const filtered = feedback.filter(f => {
    if (startDate) {
      const d = new Date(f.created_at);
      const s = new Date(startDate);
      if (d < s) return false;
    }
    if (endDate) {
      const d = new Date(f.created_at);
      const e = new Date(endDate);
      if (d > e) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pagedEmails = filtered.slice((page - 1) * pageSize, page * pageSize);

  function downloadCSV() {
    const rows = [
      ['Email', 'Rating'],
      ...filtered.map(f => [f.customer_email, f.rating]),
    ];
    const csv = rows.map(r => r.map(x => `"${x}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all-emails.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Reset to page 1 if filter changes
  useEffect(() => { setPage(1); }, [startDate, endDate]);

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10">
      <div className="backdrop-blur-md bg-white/80 border border-blue-100 rounded-3xl shadow-2xl p-4 sm:p-8 w-full max-w-5xl transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight drop-shadow-sm">All Collected Emails</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 sm:items-center w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="flex gap-2 w-full sm:w-auto">
                <label className="text-sm text-gray-600 self-center">Start:</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border border-blue-200 rounded-full px-3 py-1 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full sm:w-auto" />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <label className="text-sm text-gray-600 self-center">End:</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border border-blue-200 rounded-full px-3 py-1 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition w-full sm:w-auto" />
              </div>
            </div>
            <button onClick={downloadCSV} className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 text-sm font-semibold transition w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" /> Download CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl shadow-inner border border-blue-100 bg-white/90">
          <table className="min-w-[600px] w-full text-sm text-left rounded-2xl overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-100 to-blue-50">
              <tr>
                <th className="px-8 py-4 font-bold text-gray-700 tracking-wide">Email</th>
                <th className="px-8 py-4 font-bold text-gray-700 tracking-wide">Rating</th>
              </tr>
            </thead>
            <tbody>
              {pagedEmails.map((f, idx) => (
                <tr key={idx} className={
                  `transition-all duration-150 ${idx % 2 === 0 ? 'bg-white/70' : 'bg-blue-50/60'} hover:bg-blue-100/80`}
                >
                  <td className="px-8 py-4 font-medium text-gray-800 whitespace-nowrap">{f.customer_email}</td>
                  <td className="px-8 py-4 font-semibold text-gray-700">{f.rating}</td>
                </tr>
              ))}
              {pagedEmails.length === 0 && (
                <tr><td colSpan={2} className="px-8 py-10 text-center text-gray-400 text-lg">No emails found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold disabled:opacity-50 transition">Prev</button>
          <span className="px-4 py-2 font-semibold text-gray-600">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold disabled:opacity-50 transition">Next</button>
        </div>
        {loading && <div className="mt-8 text-center text-gray-500 text-lg animate-pulse">Loading...</div>}
        {error && <div className="mt-8 text-center text-red-500 text-lg">{error}</div>}
      </div>
    </div>
  );
};

export default AllEmailsPage; 