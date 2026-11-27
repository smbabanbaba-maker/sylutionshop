import worldCountries from "world-countries";

/** Currency codes provided by ISO-style national data, plus common global trade units.
 * These are display options only: SYLUTION does not provide FX, banking or settlement.
 */
type CurrencyRecord={currencies?:Record<string,{name?:string;symbol?:string}>};
const entries=worldCountries as CurrencyRecord[];
export const TRADE_CURRENCIES=Array.from(new Set([
 "USD","EUR","GBP","NGN","CNY","INR","AED","JPY","CAD","AUD","CHF","ZAR","GHS","KES",
 ...entries.flatMap(c=>Object.keys(c.currencies||{}))
])).filter(code=>/^[A-Z]{3}$/.test(code)).sort((a,b)=>a.localeCompare(b));
export const CURRENCY_NAMES:Record<string,string>=Object.fromEntries(
 entries.flatMap(c=>Object.entries(c.currencies||{}).map(([code,info])=>[code,info.name||code]))
);
export function currencyLabel(code:string){return code+" — "+(CURRENCY_NAMES[code]||code)}
