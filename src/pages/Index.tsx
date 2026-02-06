import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSection } from '@/components/HeroSection';
import { URLInput } from '@/components/URLInput';
import { AnalysisResult } from '@/components/AnalysisResult';
import { EducationalSection } from '@/components/EducationalSection';
import { BatchAnalysis } from '@/components/BatchAnalysis';
import { ScanHistory } from '@/components/ScanHistory';
import { Footer } from '@/components/Footer';
import { 
  extractFeatures, 
  analyzeFeatures, 
  calculateRiskScore, 
  classifyURL,
  type FeatureAnalysis 
} from '@/lib/featureExtraction';
import {
  extractAdvancedFeatures,
  analyzeAdvancedFeatures,
  calculateAdvancedRiskScore,
  type AdvancedAnalysis
} from '@/lib/advancedDetection';
import { useScanHistory } from '@/hooks/useScanHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Layers, History, BookOpen } from 'lucide-react';

interface AnalysisState {
  url: string;
  classification: 'legitimate' | 'suspicious' | 'phishing';
  riskScore: number;
  analysis: FeatureAnalysis[];
  advancedAnalysis: AdvancedAnalysis[];
  advancedScore: number;
  combinedScore: number;
}

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisState | null>(null);
  const [activeTab, setActiveTab] = useState('single');
  const { addScan } = useScanHistory();

  const handleAnalyze = async (url: string) => {
    setIsAnalyzing(true);
    setResult(null);
    setActiveTab('single');

    // Simulate analysis delay for UX
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Extract basic features from URL
    const features = extractFeatures(url);
    const analysis = analyzeFeatures(features);
    const riskScore = calculateRiskScore(analysis);
    const classification = classifyURL(riskScore);

    // Extract advanced features
    const advancedFeatures = extractAdvancedFeatures(url);
    const advancedAnalysis = analyzeAdvancedFeatures(advancedFeatures);
    const advancedScore = calculateAdvancedRiskScore(advancedAnalysis);

    // Combined score (weighted: 40% basic, 60% advanced)
    const combinedScore = Math.round((riskScore * 0.4) + (advancedScore * 0.6));
    const finalClassification = combinedScore < 25 ? 'legitimate' 
      : combinedScore < 50 ? 'suspicious' 
      : 'phishing';

    // Add to history
    addScan(url, finalClassification, combinedScore);

    setResult({
      url,
      classification: finalClassification,
      riskScore,
      analysis,
      advancedAnalysis,
      advancedScore,
      combinedScore,
    });

    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background cyber-grid">
      {/* Animated background gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <main className="flex-1 container mx-auto px-4 py-12 relative z-10">
        <HeroSection />
        
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto mt-8">
          <TabsList className="grid grid-cols-4 gap-2 bg-card/50 backdrop-blur-lg p-1 rounded-xl border border-border">
            <TabsTrigger 
              value="single" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Single URL</span>
            </TabsTrigger>
            <TabsTrigger 
              value="batch"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Batch</span>
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger 
              value="learn"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Learn</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="mt-8">
            <URLInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            
            <AnimatePresence mode="wait">
              {result && (
                <AnalysisResult
                  url={result.url}
                  classification={result.classification}
                  riskScore={result.riskScore}
                  analysis={result.analysis}
                  advancedAnalysis={result.advancedAnalysis}
                  advancedScore={result.advancedScore}
                  combinedScore={result.combinedScore}
                />
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="batch" className="mt-8">
            <BatchAnalysis onSingleAnalysis={handleAnalyze} />
          </TabsContent>

          <TabsContent value="history" className="mt-8">
            <ScanHistory onSelectUrl={handleAnalyze} />
          </TabsContent>

          <TabsContent value="learn" className="mt-8">
            <EducationalSection />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
