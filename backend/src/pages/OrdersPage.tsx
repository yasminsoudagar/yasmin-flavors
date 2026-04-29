import React from 'react';
import { motion } from 'framer-motion';
import { Package, ChefHat, Truck, CheckCircle } from 'lucide-react';
import { mockOrders } from '@/data/mockData';
import Footer from '@/components/Footer';

const statusSteps = [
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'out-for-delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Package },
];

const getStepIndex = (status: string) => statusSteps.findIndex(s => s.key === status);

const OrdersPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero pt-28 pb-12">
        <div className="container mx-auto px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-2">
            My <span className="gradient-text">Orders</span>
          </motion.h1>
          <p className="text-muted-foreground">Track your delicious deliveries</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {mockOrders.map((order, i) => {
            const currentStep = getStepIndex(order.status);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-card"
              >
                <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                  <div>
                    <h3 className="font-bold text-lg">{order.id}</h3>
                    <p className="text-sm text-muted-foreground">{order.date} • {order.address}</p>
                  </div>
                  <span className="gradient-primary text-primary-foreground text-sm font-semibold px-4 py-1.5 rounded-full">
                    ${order.total.toFixed(2)}
                  </span>
                </div>

                {/* Progress Stepper */}
                <div className="flex items-center justify-between relative">
                  {/* Line */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
                  <div
                    className="absolute top-5 left-0 h-0.5 gradient-primary transition-all duration-500"
                    style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                  />

                  {statusSteps.map((step, j) => {
                    const Icon = step.icon;
                    const isActive = j <= currentStep;
                    return (
                      <div key={step.key} className="flex flex-col items-center relative z-10">
                        <motion.div
                          initial={false}
                          animate={{ scale: isActive ? 1 : 0.8 }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isActive ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <Icon size={18} />
                        </motion.div>
                        <span className={`text-xs mt-2 font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrdersPage;
