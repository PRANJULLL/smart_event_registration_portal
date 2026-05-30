import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../utils/api';
import { QrCode, ArrowLeft, Loader, CheckCircle, AlertTriangle, AlertCircle, Sparkles, Send } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminQRScanner = () => {
  const [manualTicketId, setManualTicketId] = useState('');
  const [checking, setChecking] = useState(false);
  const [scanResult, setScanResult] = useState(null); // { success: bool, message: string, data: regObj, alreadyAttended: bool }
  const scannerRef = useRef(null);

  useEffect(() => {
    // Initialize html5-qrcode scanner
    const qrScanner = new Html5QrcodeScanner(
      'qr-reader-view',
      {
        fps: 10,
        qrbox: { width: 220, height: 220 },
        aspectRatio: 1.0,
      },
      /* verbose= */ false
    );

    qrScanner.render(
      async (decodedText) => {
        // Success callback: decodedText contains the Ticket ID
        qrScanner.clear().catch(err => console.error('Error clearing scanner:', err));
        handleCheckIn(decodedText);
      },
      (error) => {
        // Silent failure - logs a lot of errors due to scanning frames, so we ignore
      }
    );

    scannerRef.current = qrScanner;

    return () => {
      // Clear scanner on unmount
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err) => console.error('Failed to clear scanner on cleanup', err));
      }
    };
  }, []);

  const handleCheckIn = async (ticketCode) => {
    const code = ticketCode.trim();
    if (!code) return;

    try {
      setChecking(true);
      setScanResult(null);

      const response = await api.post('/admin/scan', { ticketId: code });
      
      if (response.data.success) {
        setScanResult({
          success: true,
          alreadyAttended: response.data.alreadyAttended,
          message: response.data.message,
          data: response.data.data,
        });

        if (response.data.alreadyAttended) {
          toast.info('Ticket already checked in previously');
        } else {
          toast.success('Attendance confirmed successfully!');
        }
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Check-in failed. Invalid ticket.';
      setScanResult({
        success: false,
        message: errMsg,
      });
      toast.error(errMsg);
    } finally {
      setChecking(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualTicketId.trim()) return;
    handleCheckIn(manualTicketId);
    setManualTicketId('');
  };

  const handleScanNext = () => {
    setScanResult(null);
    // Restart scanner
    if (scannerRef.current) {
      scannerRef.current.render(
        async (decodedText) => {
          scannerRef.current.clear().catch(err => console.error('Error clearing scanner:', err));
          handleCheckIn(decodedText);
        },
        (error) => {}
      );
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex items-center space-x-2 text-sm font-semibold text-indigo-650 dark:text-indigo-400 mb-2">
          <Link to="/admin" className="hover:underline flex items-center">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Admin Dashboard</span>
          </Link>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight dark:text-white mb-8">QR Ticket Check-In</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left panel: Scanner or Check-In Result */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-150 dark:border-slate-700/50 shadow-sm flex flex-col items-center">
            
            {scanResult ? (
              /* Check-In Response Card */
              <div className="w-full space-y-6 text-center py-4 animate-in fade-in duration-300">
                {scanResult.success ? (
                  scanResult.alreadyAttended ? (
                    <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-450 rounded-full flex items-center justify-center mx-auto">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-450 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                  )
                ) : (
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 text-red-650 dark:text-red-400 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-extrabold dark:text-white">
                    {scanResult.success 
                      ? (scanResult.alreadyAttended ? 'Duplicate Check-In' : 'Access Granted') 
                      : 'Access Denied'}
                  </h3>
                  <p className={`text-sm mt-1 font-bold ${scanResult.success ? 'text-indigo-600 dark:text-indigo-400' : 'text-red-500'}`}>
                    {scanResult.message}
                  </p>
                </div>

                {/* Details list */}
                {scanResult.success && scanResult.data && (
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-150 dark:border-slate-750 text-left text-xs space-y-2">
                    <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-1.5 font-semibold text-slate-455">
                      <span>Ticket ID:</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">{scanResult.data.ticketId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Attendee:</span>
                      <strong className="text-slate-700 dark:text-slate-200">{scanResult.data.userId?.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <strong className="text-slate-700 dark:text-slate-200 truncate max-w-[170px]">{scanResult.data.userId?.email}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Event:</span>
                      <strong className="text-slate-700 dark:text-slate-200 truncate max-w-[175px]">{scanResult.data.eventId?.title}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <strong className="text-slate-700 dark:text-slate-200">{new Date(scanResult.data.eventId?.date).toLocaleDateString()}</strong>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleScanNext}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-650 hover:bg-indigo-755 transition-colors shadow-sm"
                >
                  Scan Next Ticket
                </button>
              </div>
            ) : (
              /* Camera view scanner */
              <div className="w-full flex flex-col items-center">
                <div className="flex items-center space-x-1.5 mb-4 text-xs font-bold uppercase tracking-wider text-indigo-500">
                  <Sparkles className="w-4 h-4" />
                  <span>Camera Live QR Feed</span>
                </div>
                {/* DOM element targeted by html5-qrcode library */}
                <div id="qr-reader-view" className="w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"></div>
                {checking && (
                  <div className="flex items-center space-x-2 text-indigo-600 mt-4 text-sm font-bold">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Verifying ticket databases...</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right panel: Fallback manual Ticket ID checks */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-150 dark:border-slate-700/50 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-bold dark:text-white flex items-center">
                <QrCode className="w-5 h-5 mr-2 text-indigo-500" />
                <span>Manual Ticket Entry</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                If the attendee's device camera fails, or lighting is poor, you can type the unique Alphanumeric Ticket ID code printed beneath the ticket's QR code.
              </p>
            </div>

            <form onSubmit={handleManualSubmit} className="mt-8 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1">Ticket Number ID</label>
                <input
                  type="text"
                  value={manualTicketId}
                  onChange={(e) => setManualTicketId(e.target.value.toUpperCase())}
                  placeholder="e.g. TKT-E3R4T5Y6"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono tracking-wider font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={checking || !manualTicketId.trim()}
                className="w-full inline-flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                {checking ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Checking ID...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Verify and Check In
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminQRScanner;
