import { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { URLInput } from '@/components/URLInput';
import { AnalysisResult } from '@/components/AnalysisResult';
import { EducationalSection } from '@/components/EducationalSection';
import { Footer } from '@/components/Footer';
import { 
  extractFeatures, 
  analyzeFeatures, 
  calculateRiskScore, 
  classifyURL,
  type FeatureAnalysis 
} from '@/lib/featureExtraction';

interface AnalysisState {
  url: string;
  classification: 'legitimate' | 'suspicious' | 'phishing';
  riskScore: number;
  analysis: FeatureAnalysis[];
}

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisState | null>(null);

  const handleAnalyze = async (url: string) => {
    setIsAnalyzing(true);
    setResult(null);

    // Simulate analysis delay for UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Extract features from URL
    const features = extractFeatures(url);
    
    // Analyze each feature
    const analysis = analyzeFeatures(features);
    
    // Calculate overall risk score
    const riskScore = calculateRiskScore(analysis);
    
    // Classify the URL
    const classification = classifyURL(riskScore);

    setResult({
      url,
      classification,
      riskScore,
      analysis,
    });

    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background cyber-grid">
      <main className="flex-1 container mx-auto px-4 py-12">
        <HeroSection />
        <URLInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        
        {result && (
          <AnalysisResult
            url={result.url}
            classification={result.classification}
            riskScore={result.riskScore}
            analysis={result.analysis}
          />
        )}

        {!result && <EducationalSection />}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
