
import React, { useState } from 'react';
import { ShopConfig, Staff } from '../types';

interface StaffManagerProps {
  shop: ShopConfig;
  onUpdateStaff: (staff: Staff[]) => void;
}

const StaffManager: React.FC<StaffManagerProps> = ({ shop, onUpdateStaff }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState<Partial<Staff>>({ role: 'CASHIER' });

  const resetForm = () => {
    setFormData({ role: 'CASHIER' });
    setIsAdding(false);
    setEditingStaff(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.id || !formData.password) return;
    
    if (editingStaff) {
      const updatedList = shop.staff.map(s => s.id === editingStaff.id ? { ...editingStaff, ...formData } as Staff : s);
      onUpdateStaff(updatedList);
    } else {
      const newStaff: Staff = {
        id: formData.id,
        name: formData.name,
        password: formData.password,
        role: formData.role || 'CASHIER',
        createdAt: new Date()
      };
      onUpdateStaff([...shop.staff, newStaff]);
    }
    
    resetForm();
  };

  const handleOpenEdit = (member: Staff) => {
    setEditingStaff(member);
    setFormData(member);
  };

  const removeStaff = (id: string) => {
    if (confirm('Deauthorize this staff member?')) {
      onUpdateStaff(shop.staff.filter(s => s.id !== id));
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Staff Command</h2>
          <p className="text-slate-500 font-medium">Control and authorize terminal users for {shop.name}</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl"
        >
          + Authorize New Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shop.staff.map(member => (
          <div key={member.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 relative group overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl font-black text-slate-400">
                  {member.name[0]}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 uppercase tracking-tight">{member.name}</h4>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-widest">
                    {member.role}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => handleOpenEdit(member)}
                className="text-blue-600 hover:text-blue-800 text-[10px] font-black uppercase tracking-widest"
              >
                Edit
              </button>
            </div>
            
            <div className="space-y-2 py-4 border-t border-slate-50">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase">Terminal ID</span>
                <span className="text-sm font-bold text-slate-700">{member.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase">Access Pass</span>
                <span className="text-sm font-bold text-slate-700 font-mono">{member.password}</span>
              </div>
            </div>

            <button 
              onClick={() => removeStaff(member.id)}
              className="w-full mt-4 py-3 border border-rose-100 text-rose-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
            >
              Revoke Authorization
            </button>
          </div>
        ))}
        {shop.staff.length === 0 && (
          <div className="col-span-full py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
            <span className="text-4xl mb-4">👥</span>
            <p className="font-black uppercase tracking-widest text-xs">No Staff Authorized Yet</p>
          </div>
        )}
      </div>

      {(isAdding || editingStaff) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 animate-scaleIn">
            <h3 className="text-2xl font-black mb-6 text-slate-800 tracking-tight">
              {editingStaff ? 'Update Credentials' : 'Generate Credentials'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Employee Full Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name || ''}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Unique Staff ID</label>
                  <input 
                    required
                    type="text" 
                    value={formData.id || ''}
                    onChange={e => setFormData({...formData, id: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                    placeholder="S-001"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Access Password</label>
                  <input 
                    required
                    type="text" 
                    value={formData.password || ''}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                    placeholder="pass123"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Operational Role</label>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as any})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                >
                  <option value="CASHIER">Standard Cashier</option>
                  <option value="MANAGER">Node Manager</option>
                </select>
              </div>
              <div className="flex gap-4 mt-8 pt-4 border-t border-slate-50">
                <button type="button" onClick={resetForm} className="flex-1 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Cancel</button>
                <button type="submit" className="flex-2 px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl uppercase tracking-widest text-[10px]">
                  {editingStaff ? 'Save Changes' : 'Authorize Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManager;
