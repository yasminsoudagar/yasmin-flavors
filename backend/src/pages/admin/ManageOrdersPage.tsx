import React from 'react';
import { motion } from 'framer-motion';
import { mockOrders } from '@/data/mockData';

const ManageOrdersPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>
      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Order ID</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Address</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-4 font-medium">{order.id}</td>
                  <td className="py-3 px-4 text-muted-foreground">{order.date}</td>
                  <td className="py-3 px-4 text-muted-foreground">{order.address}</td>
                  <td className="py-3 px-4">
                    <select
                      defaultValue={order.status}
                      className="px-3 py-1.5 rounded-xl bg-muted border border-border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="out-for-delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold">${order.total.toFixed(2)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageOrdersPage;
