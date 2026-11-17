import React from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  X, 
  CheckCircle2, 
  Check,
  ShieldCheck, 
  DollarSign, 
  Layers, 
  Clock, 
  MessageSquare,
  QrCode
} from 'lucide-react';
import { sound } from '../lib/soundFx';

interface InvoiceQuoteGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteData?: {
    orderRef: string;
    clientName: string;
    clientEmail?: string;
    categoryName: string;
    itemTitle: string;
    basePrice: number;
    selectedAddOns: string[];
    turnaround: string;
    totalAmount: number;
  };
}

export const InvoiceQuoteGeneratorModal: React.FC<InvoiceQuoteGeneratorModalProps> = ({
  isOpen,
  onClose,
  quoteData
}) => {
  if (!isOpen) return null;

  const data = quoteData || {
    orderRef: `RTS-${Math.floor(10000 + Math.random() * 90000)}`,
    clientName: 'Valued Client',
    clientEmail: 'client@example.com',
    categoryName: 'Church & Ministry 3D Gold Flyer',
    itemTitle: '3D Gold Praise & Worship Conference Flyer',
    basePrice: 15,
    selectedAddOns: [
      'Layered Adobe Photoshop PSD Source File ($5)',
      '15-Second Action Motion Graphic Video ($10)',
      'Express 12-Hour Rush Pre-Press Delivery ($5)'
    ],
    turnaround: '24 Hours Express',
    totalAmount: 35
  };

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 overflow-y-auto backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#d4f15d] text-slate-950 font-black">
              <FileText className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#bef264]">
                OFFICIAL STUDIO QUOTE & INVOICE
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Invoice #{data.orderRef}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document Body */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-slate-950 text-slate-200 space-y-6 print:bg-white print:text-black">
          
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                R'TSON CREATIONS
              </h2>
              <p className="text-xs text-[#bef264] font-bold">
                Professional Graphic Design & Motion Studio
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Harare, Zimbabwe • Worldwide Digital Delivery<br />
                Official Email: info@rtsoncreations.co.zw • Web: www.rtsoncreations.co.zw
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                ORDER INVOICE REFERENCE
              </span>
              <span className="text-lg font-mono font-bold text-white">
                #{data.orderRef}
              </span>
              <span className="text-xs text-slate-400 block">
                Issued: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Client & Project Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                BILLED TO:
              </span>
              <span className="font-bold text-white text-sm block">{data.clientName}</span>
              <span className="text-slate-400 block">{data.clientEmail || 'Direct Client'}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                PROJECT DETAILS:
              </span>
              <span className="font-bold text-amber-300 block">{data.itemTitle}</span>
              <span className="text-slate-400 block">Turnaround: {data.turnaround}</span>
            </div>
          </div>

          {/* Itemized Line Items Table */}
          <div className="border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3 sm:p-4">Description</th>
                  <th className="p-3 sm:p-4 text-center">Output Format</th>
                  <th className="p-3 sm:p-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                <tr>
                  <td className="p-3 sm:p-4">
                    <span className="font-bold text-white block">{data.categoryName}</span>
                    <span className="text-[11px] text-slate-400">
                      300 DPI CMYK Pre-Press Master + RGB High Resolution Digital Files
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 text-center font-mono text-[11px] text-slate-300">
                    PDF / PNG / JPEG
                  </td>
                  <td className="p-3 sm:p-4 text-right font-bold text-white">
                    ${data.basePrice}.00 USD
                  </td>
                </tr>

                {data.selectedAddOns.map((addon, idx) => (
                  <tr key={idx}>
                    <td className="p-3 sm:p-4 text-slate-300">
                      <span className="inline-flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#bef264]" /> {addon}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 text-center font-mono text-[11px] text-slate-400">
                      Add-on
                    </td>
                    <td className="p-3 sm:p-4 text-right font-medium text-slate-300">
                      Included
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-900/80 font-bold text-xs border-t border-slate-800">
                <tr>
                  <td colSpan={2} className="p-3 sm:p-4 text-right text-slate-300">
                    TOTAL INVESTMENT:
                  </td>
                  <td className="p-3 sm:p-4 text-right text-base text-[#bef264] font-black">
                    ${data.totalAmount}.00 USD
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Instructions */}
          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 text-xs">
            <h4 className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#bef264]" />
              <span>Official Payment Settlement Channels (Zimbabwe &amp; International)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 rounded-xl bg-black border border-neutral-800 space-y-1">
                <strong className="text-[#bef264] block font-semibold">EcoCash Zimbabwe:</strong>
                <span className="font-mono text-white text-xs">Prompt on Invoice</span>
                <span className="text-slate-400 block">(Direct Merchant Dispatch via Info Desk)</span>
              </div>

              <div className="p-3 rounded-xl bg-black border border-neutral-800 space-y-1">
                <strong className="text-[#bef264] block font-semibold">InnBucks Express:</strong>
                <span className="font-mono text-white text-xs">Instant Paycode on Request</span>
                <span className="text-slate-400 block">(Issued with Official Quotation)</span>
              </div>

              <div className="p-3 rounded-xl bg-black border border-neutral-800 space-y-1">
                <strong className="text-[#bef264] block font-semibold">ZIPIT / Bank Transfer:</strong>
                <span className="text-slate-300 block">CABS / Stanbic Details available on request</span>
              </div>

              <div className="p-3 rounded-xl bg-black border border-neutral-800 space-y-1">
                <strong className="text-[#bef264] block font-semibold">PayPal / International:</strong>
                <span className="font-mono text-white text-xs">info@rtsoncreations.co.zw</span>
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-500 font-mono">
            Thank you for choosing R'tson Creations • Bringing Your Visual Visions to Life!
          </div>

        </div>

      </div>
    </div>
  );
};
