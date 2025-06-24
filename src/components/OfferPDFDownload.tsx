import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import { QRCodeCanvas } from 'qrcode.react';

interface OfferPDFDownloadProps {
  feedbackId: string;
  offerValue: string; // e.g., '10%'
  timestamp: string;
  verificationUrl: string; // URL for QR code
  logoUrl?: string;
  companyName?: string;
}

const OfferPDFDownload: React.FC<OfferPDFDownloadProps> = ({
  feedbackId,
  offerValue,
  timestamp,
  verificationUrl,
  logoUrl = '/logo.png',
  companyName = 'Cafe LaVia',
}) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 40;

    // Logo
    if (logoUrl) {
      try {
        const img = await fetch(logoUrl).then(r => r.blob());
        const reader = new FileReader();
        reader.readAsDataURL(img);
        await new Promise(resolve => {
          reader.onloadend = resolve;
        });
        if (reader.result) {
          doc.addImage(reader.result as string, 'PNG', pageWidth / 2 - 60, y, 120, 60);
          y += 80;
        }
      } catch {}
    }

    // Title
    doc.setFontSize(22);
    doc.text(companyName, pageWidth / 2, y, { align: 'center' });
    y += 30;
    doc.setFontSize(14);
    doc.text('Exclusive Feedback Offer', pageWidth / 2, y, { align: 'center' });
    y += 30;

    // Feedback details
    doc.setFontSize(12);
    doc.text(`Feedback ID: ${feedbackId}`, 60, y);
    y += 20;
    doc.text(`Submitted: ${timestamp}`, 60, y);
    y += 20;
    doc.text(`Offer: ${offerValue} OFF your bill`, 60, y);
    y += 30;

    // QR code (drawn from canvas)
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas');
      if (canvas) {
        const imgData = canvas.toDataURL('image/png');
        doc.text('Scan to verify at counter:', 60, y);
        doc.addImage(imgData, 'PNG', 60, y + 10, 100, 100);
      }
    }

    // Footer
    doc.setFontSize(10);
    doc.text('Show this PDF at the counter to claim your discount. Each bill can only be used once.', 60, 780);
    doc.text('Thank you for your feedback!', 60, 800);

    doc.save(`CafeLaVia-Offer-${feedbackId}.pdf`);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Hidden QR code for PDF rendering */}
      <div ref={qrRef} style={{ display: 'none' }}>
        <QRCodeCanvas value={verificationUrl} size={128} level="H" includeMargin={true} />
      </div>
      <button
        onClick={generatePDF}
        className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
      >
        Download Offer PDF
      </button>
    </div>
  );
};

export default OfferPDFDownload; 