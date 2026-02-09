
import React, { useState, useEffect } from 'react';
import { BYTEWAVE_LOGO, BYTEWAVE_CONTACT } from '../constants';

interface LoginProps {
  onLogin: (storeId: string, userId: string, password?: string, isStaff?: boolean) => void;
}

// Cookie Helpers
const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
};

const getCookie = (name: string) => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const eraseCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=-99999999;path=/;`;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<'OWNER' | 'STAFF' | 'SYSTEM'>('OWNER');
  const [storeId, setStoreId] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load cookies on mount
  useEffect(() => {
    const savedStoreId = getCookie('bw_store_id');
    const savedUserId = getCookie('bw_user_id');
    const savedRole = getCookie('bw_role') as any;
    const savedRemember = getCookie('bw_remember') === 'true';

    if (savedRemember) {
      if (savedStoreId) setStoreId(savedStoreId);
      if (savedUserId) setUserId(savedUserId);
      if (savedRole) setRole(savedRole);
      setRememberMe(true);
    }
  }, []);

  // Generate a mock unique hardware ID for visual security feel
  const hwId = React.useMemo(() => `BW-HW-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const finalStoreId = role === 'SYSTEM' ? 'CORE' : storeId;
    const finalUserId = role === 'SYSTEM' ? 'platform_admin' : userId;

    if (rememberMe) {
      setCookie('bw_store_id', finalStoreId, 30);
      setCookie('bw_user_id', finalUserId, 30);
      setCookie('bw_role', role, 30);
      setCookie('bw_remember', 'true', 30);
    } else {
      eraseCookie('bw_store_id');
      eraseCookie('bw_user_id');
      eraseCookie('bw_role');
      eraseCookie('bw_remember');
    }

    setTimeout(() => {
      onLogin(finalStoreId, finalUserId, password, role === 'STAFF');
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Visual Branding Side */}
      <div className="hidden lg:flex lg:w-3/5 relative flex-col justify-center p-24 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950">
        <div className="absolute top-12 left-12 flex items-center space-x-4">
          <img src={BYTEWAVE_LOGO} className="w-14 h-14 rounded-2xl bg-white p-1.5 shadow-2xl object-contain" alt="ByteWave" />
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter uppercase text-white leading-none">{BYTEWAVE_CONTACT.name}</span>
            <span className="text-[8px] font-black tracking-[0.3em] uppercase text-blue-400">Security Infrastructure</span>
          </div>
        </div>

        <div className="max-w-xl z-10 space-y-10">
          <div className="space-y-4">
            <span className="px-5 py-2 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/20">Production Node V4.5</span>
            <h2 className="text-7xl font-black leading-[0.9] tracking-tighter">
              Encrypted <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Node Hub.</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
              Proprietary automated billing infrastructure managed by {BYTEWAVE_CONTACT.name}. Each business node is isolated in a cryptographically distinct vault.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group">
              <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">🔒</span>
              <h4 className="font-bold text-white mb-2">Vault Isolation</h4>
              <p className="text-[10px] text-slate-500 uppercase font-black leading-relaxed">Cross-shop data interference is physically impossible.</p>
            </div>
            <div className={`p-8 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-sm transition-all flex flex-col items-center justify-center text-center`}>
              <div className="font-mono text-[9px] text-blue-400 mb-2 font-black tracking-widest">{hwId}</div>
              <h4 className="font-bold text-white mb-1 text-[10px] uppercase tracking-widest font-black">HW-ID Binding</h4>
              <p className="text-[8px] text-slate-600 uppercase font-black">Session Secured</p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-12 left-12 space-y-2">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex flex-wrap gap-x-6">
            <span>📞 {BYTEWAVE_CONTACT.phone}</span>
            <span>✉️ {BYTEWAVE_CONTACT.email}</span>
            <span>🌐 {BYTEWAVE_CONTACT.website}</span>
          </div>
          <div className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
            Platform Infrastructure provided by {BYTEWAVE_CONTACT.name} System Global
          </div>
        </div>
      </div>

      {/* Auth Interaction Side */}
      <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-8 relative bg-slate-950">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <div className="lg:hidden flex justify-center mb-8">
                <img src={BYTEWAVE_LOGO} className="w-20 h-20 rounded-[2rem] bg-white p-3 object-contain" />
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-3">Terminal Login</h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest text-[10px]">Initialize Secure Node Connection</p>
          </div>

          <div className="flex bg-slate-900 p-1.5 rounded-3xl mb-8 border border-slate-800">
            <button 
              onClick={() => { setRole('OWNER'); if(!rememberMe) { setStoreId(''); setUserId(''); } setPassword(''); }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${role === 'OWNER' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Merchant
            </button>
            <button 
              onClick={() => { setRole('STAFF'); if(!rememberMe) { setStoreId(''); setUserId(''); } setPassword(''); }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${role === 'STAFF' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Staff
            </button>
            <button 
              onClick={() => { setRole('SYSTEM'); setStoreId('CORE'); setUserId('platform_admin'); setPassword(''); }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${role === 'SYSTEM' ? 'bg-slate-700 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Master
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {role !== 'SYSTEM' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">Unique Node ID</label>
                <input
                  type="text"
                  required
                  value={storeId}
                  onChange={(e) => setStoreId(e.target.value)}
                  placeholder="e.g. coffee_hub"
                  className="w-full px-7 py-5 bg-slate-900 border border-slate-800 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-sm text-white placeholder-slate-700"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">
                {role === 'SYSTEM' ? 'Master ID' : role === 'STAFF' ? 'Terminal ID' : 'Merchant ID'}
              </label>
              <input
                type="text"
                required
                disabled={role === 'SYSTEM'}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder={role === 'SYSTEM' ? "platform_admin" : role === 'STAFF' ? "S-001" : "owner@mail.com"}
                className="w-full px-7 py-5 bg-slate-900 border border-slate-800 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-sm text-white disabled:opacity-50 placeholder-slate-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">Access Keyphrase</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-7 py-5 bg-slate-900 border border-slate-800 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-sm text-white placeholder-slate-700"
              />
            </div>

            <div className="flex items-center space-x-3 ml-2 py-2">
              <button 
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-slate-800 bg-slate-900'}`}
              >
                {rememberMe && <span className="text-white text-[10px]">✔</span>}
              </button>
              <label 
                className="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer select-none"
                onClick={() => setRememberMe(!rememberMe)}
              >
                Remember Node Credentials
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-5 text-white font-black rounded-[1.5rem] shadow-2xl transition-all transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center text-[10px] uppercase tracking-[0.2em] mt-8 ${
                role === 'SYSTEM' ? 'bg-slate-700 hover:bg-slate-600 shadow-slate-900/40' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40'
              }`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span>Initialize {role === 'SYSTEM' ? 'Master Hub' : 'Secure Vault'}</span>
              )}
            </button>
          </form>

          <div className="mt-12 text-center space-y-4">
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">
              Authorized Infrastructure Session
            </p>
            <div className="flex flex-col items-center gap-2 opacity-30">
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">System Support</span>
               <span className="text-[10px] font-black text-blue-500">{BYTEWAVE_CONTACT.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
