import React from 'react';
import { Gift, TrendingUp, Users, Clock, CheckCircle, XCircle } from 'lucide-react';

const FeedbackOffersPage: React.FC = () => {
    const offerStats = [
        { title: 'Total Offers Generated', value: '1,247', change: '+12%', icon: Gift, color: 'text-blue-600' },
        { title: 'Redemption Rate', value: '78%', change: '+5%', icon: TrendingUp, color: 'text-green-600' },
        { title: 'Active Redemptions', value: '156', change: '+8%', icon: Users, color: 'text-purple-600' },
        { title: 'Avg. Redemption Time', value: '2.3 days', change: '-15%', icon: Clock, color: 'text-orange-600' },
    ];

    const activeOffers = [
        { id: 'OFF-001', name: '5-Star Feedback Reward', type: 'Percentage', value: '15%', status: 'Active', redemptions: 89 },
        { id: 'OFF-002', name: '4-Star Feedback Reward', type: 'Percentage', value: '10%', status: 'Active', redemptions: 156 },
        { id: 'OFF-003', name: '3-Star Feedback Reward', type: 'Percentage', value: '5%', status: 'Active', redemptions: 67 },
        { id: 'OFF-004', name: 'First Time Customer', type: 'Percentage', value: '20%', status: 'Inactive', redemptions: 23 },
    ];

    const recentRedemptions = [
        { id: 'FB-2024-001', customer: 'John Doe', offer: '5-Star Feedback Reward', amount: '15%', redeemedAt: '2024-01-15 14:30', status: 'Redeemed' },
        { id: 'FB-2024-002', customer: 'Jane Smith', offer: '4-Star Feedback Reward', amount: '10%', redeemedAt: '2024-01-15 13:45', status: 'Redeemed' },
        { id: 'FB-2024-003', customer: 'Mike Johnson', offer: '3-Star Feedback Reward', amount: '5%', redeemedAt: '2024-01-15 12:20', status: 'Pending' },
        { id: 'FB-2024-004', customer: 'Sarah Wilson', offer: '5-Star Feedback Reward', amount: '15%', redeemedAt: '2024-01-15 11:15', status: 'Redeemed' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Feedback Offers</h1>
                    <p className="text-gray-600 mt-1">Manage feedback-based offers and track redemptions</p>
                </div>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                    <Gift className="w-5 h-5 mr-2" />
                    Configure Offers
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {offerStats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="flex items-center mt-4">
                            <span className="text-sm font-medium text-green-600">{stat.change}</span>
                            <span className="text-sm text-gray-500 ml-1">from last month</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Active Offers */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Active Offer Types</h2>
                    <p className="text-sm text-gray-600 mt-1">Configured feedback-based offers</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeOffers.map(offer => (
                            <div key={offer.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-gray-800">{offer.name}</h3>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        offer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {offer.status}
                                    </span>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Type:</span> {offer.type}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Value:</span> {offer.value}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Redemptions:</span> {offer.redemptions}
                                    </p>
                                </div>
                                <button className="w-full text-sm text-blue-600 hover:underline">
                                    Edit Configuration
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Redemptions */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Redemptions</h2>
                    <p className="text-sm text-gray-600 mt-1">Latest offer redemptions by customers</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Feedback ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Offer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Redeemed At
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentRedemptions.map((redemption, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {redemption.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {redemption.customer}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {redemption.offer}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {redemption.amount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {redemption.redeemedAt}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            redemption.status === 'Redeemed' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {redemption.status === 'Redeemed' ? (
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                            ) : (
                                                <Clock className="w-3 h-3 mr-1" />
                                            )}
                                            {redemption.status}
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