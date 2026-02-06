import { useState, useEffect, useCallback } from 'react';

export interface ScanHistoryItem {
  id: string;
  url: string;
  classification: 'legitimate' | 'suspicious' | 'phishing';
  riskScore: number;
  timestamp: Date;
}

const STORAGE_KEY = 'phishing-detector-history';
const MAX_HISTORY = 50;

export function useScanHistory() {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const items: ScanHistoryItem[] = parsed.map((item: ScanHistoryItem) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        setHistory(items);
      }
    } catch (error) {
      console.error('Failed to load scan history:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (error) {
        console.error('Failed to save scan history:', error);
      }
    }
  }, [history, isLoaded]);

  const addScan = useCallback((
    url: string,
    classification: 'legitimate' | 'suspicious' | 'phishing',
    riskScore: number
  ) => {
    const newItem: ScanHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url,
      classification,
      riskScore,
      timestamp: new Date(),
    };

    setHistory(prev => {
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY);
      return updated;
    });

    return newItem;
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const removeItem = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  const getStats = useCallback(() => {
    const total = history.length;
    const legitimate = history.filter(h => h.classification === 'legitimate').length;
    const suspicious = history.filter(h => h.classification === 'suspicious').length;
    const phishing = history.filter(h => h.classification === 'phishing').length;
    const avgRisk = total > 0 
      ? Math.round(history.reduce((sum, h) => sum + h.riskScore, 0) / total)
      : 0;

    return { total, legitimate, suspicious, phishing, avgRisk };
  }, [history]);

  return {
    history,
    isLoaded,
    addScan,
    clearHistory,
    removeItem,
    getStats,
  };
}
