import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface Html5QrScannerProps {
  onScan: (result: string) => void;
  onError?: (err: any) => void;
  width?: number;
  height?: number;
}

const Html5QrScanner: React.FC<Html5QrScannerProps> = ({ onScan, onError, width = 300, height = 300 }) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const qrCodeScanner = useRef<Html5Qrcode | null>(null);
  const scannerRunning = useRef(false);

  useEffect(() => {
    let isMounted = true;
    if (scannerRef.current) {
      const scannerId = scannerRef.current.id;
      qrCodeScanner.current = new Html5Qrcode(scannerId);
      qrCodeScanner.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width, height } },
        (decodedText) => {
          if (isMounted) {
            onScan(decodedText);
            if (scannerRunning.current) {
              scannerRunning.current = false;
              qrCodeScanner.current?.stop();
            }
          }
        },
        onError
      ).then(() => {
        scannerRunning.current = true;
      }).catch((err) => {
        if (onError) onError(err);
      });
    }
    return () => {
      isMounted = false;
      if (qrCodeScanner.current && scannerRunning.current) {
        scannerRunning.current = false;
        qrCodeScanner.current.stop().then(() => {
          qrCodeScanner.current?.clear();
        }).catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div id="qr-scanner" ref={scannerRef} style={{ width, height }} />;
};

export default Html5QrScanner; 