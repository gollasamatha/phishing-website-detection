// Feature Extraction Module for Phishing Detection
// Analyzes URL characteristics to identify potential phishing attempts

export interface URLFeatures {
  urlLength: number;
  hasAtSymbol: boolean;
  hasDoubleSlash: boolean;
  hasDash: boolean;
  hasIPAddress: boolean;
  isHTTPS: boolean;
  subdomainCount: number;
  hasMultipleSubdomains: boolean;
  hasSuspiciousKeywords: boolean;
  domainLength: number;
  pathLength: number;
  hasEncodedChars: boolean;
  hasTooManyDots: boolean;
}

export interface FeatureAnalysis {
  feature: string;
  value: string | number | boolean;
  riskLevel: 'safe' | 'warning' | 'danger';
  description: string;
  weight: number;
}

const SUSPICIOUS_KEYWORDS = [
  'login', 'signin', 'verify', 'account', 'update', 'secure',
  'banking', 'paypal', 'ebay', 'amazon', 'apple', 'microsoft',
  'google', 'facebook', 'instagram', 'netflix', 'password',
  'confirm', 'suspend', 'wallet', 'credit', 'debit'
];

const IP_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

export function extractFeatures(url: string): URLFeatures {
  let parsedUrl: URL;
  
  try {
    // Add protocol if missing for parsing
    const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
    parsedUrl = new URL(urlWithProtocol);
  } catch {
    // If URL parsing fails, analyze the raw string
    return {
      urlLength: url.length,
      hasAtSymbol: url.includes('@'),
      hasDoubleSlash: url.includes('//') && url.indexOf('//') !== url.indexOf('://') - 1,
      hasDash: url.includes('-'),
      hasIPAddress: IP_REGEX.test(url.split('/')[0]),
      isHTTPS: url.toLowerCase().startsWith('https'),
      subdomainCount: 0,
      hasMultipleSubdomains: false,
      hasSuspiciousKeywords: SUSPICIOUS_KEYWORDS.some(kw => url.toLowerCase().includes(kw)),
      domainLength: url.length,
      pathLength: 0,
      hasEncodedChars: url.includes('%'),
      hasTooManyDots: (url.match(/\./g) || []).length > 4,
    };
  }

  const hostname = parsedUrl.hostname;
  const path = parsedUrl.pathname;
  const fullUrl = parsedUrl.href;

  // Count subdomains
  const domainParts = hostname.split('.');
  const subdomainCount = Math.max(0, domainParts.length - 2);

  // Check for IP address
  const hasIPAddress = IP_REGEX.test(hostname);

  // Check for double slash after protocol
  const afterProtocol = fullUrl.substring(fullUrl.indexOf('://') + 3);
  const hasDoubleSlash = afterProtocol.includes('//');

  return {
    urlLength: fullUrl.length,
    hasAtSymbol: fullUrl.includes('@'),
    hasDoubleSlash,
    hasDash: hostname.includes('-'),
    hasIPAddress,
    isHTTPS: parsedUrl.protocol === 'https:',
    subdomainCount,
    hasMultipleSubdomains: subdomainCount > 2,
    hasSuspiciousKeywords: SUSPICIOUS_KEYWORDS.some(kw => 
      fullUrl.toLowerCase().includes(kw)
    ),
    domainLength: hostname.length,
    pathLength: path.length,
    hasEncodedChars: fullUrl.includes('%'),
    hasTooManyDots: (hostname.match(/\./g) || []).length > 4,
  };
}

