import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card rounded-3xl p-8 shadow-xl"
      >
        <div className="text-center mb-8">
          <span className="text-4xl">🌸</span>
          <h1 className="text-2xl font-bold mt-3">Welcome Back!</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to Yasmin Flavors</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
            />
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-border accent-primary" />
              <span className="text-muted-foreground">Remember me</span>
            </label>
            <a href="#" className="text-primary font-medium hover:underline">Forgot password?</a>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-gradient py-4 font-bold text-lg"
          >
            Sign In
          </motion.button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-card px-3 text-muted-foreground">or continue with</span></div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-border hover:bg-muted transition-colors font-medium">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Google
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
