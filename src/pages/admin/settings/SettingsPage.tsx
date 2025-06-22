import React from 'react';
import { Settings, Percent, RefreshCw, QrCode } from 'lucide-react';

const SettingsPage: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings & Configuration</h1>

            <div className="space-y-8">
                {/* Offer Settings */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center mb-4">
                        <Percent className="w-6 h-6 mr-3 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Offer Settings</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="discount-rate" className="block text-sm font-medium text-gray-700">
                                Default Discount Rate
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <input
                                    type="number"
                                    name="discount-rate"
                                    id="discount-rate"
                                    className="block w-full rounded-none rounded-l-md border-gray-300 sm:text-sm p-2 border"
                                    placeholder="10"
                                />
                                <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                                    %
                                </span>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">The default discount percentage for new offers.</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* QR Code Settings */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <div className="flex items-center mb-4">
                        <QrCode className="w-6 h-6 mr-3 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Feedback QR Code</h2>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">
                                Generate a new QR code for your feedback form.
                            </p>
                             <p className="mt-1 text-xs text-gray-500">
                                The current QR code will be invalidated immediately.
                            </p>
                        </div>
                        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Generate New QR Code
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage; 