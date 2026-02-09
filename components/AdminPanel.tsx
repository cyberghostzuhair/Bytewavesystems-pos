
import React, { useState } from 'react';
import { ShopConfig } from '../types';
import { BYTEWAVE_LOGO } from '../constants';

interface AdminPanelProps {
  shops: ShopConfig[];
  onAddShop: (shop: Partial<ShopConfig>) => void;
  onUpdateShop: (oldId: string, updatedShop: ShopConfig) => void;
  onUpdateShopStatus: (id: string, status: ShopConfig['status']) => void;
  onDeleteShop: (id: string) => void;
  isOnline: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ shops, onAddShop, onUpdateShop, onUpdateShopStatus, onDeleteShop, isOnline }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingShop, setEditingShop] = useState<ShopConfig | null>(null);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    ownerName: '',
    email: '',
    password: '',
    subscriptionType: 'Pro' as ShopConfig['subscriptionType'],
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
  });

  const resetForm = () => {
    setFormData({ 
      id: '', 
      name: '', 
      ownerName: '', 
      email: '', 
      password: '', 
      subscriptionType: 'Pro',
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    });
    setIsAdding(false);
    setEditingShop(null);
  };

  const handleOpenAdd = () => {
    if (!isOnline) {
      alert("Offline Mode: Cannot deploy new instances without internet connection.");
      return;
    }
    resetForm();
    setIsAdding(true);
  };

  const handleOpenEdit = (shop: ShopConfig) => {
    if (!isOnline) {
      alert("Offline Mode: Sync required to modify node credentials.");
      return;
    }
    setEditingShop(shop);
    setFormData({
      id: shop.id,
      name: shop.name,
      ownerName: shop.ownerName,
      email: shop.email,
      password: shop.password || '',
      subscriptionType: shop.subscriptionType,
      expiryDate: shop.expiryDate ? shop.expiryDate.split('T')[0] : ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingShop) {
      onUpdateShop(editingShop.id, { ...editingShop, ...formData });
    } else {
      onAddShop(formData);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!isOnline) {
      alert("Offline Mode: Global decommissioning requires network access.");
      return;
    }
    if (confirm(`⚠️ CRITICAL ACTION: Permanently delete business node ${id}? This action cannot be undone and all merchant data will be wiped.`)) {
      onDeleteShop(id);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <img src={BYTEWAVE_LOGO} className="w-16 h-16 rounded-2xl bg-white p-2 shadow-xl border border-slate-200 object-contain" alt="ByteWave" />
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Platform Master Hub</h2>
            <p className="text-slate-500 font-medium uppercase text-[10px] tracking-widest">Global Business Node Control Center</p>
          </div>
        </div>
        <button 
          onClick={handleOpenAdd}
          disabled={!isOnline}
          className={`px-8 py-4 rounded-2xl font-black transition-all shadow-2xl flex items-center gap-2 text-xs uppercase tracking-widest ${
            isOnline ? 'bg-slate-900 text-white hover:bg-black' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          <span>+</span> {isOnline ? 'Deploy New Business Instance' : 'Sync Required to Deploy'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-[2rem] flex items-center gap-6">
          <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center text-2xl">🛡️</div>
          <div>
            <h4 className="font-black text-amber-900 text-sm uppercase leading-none mb-1">Anti-Resale Protocol</h4>
            <p className="text-[10px] text-amber-700 font-bold uppercase tracking-tight leading-relaxed">
              This node master is proprietary. All deployed instances are strictly internal to the ByteWave ecosystem.
            </p>
          </div>
        </div>
        <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-[2rem] flex items-center gap-6">
          <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-2xl">🔗</div>
          <div>
            <h4 className="font-black text-blue-900 text-sm uppercase leading-none mb-1">Node Isolation Verified</h4>
            <p className="text-[10px] text-blue-700 font-bold uppercase tracking-tight leading-relaxed">
              Every Store ID acts as a distinct cryptographic vault. Staff IDs remain unique within their respective nodes.
            </p>
          </div>
        </div>
      </div>

      {!isOnline && (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-600 text-center text-xs font-black uppercase tracking-widest">
          Platform locked in read-only mode while offline. Connect to sync changes.
        </div>
      )}

      {(isAdding || editingShop) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-scaleIn">
            <h3 className="text-2xl font-black mb-6 text-slate-800 tracking-tight">
              {editingShop ? 'Modify Node Subscription' : 'Onboard New Merchant'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Store ID</label>
                  <input 
                    required
                    type="text" 
                    value={formData.id}
                    onChange={e => setFormData({...formData, id: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" 
                    placeholder="e.g. coffee_hub"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Deadline Date</label>
                  <input 
                    required
                    type="date" 
                    value={formData.expiryDate}
                    onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" 
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Business Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="The Coffee Hub"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Merchant Email (Login ID)</label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="owner@email.com"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Instance Password</label>
                <input 
                  required
                  type="text" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-mono" 
                  placeholder="SecurePass123"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Service Tier</label>
                <select 
                  value={formData.subscriptionType}
                  onChange={e => setFormData({...formData, subscriptionType: e.target.value as any})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                >
                  <option value="Basic">Basic Retail (30 Days)</option>
                  <option value="Pro">Professional SaaS (Annual)</option>
                  <option value="Enterprise">Enterprise Node (Unlimited)</option>
                </select>
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="flex-1 py-4 text-slate-500 font-black bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all uppercase text-[10px] tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 uppercase text-[10px] tracking-widest"
                >
                  {editingShop ? 'Update License' : 'Deploy Instance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[9px] uppercase tracking-[0.2em] font-black border-b border-slate-100">
              <tr>
                <th className="px-8 py-6">Node Instance</th>
                <th className="px-8 py-6">Master Credentials</th>
                <th className="px-8 py-6">Isolation Status</th>
                <th className="px-8 py-6">Control Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shops.map(shop => {
                const daysLeft = Math.ceil((new Date(shop.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                return (
                  <tr key={shop.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <img src={shop.logoUrl} className="w-10 h-10 rounded-xl object-cover bg-slate-50 border border-slate-100" />
                        <div>
                          <div className="font-black text-slate-800 text-sm leading-none mb-1">{shop.name}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">NODE_ID: {shop.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-xs font-bold text-slate-800">{shop.email}</div>
                      <div className="text-[10px] text-slate-400 font-mono">PWD: {shop.password || '••••••••'}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[7px] font-black uppercase tracking-widest border border-emerald-100">Vault Isolated</span>
                          <span className={`text-[9px] font-black uppercase ${daysLeft < 7 ? 'text-rose-600 animate-pulse' : 'text-slate-500'}`}>
                            {daysLeft <= 0 ? 'EXPIRED' : `${daysLeft}D Left`}
                          </span>
                        </div>
                        <div className="text-[9px] font-bold text-slate-300 uppercase">Deadline: {shop.expiryDate.split('T')[0]}</div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-4">
                        <button 
                          onClick={() => handleOpenEdit(shop)}
                          disabled={!isOnline}
                          className={`font-black text-[10px] uppercase tracking-widest ${isOnline ? 'text-blue-600 hover:text-blue-800' : 'text-slate-300 cursor-not-allowed'}`}
                        >
                          Modify
                        </button>
                        <button 
                          onClick={() => handleDelete(shop.id)}
                          disabled={!isOnline}
                          className={`font-black text-[10px] uppercase tracking-widest ${isOnline ? 'text-rose-400 hover:text-rose-600' : 'text-slate-300 cursor-not-allowed'}`}
                        >
                          Decommission
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {shops.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center text-slate-300 font-black uppercase tracking-[0.2em] italic">
                    ByteWave Node Registry Empty
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

export default AdminPanel;
