"use client";
import {useEffect,useId,useRef,useState} from "react";
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
 const [failedCode,setFailedCode]=useState<string|null>(null);
 const entry=getCountry(country);
 return <span className={"sy-country-flag "+(compact?"sy-country-flag-small":"")} title={country+" flag"}>
  {entry&&failedCode!==entry.code?<img key={entry.code} width="26" height="18" loading="lazy" src={`https://flagcdn.com/w40/${entry.code}.png`} alt={country+" flag"} onError={()=>setFailedCode(entry.code)}/>:<span role="img" aria-label={country+" flag"}>{entry?.emoji??"🌐"}</span>}
 </span>;
}
export function CountryField({value,onChange,includeAny=false,disabled=false,required=false,label="Country"}:{value:string;onChange:(name:string)=>void;includeAny?:boolean;disabled?:boolean;required?:boolean;label?:string}){
 const [open,setOpen]=useState(false);
 const [query,setQuery]=useState("");
 const container=useRef<HTMLDivElement>(null);
 const searchRef=useRef<HTMLInputElement>(null);
 const listId=useId();
 const filtered=COUNTRIES.filter(c=>(c.name+" "+c.code).toLowerCase().includes(query.trim().toLowerCase()));
 useEffect(()=>{if(!open)return;const close=(event:MouseEvent)=>{if(!container.current?.contains(event.target as Node))setOpen(false)};document.addEventListener("mousedown",close);return()=>document.removeEventListener("mousedown",close)},[open]);
 useEffect(()=>{if(open)searchRef.current?.focus()},[open]);
 const select=(country:string)=>{onChange(country);setOpen(false);setQuery("")};
 return <div className={"sy-country-picker"+(disabled?" disabled":"")} ref={container}>
  <button type="button" className="sy-country-picker-trigger" aria-expanded={open} aria-controls={listId} aria-label={label+": "+(value||"Any country")} disabled={disabled} onClick={()=>setOpen(o=>!o)}>
   {value?<CountryFlag country={value} compact/>:<span aria-hidden="true">🌍</span>}
   <span className="sy-country-picker-value">{value||"Any country"}</span>
   <span aria-hidden="true">⌄</span>
  </button>
  {required&&<input aria-hidden="true" tabIndex={-1} className="sy-country-required" value={value} onChange={()=>{}} required/>}
  {open&&<div id={listId} className="sy-country-picker-menu">
   <input ref={searchRef} type="search" aria-label={"Search "+label} className="sy-country-picker-search" placeholder="Search all countries and territories..." value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==="Escape")setOpen(false);if(e.key==="Enter"&&filtered.length===1){e.preventDefault();select(filtered[0].name)}}}/>
   <div className="sy-country-picker-options" role="group" aria-label={label+" options"}>
    {includeAny&&<button type="button" onClick={()=>select("")}><span aria-hidden="true">🌍</span><span>Any country</span></button>}
    {!COUNTRY_NAMES.includes(value)&&value&&<button type="button" onClick={()=>select(value)}>{value} (saved)</button>}
    {filtered.map(c=><button key={c.code} type="button" className={c.name===value?"selected":""} onClick={()=>select(c.name)}><CountryFlag country={c.name} compact/><span>{c.name}</span><small>{c.code.toUpperCase()}</small></button>)}
    {!filtered.length&&<p>No matching country or territory.</p>}
   </div>
  </div>}
 </div>;
}
