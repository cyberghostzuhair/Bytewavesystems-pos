
import React from 'react';
import { View, User } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  logout: () => void;
  currentUser: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, logout, currentUser, isOpen, onClose }) => {
  const shopItems = [
    { id: View.DASHBOARD, label: 'Analytics Hub', icon: '📊', roles: ['SHOP_OWNER'] },
    { id: View.POS, label: 'Live Register', icon: '🧾', roles: ['SHOP_OWNER', 'STAFF'] },
    { id: View.INVENTORY, label: 'Catalog Master', icon: '📦', roles: ['SHOP_OWNER'] },
    { id: View.STAFF_MGMT, label: 'Team Access', icon: '👥', roles: ['SHOP_OWNER'] },
    { id: View.REPORTS, label: 'Audit Vault', icon: '🛡️', roles: ['SHOP_OWNER', 'STAFF'] },
    { id: View.SETTINGS, label: 'Node Logic', icon: '⚙️', roles: ['SHOP_OWNER'] },
  ];

  const adminItems = [
    { id: View.ADMIN_PANEL, label: 'Node Master', icon: '🌐', roles: ['PLATFORM_ADMIN'] },
    { id: View.REPORTS, label: 'Global Audit', icon: '📈', roles: ['PLATFORM_ADMIN'] },
  ];

  const menuItems = (currentUser?.role === 'PLATFORM_ADMIN' ? adminItems : shopItems)
    .filter(item => item.roles.includes(currentUser?.role || ''));

  const showTroubleshooting = () => {
    alert(`ByteWave Systems - Advanced Troubleshooting Node:
    
1. TERMINAL LOCKOUT: Verify your subscription hasn't passed the deadline in 'Node Logic'.
2. PRINT FAILURES: Open browser print settings and enable 'Background Graphics' and 'Headers/Footers'.
3. DATA DESYNC: Clear local browser node cache or refresh the page to re-authenticate with the ByteWave Master.
4. AUTH FAILURES: Ensure Store ID matches exactly the one provided by your administrator.

NOTE: This instance is cryptographically bound to your hardware node. Any attempt to copy or redistribute this core is strictly monitored.`);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose}></div>
      )}

      <div className={`
        fixed inset-y-0 left-0 w-64 bg-slate-950 text-white flex flex-col h-full shadow-2xl z-50 transition-transform duration-300 transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:z-20
      `}>
        <div className="p-8 border-b border-slate-900 mb-6 flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center p-1">
              <span className="text-slate-950 font-black text-xl">B</span>
            </div>
            <div>
               <h1 className="text-lg font-black tracking-tighter uppercase leading-none">ByteWave</h1>
               <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">SaaS Core</span>
            </div>
          </div>
          <p className="text-[8px] text-slate-700 uppercase tracking-widest font-black flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Link: Encrypted Node Session
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 custom-scrollbar overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setView(item.id); onClose(); }}
              className={`w-full flex items-center px-5 py-4 rounded-[1.25rem] transition-all group ${
                currentView === item.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/30' 
                  : 'text-slate-500 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <span className="mr-4 text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="font-black text-[10px] uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
          
          <div className="pt-10 px-4 space-y-6">
             <button 
               onClick={showTroubleshooting}
               className="flex items-center gap-3 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-blue-400 transition-colors group"
             >
               <span className="group-hover:rotate-12 transition-transform">🛠️</span> Core Help Center
             </button>
             
             {currentUser?.role === 'SHOP_OWNER' && (
                <div className="bg-slate-900/50 p-5 rounded-[1.5rem] border border-slate-800/50">
                  <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-3 leading-relaxed">
                    Licensed Enterprise Node. <br/> Resale is Prohibited.
                  </p>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-2/5 h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                  </div>
                </div>
             )}
          </div>
        </nav>

        <div className="p-6 border-t border-slate-900">
          <button 
            onClick={logout}
            className="w-full py-4 rounded-2xl border border-slate-900 text-slate-600 hover:bg-rose-500/10 hover:border-rose-500 hover:text-rose-500 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            Shutdown Terminal
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
