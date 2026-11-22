import type {Product} from "./catalog";

// Fixture metadata powers filters until actual supplier terms, ratings and listing dates are available.
const exportMarkets: Record<string,string[]> = {
  Nigeria:["UAE","United Kingdom","USA","Ghana"],
  China:["Nigeria","South Africa","UAE","USA"],
  USA:["Canada","Mexico","UAE"],
  UAE:["Saudi Arabia","Nigeria","India"],
};

export function previewListing(product:Product,index:number){
  return {
    markets:exportMarkets[product.country]??["UAE","United Kingdom"],
    terms:index%3===0?["FOB","CIF"]:index%3===1?["EXW","FCA"]:["FOB","DAP"],
    rating:[5,4.7,4.3,3.8,0][index%5],
    recent:index>=36,
    featured:index<8,
    deal:index%7===0,
  };
}
