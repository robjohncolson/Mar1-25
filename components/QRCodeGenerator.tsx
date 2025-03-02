import { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { FaDownload } from 'react-icons/fa';

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
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
      <h3 className="text-lg font-medium mb-3">QR Code for {title}</h3>
      <div className="flex justify-center mb-3">
        <QRCode
          id="qr-code"
          value={fullUrl || url}
          size={200}
          level="H"
          includeMargin={true}
          renderAs="canvas"
        />
      </div>
      <button
        onClick={downloadQRCode}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center mx-auto"
      >
        <FaDownload className="mr-2" /> Download QR Code
      </button>
    </div>
  );
} 