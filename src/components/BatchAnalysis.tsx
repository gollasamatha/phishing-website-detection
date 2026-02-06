import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Download, Trash2, Play, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { extractFeatures, analyzeFeatures, calculateRiskScore, classifyURL } from '@/lib/featureExtraction';
import { extractAdvancedFeatures, analyzeAdvancedFeatures, calculateAdvancedRiskScore } from '@/lib/advancedDetection';

interface BatchResult {
  url: string;
  classification: 'legitimate' | 'suspicious' | 'phishing';
  riskScore: number;
  advancedScore: number;
  combinedScore: number;
}

interface BatchAnalysisProps {
  onSingleAnalysis?: (url: string) => void;
}

export function BatchAnalysis({ onSingleAnalysis }: BatchAnalysisProps) {
  const [urls, setUrls] = useState('');
  const [results, setResults] = useState<BatchResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const parseUrls = (text: string): string[] => {
    return text
      .split(/[\n,;]+/)
      .map(url => url.trim())
      .filter(url => url.length > 0);
  };

  const handleAnalyze = async () => {
    const urlList = parseUrls(urls);
    if (urlList.length === 0) return;

    setIsAnalyzing(true);
    setResults([]);
    setProgress(0);

    const batchResults: BatchResult[] = [];

    for (let i = 0; i < urlList.length; i++) {
      const url = urlList[i];
      
      // Extract basic features
      const features = extractFeatures(url);
      const analysis = analyzeFeatures(features);
      const basicScore = calculateRiskScore(analysis);
      
      // Extract advanced features
      const advancedFeatures = extractAdvancedFeatures(url);
      const advancedAnalysis = analyzeAdvancedFeatures(advancedFeatures);
      const advancedScore = calculateAdvancedRiskScore(advancedAnalysis);
      
      // Combined score (weighted average)
      const combinedScore = Math.round((basicScore * 0.4) + (advancedScore * 0.6));
      
      const classification = combinedScore < 25 ? 'legitimate' 
        : combinedScore < 50 ? 'suspicious' 
        : 'phishing';

      batchResults.push({
        url,
        classification,
        riskScore: basicScore,
        advancedScore,
        combinedScore,
      });

      setProgress(((i + 1) / urlList.length) * 100);
      
      // Small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setResults(batchResults);
    setIsAnalyzing(false);
  };

  const exportResults = () => {
    const csv = [
      ['URL', 'Classification', 'Basic Score', 'Advanced Score', 'Combined Score'].join(','),
      ...results.map(r => [
        `"${r.url}"`,
        r.classification.toUpperCase(),
        r.riskScore,
        r.advancedScore,
        r.combinedScore
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phishing-scan-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getIcon = (classification: string) => {
    switch (classification) {
      case 'legitimate': return <CheckCircle className="w-4 h-4 text-safe" />;
      case 'suspicious': return <AlertCircle className="w-4 h-4 text-warning" />;
      case 'phishing': return <XCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const stats = {
    total: results.length,
    legitimate: results.filter(r => r.classification === 'legitimate').length,
    suspicious: results.filter(r => r.classification === 'suspicious').length,
    phishing: results.filter(r => r.classification === 'phishing').length,
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-card/50 backdrop-blur-lg border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Batch URL Analysis</h3>
        </div>

        <Textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder="Enter URLs (one per line, or comma/semicolon separated)&#10;&#10;Example:&#10;https://google.com&#10;http://suspicious-login.xyz/paypal&#10;https://amazon.com"
          className="min-h-[150px] font-mono text-sm bg-background/50 border-border focus:border-primary"
        />

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-muted-foreground">
            {parseUrls(urls).length} URL(s) to analyze
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setUrls(''); setResults([]); }}
              disabled={isAnalyzing}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button
              onClick={handleAnalyze}
              disabled={parseUrls(urls).length === 0 || isAnalyzing}
              className="bg-primary text-primary-foreground"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing... {Math.round(progress)}%
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Analyze All
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        {isAnalyzing && (
          <div className="mt-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card/50 backdrop-blur-lg border border-border rounded-2xl p-6"
          >
            {/* Stats Summary */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-safe/10">
                <div className="text-2xl font-bold text-safe">{stats.legitimate}</div>
                <div className="text-xs text-safe/70">Legitimate</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-warning/10">
                <div className="text-2xl font-bold text-warning">{stats.suspicious}</div>
                <div className="text-xs text-warning/70">Suspicious</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-destructive/10">
                <div className="text-2xl font-bold text-destructive">{stats.phishing}</div>
                <div className="text-xs text-destructive/70">Phishing</div>
              </div>
            </div>

            {/* Export Button */}
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="sm" onClick={exportResults}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {/* Results Table */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`flex items-center gap-4 p-3 rounded-lg border ${
                    result.classification === 'legitimate'
                      ? 'border-safe/20 bg-safe/5'
                      : result.classification === 'suspicious'
                        ? 'border-warning/20 bg-warning/5'
                        : 'border-destructive/20 bg-destructive/5'
                  } hover:border-primary/30 transition-colors cursor-pointer`}
                  onClick={() => onSingleAnalysis?.(result.url)}
                >
                  {getIcon(result.classification)}
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm truncate">{result.url}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Combined</div>
                      <div className={`font-mono font-semibold ${
                        result.classification === 'legitimate'
                          ? 'text-safe'
                          : result.classification === 'suspicious'
                            ? 'text-warning'
                            : 'text-destructive'
                      }`}>
                        {result.combinedScore}%
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                      result.classification === 'legitimate'
                        ? 'bg-safe/20 text-safe'
                        : result.classification === 'suspicious'
                          ? 'bg-warning/20 text-warning'
                          : 'bg-destructive/20 text-destructive'
                    }`}>
                      {result.classification}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
