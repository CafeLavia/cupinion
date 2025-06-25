import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import { QRCodeCanvas } from 'qrcode.react';
import { useUserRole } from '../hooks/useUserRole';
import logo from '../assets/logo.png';

interface OfferPDFDownloadProps {
  feedbackId: string;
  offerValue: string; // e.g., '10%'
  timestamp: string;
  verificationUrl: string; // URL for QR code
  logoUrl?: string;
  companyName?: string;
}

const TEAL = '#084040';
const DARK = '#084040';
const HEADER = '#084040';
const LIGHT = '#f8fafc';

const OfferPDFDownload: React.FC<OfferPDFDownloadProps> = ({
  feedbackId,
  offerValue,
  timestamp,
  verificationUrl,
  logoUrl = logo, // Use imported logo from assets
  companyName = 'Cafe LaVia',
}) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const { viewOnly } = useUserRole();

  const generatePDF = async () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Fill the background with dark teal
    doc.setFillColor(8, 64, 64); // #084040
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Header bar (landing page color)
    doc.setFillColor(8, 64, 64); // #1e293b (dark slate blue)
    doc.rect(0, 0, pageWidth, 110, 'F');

    // Logo in header (centered)
    try {
      const img = await fetch(logoUrl).then(r => r.blob());
      const reader = new FileReader();
      reader.readAsDataURL(img);
      await new Promise(resolve => {
        reader.onloadend = resolve;
      });
      if (reader.result) {
        doc.addImage(reader.result as string, 'PNG', pageWidth / 2 - 75, 15, 150, 100);
      }
    } catch {}

    // Center the card vertically and horizontally
    const cardWidth = pageWidth - 80;
    const cardHeight = 520;
    const cardX = 40;
    const cardY = 150; // Increased from previous value for more top margin

    // Card background (white)
    doc.setFillColor(255, 255, 255); // White
    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 18, 18, 'F');
    let y = cardY + 40;

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(DARK);
    doc.setFontSize(20);
    doc.text('Exclusive Feedback Offer', pageWidth / 2, y, { align: 'center' });
    y += 32;

    // Offer badge
    doc.setFillColor(32, 178, 170); // TEAL
    doc.roundedRect(pageWidth / 2 - 70, y, 140, 40, 20, 20, 'F');
    doc.setFontSize(18);
    doc.setTextColor('#fff');
    doc.text(`${offerValue} OFF`, pageWidth / 2, y + 27, { align: 'center' });
    y += 60;

    // Feedback details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(DARK);
    doc.text(`Feedback ID:`, pageWidth / 2 - 120, y);
    doc.setFont('helvetica', 'bold');
    doc.text(feedbackId, pageWidth / 2, y);
    y += 22;
    doc.setFont('helvetica', 'normal');
    doc.text(`Submitted:`, pageWidth / 2 - 120, y);
    doc.setFont('helvetica', 'bold');
    doc.text(timestamp, pageWidth / 2, y);
    y += 22;
    doc.setFont('helvetica', 'normal');
    doc.text(`Scan to verify at counter:`, pageWidth / 2 - 120, y);
    y += 18;

    // QR code (drawn from canvas)
    let qrY = y;
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas');
      if (canvas) {
        const imgData = canvas.toDataURL('image/png');
        // Draw a border for QR
        doc.setDrawColor(32, 178, 170);
        doc.setLineWidth(3);
        doc.roundedRect(pageWidth / 2 - 60, qrY, 120, 120, 16, 16, 'S');
        doc.addImage(imgData, 'PNG', pageWidth / 2 - 50, qrY + 10, 100, 100);
      }
    }
    y = qrY + 140;

    // Thank you message
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(TEAL);
    doc.text('Thank you for your feedback!', pageWidth / 2, y, { align: 'center' });
    y += 30;

    // Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor('#888');
    doc.text('Show this PDF at the counter to claim your discount. Each bill can only be used once.', pageWidth / 2, pageHeight - 40, { align: 'center' });
    doc.text('Cafe LaVia • www.cafelavia.net', pageWidth / 2, pageHeight - 24, { align: 'center' });

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
        disabled={viewOnly}
      >
        Download Offer PDF
      </button>
    </div>
  );
};

export default OfferPDFDownload; 