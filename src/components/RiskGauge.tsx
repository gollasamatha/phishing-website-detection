import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface RiskGaugeProps {
  score: number;
  classification: 'legitimate' | 'suspicious' | 'phishing';
}

export function RiskGauge({ score, classification }: RiskGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getGaugeColor = () => {
    switch (classification) {
      case 'legitimate': return 'hsl(var(--safe))';
      case 'suspicious': return 'hsl(var(--warning))';
      case 'phishing': return 'hsl(var(--destructive))';
    }
  };

  const getGlowClass = () => {
    switch (classification) {
      case 'legitimate': return 'drop-shadow-[0_0_20px_hsl(var(--safe)/0.5)]';
      case 'suspicious': return 'drop-shadow-[0_0_20px_hsl(var(--warning)/0.5)]';
      case 'phishing': return 'drop-shadow-[0_0_20px_hsl(var(--destructive)/0.5)]';
    }
  };

  // Calculate the rotation angle (from -135deg to 135deg for 270deg arc)
  const rotation = -135 + (displayScore / 100) * 270;

  return (
    <div className="relative w-48 h-28 mx-auto">
      {/* Background arc */}
      <svg
        viewBox="0 0 200 110"
        className="w-full h-full"
      >
        {/* Background track */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="12"
          strokeLinecap="round"
        />
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--safe))" />
            <stop offset="50%" stopColor="hsl(var(--warning))" />
            <stop offset="100%" stopColor="hsl(var(--destructive))" />
          </linearGradient>
        </defs>

        {/* Progress arc */}
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: displayScore / 100 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Scale markers */}
        {[0, 25, 50, 75, 100].map((mark) => {
          const angle = (-135 + (mark / 100) * 270) * (Math.PI / 180);
          const x = 100 + 95 * Math.cos(angle);
          const y = 100 + 95 * Math.sin(angle);
          return (
            <text
              key={mark}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-[10px] font-mono"
            >
              {mark}
            </text>
          );
        })}
      </svg>

      {/* Needle */}
      <motion.div
        className={`absolute bottom-0 left-1/2 origin-bottom ${getGlowClass()}`}
        style={{ 
          width: '4px', 
          height: '70px',
          marginLeft: '-2px',
          background: getGaugeColor(),
          borderRadius: '2px',
        }}
        initial={{ rotate: -135 }}
        animate={{ rotate: rotation }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Center circle */}
      <div 
        className="absolute bottom-0 left-1/2 w-6 h-6 rounded-full bg-card border-2 transform -translate-x-1/2 translate-y-1/2"
        style={{ borderColor: getGaugeColor() }}
      />

      {/* Score display */}
      <motion.div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span 
          className="text-3xl font-bold font-mono"
          style={{ color: getGaugeColor() }}
        >
          {displayScore}%
        </span>
      </motion.div>
    </div>
  );
}
