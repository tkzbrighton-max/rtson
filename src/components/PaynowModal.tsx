import React, { useState } from 'react';
import { 
  X, Smartphone, CheckCircle2, Copy, 
  MessageSquare, Lock, Check, Info, ArrowRight,
  CreditCard, Mail, Building, DollarSign
} from 'lucide-react';

interface PaynowModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderReference?: string;
  amountUSD?: number;
  itemTitle?: string;
  onPaymentSuccess?: (paymentRef: string) => void;
}

export const PaynowModal: React.FC<PaynowModalProps> = ({
  isOpen,
  onClose,
  orderReference = `RTS-${Math.floor(100000 + Math.random() * 900000)}`,
  amountUSD = 15,
  itemTitle = 'Graphic Design Order',
  onPaymentSuccess
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'ecocash' | 'innbucks' | 'mukuru' | 'bank' | 'paypal'>('ecocash');

  const merchantName = "R'tson Creations Graphic Studio";
  const studioEmail = 'info@rtsoncreations.co.zw';

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleNotifyInfoEmail = () => {
    const subject = encodeURIComponent(`Payment Confirmation - #${orderReference} [${itemTitle}]`);
    const body = encodeURIComponent(`Hello R'tson Creations Studio Desk,\n\nI am sending a payment of $${amountUSD} USD for order "${itemTitle}" (Ref: #${orderReference}) via ${selectedMethod.toUpperCase()}.\n\nPlease confirm receipt once reflected.\n\nThank you.`);
    window.location.href = `mailto:${studioEmail}?subject=${subject}&body=${body}`;
    if (onPaymentSuccess) {
      onPaymentSuccess(orderReference);
    }
  };

  const handleNotifyEmail = () => {
    const subject = encodeURIComponent(`Payment Confirmation - #${orderReference} [${itemTitle}]`);
    const body = encodeURIComponent(`Hello R'tson Studio,\n\nI have sent a payment of $${amountUSD} USD for order "${itemTitle}" (Ref: #${orderReference}) via ${selectedMethod.toUpperCase()}.\n\nPlease find the payment confirmation details attached.\n\nThank you.`);
    window.location.href = `mailto:${studioEmail}?subject=${subject}&body=${body}`;
    if (onPaymentSuccess) {
      onPaymentSuccess(orderReference);
    }
  };

  return (
    <div id="payment-methods-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-white">
        
        {/* Terminal Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#bef264]" />
            <span className="text-xs font-mono font-bold text-slate-300">
              PAYMENT METHODS & SETTLEMENT
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Invoice Summary */}
        <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">ORDER REF: #{orderReference}</span>
            <span className="text-xs font-bold text-white">{itemTitle}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-[#bef264] uppercase tracking-wider block">Total Amount</span>
            <span className="text-lg font-black text-[#bef264] font-mono">${amountUSD}.00 <span className="text-xs text-slate-400 font-normal">USD</span></span>
          </div>
        </div>

        {/* Method Selector Tabs */}
        <div className="px-5 pt-3 pb-1 bg-slate-900 border-b border-slate-800">
          <div className="flex gap-1 overflow-x-auto pb-2">
            {[
              { id: 'ecocash', label: 'EcoCash USD' },
              { id: 'innbucks', label: 'InnBucks' },
              { id: 'mukuru', label: 'Mukuru / WU' },
              { id: 'bank', label: 'Bank / Zipit' },
              { id: 'paypal', label: 'PayPal / Card' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMethod(m.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedMethod === m.id
                    ? 'bg-[#d4f15d] text-slate-950 font-black shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          
          {selectedMethod === 'ecocash' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#bef264]" /> EcoCash USD Direct
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#d4f15d] text-slate-950">
                    Direct Mobile
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-white block">
                        EcoCash Mobile USD Settlement
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Account Name: <strong className="text-slate-200">{merchantName}</strong>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNotifyInfoEmail}
                    className="w-full py-2 px-3 rounded-lg bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 text-xs font-black transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-950" />
                    <span>Request EcoCash Prompt via Info Email</span>
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-white">Settlement Guide:</div>
                <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
                  <li>Click button above to request prompt via info email</li>
                  <li>Enter amount: <strong className="text-[#bef264]">${amountUSD} USD</strong></li>
                  <li>Receipt confirmed by studio team immediately</li>
                </ol>
              </div>
            </div>
          )}

          {selectedMethod === 'innbucks' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#bef264]" /> InnBucks USD Deposit
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white block">
                      InnBucks Account & Paycode
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Account Name: <strong className="text-slate-200">Takudzwa (Harare)</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleNotifyInfoEmail}
                    className="w-full py-2 px-3 rounded-lg bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 text-xs font-black transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-950" />
                    <span>Request InnBucks Paycode via Info Email</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'mukuru' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs text-slate-300">
              <span className="font-bold text-white block">Mukuru / Western Union / WorldRemit:</span>
              <div className="bg-slate-900 p-3 rounded-lg space-y-1 text-[11px]">
                <div>Recipient Name: <strong className="text-white">Takudzwa</strong></div>
                <div>City / Country: <strong className="text-white">Harare, Zimbabwe</strong></div>
                <div>Verification: <strong className="text-emerald-400">Delivered directly to info@rtsoncreations.co.zw</strong></div>
              </div>
            </div>
          )}

          {selectedMethod === 'bank' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs text-slate-300">
              <span className="font-bold text-white block">Bank Transfer & Zipit:</span>
              <p className="text-slate-400 text-[11px]">
                We accept transfers via Stanbic, CABS, CBZ, and FBC Bank. Specific account details will be shared on invoice issuance.
              </p>
            </div>
          )}

          {selectedMethod === 'paypal' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs text-slate-300">
              <span className="font-bold text-white block">International Digital Invoicing:</span>
              <p className="text-slate-400 text-[11px]">
                We generate direct digital card / PayPal payment links for clients abroad upon project brief submission.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleNotifyInfoEmail}
              className="w-full py-3 px-4 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow"
            >
              <Mail className="w-4 h-4 text-slate-950" />
              <span>Confirm Payment via info@rtsoncreations.co.zw</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleNotifyEmail}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-[#bef264]" />
              <span>Send Payment Proof to info@rtsoncreations.co.zw</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
