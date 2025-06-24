import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Clock, Download, Mail, QrCode } from 'lucide-react';
import PDFGenerator from '../../../components/PDFGenerator';
import { FeedbackService } from '../../../services/feedbackService';
import { supabase } from '../../../services/supabaseClient';
import { QrReader } from 'react-qr-reader';

const OfferRedeemPage: React.FC = () => {
    const [feedbackId, setFeedbackId] = useState('');
    const [billNumber, setBillNumber] = useState('');
    const [searchResult, setSearchResult] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [claimStatus, setClaimStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showPDFGenerator, setShowPDFGenerator] = useState(false);
    const [showQRScanner, setShowQRScanner] = useState(false);

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
            const claim = await FeedbackService.checkOfferClaim({ billNumber: billNumber.trim() });
            if (claim) {
                setClaimStatus('Already Redeemed');
                setError('This bill has already been used for an offer.');
                setIsRedeeming(false);
                return;
            }
            // Get current user (staff) id
            const { data: { user } } = await supabase.auth.getUser();
            await FeedbackService.createOfferClaim({ feedbackId: searchResult.id, billNumber: billNumber.trim(), claimedBy: user?.id });
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

    const handleScan = (result: any) => {
        if (result && result.text) {
            // Try to extract feedback ID from URL or plain code
            let code = result.text;
            const match = code.match(/fid=([A-Za-z0-9\-]+)/);
            if (match) code = match[1];
            setFeedbackId(code);
            setShowQRScanner(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Redeem Offers</h1>
                <p className="text-gray-600 mt-1">Scan QR or enter feedback ID and bill number to redeem customer offers</p>
            </div>
            {/* QR Scanner Button */}
            <div className="flex items-center gap-3 mb-2">
                <button
                    onClick={() => setShowQRScanner((v) => !v)}
                    className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md font-semibold hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                    <QrCode className="w-5 h-5 mr-2" />
                    {showQRScanner ? 'Close Scanner' : 'Scan QR Code'}
                </button>
                <input
                    type="text"
                    id="feedbackId"
                    value={feedbackId}
                    onChange={(e) => setFeedbackId(e.target.value)}
                    placeholder="Enter feedback code (e.g. FD-XXXXXX)"
                    className="ml-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
                <button
                    onClick={handleSearch}
                    disabled={isSearching || !feedbackId.trim()}
                    className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isSearching ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : (
                        <Search className="w-5 h-5 inline-block mr-2" />
                    )}
                    Search
                </button>
            </div>
            {/* QR Scanner Modal/Inline */}
            {showQRScanner && (
                <div className="w-full max-w-xs mx-auto mb-4 rounded-lg overflow-hidden border border-gray-300 bg-white shadow-lg">
                    <div style={{ width: '100%' }}>
                        <QrReader
                            constraints={{ facingMode: 'environment' }}
                            onResult={handleScan}
                        />
                    </div>
                    <div className="p-2 text-center text-xs text-gray-600">Point camera at the QR code on the customer PDF/phone</div>
                </div>
            )}
            {/* Search Results */}
            {searchResult && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Bill Verification</h2>
                        {claimStatus && (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(claimStatus)}`}>
                                {getStatusIcon(claimStatus)}
                                <span className="ml-1">{claimStatus}</span>
                            </span>
                        )}
                    </div>
                    <div className="p-6 flex flex-col items-center">
                        {/* Bill Image Display */}
                        {searchResult.bill_image_url && (
                            <div className="mb-4 flex flex-col items-center">
                                <div className="text-sm text-gray-700 mb-2">Bill Image</div>
                                <img
                                    src={searchResult.bill_image_url}
                                    alt="Bill"
                                    className="w-full max-w-xs rounded-lg border border-gray-300 shadow-md object-contain"
                                    style={{ maxHeight: 320 }}
                                />
                            </div>
                        )}
                        {/* Feedback Custom ID */}
                        <div className="mb-4 w-full flex flex-col items-center">
                            <div className="text-sm text-gray-700 mb-1">Feedback Code</div>
                            <div className="text-lg font-mono font-bold text-gray-900 bg-gray-100 px-4 py-2 rounded">
                                {searchResult.custom_id || '-'}
                            </div>
                        </div>
                        {/* Offer Percentage */}
                        <OfferPercentageDisplay rating={searchResult.rating} />
                        {/* Bill Number Input and Claim Check */}
                        <div className="w-full max-w-xs">
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
                            <button
                                onClick={async () => {
                                    setError(null);
                                    setClaimStatus(null);
                                    if (!billNumber.trim()) return;
                                    setIsSearching(true);
                                    try {
                                        // Only check if bill_number exists in offer_claims
                                        const claim = await FeedbackService.checkOfferClaim({ feedbackId: '', billNumber: billNumber.trim() });
                                        if (claim) {
                                            setClaimStatus('Already Redeemed');
                                        } else {
                                            setClaimStatus('Not Redeemed');
                                        }
                                    } catch (err: any) {
                                        setError(err.message || 'Error checking offer claim.');
                                    } finally {
                                        setIsSearching(false);
                                    }
                                }}
                                disabled={isSearching || !billNumber.trim()}
                                className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isSearching ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                                ) : (
                                    <Search className="w-5 h-5 inline-block mr-2" />
                                )}
                                Check Claim
                            </button>
                            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
                        </div>
                        {/* Mark as Claimed Button */}
                        <div className="mt-6 flex justify-end w-full max-w-xs">
                            <button
                                onClick={handleRedeem}
                                disabled={claimStatus !== 'Not Redeemed' || isRedeeming || !billNumber.trim()}
                                className="px-6 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed w-full"
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

const OfferPercentageDisplay: React.FC<{ rating: string }> = ({ rating }) => {
    const [percentage, setPercentage] = useState<number | null>(null);
    React.useEffect(() => {
        FeedbackService.fetchOfferPercentage(rating).then(setPercentage);
    }, [rating]);
    if (percentage === null) return null;
    return (
        <div className="mb-4 w-full flex flex-col items-center">
            <div className="text-sm text-gray-700 mb-1">Offer Percentage</div>
            <div className="text-lg font-bold text-green-700 bg-green-100 px-4 py-2 rounded">
                {percentage}%
            </div>
        </div>
    );
};

export default OfferRedeemPage; 