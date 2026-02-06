// Advanced Detection Module for Phishing Detection
// Implements typosquatting detection, homograph attacks, entropy analysis, and domain reputation

export interface AdvancedFeatures {
  entropyScore: number;
  hasHomographChars: boolean;
  typosquattingScore: number;
  suspiciousTLD: boolean;
  domainAge: 'new' | 'established' | 'unknown';
  redirectRisk: boolean;
  portAnomalies: boolean;
  punycodeDomain: boolean;
  brandImpersonation: string | null;
  shortenedURL: boolean;
}

export interface AdvancedAnalysis {
  feature: string;
  value: string | number | boolean;
  riskLevel: 'safe' | 'warning' | 'danger';
  description: string;
  weight: number;
  category: 'entropy' | 'impersonation' | 'structure' | 'reputation';
}

// Popular brands commonly targeted in phishing
const TARGET_BRANDS = [
  { name: 'PayPal', patterns: ['paypal', 'paypa1', 'paypai', 'paypaI', 'pаypal'] },
  { name: 'Amazon', patterns: ['amazon', 'amaz0n', 'amazоn', 'arnazon'] },
  { name: 'Apple', patterns: ['apple', 'app1e', 'аpple', 'appIe'] },
  { name: 'Microsoft', patterns: ['microsoft', 'micr0soft', 'micrоsoft'] },
  { name: 'Google', patterns: ['google', 'g00gle', 'goog1e', 'goоgle'] },
  { name: 'Netflix', patterns: ['netflix', 'netf1ix', 'netfIix'] },
  { name: 'Facebook', patterns: ['facebook', 'faceb00k', 'fаcebook'] },
  { name: 'Instagram', patterns: ['instagram', 'instagran', '1nstagram'] },
  { name: 'Twitter', patterns: ['twitter', 'twltter', 'tw1tter'] },
  { name: 'LinkedIn', patterns: ['linkedin', 'linkedln', 'l1nkedin'] },
  { name: 'Chase', patterns: ['chase', 'chas3', 'chаse'] },
  { name: 'Bank of America', patterns: ['bankofamerica', 'bank0famerica'] },
  { name: 'Wells Fargo', patterns: ['wellsfargo', 'we11sfargo'] },
];

// Suspicious TLDs commonly used in phishing
const SUSPICIOUS_TLDS = [
  '.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.club', 
  '.work', '.date', '.loan', '.online', '.site', '.website',
  '.space', '.win', '.bid', '.stream', '.racing', '.download'
];

// URL shortener domains
const URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd',
  'buff.ly', 'j.mp', 'short.link', 'rb.gy', 'cutt.ly', 'shorturl.at'
];

// Homograph characters (Cyrillic, etc. that look like Latin)
const HOMOGRAPH_MAP: Record<string, string> = {
  'а': 'a', 'е': 'e', 'о': 'o', 'р': 'p', 'с': 'c', 'у': 'y', 'х': 'x',
  'і': 'i', 'ј': 'j', 'ѕ': 's', 'ԁ': 'd', 'ԛ': 'q', 'ɡ': 'g', 'ν': 'v',
  '0': 'o', '1': 'l', '3': 'e', '4': 'a', '5': 's', '8': 'b'
};

/**
 * Calculate Shannon entropy of a string
 * Higher entropy = more random/suspicious
 */
export function calculateEntropy(str: string): number {
  const len = str.length;
  if (len === 0) return 0;
  
  const charFreq: Record<string, number> = {};
  for (const char of str) {
    charFreq[char] = (charFreq[char] || 0) + 1;
  }
  
  let entropy = 0;
  for (const char in charFreq) {
    const freq = charFreq[char] / len;
    entropy -= freq * Math.log2(freq);
  }
  
  return Math.round(entropy * 100) / 100;
}

/**
 * Check for homograph characters in domain
 */
export function detectHomographs(domain: string): boolean {
  const homographChars = Object.keys(HOMOGRAPH_MAP);
  return homographChars.some(char => domain.includes(char));
}

/**
 * Calculate typosquatting similarity score
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

/**
 * Detect potential brand impersonation
 */
