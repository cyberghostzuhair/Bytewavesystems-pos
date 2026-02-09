
import React, { useState } from 'react';
import { ShopConfig } from '../types';
import { BYTEWAVE_CONTACT } from '../constants';

interface SettingsProps {
  config: ShopConfig;
  onUpdate: (newConfig: ShopConfig) => void;
}

const Settings: React.FC<SettingsProps> = ({ config, onUpdate }) => {
  const [formData, setFormData] = useState(config);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    alert('Business credentials updated successfully!');
  };

  return (
    <div className="p-10 max-w-5xl mx-auto animate-fadeIn">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Branding & Logic</h2>
          <p className="text-slate-500 font-medium">Customize how your customers perceive your business</p>
        </div>
        <div className="px-4 py-2 bg-slate-900 rounded-2xl text-white text-xs font-black uppercase tracking-widest">
           Plan: {config.subscriptionType}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest border-b border-slate-50 pb-4">Identity</h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Display Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Public Logo URL</label>
              <div className="flex gap-4">
                <img src={formData.logoUrl} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                <input 
                  type="text" 
                  value={formData.logoUrl}
                  onChange={e => setFormData({...formData, logoUrl: e.target.value})}
                  className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm" 
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest border-b border-slate-50 pb-4">Billing Configuration</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Local Currency</label>
                <input 
                  type="text" 
                  value={formData.currency}
                  onChange={e => setFormData({...formData, currency: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-center" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tax Percentage</label>
                <input 
                  type="number" 
                  value={formData.taxRate}
                  onChange={e => setFormData({...formData, taxRate: parseFloat(e.target.value)})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-center" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Store Contact Number</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" 
              />
            </div>
          </div>

          <div className="md:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Storefront Physical Address (Printed on Receipts)</label>
            <textarea 
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              className="w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-blue-500 outline-none font-medium min-h-[120px]"
              placeholder="Full physical address..."
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            className="px-12 py-5 bg-blue-600 text-white rounded-[2rem] font-black hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-2"
          >
            <span>💾</span> Update Business Profile
          </button>
        </div>
      </form>
      
      <div className="mt-12 p-10 bg-gradient-to-br from-slate-900 to-slate-950 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="text-center md:text-left">
          <h4 className="text-2xl font-black mb-1">Managed Infrastructure</h4>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Support: {BYTEWAVE_CONTACT.phone} | {BYTEWAVE_CONTACT.email}</p>
          <p className="text-slate-600 font-bold uppercase tracking-widest text-[8px] mt-2">{BYTEWAVE_CONTACT.website}</p>
        </div>
        <div className="flex gap-4">
          <a href={`mailto:${BYTEWAVE_CONTACT.email}`} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors">
            Email Support
          </a>
          <a href={`tel:${BYTEWAVE_CONTACT.phone}`} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors">
            Call ByteWave
          </a>
        </div>
      </div>
    </div>
  );
};

export default Settings;
