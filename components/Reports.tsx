
import React from 'react';
import { Order, ShopConfig } from '../types';

interface ReportsProps {
  orders: Order[];
  shop: ShopConfig;
}

const Reports: React.FC<ReportsProps> = ({ orders, shop }) => {
  return (
    <div className="p-4 md:p-10 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Audit & Sales Logs</h2>
          <p className="text-slate-500 font-medium">Historical transaction records for {shop.name}</p>
        </div>
        <button className="hidden md:block px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50">
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Order ID</th>
                <th className="px-8 py-5">Timestamp</th>
                <th className="px-8 py-5">Items</th>
                <th className="px-8 py-5">Payment</th>
                <th className="px-8 py-5">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...orders].reverse().map(order => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 font-black text-slate-800">#{order.id}</td>
                  <td className="px-8 py-5 text-sm text-slate-500">
                    {new Date(order.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div key={i} className="w-8 h-8 rounded-lg bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold overflow-hidden">
                           <img src={item.image} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-tighter">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-black text-blue-600">
                    {shop.currency}{order.total.toFixed(2)}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-300 font-bold uppercase tracking-widest">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