export function analyzeFeatures(features: URLFeatures): FeatureAnalysis[] {
  const analysis: FeatureAnalysis[] = [];

  // URL Length Analysis
  analysis.push({
    feature: 'URL Length',
    value: features.urlLength,
    riskLevel: features.urlLength > 75 ? 'danger' : features.urlLength > 54 ? 'warning' : 'safe',
    description: features.urlLength > 75 
      ? 'Excessively long URLs are often used to hide malicious content'
      : features.urlLength > 54 
        ? 'Moderately long URL - could be suspicious'
        : 'Normal URL length',
    weight: features.urlLength > 75 ? 2 : features.urlLength > 54 ? 1 : 0,
  });

  // @ Symbol Analysis
  analysis.push({
    feature: '@ Symbol Present',
    value: features.hasAtSymbol,
    riskLevel: features.hasAtSymbol ? 'danger' : 'safe',
    description: features.hasAtSymbol 
      ? '@ symbol in URL can redirect to a different site'
      : 'No @ symbol detected',
    weight: features.hasAtSymbol ? 3 : 0,
  });

  // Double Slash Analysis
  analysis.push({
    feature: 'Double Slash (//) in Path',
    value: features.hasDoubleSlash,
    riskLevel: features.hasDoubleSlash ? 'warning' : 'safe',
    description: features.hasDoubleSlash 
      ? 'Unusual double slash pattern detected'
      : 'No suspicious slash patterns',
    weight: features.hasDoubleSlash ? 1.5 : 0,
  });

  // Dash in Domain Analysis
  analysis.push({
    feature: 'Dash (-) in Domain',
    value: features.hasDash,
    riskLevel: features.hasDash ? 'warning' : 'safe',
    description: features.hasDash 
      ? 'Dashes in domain names are often used in phishing (e.g., secure-login-bank.com)'
      : 'No dashes in domain',
    weight: features.hasDash ? 1 : 0,
  });

  // IP Address Analysis
  analysis.push({
    feature: 'IP Address Instead of Domain',
    value: features.hasIPAddress,
    riskLevel: features.hasIPAddress ? 'danger' : 'safe',
    description: features.hasIPAddress 
      ? 'IP address used instead of domain name - highly suspicious'
      : 'Normal domain name used',
    weight: features.hasIPAddress ? 3 : 0,
  });

  // HTTPS Analysis
  analysis.push({
    feature: 'HTTPS Protocol',
    value: features.isHTTPS,
    riskLevel: features.isHTTPS ? 'safe' : 'warning',
    description: features.isHTTPS 
      ? 'Secure HTTPS connection'
      : 'No HTTPS - connection is not encrypted',
    weight: features.isHTTPS ? 0 : 1.5,
  });

  // Subdomain Analysis
  analysis.push({
    feature: 'Subdomain Count',
    value: features.subdomainCount,
    riskLevel: features.hasMultipleSubdomains ? 'danger' : features.subdomainCount > 1 ? 'warning' : 'safe',
    description: features.hasMultipleSubdomains 
      ? 'Too many subdomains - common phishing technique'
      : features.subdomainCount > 1 
        ? 'Multiple subdomains detected'
        : 'Normal subdomain structure',
    weight: features.hasMultipleSubdomains ? 2.5 : features.subdomainCount > 1 ? 1 : 0,
  });

  // Suspicious Keywords Analysis
  analysis.push({
    feature: 'Suspicious Keywords',
    value: features.hasSuspiciousKeywords,
    riskLevel: features.hasSuspiciousKeywords ? 'warning' : 'safe',
    description: features.hasSuspiciousKeywords 
      ? 'Contains keywords commonly used in phishing'
      : 'No suspicious keywords detected',
    weight: features.hasSuspiciousKeywords ? 1.5 : 0,
  });

  // Encoded Characters Analysis
  analysis.push({
    feature: 'Encoded Characters',
    value: features.hasEncodedChars,
    riskLevel: features.hasEncodedChars ? 'warning' : 'safe',
    description: features.hasEncodedChars 
      ? 'URL contains encoded characters - may hide malicious content'
      : 'No suspicious encoding',
    weight: features.hasEncodedChars ? 1 : 0,
  });

  return analysis;
}

export function calculateRiskScore(analysis: FeatureAnalysis[]): number {
  const totalWeight = analysis.reduce((sum, item) => sum + item.weight, 0);
  const maxPossibleWeight = 17; // Sum of all maximum weights
  return Math.min(100, Math.round((totalWeight / maxPossibleWeight) * 100));
}

export function classifyURL(riskScore: number): 'legitimate' | 'suspicious' | 'phishing' {
  if (riskScore < 25) return 'legitimate';
  if (riskScore < 50) return 'suspicious';
  return 'phishing';
}