export function detectBrandImpersonation(url: string): string | null {
  const lowerUrl = url.toLowerCase();
  
  for (const brand of TARGET_BRANDS) {
    // Check if it contains a typosquatted version
    for (const pattern of brand.patterns) {
      if (lowerUrl.includes(pattern)) {
        // Check if it's on the official domain
        const officialDomain = `${brand.patterns[0]}.com`;
        if (!lowerUrl.includes(officialDomain)) {
          return brand.name;
        }
      }
    }
    
    // Check Levenshtein distance for similar domains
    const domainMatch = url.match(/(?:https?:\/\/)?(?:www\.)?([^\/]+)/i);
    if (domainMatch) {
      const domain = domainMatch[1].split('.')[0].toLowerCase();
      const distance = levenshteinDistance(domain, brand.patterns[0]);
      const similarity = 1 - (distance / Math.max(domain.length, brand.patterns[0].length));
      
      if (similarity > 0.7 && similarity < 1) {
        return brand.name;
      }
    }
  }
  
  return null;
}

/**
 * Check if domain uses a suspicious TLD
 */
export function checkSuspiciousTLD(url: string): boolean {
  const lowerUrl = url.toLowerCase();
  return SUSPICIOUS_TLDS.some(tld => lowerUrl.endsWith(tld) || lowerUrl.includes(tld + '/'));
}

/**
 * Check if URL is a shortened URL
 */
export function isShortenerURL(url: string): boolean {
  const lowerUrl = url.toLowerCase();
  return URL_SHORTENERS.some(shortener => lowerUrl.includes(shortener));
}

/**
 * Check for Punycode domain (IDN homograph attack)
 */
export function isPunycodeDomain(url: string): boolean {
  return url.toLowerCase().includes('xn--');
}

/**
 * Check for non-standard port usage
 */
export function hasPortAnomalies(url: string): boolean {
  const portMatch = url.match(/:(\d+)/);
  if (portMatch) {
    const port = parseInt(portMatch[1]);
    const normalPorts = [80, 443, 8080, 8443];
    return !normalPorts.includes(port);
  }
  return false;
}

/**
 * Check for multiple redirects indicator
 */
export function hasRedirectIndicators(url: string): boolean {
  const redirectPatterns = [
    /redirect[=\/]/i,
    /redir[=\/]/i,
    /url[=\/]http/i,
    /goto[=\/]/i,
    /return[=\/]http/i,
    /next[=\/]http/i,
    /continue[=\/]http/i,
  ];
  return redirectPatterns.some(pattern => pattern.test(url));
}

/**
 * Calculate typosquatting risk score
 */
export function calculateTyposquattingScore(url: string): number {
  let score = 0;
  const lowerUrl = url.toLowerCase();
  
  // Check for number substitutions
  if (/[0-9]/.test(lowerUrl.split('/')[0])) {
    score += 20;
  }
  
  // Check for brand similarity
  if (detectBrandImpersonation(url)) {
    score += 40;
  }
  
  // Check for homographs
  if (detectHomographs(url)) {
    score += 30;
  }
  
  // Check for doubled/repeated characters suggesting typos
  if (/(.)\1{2,}/.test(url)) {
    score += 10;
  }
  
  return Math.min(100, score);
}

/**
 * Extract advanced features from URL
 */
export function extractAdvancedFeatures(url: string): AdvancedFeatures {
  let hostname = '';
  
  try {
    const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
    const parsedUrl = new URL(urlWithProtocol);
    hostname = parsedUrl.hostname;
  } catch {
    hostname = url.split('/')[0];
  }
  
  const entropy = calculateEntropy(hostname);
  
  return {
    entropyScore: entropy,
    hasHomographChars: detectHomographs(hostname),
    typosquattingScore: calculateTyposquattingScore(url),
    suspiciousTLD: checkSuspiciousTLD(url),
    domainAge: 'unknown', // Would require external API in production
    redirectRisk: hasRedirectIndicators(url),
    portAnomalies: hasPortAnomalies(url),
    punycodeDomain: isPunycodeDomain(url),
    brandImpersonation: detectBrandImpersonation(url),
    shortenedURL: isShortenerURL(url),
  };
}

/**
 * Analyze advanced features and return detailed analysis
 */
