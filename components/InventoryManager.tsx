
import React, { useState } from 'react';
import { Product, ShopConfig } from '../types';

interface InventoryManagerProps {
  products: Product[];
  shop: ShopConfig;
  onUpdate: (products: Product[]) => void;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({ products, shop, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});

  const handleDelete = (id: string) => {
    if (confirm('Permanently decommission this item?')) {
      onUpdate(products.filter(p => p.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) return;
    
    if (editingId) {
      onUpdate(products.map(p => p.id === editingId ? { ...p, ...formData } as Product : p));
    } else {
      const newProduct: Product = {
        id: `prod_${Date.now()}`,
        name: formData.name || '',
        price: Number(formData.price),
        category: formData.category || 'General',
        stock: Number(formData.stock || 0),
        image: formData.image || 'https://picsum.photos/seed/new/200/200'
      };
      onUpdate([newProduct, ...products]);
    }
    setEditingId(null);
    setIsAdding(false);
    setFormData({});
  };

  const startEdit = (product: Product) => {
    setFormData(product);
    setEditingId(product.id);
    setIsAdding(true);
  };

  return (
    <div className="p-4 md:p-10 space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Catalog Registry</h2>
          <p className="text-slate-500 font-medium tracking-tight">Manage the node inventory database</p>
        </div>
        <button 
          onClick={() => { setFormData({}); setEditingId(null); setIsAdding(true); }}
          className="w-full md:w-auto bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-black shadow-xl active:scale-95 transition-all text-xs uppercase tracking-widest"
        >
          + Provision New Item
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="relative mb-5">
              <img src={p.image} className="w-full h-44 rounded-3xl object-cover shadow-sm group-hover:brightness-75 transition-all" alt="" />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(p)} className="p-3 bg-white rounded-2xl shadow-xl text-blue-600 hover:scale-110 active:scale-90 transition-all">✏️</button>
                <button onClick={() => handleDelete(p.id)} className="p-3 bg-white rounded-2xl shadow-xl text-rose-500 hover:scale-110 active:scale-90 transition-all">🗑️</button>
              </div>
            </div>
            <div className="flex-1 px-1">
              <div className="flex justify-between items-start mb-1">
                <span className="font-black text-slate-800 text-sm uppercase tracking-tight truncate w-3/4">{p.name}</span>
                <span className="text-blue-600 font-black text-sm">{shop.currency}{p.price.toFixed(2)}</span>
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">{p.category}</p>
              
              <div className="flex justify-between text-[9px] font-black text-slate-500 mb-2 uppercase tracking-widest">
                <span>Stock Utilization</span>
                <span>{p.stock} Units</span>
              </div>
              <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                <div className={`h-full transition-all duration-1000 ${p.stock < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, p.stock)}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-10 animate-scaleIn overflow-y-auto max-h-[90vh]">
            <h3 className="text-3xl font-black mb-8 text-slate-900 tracking-tighter">
              {editingId ? 'Modify Provisioning' : 'Provision New Item'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Descriptor</label>
                <input 
                  type="text" 
                  value={formData.name || ''} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  placeholder="Product Title"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Unit Price</label>
                <input 
                  type="number" 
                  value={formData.price || ''} 
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Inventory Level</label>
                <input 
                  type="number" 
                  value={formData.stock || ''} 
                  onChange={e => setFormData({...formData, stock: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Category</label>
                <input 
                  type="text" 
                  value={formData.category || ''} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  placeholder="e.g. Coffee, Snacks"
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Media Resource URL</label>
                <input 
                  type="text" 
                  value={formData.image || ''} 
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
                  placeholder="https://images.domain.com/item.jpg"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-10">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-5 font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest text-[10px]">Abandon</button>
              <button onClick={handleSave} className="flex-2 px-12 py-5 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 shadow-2xl shadow-blue-200 text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all">
                Synchronize Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
