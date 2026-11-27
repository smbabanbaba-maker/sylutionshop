"use client";
import {useEffect,useState} from "react";
import worldCountries from "world-countries";

const PROFILE_KEY="sylution_demo_profile";
type CountryRecord={cca2:string;name:{common:string};currencies?:Record<string,{name?:string}>;idd?:{root?:string;suffixes?:string[]}};
type ProfileRecord={name?:string;email?:string;company?:string;country?:string;role?:string};
export type AccountDefaults={name:string;email:string;company:string;country:string;currency:string;dialCode:string;countryCode:string};
const countries=worldCountries as CountryRecord[];
const aliases:Record<string,string>={"USA":"US","United States":"US","United States of America":"US","UAE":"AE","United Arab Emirates":"AE","Türkiye":"TR","Turkey":"TR","Turkiye":"TR","UK":"GB","United Kingdom":"GB","Great Britain":"GB","Ivory Coast":"CI","Czech Republic":"CZ"};
const empty:AccountDefaults={name:"",email:"",company:"",country:"",currency:"USD",dialCode:"",countryCode:""};
export function countryMetadata(country:string){
 const name=country.trim();
 const code=aliases[name]||name.toUpperCase();
 const item=countries.find(c=>c.cca2===code||c.name.common.toLowerCase()===name.toLowerCase());
 if(!item)return {currency:"USD",dialCode:"",countryCode:""};
 const codes=Object.keys(item.currencies||{});
 const preferred=({"US":"USD","GB":"GBP","NG":"NGN","AE":"AED","CN":"CNY","IN":"INR","ZA":"ZAR","CA":"CAD","AU":"AUD"} as Record<string,string>)[item.cca2];
 const currency=preferred&&codes.includes(preferred)?preferred:codes[0]||"USD";
 const dialing=item.idd?.root||"";
 const suffix=item.idd?.suffixes?.length===1?item.idd.suffixes[0]:"";
 return {currency,dialCode:dialing+suffix,countryCode:item.cca2};
}
export function getAccountDefaults():AccountDefaults{
 if(typeof window==="undefined")return empty;
 try{
  const raw=localStorage.getItem(PROFILE_KEY);
  if(!raw)return empty;
  const profile=JSON.parse(raw) as ProfileRecord;
  if(!profile||typeof profile!=="object")return empty;
  const country=typeof profile.country==="string"?profile.country.trim():"";
  const meta=countryMetadata(country);
  return {name:String(profile.name||""),email:String(profile.email||""),company:String(profile.company||""),country,...meta};
 }catch{return empty}
}
export function useAccountDefaults(){
 const [value,setValue]=useState<AccountDefaults>(empty);
 useEffect(()=>{
  const update=()=>setValue(getAccountDefaults());
  update();
  window.addEventListener("sylution-profile-change",update);
  window.addEventListener("storage",update);
  return()=>{window.removeEventListener("sylution-profile-change",update);window.removeEventListener("storage",update)};
 },[]);
 return value;
}
