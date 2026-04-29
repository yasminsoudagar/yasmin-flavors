import React from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, Heart } from 'lucide-react';
import type { FoodItem } from '@/data/mockData';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface FoodCardProps {
  item: FoodItem;
  index?: number;
}

const FoodCard = ({ item, index = 0 }: FoodCardProps) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const wishlisted = isInWishlist(item.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="food-card bg-card group"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
        
        {/* Discount Badge */}
        {item.discount > 0 && (
          <div className="absolute top-3 left-3 gradient-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
            {item.discount}% OFF
          </div>
        )}

        {/* Stock Badge */}
        {item.stock <= 5 && (
          <div className="absolute top-3 right-12 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full">
            Only {item.stock} left
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={() => toggleItem(item)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
        >
          <Heart size={16} className={wishlisted ? 'fill-secondary text-secondary' : 'text-muted-foreground'} />
        </button>

        {/* Veg Indicator */}
        <div className={`absolute bottom-3 left-3 w-5 h-5 rounded-sm border-2 flex items-center justify-center ${item.isVeg ? 'border-green-500' : 'border-destructive'}`}>
          <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-destructive'}`} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-card-foreground truncate">{item.name}</h3>
        <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{item.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="text-sm font-semibold">{item.rating}</span>
          <span className="text-xs text-muted-foreground">({item.reviews})</span>
        </div>

        {/* Price & Add */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
            {item.originalPrice > item.price && (
              <span className="text-xs text-muted-foreground line-through">${item.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => addItem(item)}
            className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground shadow-lg hover:shadow-glow transition-shadow"
          >
            <Plus size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard;
