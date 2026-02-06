import { Shield, ShieldAlert, ShieldX, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FeatureAnalysis } from '@/lib/featureExtraction';
import { AdvancedAnalysis } from '@/lib/advancedDetection';
import { motion, AnimatePresence } from 'framer-motion';
import { RiskGauge } from './RiskGauge';
import { ThreatIndicators } from './ThreatIndicators';
import { useState } from 'react';

interface AnalysisResultProps {
  url: string;
  classification: 'legitimate' | 'suspicious' | 'phishing';
  riskScore: number;
  analysis: FeatureAnalysis[];
  advancedAnalysis?: AdvancedAnalysis[];
  advancedScore?: number;
  combinedScore?: number;
}

export function AnalysisResult({ 
  url, 
  classification, 
  riskScore, 
  analysis,
  advancedAnalysis,
  advancedScore,
  combinedScore
}: AnalysisResultProps) {
  const [showBasicAnalysis, setShowBasicAnalysis] = useState(false);
  const [showAdvancedAnalysis, setShowAdvancedAnalysis] = useState(true);

  const displayScore = combinedScore ?? riskScore;
  const displayClassification = combinedScore 
    ? (combinedScore < 25 ? 'legitimate' : combinedScore < 50 ? 'suspicious' : 'phishing')
    : classification;

  const getClassificationStyles = () => {
    switch (displayClassification) {
      case 'legitimate':
        return {
          icon: Shield,
          bgClass: 'bg-safe/10 border-safe/30',
          textClass: 'text-safe',
          glowClass: 'shadow-[0_0_30px_-5px_hsl(var(--safe)/0.3)]',
          label: 'LEGITIMATE',
          description: 'This URL appears to be safe and legitimate.',
        };
      case 'suspicious':
        return {
          icon: ShieldAlert,
          bgClass: 'bg-warning/10 border-warning/30',
          textClass: 'text-warning',
          glowClass: 'shadow-[0_0_30px_-5px_hsl(var(--warning)/0.3)]',
          label: 'SUSPICIOUS',
          description: 'This URL shows some warning signs. Proceed with caution.',
        };
      case 'phishing':
        return {
          icon: ShieldX,
          bgClass: 'bg-destructive/10 border-destructive/30',
          textClass: 'text-destructive',
          glowClass: 'shadow-[0_0_30px_-5px_hsl(var(--destructive)/0.3)]',
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
      {/* Main Result Card - Glassmorphism Style */}
      <div className={`rounded-2xl border backdrop-blur-lg p-8 ${styles.bgClass} ${styles.glowClass} transition-all duration-500`}>
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Risk Gauge */}
          <div className="flex-shrink-0">
            <RiskGauge score={displayScore} classification={displayClassification} />
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-2">
              <div className={`p-3 rounded-xl ${styles.bgClass} animate-pulse`}>
                <Icon className={`w-8 h-8 ${styles.textClass}`} />
              </div>
              <div>
                <h2 className={`text-2xl font-bold font-mono ${styles.textClass}`}>
                  {styles.label}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">{styles.description}</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 rounded-lg bg-background/50 border border-border">
              <p className="font-mono text-sm text-foreground/80 break-all">
                {url}
              </p>
            </div>

            {/* Score Breakdown */}
            {advancedScore !== undefined && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="text-center p-2 rounded-lg bg-background/30">
                  <div className="text-xs text-muted-foreground">Basic</div>
                  <div className="font-mono font-bold">{riskScore}%</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-background/30">
                  <div className="text-xs text-muted-foreground">Advanced</div>
                  <div className="font-mono font-bold">{advancedScore}%</div>
                </div>
                <div className={`text-center p-2 rounded-lg ${styles.bgClass}`}>
                  <div className="text-xs text-muted-foreground">Combined</div>
                  <div className={`font-mono font-bold ${styles.textClass}`}>{displayScore}%</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Threat Analysis */}
      {advancedAnalysis && advancedAnalysis.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-card/50 backdrop-blur-lg border border-border rounded-2xl p-6"
        >
          <button
            onClick={() => setShowAdvancedAnalysis(!showAdvancedAnalysis)}
            className="w-full flex items-center justify-between mb-4"
          >
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="text-primary">{'<'}</span>
              Advanced Threat Detection
              <span className="text-primary">{'/>'}</span>
            </h3>
            {showAdvancedAnalysis ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          <AnimatePresence>
            {showAdvancedAnalysis && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <ThreatIndicators analysis={advancedAnalysis} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Basic Feature Analysis - Collapsible */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 bg-card/50 backdrop-blur-lg border border-border rounded-2xl p-6"
      >
        <button
          onClick={() => setShowBasicAnalysis(!showBasicAnalysis)}
          className="w-full flex items-center justify-between"
        >
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-primary">{'<'}</span>
            URL Feature Analysis
            <span className="text-primary">{'/>'}</span>
          </h3>
          {showBasicAnalysis ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        <AnimatePresence>
          {showBasicAnalysis && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4"
            >
              <div className="grid gap-3">
                {analysis.map((item, index) => (
                  <motion.div
                    key={item.feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="bg-background/50 border border-border rounded-xl p-4 hover:border-primary/30 transition-all duration-300"
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
