import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import Footer from '@/components/Footer';

const WishlistPage = () => {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero pt-28 pb-12">
        <div className="container mx-auto px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-2">
            My <span className="gradient-text">Wishlist</span>
          </motion.h1>
          <p className="text-muted-foreground">{items.length} saved items</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">❤️</span>
            <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground">Save your favorite dishes to order later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl overflow-hidden shadow-card group"
              >
                <div className="relative">
                  <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-primary font-bold mt-1">${item.price.toFixed(2)}</p>
                  <div className="flex gap-2 mt-3">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => { addItem(item); removeItem(item.id); }}
                      className="flex-1 btn-gradient text-sm py-2 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={16} /> Move to Cart
                    </motion.button>
                    <button onClick={() => removeItem(item.id)} className="p-2 rounded-xl border border-border hover:bg-destructive/10 hover:text-destructive transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;
