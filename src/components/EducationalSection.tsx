import { AlertTriangle, CheckCircle, Info, Code } from 'lucide-react';
import { motion } from 'framer-motion';

export function EducationalSection() {
  const phishingIndicators = [
    { indicator: 'Long URLs (>75 characters)', risk: 'high' },
    { indicator: '@ symbol in URL', risk: 'high' },
    { indicator: 'IP address instead of domain', risk: 'high' },
    { indicator: 'Multiple subdomains (>3)', risk: 'high' },
    { indicator: 'Dash (-) in domain name', risk: 'medium' },
    { indicator: 'Missing HTTPS', risk: 'medium' },
    { indicator: 'Encoded characters (%20, %3D)', risk: 'medium' },
    { indicator: 'Suspicious keywords (login, verify)', risk: 'medium' },
  ];

  const safeIndicators = [
    'HTTPS protocol enabled',
    'Simple, short domain name',
    'No special characters in domain',
    'Known trusted domain',
    'No excessive subdomains',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-16 grid md:grid-cols-2 gap-8"
    >
      {/* Phishing Indicators */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-destructive/10">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Phishing Indicators</h3>
        </div>
        <ul className="space-y-3">
          {phishingIndicators.map((item, index) => (
            <li key={index} className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${
                item.risk === 'high' ? 'bg-destructive' : 'bg-warning'
              }`} />
              <span className="text-sm text-muted-foreground">{item.indicator}</span>
              <span className={`ml-auto text-xs px-2 py-0.5 rounded ${
                item.risk === 'high' 
                  ? 'bg-destructive/10 text-destructive' 
                  : 'bg-warning/10 text-warning'
              }`}>
                {item.risk}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Safe Indicators */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-safe/10">
            <CheckCircle className="w-5 h-5 text-safe" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Legitimate URL Signs</h3>
        </div>
        <ul className="space-y-3">
          {safeIndicators.map((item, index) => (
            <li key={index} className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-safe" />
              <span className="text-sm text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* How It Works */}
      <div className="md:col-span-2 bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Code className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground">How Detection Works</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Feature Extraction',
              description: 'The URL is parsed and analyzed for key characteristics like length, special characters, and domain structure.',
            },
            {
              step: '02',
              title: 'Rule-Based Analysis',
              description: 'Each feature is evaluated against known phishing patterns and assigned a risk weight.',
            },
            {
              step: '03',
              title: 'Risk Calculation',
              description: 'All weights are combined to produce a final risk score and classification.',
            },
          ].map((item, index) => (
            <div key={index} className="relative">
              <span className="text-4xl font-bold text-primary/20 font-mono">{item.step}</span>
              <h4 className="font-semibold text-foreground mt-2">{item.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="md:col-span-2 bg-muted/50 border border-border rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Educational Disclaimer:</strong> This tool is designed for 
          educational purposes only. It uses rule-based heuristics and may not catch all phishing attempts. 
          Always exercise caution when clicking on unfamiliar links and verify URLs manually when in doubt.
        </p>
      </div>
    </motion.div>
  );
}
