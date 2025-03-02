import { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { FaDownload, FaQrcode } from 'react-icons/fa';

interface QRCodeGeneratorProps {
  url: string;
  title: string;
}

export default function QRCodeGenerator({ url, title }: QRCodeGeneratorProps) {
  const [fullUrl, setFullUrl] = useState('');

  useEffect(() => {
    // Get the base URL of the application
    if (typeof window !== 'undefined') {
      const baseUrl = window.location.origin;
      setFullUrl(`${baseUrl}${url}`);
    }
  }, [url]);

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${title.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-3 flex items-center mac-header p-2">
        <FaQrcode className="mr-2 text-mac-white" /> <span className="text-mac-white">QR Code for {title}</span>
      </h3>
      <div className="flex justify-center my-4 bg-mac-white p-4 border border-mac-border">
        <QRCode
          id="qr-code"
          value={fullUrl || url}
          size={200}
          level="H"
          includeMargin={true}
          renderAs="canvas"
          bgColor="#FFFFFF"
          fgColor="#000000"
        />
      </div>
      <button
        onClick={downloadQRCode}
        className="mac-button flex items-center mx-auto"
      >
        <FaDownload className="mr-2 inline-block" /> Download QR Code
      </button>
    </div>
  );
} 