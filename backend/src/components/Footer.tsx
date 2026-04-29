import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="gradient-footer text-muted-foreground dark:text-muted-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🌸</span>
              <span className="text-2xl font-bold text-white">Yasmin Flavors</span>
            </div>
            <p className="text-sm leading-relaxed opacity-80">
              Where Every Bite Feels Special. Experience the finest flavors delivered right to your doorstep.
            </p>
            <div className="flex gap-3 mt-6">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Icon size={18} className="text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {['Home', 'Menu', 'Orders', 'Wishlist'].map(item => (
                <Link key={item} to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-sm opacity-80 hover:opacity-100 hover:text-white transition-all">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2 opacity-80">
                <MapPin size={16} /> <span>123 Flavor Street, Food City</span>
              </div>
              <div className="flex items-center gap-2 opacity-80">
                <Phone size={16} /> <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 opacity-80">
                <Mail size={16} /> <span>hello@yasminflavors.com</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-sm opacity-80 mb-4">Subscribe for exclusive deals and new menu updates!</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/50 text-sm focus:outline-none focus:border-white/30"
              />
              <button className="btn-gradient text-sm px-4 py-2">Go</button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm opacity-60">
          <p>© 2024 Yasmin Flavors 🌸 — Where Every Bite Feels Special</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
