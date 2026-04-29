import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
import { foodItems as initialItems, type FoodItem } from '@/data/mockData';

const ManageFoodPage = () => {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Manage Food</h1>
        <button onClick={() => setShowModal(true)} className="btn-gradient flex items-center gap-2 text-sm">
          <Plus size={18} /> Add Food
        </button>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
        />
      </div>

      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Item</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Category</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Price</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Stock</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{item.category}</td>
                  <td className="py-3 px-4 text-right font-semibold text-primary">${item.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={item.stock <= 5 ? 'text-destructive font-semibold' : ''}>{item.stock}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-accent transition-colors"><Edit size={16} /></button>
                      <button onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Food Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card rounded-3xl p-8 z-50 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Add New Food</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-accent"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <input placeholder="Food Name" className="w-full px-4 py-3 rounded-2xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" />
                <input placeholder="Price" type="number" className="w-full px-4 py-3 rounded-2xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" />
                <input placeholder="Category" className="w-full px-4 py-3 rounded-2xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" />
                <textarea placeholder="Description" rows={3} className="w-full px-4 py-3 rounded-2xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground resize-none" />
                <button onClick={() => setShowModal(false)} className="w-full btn-gradient py-3 font-bold">Add Food Item</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageFoodPage;
