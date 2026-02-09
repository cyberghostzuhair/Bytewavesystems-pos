
import React, { useState } from 'react';
import { Product, CartItem, ShopConfig, Order } from '../types';
import { CATEGORIES } from '../constants';

interface POSProps {
  products: Product[];
  shop: ShopConfig;
  onCompleteOrder: (cart: CartItem[], total: number, paymentMethod: Order['paymentMethod']) => void;
}

const POS: React.FC<POSProps> = ({ products, shop, onCompleteOrder }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('Card');

  const filteredProducts = products.filter(p => 
    (filter === 'All' || p.category === filter) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    if (navigator.vibrate) navigator.vibrate(20);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * (shop.taxRate / 100);
  const total = subtotal + tax;

  const paymentOptions: { id: Order['paymentMethod']; icon: string; label: string }[] = [
    { id: 'Card', icon: '💳', label: 'Credit Card' },
    { id: 'Cash', icon: '💵', label: 'Physical Cash' },
    { id: 'Digital', icon: '📱', label: 'Digital Pay' },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full animate-fadeIn relative overflow-hidden bg-slate-50">
      {/* Product Search & Grid */}
      <div className={`flex-1 flex flex-col min-h-0 ${showMobileCart ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-4 md:p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Search catalog by name..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium shadow-sm transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                    filter === cat ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200 hover:border-blue-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-24 custom-scrollbar">
          {filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-20 opacity-40">
              <span className="text-6xl mb-4">📦</span>
              <p className="font-black uppercase tracking-widest text-xs">Inventory empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {filteredProducts.map(product => (
                <div 
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white p-3 rounded-3xl border border-slate-100 hover:border-blue-300 hover:shadow-xl transition-all cursor-pointer group flex flex-col active:scale-95"
                >
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-2xl">
                    <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  </div>
                  <div className="px-1">
                    <h4 className="font-black text-slate-800 text-sm leading-tight mb-1 truncate uppercase tracking-tight">{product.name}</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-600 font-black text-sm">{shop.currency}{product.price.toFixed(2)}</span>
                      <span className={`text-[9px] font-bold uppercase ${product.stock < 10 ? 'text-rose-500' : 'text-slate-300'}`}>
                        {product.stock} Units
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart Panel */}
      <div className={`lg:w-[420px] bg-white border-l border-slate-200 flex flex-col h-full ${showMobileCart ? 'fixed inset-0 z-50 flex' : 'hidden lg:flex'}`}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Register Node</h3>
          <button onClick={() => setShowMobileCart(false)} className="lg:hidden p-2 text-slate-400">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <span className="text-6xl mb-4">🧾</span>
              <p className="font-black uppercase tracking-widest text-[10px]">Awaiting Items</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 items-center bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100 group animate-fadeIn">
                <img src={item.image} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-black text-slate-800 truncate uppercase tracking-tight">{item.name}</h5>
                  <p className="text-xs font-bold text-blue-600">{shop.currency}{(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black">-</button>
                  <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black">+</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>Subtotal</span>
              <span>{shop.currency}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-black text-slate-900 pt-2 tracking-tighter">
              <span>TOTAL</span>
              <span>{shop.currency}{total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {paymentOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => setPaymentMethod(opt.id)}
                className={`flex flex-col items-center py-3 rounded-2xl border-2 transition-all ${
                  paymentMethod === opt.id ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-200 bg-white text-slate-400'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-tight">{opt.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          <button 
            disabled={cart.length === 0}
            onClick={() => { onCompleteOrder(cart, total, paymentMethod); setCart([]); }}
            className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl disabled:bg-slate-200 disabled:text-slate-400 active:scale-95 transition-all"
          >
            Finalize Transaction
          </button>
        </div>
      </div>

      {/* Floating View Cart Trigger */}
      <button 
        onClick={() => setShowMobileCart(true)}
        className={`lg:hidden fixed bottom-6 right-6 p-5 bg-slate-900 text-white rounded-full shadow-2xl z-40 transition-all active:scale-90 ${showMobileCart ? 'scale-0' : 'scale-100'}`}
      >
        <span className="font-black text-[10px] tracking-widest uppercase">Cart ({cart.length})</span>
      </button>
    </div>
  );
};

export default POS;
