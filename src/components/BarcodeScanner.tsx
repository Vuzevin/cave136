import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 150 } },
      /* verbose= */ false
    );

    scannerRef.current.render(
      (decodedText) => {
        onScan(decodedText);
        scannerRef.current?.clear();
        onClose();
      },
      () => {
        // scan error ignored
      }
    );

    return () => {
      scannerRef.current?.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [onScan, onClose]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-60px',
            right: 0,
            background: 'white',
            border: 'none',
            borderRadius: '50%',
            padding: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}
        >
          <X size={24} />
        </button>

        <div id="reader" style={{ 
          width: '100%', 
          borderRadius: '24px', 
          overflow: 'hidden',
          background: 'white',
          padding: '12px'
        }}></div>

        <p style={{ color: 'white', marginTop: '32px', textAlign: 'center', fontWeight: 600, fontSize: '16px' }}>
          Placez le code-barres dans le cadre pour scanner
        </p>
      </div>

      <style>{`
        #reader__dashboard_section_csr button {
          background: var(--text-primary) !important;
          color: white !important;
          border-radius: 12px !important;
          padding: 8px 16px !important;
          font-weight: 600 !important;
          border: none !important;
          margin: 10px !important;
        }
        #reader__status_span { font-weight: 600 !important; color: #666 !important; }
      `}</style>
    </div>
  );
}
