
import React, { useState, useEffect } from 'react';
import { View, Product, Order, CartItem, ShopConfig, User, Staff } from './types';
import { INITIAL_PRODUCTS, BYTEWAVE_CONTACT } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import POS from './components/POS';
import Login from './components/Login';
import Settings from './components/Settings';
import AdminPanel from './components/AdminPanel';
import InventoryManager from './components/InventoryManager';
import Reports from './components/Reports';
import Receipt from './components/Receipt';
import StaffManager from './components/StaffManager';

const MASTER_ADMIN: User = { id: 'bw_system_001', username: 'platform_admin', role: 'PLATFORM_ADMIN' };

const App: React.FC = () => {
  const [currentView, setView] = useState<View>(View.LOGIN);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeShop, setActiveShop] = useState<ShopConfig | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const [allShops, setAllShops] = useState<ShopConfig[]>(() => {
    const saved = localStorage.getItem('bytewave_master_shops');
    return saved ? JSON.parse(saved) : [];
  });

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeReceipt, setActiveReceipt] = useState<Order | null>(null);

  // Network status listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => { localStorage.setItem('bytewave_master_shops', JSON.stringify(allShops)); }, [allShops]);

  useEffect(() => {
    if (activeShop) {
      const savedOrders = localStorage.getItem(`orders_${activeShop.id}`);
      setOrders(savedOrders ? JSON.parse(savedOrders) : []);
      const savedProducts = localStorage.getItem(`products_${activeShop.id}`);
      setProducts(savedProducts ? JSON.parse(savedProducts) : []);
    }
  }, [activeShop]);

  const handleLogin = (storeId: string, userId: string, password?: string, isStaff?: boolean) => {
    if (storeId === 'CORE' && userId === 'platform_admin') {
      if (password === 'admin' || password === 'bytewave_master_2024') {
         setView(View.ADMIN_PANEL); 
         setCurrentUser(MASTER_ADMIN); 
         setActiveShop(null);
         return;
      } else {
        alert("SECURITY ALERT: System Master password incorrect.");
        return;
      }
    }

    const shop = allShops.find(s => s.id === storeId);
    if (!shop) { alert("SECURITY ERROR: Business Node not found. Ensure Store ID is correct."); return; }
    
    const expiry = new Date(shop.expiryDate);
    if (expiry < new Date()) {
      alert("TERMINAL LOCKED: Subscription has expired. Please contact ByteWave Management for renewal.");
      return;
    }

    if (shop.status === 'suspended') { alert("SUBSCRIPTION SUSPENDED: Connection interrupted by ByteWave billing."); return; }

    if (isStaff) {
      const staffMember = shop.staff.find(m => m.id === userId);
      if (staffMember && staffMember.password === password) {
        setCurrentUser({ id: userId, username: userId, role: 'STAFF', shopId: shop.id, staffName: staffMember.name });
        setActiveShop(shop); setView(View.POS);
      } else {
        alert("AUTH FAILURE: Incorrect Staff Credentials.");
      }
    } else {
      if (shop.email === userId && shop.password === password) {
        setCurrentUser({ id: shop.id, username: shop.email, role: 'SHOP_OWNER', shopId: shop.id });
        setActiveShop(shop); setView(View.DASHBOARD);
      } else {
        alert("AUTH FAILURE: Merchant Email/Password mismatch.");
      }
    }
  };

  const updateShopData = (updatedShop: ShopConfig) => {
    setAllShops(prev => prev.map(s => s.id === updatedShop.id ? updatedShop : s));
    setActiveShop(updatedShop);
  };

  const handleFullUpdateShop = (oldId: string, updatedShop: ShopConfig) => {
    setAllShops(prev => prev.map(s => s.id === oldId ? updatedShop : s));
    if (activeShop?.id === oldId) setActiveShop(updatedShop);
  };

  const handleDeleteShop = (id: string) => {
    setAllShops(prev => prev.filter(s => s.id !== id));
    if (activeShop?.id === id) {
      setCurrentUser(null);
      setActiveShop(null);
      setView(View.LOGIN);
    }
  };

  const handleUpdateActiveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    if (activeShop) localStorage.setItem(`products_${activeShop.id}`, JSON.stringify(newProducts));
  };

  const handleCompleteOrder = (cart: CartItem[], total: number, paymentMethod: Order['paymentMethod']) => {
    if (!activeShop) return;
    const subtotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const tax = subtotal * (activeShop.taxRate / 100);
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      shopId: activeShop.id, 
      items: cart, 
      subtotal, 
      tax, 
      total, 
      timestamp: new Date(), 
      paymentMethod
    };
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem(`orders_${activeShop.id}`, JSON.stringify(updatedOrders));
    
    const updatedProducts = products.map(p => {
      const ci = cart.find(item => item.id === p.id);
      return ci ? { ...p, stock: Math.max(0, p.stock - ci.quantity) } : p;
    });
    handleUpdateActiveProducts(updatedProducts);
    setActiveReceipt(newOrder);
  };

  if (currentView === View.LOGIN) return <Login onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        currentView={currentView} setView={setView} 
        logout={() => { setCurrentUser(null); setActiveShop(null); setView(View.LOGIN); }} 
        currentUser={currentUser} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 relative overflow-hidden flex flex-col">
        {!isOnline && (
          <div className="bg-rose-500 text-white px-4 py-2 text-center text-[10px] font-black uppercase tracking-[0.2em] animate-pulse z-[100]">
            System Offline: Data Sync Paused. Some administrative features disabled.
          </div>
        )}
        <header className="h-16 lg:h-20 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between z-10 no-print">
          <div className="flex items-center space-x-3">
             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">☰</button>
             {activeShop && (
               <div className="flex items-center gap-3">
                 <img src={activeShop.logoUrl} className="w-8 h-8 md:w-10 md:h-10 rounded-xl object-cover shadow-sm border border-slate-100" />
                 <h2 className="font-black text-slate-800 tracking-tight text-sm md:text-base leading-none uppercase">{activeShop.name}</h2>
               </div>
             )}
             {currentUser?.role === 'PLATFORM_ADMIN' && (
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xs">B</div>
                 <h2 className="font-black text-slate-900 tracking-tight text-sm md:text-base uppercase tracking-tighter">ByteWave Hub</h2>
               </div>
             )}
          </div>
          <div className="flex items-center space-x-6">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isOnline ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
              <span className="text-[9px] font-black uppercase tracking-widest">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                {currentUser?.role === 'PLATFORM_ADMIN' ? 'GLOBAL MASTER' : currentUser?.role === 'STAFF' ? `Operator: ${currentUser.staffName}` : `Merchant: ${currentUser?.username}`}
              </p>
              <p className="text-sm font-bold text-slate-800 leading-none uppercase tracking-tighter">NODE_VLT: {currentUser?.shopId || 'MASTER_CORE'}</p>
            </div>
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl border-4 border-slate-50 flex items-center justify-center text-white font-black text-xs md:text-sm shadow-xl ${currentUser?.role === 'PLATFORM_ADMIN' ? 'bg-indigo-600' : 'bg-slate-900'}`}>
              {currentUser?.role === 'PLATFORM_ADMIN' ? 'M' : currentUser?.role === 'STAFF' ? 'S' : 'B'}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50/50 custom-scrollbar">
          {currentView === View.DASHBOARD && <Dashboard orders={orders} inventory={products} shop={activeShop} />}
          {currentView === View.POS && activeShop && <POS products={products} shop={activeShop} onCompleteOrder={handleCompleteOrder} />}
          {currentView === View.INVENTORY && activeShop && <InventoryManager products={products} shop={activeShop} onUpdate={handleUpdateActiveProducts} />}
          {currentView === View.STAFF_MGMT && activeShop && <StaffManager shop={activeShop} onUpdateStaff={(staff) => updateShopData({...activeShop, staff})} />}
          {currentView === View.REPORTS && activeShop && <Reports orders={orders} shop={activeShop} />}
          {currentView === View.SETTINGS && activeShop && <Settings config={activeShop} onUpdate={updateShopData} />}
          {currentView === View.ADMIN_PANEL && (
            <AdminPanel 
              isOnline={isOnline}
              shops={allShops} 
              onAddShop={(d) => {
                if (!isOnline) { alert("OFFLINE ERROR: Cannot deploy new nodes while disconnected."); return; }
                if (allShops.some(s => s.id === d.id)) {
                   alert("SECURITY CONFLICT: A business node with this ID already exists.");
                   return;
                }
                const newShopId = d.id || `node_${Math.random().toString(36).substr(2, 5)}`;
                const newShop: ShopConfig = {
                  id: newShopId, name: d.name || 'New Enterprise', ownerName: d.ownerName || 'Unknown Owner',
                  email: d.email || '', password: d.password || 'bytewave123',
                  logoUrl: `https://picsum.photos/seed/${newShopId}/200/200`,
                  address: 'Awaiting Physical Address Configuration', phone: '000-000-0000', currency: '$', taxRate: 10,
                  status: 'active', subscriptionType: d.subscriptionType || 'Pro', createdAt: new Date(), 
                  expiryDate: d.expiryDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
                  staff: []
                };
                setAllShops(prev => [newShop, ...prev]);
              }} 
              onUpdateShop={handleFullUpdateShop}
              onUpdateShopStatus={(id, status) => {
                if (!isOnline) { alert("OFFLINE ERROR: Cannot change node status without sync."); return; }
                setAllShops(s => s.map(x => x.id === id ? { ...x, status } : x));
              }}
              onDeleteShop={handleDeleteShop}
            />
          )}
        </div>

        <footer className="h-12 bg-white border-t border-slate-100 px-8 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-slate-400 uppercase tracking-widest font-black">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`}></div>
            Managed by <span className="text-blue-600">{BYTEWAVE_CONTACT.name}</span> System Global
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-[8px] md:text-[10px] text-slate-400 uppercase tracking-widest font-black">
              {BYTEWAVE_CONTACT.website}
            </div>
          </div>
        </footer>
      </main>

      {activeReceipt && activeShop && <Receipt order={activeReceipt} shop={activeShop} onClose={() => setActiveReceipt(null)} />}
    </div>
  );
};

export default App;
