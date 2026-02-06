import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, ExternalLink, Clock, Shield, ShieldAlert, ShieldX, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScanHistory, ScanHistoryItem } from '@/hooks/useScanHistory';

interface ScanHistoryProps {
  onSelectUrl?: (url: string) => void;
}

export function ScanHistory({ onSelectUrl }: ScanHistoryProps) {
  const { history, clearHistory, removeItem, getStats } = useScanHistory();
  const stats = getStats();

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getIcon = (classification: string) => {
    switch (classification) {
      case 'legitimate': return <Shield className="w-4 h-4 text-safe" />;
      case 'suspicious': return <ShieldAlert className="w-4 h-4 text-warning" />;
      case 'phishing': return <ShieldX className="w-4 h-4 text-destructive" />;
    }
  };

  if (history.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-card/50 backdrop-blur-lg border border-border rounded-2xl p-8 text-center">
          <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Scan History</h3>
          <p className="text-muted-foreground text-sm">
            Your scanned URLs will appear here for easy reference.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Stats Overview */}
      <div className="bg-card/50 backdrop-blur-lg border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Scan Statistics</h3>
          </div>
          <Button variant="outline" size="sm" onClick={clearHistory}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="text-center p-4 rounded-xl bg-muted/50">
            <div className="text-3xl font-bold text-foreground">{stats.total}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Scans</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-safe/10">
            <div className="text-3xl font-bold text-safe">{stats.legitimate}</div>
            <div className="text-xs text-safe/70 mt-1">Legitimate</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-warning/10">
            <div className="text-3xl font-bold text-warning">{stats.suspicious}</div>
            <div className="text-xs text-warning/70 mt-1">Suspicious</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-destructive/10">
            <div className="text-3xl font-bold text-destructive">{stats.phishing}</div>
            <div className="text-xs text-destructive/70 mt-1">Phishing</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-primary/10">
            <div className="text-3xl font-bold text-primary">{stats.avgRisk}%</div>
            <div className="text-xs text-primary/70 mt-1">Avg Risk</div>
          </div>
        </div>

        {/* Visual Distribution */}
        <div className="mt-6">
          <div className="text-sm text-muted-foreground mb-2">Threat Distribution</div>
          <div className="h-3 rounded-full overflow-hidden flex bg-muted">
            {stats.legitimate > 0 && (
              <motion.div
                className="h-full bg-safe"
                initial={{ width: 0 }}
                animate={{ width: `${(stats.legitimate / stats.total) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            )}
            {stats.suspicious > 0 && (
              <motion.div
                className="h-full bg-warning"
                initial={{ width: 0 }}
                animate={{ width: `${(stats.suspicious / stats.total) * 100}%` }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />
            )}
            {stats.phishing > 0 && (
              <motion.div
                className="h-full bg-destructive"
                initial={{ width: 0 }}
                animate={{ width: `${(stats.phishing / stats.total) * 100}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            )}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-safe" /> Legitimate
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-warning" /> Suspicious
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-destructive" /> Phishing
            </span>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="bg-card/50 backdrop-blur-lg border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <History className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Recent Scans</h3>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          <AnimatePresence>
            {history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.02 }}
                className={`group flex items-center gap-4 p-3 rounded-lg border ${
                  item.classification === 'legitimate'
                    ? 'border-safe/20 bg-safe/5'
                    : item.classification === 'suspicious'
                      ? 'border-warning/20 bg-warning/5'
                      : 'border-destructive/20 bg-destructive/5'
                } hover:border-primary/30 transition-all cursor-pointer`}
                onClick={() => onSelectUrl?.(item.url)}
              >
                {getIcon(item.classification)}
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm truncate">{item.url}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatDate(item.timestamp)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`font-mono font-semibold ${
                      item.classification === 'legitimate'
                        ? 'text-safe'
                        : item.classification === 'suspicious'
                          ? 'text-warning'
                          : 'text-destructive'
                    }`}>
                      {item.riskScore}%
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
