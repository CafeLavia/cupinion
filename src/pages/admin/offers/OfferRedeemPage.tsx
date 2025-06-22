import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Clock, Download, Mail, QrCode } from 'lucide-react';
import PDFGenerator from '../../../components/PDFGenerator';

const OfferRedeemPage: React.FC = () => {
    const [feedbackId, setFeedbackId] = useState('');
    const [searchResult, setSearchResult] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showPDFGenerator, setShowPDFGenerator] = useState(false);

    // Mock data - replace with actual API call
    const mockFeedbackData = {
        'FB-2024-001': {
            id: 'FB-2024-001',
            customerName: 'John Doe',
            customerEmail: 'john.doe@email.com',
            rating: 5,
            submittedAt: '2024-01-15 14:30:00',
            status: 'Not Redeemed',
            offerType: '5-Star Feedback Reward',
            offerValue: '15% off',
            billAmount: '$45.50',
            feedback: 'Excellent service and amazing food! Will definitely come back.',
            hasBillImage: true
        },
        'FB-2024-002': {
            id: 'FB-2024-002',
            customerName: 'Jane Smith',
            customerEmail: 'jane.smith@email.com',
            rating: 4,
            submittedAt: '2024-01-15 13:45:00',
            status: 'Already Redeemed',
            offerType: '4-Star Feedback Reward',
            offerValue: '10% off',
            billAmount: '$32.75',
            feedback: 'Good food and friendly staff. Nice atmosphere.',
            hasBillImage: false,
            redeemedAt: '2024-01-15 16:20:00'
        }
    };

    const handleSearch = async () => {
        if (!feedbackId.trim()) return;
        
        setIsSearching(true);
        // Simulate API call
        setTimeout(() => {
            const result = mockFeedbackData[feedbackId as keyof typeof mockFeedbackData];
            setSearchResult(result || null);
            setIsSearching(false);
        }, 1000);
    };

    const handleRedeem = async () => {
        if (!searchResult) return;
        
        // Simulate redemption
        setSearchResult({
            ...searchResult,
            status: 'Already Redeemed',
            redeemedAt: new Date().toISOString()
        });
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
                <p className="text-gray-600 mt-1">Enter feedback ID to redeem customer offers</p>
            </div>

            {/* Search Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="max-w-md">
                    <label htmlFor="feedbackId" className="block text-sm font-medium text-gray-700 mb-2">
                        Feedback ID
                    </label>
                    <div className="flex">
                        <input
                            type="text"
                            id="feedbackId"
                            value={feedbackId}
                            onChange={(e) => setFeedbackId(e.target.value)}
                            placeholder="Enter feedback ID (e.g., FB-2024-001)"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button
                            onClick={handleSearch}
                            disabled={isSearching || !feedbackId.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isSearching ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Search className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Search Results */}
            {searchResult && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Feedback Details</h2>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(searchResult.status)}`}>
                                {getStatusIcon(searchResult.status)}
                                <span className="ml-1">{searchResult.status}</span>
                            </span>
                        </div>
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
                                        <label className="text-sm font-medium text-gray-700">Name</label>
                                        <p className="text-sm text-gray-900">{searchResult.customerName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Email</label>
                                        <p className="text-sm text-gray-900">{searchResult.customerEmail}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Bill Amount</label>
                                        <p className="text-sm text-gray-900">{searchResult.billAmount}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Rating</label>
                                        <div className="flex items-center">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className={`w-4 h-4 ${i < searchResult.rating ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="ml-2 text-sm text-gray-600">({searchResult.rating}/5)</span>
                                        </div>
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
                                        <label className="text-sm font-medium text-gray-700">Offer Type</label>
                                        <p className="text-sm text-gray-900">{searchResult.offerType}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Offer Value</label>
                                        <p className="text-lg font-semibold text-green-600">{searchResult.offerValue}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Submitted At</label>
                                        <p className="text-sm text-gray-900">{searchResult.submittedAt}</p>
                                    </div>
                                    {searchResult.redeemedAt && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Redeemed At</label>
                                            <p className="text-sm text-gray-900">{searchResult.redeemedAt}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Feedback Text */}
                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                                Customer Feedback
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-900">{searchResult.feedback}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex flex-wrap gap-3">
                            {searchResult.status === 'Not Redeemed' && (
                                <button
                                    onClick={handleRedeem}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Mark as Redeemed
                                </button>
                            )}
                            
                            <button 
                                onClick={() => setShowPDFGenerator(!showPDFGenerator)}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Generate PDF
                            </button>
                            
                            <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700">
                                <QrCode className="w-4 h-4 mr-2" />
                                View QR Code
                            </button>
                        </div>

                        {/* PDF Generator */}
                        {showPDFGenerator && (
                            <div className="mt-6">
                                <PDFGenerator
                                    feedbackId={searchResult.id}
                                    customerName={searchResult.customerName}
                                    offerType={searchResult.offerType}
                                    offerValue={searchResult.offerValue}
                                    timestamp={searchResult.submittedAt}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* No Results */}
            {searchResult === null && feedbackId && !isSearching && (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Feedback Not Found</h3>
                    <p className="text-gray-600">No feedback found with ID: {feedbackId}</p>
                </div>
            )}
        </div>
    );
};

export default OfferRedeemPage; 