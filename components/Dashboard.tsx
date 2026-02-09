
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Order, Product, ShopConfig } from '../types';
import { getBusinessInsight } from '../services/geminiService';

interface DashboardProps {
  orders: Order[];
  inventory: Product[];
  shop: ShopConfig | null;
}

const Dashboard: React.FC<DashboardProps> = ({ orders, inventory, shop }) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    if (orders.length > 0 || inventory.length > 0) {
      const fetchInsights = async () => {
        setLoadingInsights(true);
        const res = await getBusinessInsight(orders, inventory);
        setInsights(res);
        setLoadingInsights(false);
      };
      fetchInsights();
    }
  }, [orders, inventory]);

  const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  const lowStockCount = inventory.filter(p => p.stock < 10).length;

  const daysLeft = shop ? Math.ceil((new Date(shop.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 0;

  const chartData = orders.slice(-7).map(o => ({
    name: new Date(o.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    total: o.total
  }));

  return (
    <div className="p-8 space-y-8 animate-fadeIn bg-slate-50 min-h-full pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Performance Pulse</h2>
          <p className="text-slate-500 font-medium">Instance health and operational metrics</p>
        </div>
        
        {shop && (
          <div className={`p-4 rounded-3xl border-2 flex items-center gap-4 transition-all shadow-sm ${
            daysLeft < 7 ? 'bg-rose-50 border-rose-100 text-rose-600 animate-pulse' : 'bg-white border-slate-100'
          }`}>
             <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Service Deadline</p>
                <p className="text-sm font-black">{daysLeft <= 0 ? 'Instance Expired' : `${daysLeft} Days Remaining`}</p>
             </div>
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow-lg ${
               daysLeft < 7 ? 'bg-rose-500 shadow-rose-200' : 'bg-slate-900'
             }`}>
               {daysLeft <= 0 ? '!' : (daysLeft > 99 ? '99+' : daysLeft)}
             </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Total Revenue Flow</span>
          <div className="flex items-baseline">
            <span className="text-4xl font-black text-slate-900 tracking-tighter">{shop?.currency}{totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Node Operations</span>
          <div className="flex items-baseline">
            <span className="text-4xl font-black text-slate-900 tracking-tighter">{totalOrders}</span>
            <span className="ml-2 text-blue-500 text-[10px] font-black uppercase tracking-widest">Completed Orders</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Inventory Integrity</span>
          <div className="flex items-baseline">
            <span className={`text-4xl font-black tracking-tighter ${lowStockCount > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{lowStockCount}</span>
            <span className="ml-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">Low Stock Alerts</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Sales Velocity (Recent Activity)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}}
                />
                <Bar dataKey="total" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white overflow-hidden relative border border-white/5">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center">
              <span className="mr-3 text-lg">🤖</span> ByteWave Intelligent Insights
            </h3>
            <span className="px-3 py-1 bg-white/10 text-white/50 text-[8px] font-black uppercase rounded-lg tracking-widest border border-white/5">Instance V4.5</span>
          </div>
          
          {loadingInsights ? (
            <div className="flex items-center justify-center h-48 space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-200"></div>
            </div>
          ) : insights.length > 0 ? (
            <ul className="space-y-4">
              {insights.map((insight, idx) => (
                <li key={idx} className="flex items-start bg-white/5 p-5 rounded-[1.5rem] border border-white/5 hover:border-white/10 transition-colors">
                  <span className="mr-5 mt-1.5 w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 shadow-[0_0_10px_rgba(96,165,250,0.5)]"></span>
                  <span className="text-xs text-slate-300 leading-relaxed font-bold tracking-tight">{insight}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center opacity-30 text-center">
                <span className="text-5xl mb-3">📉</span>
                <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">System awaiting historical <br/>node data for AI generation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
