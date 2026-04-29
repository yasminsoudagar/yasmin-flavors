import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const getStrength = (p: string) => {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
};

const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = ['bg-destructive', 'bg-amber-500', 'bg-amber-400', 'bg-green-500'];

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const strength = getStrength(password);

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card rounded-3xl p-8 shadow-xl"
      >
        <div className="text-center mb-8">
          <span className="text-4xl">🌸</span>
          <h1 className="text-2xl font-bold mt-3">Create Account</h1>
          <p className="text-muted-foreground text-sm mt-1">Join Yasmin Flavors today</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input type="text" placeholder="Full name" className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input type="email" placeholder="Email address" className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
            />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Strength meter */}
          {password && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < strength ? strengthColors[strength - 1] : 'bg-muted'}`} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Password strength: {strength > 0 ? strengthLabels[strength - 1] : 'Too short'}</p>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-gradient py-4 font-bold text-lg"
          >
            Create Account
          </motion.button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
