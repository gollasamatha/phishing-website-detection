import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Eye, Lock, Globe, Fingerprint, Link2, Zap } from 'lucide-react';
import { AdvancedAnalysis } from '@/lib/advancedDetection';

interface ThreatIndicatorsProps {
  analysis: AdvancedAnalysis[];
}

const categoryIcons: Record<string, typeof AlertTriangle> = {
  entropy: Zap,
  impersonation: Fingerprint,
  structure: Link2,
  reputation: Globe,
};

const categoryLabels: Record<string, string> = {
  entropy: 'Entropy Analysis',
  impersonation: 'Impersonation Detection',
  structure: 'URL Structure',
  reputation: 'Domain Reputation',
};

export function ThreatIndicators({ analysis }: ThreatIndicatorsProps) {
  // Group analysis by category
  const groupedAnalysis = analysis.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, AdvancedAnalysis[]>);

  const getDangerCount = (items: AdvancedAnalysis[]) => 
    items.filter(i => i.riskLevel === 'danger').length;
  
  const getWarningCount = (items: AdvancedAnalysis[]) => 
    items.filter(i => i.riskLevel === 'warning').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Eye className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Advanced Threat Analysis</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(groupedAnalysis).map(([category, items], categoryIndex) => {
          const CategoryIcon = categoryIcons[category] || AlertTriangle;
          const dangerCount = getDangerCount(items);
          const warningCount = getWarningCount(items);
          const hasThreat = dangerCount > 0 || warningCount > 0;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className={`rounded-xl border p-4 ${
                dangerCount > 0
                  ? 'border-destructive/30 bg-destructive/5'
                  : warningCount > 0
                    ? 'border-warning/30 bg-warning/5'
                    : 'border-safe/30 bg-safe/5'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CategoryIcon className={`w-4 h-4 ${
                    dangerCount > 0
                      ? 'text-destructive'
                      : warningCount > 0
                        ? 'text-warning'
                        : 'text-safe'
                  }`} />
                  <span className="font-semibold text-sm">
                    {categoryLabels[category] || category}
                  </span>
                </div>
                {hasThreat && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    dangerCount > 0
                      ? 'bg-destructive/20 text-destructive'
                      : 'bg-warning/20 text-warning'
                  }`}>
                    {dangerCount > 0 ? `${dangerCount} critical` : `${warningCount} warning`}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {items.map((item, index) => (
                  <motion.div
                    key={item.feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
                    className={`flex items-start gap-2 p-2 rounded-lg ${
                      item.riskLevel === 'danger'
                        ? 'bg-destructive/10'
                        : item.riskLevel === 'warning'
                          ? 'bg-warning/10'
                          : 'bg-safe/10'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      item.riskLevel === 'danger'
                        ? 'bg-destructive animate-pulse'
                        : item.riskLevel === 'warning'
                          ? 'bg-warning'
                          : 'bg-safe'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium truncate">{item.feature}</span>
                        <span className={`text-xs font-mono ${
                          item.riskLevel === 'danger'
                            ? 'text-destructive'
                            : item.riskLevel === 'warning'
                              ? 'text-warning'
                              : 'text-safe'
                        }`}>
                          {typeof item.value === 'boolean' 
                            ? item.value ? 'YES' : 'NO'
                            : item.value}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
