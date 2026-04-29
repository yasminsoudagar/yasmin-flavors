import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, Truck } from 'lucide-react';
import FoodCard from '@/components/FoodCard';
import Footer from '@/components/Footer';
import { categories, foodItems, testimonials, specialOffers } from '@/data/mockData';

const floatingFoods = ['🍔', '🍕', '🍣', '🍰', '🍜', '🌮', '🍩', '🥤'];

const HeroSection = () => (
  <section className="relative min-h-screen gradient-hero flex items-center overflow-hidden">
    {/* Floating food icons */}
    {floatingFoods.map((food, i) => (
      <motion.span
        key={i}
        className={`absolute text-4xl md:text-6xl opacity-20 select-none ${
          i % 2 === 0 ? 'floating' : i % 3 === 0 ? 'floating-delay-1' : 'floating-delay-2'
        }`}
        style={{
          top: `${10 + (i * 12) % 70}%`,
          left: `${5 + (i * 15) % 85}%`,
        }}
      >
        {food}
      </motion.span>
    ))}

    <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block gradient-primary text-primary-foreground text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            🌸 #1 Food Delivery App
          </span>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Delicious Food,
            <br />
            <span className="gradient-text">Delivered Fast</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg">
            Where Every Bite Feels Special. Explore hundreds of curated dishes from the best restaurants in town.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/menu">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-gradient py-4 px-8 text-lg flex items-center gap-2 animate-pulse-glow"
              >
                Order Now <ArrowRight size={20} />
              </motion.button>
            </Link>
            <Link to="/menu">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Explore Menu
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-wrap gap-8 mt-12"
        >
          {[
            { icon: Star, label: '4.9 Rating', sub: '10K+ reviews' },
            { icon: Clock, label: '30 Min', sub: 'Fast delivery' },
            { icon: Truck, label: 'Free Delivery', sub: 'Orders $25+' },
          ].map(({ icon: Icon, label, sub }, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground">
                <Icon size={22} />
              </div>
              <div>
                <p className="font-bold">{label}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

const CategoriesSection = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Popular <span className="gradient-text">Categories</span></h2>
        <p className="text-muted-foreground">Explore your favorite cuisine</p>
      </motion.div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.08, y: -5 }}
            className="flex flex-col items-center p-5 rounded-2xl bg-card shadow-card cursor-pointer hover:shadow-card-hover transition-shadow"
          >
            <span className="text-4xl mb-2">{cat.icon}</span>
            <span className="font-semibold text-sm">{cat.name}</span>
            <span className="text-xs text-muted-foreground">{cat.count} items</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const TrendingSection = () => (
  <section className="py-20 bg-muted/30">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Trending <span className="gradient-text">Dishes</span></h2>
          <p className="text-muted-foreground">Most loved by our foodies</p>
        </div>
        <Link to="/menu" className="btn-gradient text-sm px-5 py-2.5 hidden md:flex items-center gap-2">
          View All <ArrowRight size={16} />
        </Link>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {foodItems.slice(0, 8).map((item, i) => (
          <FoodCard key={item.id} item={item} index={i} />
        ))}
      </div>
      <div className="mt-8 text-center md:hidden">
        <Link to="/menu" className="btn-gradient text-sm px-6 py-3 inline-flex items-center gap-2">View All Menu <ArrowRight size={16} /></Link>
      </div>
    </div>
  </section>
);

const OffersSection = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Special <span className="gradient-text">Offers</span></h2>
        <p className="text-muted-foreground">Don't miss out on these deals!</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {specialOffers.map((offer, i) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, x: i === 0 ? -30 : i === 2 ? 30 : 0, y: i === 1 ? 30 : 0 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            className={`gradient-primary rounded-2xl p-8 text-primary-foreground cursor-pointer`}
          >
            <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
            <p className="opacity-90">{offer.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section className="py-20 bg-muted/30">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">What Our <span className="gradient-text">Foodies Say</span></h2>
        <p className="text-muted-foreground">Real reviews from real food lovers</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card p-6 rounded-2xl shadow-card"
          >
            <div className="flex items-center gap-3 mb-4">
              <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.date}</p>
              </div>
            </div>
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{t.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const DownloadSection = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="gradient-primary rounded-3xl p-12 text-primary-foreground text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Get the Yasmin Flavors App 🌸</h2>
        <p className="text-lg opacity-90 mb-8 max-w-lg mx-auto">Download now and get 50% off your first order. Available on iOS and Android.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-8 py-4 bg-card/20 backdrop-blur-sm rounded-2xl font-semibold hover:bg-card/30 transition-colors">
            📱 App Store
          </button>
          <button className="px-8 py-4 bg-card/20 backdrop-blur-sm rounded-2xl font-semibold hover:bg-card/30 transition-colors">
            🤖 Google Play
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoriesSection />
      <TrendingSection />
      <OffersSection />
      <TestimonialsSection />
      <DownloadSection />
      <Footer />
    </div>
  );
};

export default Index;
