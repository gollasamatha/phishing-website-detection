import { Shield, Lock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <div className="text-center mb-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center justify-center p-4 mb-6 rounded-2xl bg-primary/10 border border-primary/20 glow-primary"
      >
        <Shield className="w-12 h-12 text-primary animate-pulse-glow" />
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
      >
        <span className="text-foreground">Phishing </span>
        <span className="text-gradient-safe">Detection</span>
        <span className="text-foreground"> System</span>
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
      >
        Advanced URL analysis using rule-based detection to identify potential phishing websites. 
        Protect yourself from malicious links.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap justify-center gap-6"
      >
        {[
          { icon: Shield, label: 'Real-time Analysis', desc: 'Instant URL scanning' },
          { icon: Lock, label: 'Security Features', desc: '10+ detection parameters' },
          { icon: Eye, label: 'Transparent Results', desc: 'Detailed breakdown' },
        ].map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-card border border-border"
          >
            <feature.icon className="w-5 h-5 text-primary" />
            <div className="text-left">
              <p className="font-semibold text-foreground text-sm">{feature.label}</p>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
