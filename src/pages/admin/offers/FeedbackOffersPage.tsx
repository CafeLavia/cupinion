import React, { useEffect, useState } from 'react';
import { Gift, TrendingUp, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

const FeedbackOffersPage: React.FC = () => {
    const [stats, setStats] = useState({
        totalOffers: 0,
        redemptionRate: 0,
        redeemedOffers: 0,
        avgRedemptionTime: '' as string,
    });
    const [recentRedemptions, setRecentRedemptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            // Fetch all feedback, offer_claims, and profiles
            const { data: feedback, error: feedbackError } = await supabase.from('feedback').select('*');
            const { data: claims, error: claimsError } = await supabase.from('offer_claims').select('*');
            const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*');
            if (feedbackError || claimsError || profilesError) {
                setLoading(false);
                return;
            }
            // Only count feedback as offers if rating is 'Love it', 'Great', or 'Okay', and has email and bill
            const validRatings = ['Love it', 'Great', 'Okay'];
            const grantedOffers = feedback.filter((fb: any) =>
                validRatings.includes(fb.rating) &&
                fb.customer_email && fb.customer_email.trim() !== '' &&
                fb.bill_image_url && fb.bill_image_url.trim() !== ''
            );
            const totalOffers = grantedOffers.length;
            // Redeemed offers: claims with claimed_at
            const redeemedClaims = claims.filter((c: any) => c.claimed_at);
            const redeemedOffers = redeemedClaims.length;
            // Redemption rate
            const redemptionRate = totalOffers > 0 ? Math.round((redeemedOffers / totalOffers) * 100) : 0;
            // Avg. redemption time (in days, only for redeemed)
            const redemptionTimes = redeemedClaims
                .map((c: any) => {
                    const fb = feedback.find((f: any) => f.id === c.feedback_id);
                    if (fb && c.claimed_at) {
                        return (new Date(c.claimed_at).getTime() - new Date(fb.created_at).getTime()) / (1000 * 60 * 60 * 24);
                    }
                    return null;
                })
                .filter((t: any): t is number => t !== null);
            const avgRedemptionTimeNum = redemptionTimes.length > 0 ? (redemptionTimes.reduce((a: number, b: number) => a + b, 0) / redemptionTimes.length) : 0;
            const avgRedemptionTime = avgRedemptionTimeNum.toFixed(1);
            // Recent redemptions (last 5, only redeemed)
            const recent = redeemedClaims
                .sort((a: any, b: any) => new Date(b.claimed_at).getTime() - new Date(a.claimed_at).getTime())
                .slice(0, 5)
                .map((c: any) => {
                    const fb = feedback.find((f: any) => f.id === c.feedback_id);
                    const staff = profiles.find((p: any) => p.id === c.claimed_by);
                    return {
                        id: fb?.custom_id || c.feedback_id,
                        customer: fb?.customer_email || '-',
                        offer: fb?.rating ? `${fb.rating} Feedback Reward` : '-',
                        redeemedAt: c.claimed_at ? new Date(c.claimed_at).toLocaleString() : '-',
                        staff: staff?.full_name || staff?.username || '-',
                        status: 'Redeemed',
                    };
                });
            setStats({
                totalOffers,
                redemptionRate,
                redeemedOffers,
                avgRedemptionTime: avgRedemptionTime,
            });
            setRecentRedemptions(recent);
            setLoading(false);
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Feedback Offers</h1>
                <p className="text-gray-600 mt-1">Manage feedback-based offers and track redemptions</p>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Offers Granted</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{loading ? '...' : stats.totalOffers}</p>
                        </div>
                        <div className="p-3 rounded-full bg-gray-100 text-blue-600">
                            <Gift className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Redeemed Offers</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{loading ? '...' : stats.redeemedOffers}</p>
                        </div>
                        <div className="p-3 rounded-full bg-gray-100 text-green-600">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Redemption Rate</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{loading ? '...' : `${stats.redemptionRate}%`}</p>
                        </div>
                        <div className="p-3 rounded-full bg-gray-100 text-orange-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>
            {/* Recent Redemptions */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Recent Redemptions</h2>
                        <p className="text-sm text-gray-600 mt-1">Latest offer redemptions by customers</p>
                    </div>
                    <button className="text-blue-600 hover:underline text-sm font-medium" onClick={() => navigate('/admin/offers/all-redemptions')}>View All</button>
                </div>
                <div className="overflow-x-auto">
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
                            ) : recentRedemptions.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-4">No redemptions found.</td></tr>
                            ) : recentRedemptions.map((redemption, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{redemption.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{redemption.customer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{redemption.offer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{redemption.redeemedAt}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{redemption.staff}</td>
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
            </div>
        </div>
    );
};

export default FeedbackOffersPage; 