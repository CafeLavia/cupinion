import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Clock, Download, Mail, QrCode } from 'lucide-react';
import PDFGenerator from '../../../components/PDFGenerator';
import { FeedbackService } from '../../../services/feedbackService';
import { supabase } from '../../../services/supabaseClient';

const OfferRedeemPage: React.FC = () => {
    const [feedbackId, setFeedbackId] = useState('');
    const [billNumber, setBillNumber] = useState('');
    const [searchResult, setSearchResult] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [claimStatus, setClaimStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showPDFGenerator, setShowPDFGenerator] = useState(false);

    const handleSearch = async () => {
        setError(null);
        setClaimStatus(null);
        setSearchResult(null);
        if (!feedbackId.trim()) return;
        setIsSearching(true);
        try {
            const feedback = await FeedbackService.fetchFeedbackById(feedbackId.trim());
            if (!feedback) {
                setError('No feedback found for this ID.');
                setIsSearching(false);
                return;
            }
            setSearchResult(feedback);
            // Check claim status
            if (billNumber.trim()) {
                const claim = await FeedbackService.checkOfferClaim({ feedbackId: feedbackId.trim(), billNumber: billNumber.trim() });
                if (claim) {
                    setClaimStatus('Already Redeemed');
                } else {
                    setClaimStatus('Not Redeemed');
                }
            }
        } catch (err: any) {
            setError(err.message || 'Error fetching feedback.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleRedeem = async () => {
        setError(null);
        setIsRedeeming(true);
        try {
            if (!searchResult) {
                setError('No feedback loaded.');
                setIsRedeeming(false);
                return;
            }
            if (!billNumber.trim()) {
                setError('Please enter a bill number.');
                setIsRedeeming(false);
                return;
            }
            // Check again before redeeming
            const claim = await FeedbackService.checkOfferClaim({ feedbackId: feedbackId.trim(), billNumber: billNumber.trim() });
            if (claim) {
                setClaimStatus('Already Redeemed');
                setError('This feedback or bill has already been used for an offer.');
                setIsRedeeming(false);
                return;
            }
            // Get current user (staff) id
            const { data: { user } } = await supabase.auth.getUser();
            await FeedbackService.createOfferClaim({ feedbackId: feedbackId.trim(), billNumber: billNumber.trim(), claimedBy: user?.id });
            setClaimStatus('Already Redeemed');
        } catch (err: any) {
            setError(err.message || 'Error redeeming offer.');
        } finally {
            setIsRedeeming(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Not Redeemed':
                return 'text-green-600 bg-green-100';
            case 'Already Redeemed':
                return 'text-red-600 bg-red-100';
            case 'Pending':
                return 'text-yellow-600 bg-yellow-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Not Redeemed':
                return <Clock className="w-4 h-4" />;
            case 'Already Redeemed':
                return <CheckCircle className="w-4 h-4" />;
            case 'Pending':
                return <Clock className="w-4 h-4" />;
            default:
                return <XCircle className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Redeem Offers</h1>
                <p className="text-gray-600 mt-1">Enter feedback ID and bill number to redeem customer offers</p>
            </div>

            {/* Search Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="max-w-md space-y-4">
                    <div>
                        <label htmlFor="feedbackId" className="block text-sm font-medium text-gray-700 mb-2">
                            Feedback ID
                        </label>
                        <input
                            type="text"
                            id="feedbackId"
                            value={feedbackId}
                            onChange={(e) => setFeedbackId(e.target.value)}
                            placeholder="Enter feedback ID (uuid)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label htmlFor="billNumber" className="block text-sm font-medium text-gray-700 mb-2">
                            Bill Number
                        </label>
                        <input
                            type="text"
                            id="billNumber"
                            value={billNumber}
                            onChange={(e) => setBillNumber(e.target.value)}
                            placeholder="Enter bill number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={isSearching || !feedbackId.trim()}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSearching ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                        ) : (
                            <Search className="w-5 h-5 inline-block mr-2" />
                        )}
                        Search
                    </button>
                    {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
                </div>
            </div>

            {/* Search Results */}
            {searchResult && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Feedback Details</h2>
                        {claimStatus && (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(claimStatus)}`}>
                                {getStatusIcon(claimStatus)}
                                <span className="ml-1">{claimStatus}</span>
                            </span>
                        )}
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Customer Information */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                                    Customer Information
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Email</label>
                                        <p className="text-sm text-gray-900">{searchResult.customer_email || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Table Number</label>
                                        <p className="text-sm text-gray-900">{searchResult.table_number || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Rating</label>
                                        <p className="text-sm text-gray-900">{searchResult.rating || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Submitted At</label>
                                        <p className="text-sm text-gray-900">{searchResult.created_at ? new Date(searchResult.created_at).toLocaleString() : '-'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Offer Information */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                                    Offer Details
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Feedback ID</label>
                                        <p className="text-sm text-gray-900">{searchResult.id}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Bill Number</label>
                                        <p className="text-sm text-gray-900">{billNumber || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Status</label>
                                        <p className="text-sm text-gray-900">{claimStatus || 'Unknown'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleRedeem}
                                disabled={claimStatus === 'Already Redeemed' || isRedeeming || !billNumber.trim()}
                                className="px-6 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isRedeeming ? 'Processing...' : 'Mark as Claimed'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OfferRedeemPage; 