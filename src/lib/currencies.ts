import { Language } from '../types';

export interface Currency {
  code: string;
  symbol: string;
  nameAr: string;
  nameEn: string;
  rateToShekel: number; // Shekel is the base currency (1 ₪ = 1.0)
}

export const currencies: Record<string, Currency> = {
  ILS: { code: 'ILS', symbol: '₪', nameAr: 'شيكل إسرائيلي (الرئيسية)', nameEn: 'Israeli Shekel (Primary)', rateToShekel: 1.0 },
  SAR: { code: 'SAR', symbol: 'ر.س', nameAr: 'ريال سعودي', nameEn: 'Saudi Riyal', rateToShekel: 1.02 },
  USD: { code: 'USD', symbol: '$', nameAr: 'دولار أمريكي', nameEn: 'US Dollar', rateToShekel: 0.27 },
  EUR: { code: 'EUR', symbol: '€', nameAr: 'يورو', nameEn: 'Euro', rateToShekel: 0.25 },
  JOD: { code: 'JOD', symbol: 'د.أ', nameAr: 'دينار أردني', nameEn: 'Jordanian Dinar', rateToShekel: 0.19 },
  AED: { code: 'AED', symbol: 'د.إ', nameAr: 'درهم إماراتي', nameEn: 'UAE Dirham', rateToShekel: 0.99 },
  EGP: { code: 'EGP', symbol: 'ج.م', nameAr: 'جنيه مصري', nameEn: 'Egyptian Pound', rateToShekel: 13.10 },
  TRY: { code: 'TRY', symbol: '₺', nameAr: 'ليرة تركية', nameEn: 'Turkish Lira', rateToShekel: 8.80 },
  RUB: { code: 'RUB', symbol: '₽', nameAr: 'روبل روسي', nameEn: 'Russian Ruble', rateToShekel: 22.50 },
  CNY: { code: 'CNY', symbol: '¥', nameAr: 'يوان صيني', nameEn: 'Chinese Yuan', rateToShekel: 1.95 },
  INR: { code: 'INR', symbol: '₹', nameAr: 'روبية هندية', nameEn: 'Indian Rupee', rateToShekel: 22.80 },
};

// Rate update subscribers
type RateListener = () => void;
const listeners: Set<RateListener> = new Set();

let lastUpdatedTimestamp: string = 'الآن (محدث تلقائياً)';
let isFetchingRates = false;

export function subscribeToRates(listener: RateListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach(fn => fn());
}

export function getLastRatesUpdatedTime(): string {
  return lastUpdatedTimestamp;
}

// Background free live exchange rate fetcher
export async function fetchLiveExchangeRates(): Promise<boolean> {
  if (isFetchingRates) return false;
  isFetchingRates = true;

  try {
    // Open Exchange Rates free API relative to ILS (base)
    const response = await fetch('https://open.er-api.com/v6/latest/ILS');
    if (response.ok) {
      const data = await response.json();
      if (data && data.rates) {
        Object.keys(currencies).forEach((code) => {
          if (code === 'ILS') {
            currencies.ILS.rateToShekel = 1.0;
          } else if (data.rates[code]) {
            currencies[code].rateToShekel = Number(data.rates[code]);
          }
        });
        
        const now = new Date();
        lastUpdatedTimestamp = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} (تلقائي حي)`;
        notifyListeners();
        isFetchingRates = false;
        return true;
      }
    }
  } catch (err) {
    // Graceful fallback to built-in rate table
    console.log('Background currency sync using reliable default rates');
  }

  isFetchingRates = false;
  return false;
}

// Initialize background auto update
let autoUpdateInterval: any = null;
export function initBackgroundCurrencyUpdates() {
  fetchLiveExchangeRates();
  if (!autoUpdateInterval) {
    autoUpdateInterval = setInterval(() => {
      fetchLiveExchangeRates();
    }, 10 * 60 * 1000); // Check every 10 minutes
  }
}

// Default mapping for languages to default currency
export const languageDefaultCurrency: Record<Language, string> = {
  ar: 'ILS', // Primary Shekel ₪
  en: 'USD',
  tr: 'TRY',
  he: 'ILS', // Shekel ₪
  ru: 'RUB',
  zh: 'CNY',
  hi: 'INR',
  de: 'EUR',
  fr: 'EUR',
  es: 'EUR',
};

export function convertCurrency(amount: number, fromCode: string, toCode: string): number {
  const fromCurr = currencies[fromCode] || currencies.USD;
  const toCurr = currencies[toCode] || currencies.ILS;

  if (fromCode === toCode) return amount;

  // Convert from 'fromCode' to Shekel (ILS) base
  const amountInILS = amount / (fromCurr.rateToShekel || 1);
  // Convert from Shekel to 'toCode'
  return amountInILS * (toCurr.rateToShekel || 1);
}

export function formatPriceFromILS(
  amountInILS: number, 
  targetCurrencyCode: string = 'ILS'
): { formatted: string; amount: number; symbol: string; code: string } {
  const curr = currencies[targetCurrencyCode] || currencies.ILS;

  if (amountInILS === 0) {
    return { formatted: 'مجاناً', amount: 0, symbol: curr.symbol, code: curr.code };
  }

  const converted = convertCurrency(amountInILS, 'ILS', targetCurrencyCode);

  let formattedNum = '';
  if (converted < 10) {
    formattedNum = (Math.round(converted * 10) / 10).toString();
  } else {
    formattedNum = Math.round(converted).toLocaleString();
  }

  return {
    formatted: `${formattedNum} ${curr.symbol}`,
    amount: Number(formattedNum.replace(/,/g, '')),
    symbol: curr.symbol,
    code: curr.code
  };
}

export function formatPriceFromUSD(
  amountInUSD: number, 
  targetCurrencyCode: string = 'ILS'
): { formatted: string; amount: number; symbol: string; code: string } {
  const curr = currencies[targetCurrencyCode] || currencies.ILS;

  if (amountInUSD === 0) {
    return { formatted: 'مجاناً', amount: 0, symbol: curr.symbol, code: curr.code };
  }

  const converted = convertCurrency(amountInUSD, 'USD', targetCurrencyCode);

  let formattedNum = '';
  if (converted < 10) {
    formattedNum = (Math.round(converted * 10) / 10).toString();
  } else {
    formattedNum = Math.round(converted).toLocaleString();
  }

  return {
    formatted: `${formattedNum} ${curr.symbol}`,
    amount: Number(formattedNum.replace(/,/g, '')),
    symbol: curr.symbol,
    code: curr.code
  };
}

export function formatPrice(amountInShekels: number, currencyCode: string = 'ILS'): string {
  const curr = currencies[currencyCode] || currencies.ILS;
  const converted = amountInShekels * (curr.rateToShekel || 1);
  
  const formattedNum = Number.isInteger(converted) 
    ? converted.toString() 
    : converted.toFixed(1);

  return `${formattedNum} ${curr.symbol}`;
}

