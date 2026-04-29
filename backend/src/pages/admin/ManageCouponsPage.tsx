import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X } from 'lucide-react';

interface Coupon {
  id: number;
  code: string;
  discount: number;
  type: 'percent' | 'flat';
  expiry: string;
}

const initialCoupons: Coupon[] = [
  { id: 1, code: 'WELCOME50', discount: 50, type: 'percent', expiry: '2024-03-31' },
  { id: 2, code: 'FLAT100', discount: 100, type: 'flat', expiry: '2024-02-28' },
  { id: 3, code: 'YUMMY20', discount: 20, type: 'percent', expiry: '2024-04-15' },
];

const ManageCouponsPage = () => {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Coupons</h1>
        <button onClick={() => setShowModal(true)} className="btn-gradient flex items-center gap-2 text-sm">
          <Plus size={18} /> Add Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon, i) => (
          <motion.div
            key={coupon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl p-6 shadow-card border-l-4 border-primary"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="gradient-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">{coupon.code}</span>
              <button onClick={() => setCoupons(prev => prev.filter(c => c.id !== coupon.id))} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
            <p className="text-2xl font-bold">{coupon.type === 'percent' ? `${coupon.discount}%` : `$${coupon.discount}`} OFF</p>
            <p className="text-xs text-muted-foreground mt-1">Expires: {coupon.expiry}</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card rounded-3xl p-8 z-50 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Add Coupon</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-accent"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <input placeholder="Coupon Code" className="w-full px-4 py-3 rounded-2xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" />
                <input placeholder="Discount" type="number" className="w-full px-4 py-3 rounded-2xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" />
                <input type="date" className="w-full px-4 py-3 rounded-2xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" />
                <button onClick={() => setShowModal(false)} className="w-full btn-gradient py-3 font-bold">Add Coupon</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageCouponsPage;
