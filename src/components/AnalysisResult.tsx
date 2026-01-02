import { Shield, ShieldAlert, ShieldX, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { FeatureAnalysis } from '@/lib/featureExtraction';
import { motion } from 'framer-motion';

interface AnalysisResultProps {
  url: string;
  classification: 'legitimate' | 'suspicious' | 'phishing';
  riskScore: number;
  analysis: FeatureAnalysis[];
}

export function AnalysisResult({ url, classification, riskScore, analysis }: AnalysisResultProps) {
  const getClassificationStyles = () => {
    switch (classification) {
      case 'legitimate':
        return {
          icon: Shield,
          bgClass: 'bg-safe/10 border-safe/30',
          textClass: 'text-safe',
          glowClass: 'glow-safe',
          label: 'LEGITIMATE',
          description: 'This URL appears to be safe and legitimate.',
        };
      case 'suspicious':
        return {
          icon: ShieldAlert,
          bgClass: 'bg-warning/10 border-warning/30',
          textClass: 'text-warning',
          glowClass: '',
          label: 'SUSPICIOUS',
          description: 'This URL shows some warning signs. Proceed with caution.',
        };
      case 'phishing':
        return {
          icon: ShieldX,
          bgClass: 'bg-destructive/10 border-destructive/30',
          textClass: 'text-destructive',
          glowClass: 'glow-danger',
          label: 'PHISHING DETECTED',
          description: 'This URL shows strong indicators of being a phishing attempt.',
        };
    }
  };

  const styles = getClassificationStyles();
  const Icon = styles.icon;

  const getRiskLevelIcon = (level: 'safe' | 'warning' | 'danger') => {
    switch (level) {
      case 'safe':
        return <CheckCircle className="w-4 h-4 text-safe" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case 'danger':
        return <XCircle className="w-4 h-4 text-destructive" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto mt-8"
    >
      {/* Main Result Card */}
      <div className={`rounded-2xl border p-8 ${styles.bgClass} ${styles.glowClass} transition-all duration-500`}>
        <div className="flex items-center gap-6">
          <div className={`p-4 rounded-xl ${styles.bgClass} animate-pulse-glow`}>
            <Icon className={`w-12 h-12 ${styles.textClass}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className={`text-2xl font-bold font-mono ${styles.textClass}`}>
                {styles.label}
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles.bgClass} ${styles.textClass}`}>
                Risk: {riskScore}%
              </span>
            </div>
            <p className="text-muted-foreground">{styles.description}</p>
            <p className="font-mono text-sm mt-2 text-foreground/70 break-all">
              {url}
            </p>
          </div>
        </div>

        {/* Risk Score Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Risk Assessment</span>
            <span className={styles.textClass}>{riskScore}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${riskScore}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className={`h-full rounded-full ${
                classification === 'legitimate'
                  ? 'bg-safe'
                  : classification === 'suspicious'
                    ? 'bg-warning'
                    : 'bg-destructive'
              }`}
            />
          </div>
          <div className="flex justify-between text-xs mt-1 text-muted-foreground">
            <span>Safe</span>
            <span>Suspicious</span>
            <span>Phishing</span>
          </div>
        </div>
      </div>

      {/* Feature Analysis */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-primary">{'<'}</span>
          Feature Analysis
          <span className="text-primary">{'/>'}</span>
        </h3>
        <div className="grid gap-3">
          {analysis.map((item, index) => (
            <motion.div
              key={item.feature}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5">
                  {getRiskLevelIcon(item.riskLevel)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="font-semibold text-foreground">{item.feature}</h4>
                    <span className={`font-mono text-sm px-2 py-0.5 rounded ${
                      item.riskLevel === 'safe'
                        ? 'bg-safe/10 text-safe'
                        : item.riskLevel === 'warning'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-destructive/10 text-destructive'
                    }`}>
                      {typeof item.value === 'boolean' 
                        ? item.value ? 'Yes' : 'No'
                        : item.value}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