export function analyzeAdvancedFeatures(features: AdvancedFeatures): AdvancedAnalysis[] {
  const analysis: AdvancedAnalysis[] = [];
  
  // Entropy Analysis
  analysis.push({
    feature: 'Domain Entropy',
    value: features.entropyScore,
    riskLevel: features.entropyScore > 4 ? 'danger' : features.entropyScore > 3 ? 'warning' : 'safe',
    description: features.entropyScore > 4
      ? 'High randomness in domain suggests auto-generated phishing domain'
      : features.entropyScore > 3
        ? 'Moderate entropy - domain may be suspicious'
        : 'Normal domain entropy',
    weight: features.entropyScore > 4 ? 2.5 : features.entropyScore > 3 ? 1 : 0,
    category: 'entropy',
  });
  
  // Homograph Attack Detection
  analysis.push({
    feature: 'Homograph Characters',
    value: features.hasHomographChars,
    riskLevel: features.hasHomographChars ? 'danger' : 'safe',
    description: features.hasHomographChars
      ? 'Contains lookalike characters (Cyrillic/special) - IDN homograph attack'
      : 'No suspicious lookalike characters',
    weight: features.hasHomographChars ? 3 : 0,
    category: 'impersonation',
  });
  
  // Brand Impersonation
  analysis.push({
    feature: 'Brand Impersonation',
    value: features.brandImpersonation || 'None',
    riskLevel: features.brandImpersonation ? 'danger' : 'safe',
    description: features.brandImpersonation
      ? `Appears to impersonate ${features.brandImpersonation} - likely phishing`
      : 'No brand impersonation detected',
    weight: features.brandImpersonation ? 3.5 : 0,
    category: 'impersonation',
  });
  
  // Typosquatting Score
  analysis.push({
    feature: 'Typosquatting Risk',
    value: `${features.typosquattingScore}%`,
    riskLevel: features.typosquattingScore > 50 ? 'danger' : features.typosquattingScore > 20 ? 'warning' : 'safe',
    description: features.typosquattingScore > 50
      ? 'High typosquatting risk - domain mimics legitimate site'
      : features.typosquattingScore > 20
        ? 'Moderate typosquatting indicators detected'
        : 'Low typosquatting risk',
    weight: features.typosquattingScore > 50 ? 2.5 : features.typosquattingScore > 20 ? 1 : 0,
    category: 'impersonation',
  });
  
  // Suspicious TLD
  analysis.push({
    feature: 'Suspicious TLD',
    value: features.suspiciousTLD,
    riskLevel: features.suspiciousTLD ? 'warning' : 'safe',
    description: features.suspiciousTLD
      ? 'Uses a TLD commonly associated with phishing/spam'
      : 'TLD is not typically associated with phishing',
    weight: features.suspiciousTLD ? 1.5 : 0,
    category: 'reputation',
  });
  
  // Punycode Domain
  analysis.push({
    feature: 'Punycode (xn--) Domain',
    value: features.punycodeDomain,
    riskLevel: features.punycodeDomain ? 'danger' : 'safe',
    description: features.punycodeDomain
      ? 'Internationalized domain name - potential IDN attack vector'
      : 'Standard ASCII domain',
    weight: features.punycodeDomain ? 2 : 0,
    category: 'impersonation',
  });
  
  // URL Shortener
  analysis.push({
    feature: 'Shortened URL',
    value: features.shortenedURL,
    riskLevel: features.shortenedURL ? 'warning' : 'safe',
    description: features.shortenedURL
      ? 'URL shortener detected - destination hidden'
      : 'Not a shortened URL',
    weight: features.shortenedURL ? 1.5 : 0,
    category: 'structure',
  });
  
  // Redirect Indicators
  analysis.push({
    feature: 'Redirect Patterns',
    value: features.redirectRisk,
    riskLevel: features.redirectRisk ? 'warning' : 'safe',
    description: features.redirectRisk
      ? 'URL contains redirect parameters - may lead elsewhere'
      : 'No suspicious redirect patterns',
    weight: features.redirectRisk ? 1 : 0,
    category: 'structure',
  });
  
  // Port Anomalies
  analysis.push({
    feature: 'Port Anomalies',
    value: features.portAnomalies,
    riskLevel: features.portAnomalies ? 'warning' : 'safe',
    description: features.portAnomalies
      ? 'Non-standard port used - unusual for legitimate sites'
      : 'Standard port usage',
    weight: features.portAnomalies ? 1 : 0,
    category: 'structure',
  });
  
  return analysis;
}

/**
 * Calculate combined risk score from advanced features
 */
export function calculateAdvancedRiskScore(analysis: AdvancedAnalysis[]): number {
  const totalWeight = analysis.reduce((sum, item) => sum + item.weight, 0);
  const maxPossibleWeight = 18; // Sum of all maximum weights
  return Math.min(100, Math.round((totalWeight / maxPossibleWeight) * 100));
}
