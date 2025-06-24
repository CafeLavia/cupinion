import React, { useEffect, useState } from 'react';
import { supabase } from '../../../services/supabaseClient';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 20;

// AllRedemptionsPage: Shows all redeemed offers with staff name, paginated and searchable
const AllRedemptionsPage: React.FC = () => {
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: feedback } = await supabase.from('feedback').select('*');
      const { data: claims } = await supabase.from('offer_claims').select('*');
      const { data: profiles } = await supabase.from('profiles').select('*');
      const feedbackArr = feedback || [];
      const claimsArr = claims || [];
      const profilesArr = profiles || [];
      // Only redeemed
      const redeemed = claimsArr.filter((c: any) => c.claimed_at)
        .map((c: any) => {
          const fb = feedbackArr.find((f: any) => f.id === c.feedback_id);
          const staff = profilesArr.find((p: any) => p.id === c.claimed_by);
          return {
            id: fb?.custom_id || c.feedback_id,
            customer: fb?.customer_email || '-',
            offer: fb?.rating ? `${fb.rating} Feedback Reward` : '-',
            redeemedAt: c.claimed_at ? new Date(c.claimed_at).toLocaleString() : '-',
            staff: staff?.full_name || staff?.username || '-',
            status: 'Redeemed',
          };
        });
      // Filter by search
      const filtered = redeemed.filter((r: any) =>
        r.customer.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase())
      );
      setTotal(filtered.length);
      setRedemptions(filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
      setLoading(false);
    };
    fetchData();
  }, [search, page]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Redemptions</h1>
          <p className="text-gray-600 mt-1">All redeemed offers and who operated the system</p>
        </div>
        <button className="text-blue-600 hover:underline text-sm font-medium" onClick={() => navigate(-1)}>Back</button>
      </div>
      <div className="mb-4 w-full">
        <input
          type="text"
          placeholder="Search by customer email or feedback ID..."
          className="px-4 py-2 border border-gray-300 rounded-lg w-full"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto mb-6">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Redeemed At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
            ) : redemptions.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-4">No redemptions found.</td></tr>
            ) : redemptions.map((r, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.offer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.redeemedAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.staff}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Redeemed
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 w-full mt-4">
        <span className="text-sm text-gray-700">Showing <span className="font-semibold">{redemptions.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}</span> to <span className="font-semibold">{Math.min(page * PAGE_SIZE, total)}</span> of <span className="font-semibold">{total}</span> entries</span>
        <div className="flex items-center space-x-2 w-full justify-center">
          <button
            className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >Previous</button>
          <span className="text-sm">Page {page} of {Math.ceil(total / PAGE_SIZE)}</span>
          <button
            className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50"
            onClick={() => setPage(p => Math.min(Math.ceil(total / PAGE_SIZE), p + 1))}
            disabled={page === Math.ceil(total / PAGE_SIZE) || total === 0}
          >Next</button>
        </div>
      </div>
    </div>
  );
};

export default AllRedemptionsPage; 