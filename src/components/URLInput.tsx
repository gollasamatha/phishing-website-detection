import { useState } from 'react';
import { Search, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface URLInputProps {
  onAnalyze: (url: string) => void;
  isAnalyzing: boolean;
}

export function URLInput({ onAnalyze, isAnalyzing }: URLInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  const exampleUrls = [
    { url: 'https://www.google.com', type: 'safe' },
    { url: 'http://192.168.1.1/login/verify-account', type: 'phishing' },
    { url: 'https://secure-login-paypal.suspicious-domain.com/account', type: 'phishing' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-primary/50 to-primary rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
          <div className="relative flex items-center bg-card rounded-xl border border-border overflow-hidden">
            <div className="pl-4 text-muted-foreground">
              <Search className="w-5 h-5" />
            </div>
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to analyze (e.g., https://example.com)"
              className="flex-1 border-0 bg-transparent text-foreground placeholder:text-muted-foreground font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0 h-14"
            />
            <Button
              type="submit"
              disabled={!url.trim() || isAnalyzing}
              className="m-2 h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-300 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Scanning...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Analyze
                </span>
              )}
            </Button>
          </div>
        </div>
      </form>

      <div className="mt-6">
        <p className="text-muted-foreground text-sm mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Try these examples:
        </p>
        <div className="flex flex-wrap gap-2">
          {exampleUrls.map((example, index) => (
            <button
              key={index}
              onClick={() => {
                setUrl(example.url);
                onAnalyze(example.url);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300 border ${
                example.type === 'safe'
                  ? 'border-safe/30 text-safe hover:bg-safe/10'
                  : 'border-destructive/30 text-destructive hover:bg-destructive/10'
              }`}
            >
              {example.url.length > 40 ? example.url.substring(0, 40) + '...' : example.url}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
