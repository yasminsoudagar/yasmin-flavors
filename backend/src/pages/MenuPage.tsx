import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import FoodCard from '@/components/FoodCard';
import Footer from '@/components/Footer';
import { foodItems, categories } from '@/data/mockData';

const MenuPage = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');

  const filtered = useMemo(() => {
    let items = [...foodItems];
    if (search) items = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase()));
    if (activeCategory !== 'All') items = items.filter(i => i.category === activeCategory);
    if (isVegOnly) items = items.filter(i => i.isVeg);
    if (sortBy === 'price-low') items.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') items.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') items.sort((a, b) => b.rating - a.rating);
    return items;
  }, [search, activeCategory, isVegOnly, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero pt-28 pb-12">
        <div className="container mx-auto px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-2">
            Our <span className="gradient-text">Menu</span>
          </motion.h1>
          <p className="text-muted-foreground mb-6">Discover flavors that make every bite special</p>

          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search your favorite food..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border shadow-card focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 flex-1">
            {['All', ...categories.map(c => c.name)].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'gradient-primary text-primary-foreground shadow-lg'
                    : 'bg-card border border-border hover:border-primary text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Veg Toggle */}
          <button
            onClick={() => setIsVegOnly(!isVegOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              isVegOnly ? 'border-green-500 bg-green-500/10 text-green-600' : 'border-border bg-card text-foreground'
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${isVegOnly ? 'bg-green-500' : 'bg-muted-foreground'}`} />
            Veg Only
          </button>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 rounded-full text-sm font-medium border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-semibold mb-2">No dishes found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item, i) => (
              <FoodCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MenuPage;
