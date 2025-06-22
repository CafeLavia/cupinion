import React, { useState } from 'react';
import { Save, Plus, Trash2, Download, Mail, QrCode, FileText } from 'lucide-react';

const OfferSettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('offers');
    const [offerTypes, setOfferTypes] = useState([
        { id: 1, name: '5-Star Feedback Reward', type: 'percentage', value: 15, status: 'active', minRating: 5 },
        { id: 2, name: '4-Star Feedback Reward', type: 'percentage', value: 10, status: 'active', minRating: 4 },
        { id: 3, name: '3-Star Feedback Reward', type: 'percentage', value: 5, status: 'active', minRating: 3 },
        { id: 4, name: 'First Time Customer', type: 'percentage', value: 20, status: 'inactive', minRating: 0 },
    ]);

    const [pdfSettings, setPdfSettings] = useState({
        includeLogo: true,
        includeTimestamp: true,
        includeQRCode: true,
        includePromoCode: true,
        logoUrl: '/logo.png',
        companyName: 'Cafe LaVia',
        footerText: 'Thank you for your feedback!',
        primaryColor: '#1ABC9C',
        secondaryColor: '#2C3E50'
    });

    const [emailSettings, setEmailSettings] = useState({
        autoSend: true,
        subject: 'Your Feedback Reward - Cafe LaVia',
        template: 'Thank you for your feedback! Here is your reward.',
        fromEmail: 'rewards@cafelavia.com',
        fromName: 'Cafe LaVia Rewards'
    });

    const addOfferType = () => {
        const newOffer = {
            id: offerTypes.length + 1,
            name: '',
            type: 'percentage',
            value: 0,
            status: 'active',
            minRating: 0
        };
        setOfferTypes([...offerTypes, newOffer]);
    };

    const updateOfferType = (id: number, field: string, value: any) => {
        setOfferTypes(offerTypes.map(offer => 
            offer.id === id ? { ...offer, [field]: value } : offer
        ));
    };

    const deleteOfferType = (id: number) => {
        setOfferTypes(offerTypes.filter(offer => offer.id !== id));
    };

    const tabs = [
        { id: 'offers', name: 'Offer Types', icon: FileText },
        { id: 'pdf', name: 'PDF Settings', icon: Download },
        { id: 'email', name: 'Email Settings', icon: Mail },
        { id: 'qr', name: 'QR Code Settings', icon: QrCode }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Offer Settings</h1>
                <p className="text-gray-600 mt-1">Configure feedback-based offers and system settings</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <tab.icon className="w-4 h-4 mr-2" />
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {/* Offer Types Tab */}
                    {activeTab === 'offers' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Offer Types</h2>
                                <button
                                    onClick={addOfferType}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Offer Type
                                </button>
                            </div>

                            <div className="space-y-4">
                                {offerTypes.map(offer => (
                                    <div key={offer.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Offer Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={offer.name}
                                                    onChange={(e) => updateOfferType(offer.id, 'name', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Type
                                                </label>
                                                <select
                                                    value={offer.type}
                                                    onChange={(e) => updateOfferType(offer.id, 'type', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="percentage">Percentage</option>
                                                    <option value="fixed">Fixed Amount</option>
                                                    <option value="bogo">BOGO</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Value
                                                </label>
                                                <input
                                                    type="number"
                                                    value={offer.value}
                                                    onChange={(e) => updateOfferType(offer.id, 'value', parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Min Rating
                                                </label>
                                                <select
                                                    value={offer.minRating}
                                                    onChange={(e) => updateOfferType(offer.id, 'minRating', parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value={0}>Any Rating</option>
                                                    <option value={3}>3+ Stars</option>
                                                    <option value={4}>4+ Stars</option>
                                                    <option value={5}>5 Stars</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={offer.status === 'active'}
                                                        onChange={(e) => updateOfferType(offer.id, 'status', e.target.checked ? 'active' : 'inactive')}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700">Active</span>
                                                </label>
                                            </div>
                                            <button
                                                onClick={() => deleteOfferType(offer.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PDF Settings Tab */}
                    {activeTab === 'pdf' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900">PDF Template Settings</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-md font-medium text-gray-900">Content Options</h3>
                                    
                                    <div className="space-y-3">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={pdfSettings.includeLogo}
                                                onChange={(e) => setPdfSettings({...pdfSettings, includeLogo: e.target.checked})}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Include Logo</span>
                                        </label>
                                        
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={pdfSettings.includeTimestamp}
                                                onChange={(e) => setPdfSettings({...pdfSettings, includeTimestamp: e.target.checked})}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Include Timestamp</span>
                                        </label>
                                        
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={pdfSettings.includeQRCode}
                                                onChange={(e) => setPdfSettings({...pdfSettings, includeQRCode: e.target.checked})}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Include QR Code</span>
                                        </label>
                                        
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={pdfSettings.includePromoCode}
                                                onChange={(e) => setPdfSettings({...pdfSettings, includePromoCode: e.target.checked})}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Include Promo Code</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-md font-medium text-gray-900">Customization</h3>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Company Name
                                        </label>
                                        <input
                                            type="text"
                                            value={pdfSettings.companyName}
                                            onChange={(e) => setPdfSettings({...pdfSettings, companyName: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Footer Text
                                        </label>
                                        <textarea
                                            value={pdfSettings.footerText}
                                            onChange={(e) => setPdfSettings({...pdfSettings, footerText: e.target.value})}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Primary Color
                                        </label>
                                        <input
                                            type="color"
                                            value={pdfSettings.primaryColor}
                                            onChange={(e) => setPdfSettings({...pdfSettings, primaryColor: e.target.value})}
                                            className="w-full h-10 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Email Settings Tab */}
                    {activeTab === 'email' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900">Email Notification Settings</h2>
                            
                            <div className="space-y-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={emailSettings.autoSend}
                                        onChange={(e) => setEmailSettings({...emailSettings, autoSend: e.target.checked})}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Automatically send PDF via email</span>
                                </label>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        From Email
                                    </label>
                                    <input
                                        type="email"
                                        value={emailSettings.fromEmail}
                                        onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        From Name
                                    </label>
                                    <input
                                        type="text"
                                        value={emailSettings.fromName}
                                        onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Subject
                                    </label>
                                    <input
                                        type="text"
                                        value={emailSettings.subject}
                                        onChange={(e) => setEmailSettings({...emailSettings, subject: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Template
                                    </label>
                                    <textarea
                                        value={emailSettings.template}
                                        onChange={(e) => setEmailSettings({...emailSettings, template: e.target.value})}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* QR Code Settings Tab */}
                    {activeTab === 'qr' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900">QR Code Settings</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-md font-medium text-gray-900">QR Code Configuration</h3>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            QR Code Size (px)
                                        </label>
                                        <input
                                            type="number"
                                            defaultValue={200}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Error Correction Level
                                        </label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="L">Low (7%)</option>
                                            <option value="M">Medium (15%)</option>
                                            <option value="Q">Quartile (25%)</option>
                                            <option value="H">High (30%)</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            QR Code Color
                                        </label>
                                        <input
                                            type="color"
                                            defaultValue="#000000"
                                            className="w-full h-10 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-md font-medium text-gray-900">Preview</h3>
                                    
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                        <QrCode className="w-32 h-32 mx-auto text-gray-400" />
                                        <p className="text-sm text-gray-500 mt-2">QR Code Preview</p>
                                    </div>
                                    
                                    <div className="text-sm text-gray-600">
                                        <p><strong>Encoded Data:</strong> FB-2024-001</p>
                                        <p><strong>Size:</strong> 200x200px</p>
                                        <p><strong>Error Correction:</strong> Medium (15%)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                </button>
            </div>
        </div>
    );
};

export default OfferSettingsPage; 