"use client";
import {useState} from "react";
export const COUNTRY_FLAGS:Record<string,{code:string;emoji:string}>={
 Nigeria:{code:"ng",emoji:"🇳🇬"},China:{code:"cn",emoji:"🇨🇳"},USA:{code:"us",emoji:"🇺🇸"},UAE:{code:"ae",emoji:"🇦🇪"},Türkiye:{code:"tr",emoji:"🇹🇷"},India:{code:"in",emoji:"🇮🇳"},Thailand:{code:"th",emoji:"🇹🇭"},Ghana:{code:"gh",emoji:"🇬🇭"},Ethiopia:{code:"et",emoji:"🇪🇹"},Tunisia:{code:"tn",emoji:"🇹🇳"},Vietnam:{code:"vn",emoji:"🇻🇳"},Ukraine:{code:"ua",emoji:"🇺🇦"},Egypt:{code:"eg",emoji:"🇪🇬"},Kenya:{code:"ke",emoji:"🇰🇪"},Morocco:{code:"ma",emoji:"🇲🇦"},Brazil:{code:"br",emoji:"🇧🇷"},Germany:{code:"de",emoji:"🇩🇪"},Pakistan:{code:"pk",emoji:"🇵🇰"},Canada:{code:"ca",emoji:"🇨🇦"},Australia:{code:"au",emoji:"🇦🇺"}};
export function CountryFlag({country,compact=false}:{country:string;compact?:boolean}){
 const entry=COUNTRY_FLAGS[country];const [failed,setFailed]=useState(false);
 return <span className={"sy-country-flag "+(compact?"sy-country-flag-small":"")} title={country+" flag"}>
  {entry&&!failed?<img width="26" height="18" loading="lazy" src={`https://flagcdn.com/w40/${entry.code}.png`} alt={country+" flag"} onError={()=>setFailed(true)}/>:<span role="img" aria-label={country+" flag"}>{entry?.emoji??"🌐"}</span>}
 </span>;
}
