import { motion } from 'framer-motion';
import { Shield, Zap, Brain, Lock } from 'lucide-react';

export function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      {/* Animated Logo */}
      <motion.div
        className="relative inline-block mb-6"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
        <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 backdrop-blur-lg">
          <Shield className="w-16 h-16 text-primary" />
        </div>
      </motion.div>

      {/* Title with gradient */}
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        <span className="text-gradient-safe">
          PhishGuard
        </span>
        <span className="text-foreground"> Pro</span>
      </h1>
      
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
        Advanced AI-powered phishing detection with{' '}
        <span className="text-primary font-semibold">20+ detection algorithms</span>,{' '}
        typosquatting analysis, and homograph attack prevention.
      </p>

      {/* Feature badges */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border backdrop-blur-sm"
        >
          <Zap className="w-4 h-4 text-warning" />
          <span className="text-sm">Real-time Analysis</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border backdrop-blur-sm"
        >
          <Brain className="w-4 h-4 text-primary" />
          <span className="text-sm">20+ Detection Features</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border backdrop-blur-sm"
        >
          <Lock className="w-4 h-4 text-safe" />
          <span className="text-sm">Privacy First</span>
        </motion.div>
      </div>

      {/* Code-style decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="font-mono text-sm text-muted-foreground"
      >
        <span className="text-primary">{'const'}</span>
        {' security = '}
        <span className="text-safe">{'await'}</span>
        {' analyze('}
        <span className="text-warning">url</span>
        {');'}
      </motion.div>
    </motion.div>
  );
}
