import React from 'react';
import { Download, Mail, QrCode } from 'lucide-react';

interface PDFGeneratorProps {
    feedbackId: string;
    customerName?: string;
    offerType: string;
    offerValue: string;
    timestamp: string;
    logoUrl?: string;
    companyName?: string;
    footerText?: string;
    primaryColor?: string;
    secondaryColor?: string;
    includeQRCode?: boolean;
    includePromoCode?: boolean;
    promoCode?: string;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({
    feedbackId,
    customerName = 'Valued Customer',
    offerType,
    offerValue,
    timestamp,
    logoUrl = '/logo.png',
    companyName = 'Cafe LaVia',
    footerText = 'Thank you for your feedback!',
    primaryColor = '#1ABC9C',
    secondaryColor = '#2C3E50',
    includeQRCode = true,
    includePromoCode = true,
    promoCode
}) => {
    
    const generatePDF = () => {
        // This would integrate with a PDF library like jsPDF or react-pdf
        // For now, we'll create a mock PDF generation
        console.log('Generating PDF for feedback:', feedbackId);
        
        // Mock PDF generation logic
        const pdfData = {
            feedbackId,
            customerName,
            offerType,
            offerValue,
            timestamp,
            logoUrl,
            companyName,
            footerText,
            primaryColor,
            secondaryColor,
            includeQRCode,
            includePromoCode,
            promoCode: promoCode || `PROMO-${feedbackId.slice(-6)}`
        };
        
        // In a real implementation, this would create and download the PDF
        console.log('PDF Data:', pdfData);
        
        // Simulate download
        const blob = new Blob([JSON.stringify(pdfData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `offer-${feedbackId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const sendEmail = () => {
        // This would integrate with email service
        console.log('Sending email for feedback:', feedbackId);
        
        const emailData = {
            to: customerName,
            subject: `Your Feedback Reward - ${companyName}`,
            feedbackId,
            offerType,
            offerValue,
            timestamp
        };
        
        console.log('Email Data:', emailData);
        alert('Email sent successfully! (Mock implementation)');
    };

    const generateQRCode = () => {
        // This would generate a QR code containing the feedback ID
        console.log('Generating QR code for feedback:', feedbackId);
        
        // In a real implementation, this would use a QR code library
        const qrData = {
            feedbackId,
            timestamp,
            companyName
        };
        
        console.log('QR Code Data:', qrData);
        alert('QR Code generated! (Mock implementation)');
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">PDF Generation</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={generatePDF}
                        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                    </button>
                    <button
                        onClick={sendEmail}
                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                    >
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                    </button>
                    {includeQRCode && (
                        <button
                            onClick={generateQRCode}
                            className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700"
                        >
                            <QrCode className="w-4 h-4 mr-2" />
                            QR Code
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <p><span className="font-medium">Feedback ID:</span> {feedbackId}</p>
                    <p><span className="font-medium">Customer:</span> {customerName}</p>
                    <p><span className="font-medium">Offer Type:</span> {offerType}</p>
                    <p><span className="font-medium">Offer Value:</span> {offerValue}</p>
                </div>
                <div>
                    <p><span className="font-medium">Timestamp:</span> {timestamp}</p>
                    <p><span className="font-medium">Company:</span> {companyName}</p>
                    {includePromoCode && (
                        <p><span className="font-medium">Promo Code:</span> {promoCode || `PROMO-${feedbackId.slice(-6)}`}</p>
                    )}
                    <p><span className="font-medium">QR Code:</span> {includeQRCode ? 'Included' : 'Not included'}</p>
                </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-xs text-gray-600">
                    <strong>PDF will include:</strong> Logo, Feedback ID, Timestamp, QR Code, Promo Code, and Company branding.
                </p>
            </div>
        </div>
    );
};

export default PDFGenerator; 