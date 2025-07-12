import React, { useEffect, useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, CheckCircle, XCircle, Gift } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

// --- Re-usable Stat Card Component ---
const StatCard = ({ title, value, icon: Icon, color, details, loading }: { title: string, value: string, icon: React.ElementType, color: string, details: string, loading?: boolean }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center min-h-[110px]">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center`} style={{ backgroundColor: `${color}20` }}>
            <Icon className="w-8 h-8" style={{ color }} />
        </div>
        <div className="ml-4">
            <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
            <p className="text-2xl font-bold text-gray-800">{loading ? <span className="animate-pulse text-gray-400">...</span> : value}</p>
            <p className="text-xs text-gray-400">{details}</p>
        </div>
    </div>
);

const FEEDBACK_RATINGS = [
  { name: 'Love it', color: '#16a34a' },
  { name: 'Great', color: '#0e7490' },
  { name: 'Okay', color: '#eab308' },
  { name: 'Poor', color: '#ea580c' },
  { name: 'Terrible', color: '#dc2626' },
];

const DashboardPage: React.FC = () => {
  // Stat states
  const [totalFeedback, setTotalFeedback] = useState<number|null>(null);
  const [positiveFeedback, setPositiveFeedback] = useState<number|null>(null);
  const [negativeFeedback, setNegativeFeedback] = useState<number|null>(null);
  const [offersRedeemed, setOffersRedeemed] = useState<number|null>(null);
  const [redemptionRate, setRedemptionRate] = useState<string>('');
  const [feedbackDist, setFeedbackDist] = useState<{[key:string]:number}>({});
  const [recentFeedback, setRecentFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // 1. Fetch all feedback
        const { data: feedback, error: feedbackErr } = await supabase
          .from('feedback')
          .select('*')
          .order('created_at', { ascending: false });
        if (feedbackErr) throw feedbackErr;

        // 2. Fetch all offer claims
        const { data: claims, error: claimsErr } = await supabase
          .from('offer_claims')
          .select('*');
        if (claimsErr) throw claimsErr;

        // 3. Feedback distribution
        const dist: {[key:string]:number} = {};
        FEEDBACK_RATINGS.forEach(r => dist[r.name] = 0);
        feedback.forEach(f => {
          if (dist[f.rating] !== undefined) dist[f.rating]++;
        });
        setFeedbackDist(dist);

        // 4. Stat cards
        setTotalFeedback(feedback.length);
        const positive = feedback.filter(f => f.rating === 'Love it' || f.rating === 'Great').length;
        setPositiveFeedback(positive);
        // Negative feedback = Poor or Terrible
        const negative = feedback.filter(f => f.rating === 'Poor' || f.rating === 'Terrible').length;
        setNegativeFeedback(negative);
        setOffersRedeemed(claims.length);
        // Use positive feedback as denominator for redemption rate if offers are removed
        setRedemptionRate(positive ? ((claims.length / positive) * 100).toFixed(1) + '%' : '0%');

        // 5. Recent feedback (last 5)
        setRecentFeedback(feedback.slice(0, 5));
      } catch (e: any) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white py-8 px-2 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">Feedback System Overview</p>
        </div>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Feedback" value={totalFeedback?.toString() || ''} icon={MessageSquare} color="#3b82f6" details="All feedback received" loading={loading} />
          <StatCard title="Positive Feedback" value={positiveFeedback?.toString() || ''} icon={ThumbsUp} color="#16a34a" details={totalFeedback ? ((positiveFeedback!/totalFeedback*100).toFixed(1) + '% of total') : ''} loading={loading} />
          <StatCard title="Negative Feedback" value={negativeFeedback?.toString() || ''} icon={ThumbsDown} color="#dc2626" details={totalFeedback ? ((negativeFeedback!/totalFeedback*100).toFixed(1) + '% of total') : ''} loading={loading} />
          <StatCard title="Offers Redeemed" value={offersRedeemed?.toString() || ''} icon={CheckCircle} color="#16a34a" details={`Redemption rate: ${redemptionRate}`} loading={loading} />
        </div>
        {/* Recent Feedback */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-gray-800 text-lg font-semibold mb-4">Recent Feedback</h4>
            {loading ? (
              <div className="text-center text-gray-400 animate-pulse">Loading...</div>
            ) : (
              <ul role="list" className="divide-y divide-gray-200">
                {recentFeedback.map((f, i) => (
                  <li key={f.id || i} className="py-4 flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                      {f.rating === 'Love it' || f.rating === 'Great' ? <ThumbsUp className="h-6 w-6 text-green-500" /> : <ThumbsDown className="h-6 w-6 text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">{f.details?.notes || 'No comment'}</p>
                      <p className="truncate text-xs text-gray-500">{f.customer_email || 'Anonymous'}</p>
                      {f.phone_number && (
                        <p className="truncate text-xs text-gray-400">{f.phone_number}</p>
                      )}
                    </div>
                    <div className="flex items-center text-xs">
                      {f.status === 'Reviewed' ? <CheckCircle className='w-4 h-4 text-green-600 mr-1'/> : <XCircle className='w-4 h-4 text-yellow-600 mr-1'/>}
                      {f.status || 'Pending'}
                    </div>
                    <div className="inline-flex items-center text-xs font-semibold text-gray-600">
                      {f.created_at ? new Date(f.created_at).toLocaleString() : ''}
                    </div>
                  </li>
                ))}
                {recentFeedback.length === 0 && !loading && <li className="py-8 text-center text-gray-400">No feedback found.</li>}
              </ul>
            )}
          </div>
          {/* Feedback Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-gray-800 text-lg font-semibold mb-4">Feedback Breakdown</h4>
            {loading ? (
              <div className="text-center text-gray-400 animate-pulse">Loading...</div>
            ) : (
              <div className="space-y-3">
                {FEEDBACK_RATINGS.map((level) => (
                  <div key={level.name} className="flex items-center">
                    <span className="text-sm text-gray-600 w-20">{level.name}</span>
                    <div className="w-full bg-gray-200 rounded-full h-4 mx-2">
                      <div
                        className="h-4 rounded-full"
                        style={{ width: `${totalFeedback ? ((feedbackDist[level.name] || 0) / totalFeedback * 100) : 0}%`, backgroundColor: level.color }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-10 text-right">{feedbackDist[level.name] || 0}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 