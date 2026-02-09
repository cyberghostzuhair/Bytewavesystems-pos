
import React from 'react';
import { Order, ShopConfig } from '../types';
import { BYTEWAVE_LOGO } from '../constants';

interface ReceiptProps {
  order: Order;
  shop: ShopConfig;
  onClose: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({ order, shop, onClose }) => {
  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4 overflow-y-auto no-print animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-scaleIn ring-1 ring-white/10">
        
        {/* Printable Area - Optimized for High Quality Thermal or A4 Save */}
        <div id="printable-receipt" className="p-10 overflow-y-auto flex-1 font-mono text-slate-800 leading-relaxed bg-white">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mb-6 relative inline-block group">
              <div className="absolute inset-0 bg-slate-100 rounded-[2rem] -rotate-3 group-hover:rotate-0 transition-transform"></div>
              <img src={shop.logoUrl} className="relative w-24 h-24 mx-auto rounded-[2rem] object-contain shadow-xl border-4 border-white bg-white" alt={shop.name} />
            </div>
            <h2 className="text-2xl font-black tracking-tighter uppercase mb-2 leading-none">{shop.name}</h2>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest space-y-1 opacity-70">
              <p className="max-w-[200px] mx-auto leading-tight">{shop.address}</p>
              <p className="pt-2 border-t border-slate-50 mt-2 inline-block">TEL: {shop.phone}</p>
            </div>
          </div>
          
          {/* Divider */}
          <div className="flex items-center gap-2 mb-8">
            <div className="h-px bg-slate-100 flex-1"></div>
            <div className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Official Invoice</div>
            <div className="h-px bg-slate-100 flex-1"></div>
          </div>
          
          {/* Order Meta */}
          <div className="flex justify-between items-end mb-8 font-bold">
            <div className="space-y-1">
              <p className="text-[8px] text-slate-400 uppercase tracking-widest">Transaction ID</p>
              <p className="text-slate-900 font-black text-sm">#{order.id}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[8px] text-slate-400 uppercase tracking-widest">Date & Time</p>
              <p className="text-slate-900 text-[10px] font-black">
                {new Date(order.timestamp).toLocaleDateString()} — {new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-5 mb-10">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="font-black text-xs text-slate-900 uppercase tracking-tight">{item.name}</p>
                  <p className="text-[9px] text-slate-400 font-bold tracking-widest">
                    {item.quantity} UNIT{item.quantity > 1 ? 'S' : ''} @ {shop.currency}{item.price.toFixed(2)}
                  </p>
                </div>
                <span className="font-black text-xs text-slate-900">{shop.currency}{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Financial Totals */}
          <div className="bg-slate-50/50 rounded-3xl p-6 space-y-3 mb-10 border border-slate-50">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span>Gross Total</span>
              <span>{shop.currency}{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span>State Tax ({shop.taxRate}%)</span>
              <span>{shop.currency}{order.tax.toFixed(2)}</span>
            </div>
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
              <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">Amount Due</span>
              <span className="text-xl font-black text-slate-900">{shop.currency}{order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method Badge */}
          <div className="flex justify-center mb-10">
             <div className="px-6 py-2 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-200">
               Paid via {order.paymentMethod}
             </div>
          </div>

          {/* ByteWave Verification Footer */}
          <div className="text-center mt-12 space-y-6 pt-10 border-t border-slate-100">
            <img src={BYTEWAVE_LOGO} className="w-12 h-12 mx-auto opacity-80 object-contain" alt="ByteWave Core" />
            <div className="space-y-1">
              <p className="font-black text-[9px] tracking-[0.3em] text-slate-900 uppercase">Cryptographic Receipt</p>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest max-w-[150px] mx-auto leading-relaxed">
                Secure Node Transaction ID: {order.id}-{shop.id.slice(0,4).toUpperCase()}
              </p>
            </div>
            <div className="flex justify-center gap-1">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-slate-100 rounded-full"></div>
                ))}
            </div>
          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <button 
                onClick={handlePrint}
                className="py-5 bg-slate-900 text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
            >
                <span>🖨️</span> Print / PDF
            </button>
            <button 
                onClick={onClose}
                className="py-5 bg-white border border-slate-200 text-slate-600 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-all active:scale-95"
            >
                Close Terminal
            </button>
          </div>
          <p className="text-[8px] text-slate-400 text-center font-black uppercase tracking-[0.15em]">
            This session is cryptographically bound to ByteWave Node Infrastructure
          </p>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
