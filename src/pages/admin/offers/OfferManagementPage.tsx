import React from 'react';
import { PlusCircle, Tag } from 'lucide-react';

const OfferManagementPage: React.FC = () => {
    const offers = [
        { id: 'OFF-001', name: 'Weekend Special', type: 'Discount', value: '15%', status: 'Active' },
        { id: 'OFF-002', name: 'Happy Hour', type: 'BOGO', value: 'Buy One Get One', status: 'Active' },
        { id: 'OFF-003', name: 'Lunch Combo', type: 'Fixed Price', value: '$12.99', status: 'Inactive' },
        { id: 'OFF-004', name: 'Student Discount', type: 'Discount', value: '10%', status: 'Active' },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Offer Management</h1>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Create New Offer
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Offers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map(offer => (
                        <div key={offer.id} className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center mb-2">
                                    <Tag className="w-5 h-5 text-gray-500 mr-2" />
                                    <h3 className="font-semibold text-gray-800">{offer.name}</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Type:</span> {offer.type}</p>
                                <p className="text-sm text-gray-600"><span className="font-medium">Value:</span> {offer.value}</p>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${offer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {offer.status}
                                </span>
                                <button className="text-sm text-blue-600 hover:underline">Edit</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OfferManagementPage; 