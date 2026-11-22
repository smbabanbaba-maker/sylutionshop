"use client";
import {useState} from "react";
import worldCountries from "world-countries";

// Shared ISO 3166-1 country and territory data for all SYLUTION forms.
// Preserve established demo names to avoid breaking previously saved records.
type WorldRecord={cca2:string;name:{common:string};flag?:string;idd?:{root?:string;suffixes?:string[]}};
const names:Record<string,string>={"US":"USA","AE":"UAE","TR":"Türkiye","GB":"United Kingdom"};
const source=worldCountries as WorldRecord[];
export type CountryEntry={name:string;code:string;emoji:string;dial:string};
export const COUNTRIES:CountryEntry[]=source.filter(c=>/^[A-Z]{2}$/.test(c.cca2)).map(c=>{
 const code=c.cca2.toLowerCase();
 const name=names[c.cca2]||c.name.common;
 const root=c.idd?.root||"";
 const suffix=c.idd?.suffixes?.length===1?c.idd.suffixes[0]:"";
 return {name,code,emoji:c.flag||String.fromCodePoint(...c.cca2.split("").map(x=>127397+x.charCodeAt(0))),dial:root?root+suffix:""};
}).sort((a,b)=>a.name.localeCompare(b.name));
export const COUNTRY_NAMES=COUNTRIES.map(c=>c.name);
export const COUNTRY_FLAGS:Record<string,{code:string;emoji:string;dial:string}>=Object.fromEntries(COUNTRIES.map(c=>[c.name,{code:c.code,emoji:c.emoji,dial:c.dial}]));
const aliases:Record<string,string>={"United States":"USA","United States of America":"USA","US":"USA","United Arab Emirates":"UAE","AE":"UAE","Turkey":"Türkiye","Turkiye":"Türkiye","UK":"United Kingdom","Great Britain":"United Kingdom","GB":"United Kingdom","Ivory Coast":"Côte d'Ivoire","Czech Republic":"Czechia","South Korea":"South Korea","North Korea":"North Korea"};
export function getCountry(country:string){return COUNTRY_FLAGS[country]||COUNTRY_FLAGS[aliases[country]]||COUNTRIES.find(c=>c.code===country.toLowerCase());}
export function getDialingCode(country:string){return getCountry(country)?.dial||"";}
export function CountryFlag({country,compact=false}:{country:string;compact?:boolean}){
 const [failed,setFailed]=useState(false);
 const entry=getCountry(country);
 return <span className={"sy-country-flag "+(compact?"sy-country-flag-small":"")} title={country+" flag"}>
  {entry&&!failed?<img key={entry.code} width="26" height="18" loading="lazy" src={`https://flagcdn.com/w40/${entry.code}.png`} alt={country+" flag"} onError={()=>setFailed(true)}/>:<span role="img" aria-label={country+" flag"}>{entry?.emoji??"🌐"}</span>}
 </span>;
}
export function CountryField({value,onChange,includeAny=false,disabled=false,required=false,label="Country"}:{value:string;onChange:(name:string)=>void;includeAny?:boolean;disabled?:boolean;required?:boolean;label?:string}){
 return <span className="sy-country-field">
  {value&&value!=="Any country"?<CountryFlag country={value} compact/>:<span aria-hidden="true">🌍</span>}
  <select aria-label={label} value={value} disabled={disabled} required={required} onChange={e=>onChange(e.target.value)}>
    {includeAny&&<option value="">Any country</option>}
    {!COUNTRY_NAMES.includes(value)&&value&&<option value={value}>{value} (saved)</option>}
    {COUNTRIES.map(c=><option key={c.code} value={c.name}>{c.emoji} {c.name}</option>)}
  </select>
 </span>;
}
