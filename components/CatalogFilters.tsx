"use client";

import {useEffect,useRef,useState} from "react";
import {SlidersHorizontal,X} from "lucide-react";
import {COUNTRIES,CountryFlag} from "./CountryFlag";

export const tradeTerms = ["FOB","CIF","EXW","CFR","DAP","FCA","CIP","DDP","CPT","FAS","DPU"];
export const filterLabels = {country:"Supplier country",markets:"Main markets",trust:"Trust rating",terms:"Trade terms"} as const;
type Field = keyof typeof filterLabels;
export type CatalogSelection = Record<Field,string[]>;
export const emptySelection: CatalogSelection = {country:[],markets:[],trust:[],terms:[]};
const fields = Object.keys(filterLabels) as Field[];
const countryOptions = COUNTRIES.map(country=>({
  value:country.name,
  label:country.code==="ae"?"United Arab Emirates":country.code==="us"?"United States":country.name
})).sort((a,b)=>a.label.localeCompare(b.label));
const trustOptions = [{value:"5",label:"5 stars"},{value:"4",label:"Above 4 stars"},{value:"3",label:"Above 3 stars"}];

export function CatalogFilters({value,onChange}:{value:CatalogSelection;onChange:(value:CatalogSelection)=>void}){
  const [panel,setPanel] = useState<Field|"all"|null>(null);
  const [draft,setDraft] = useState(value);
  const [query,setQuery] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const active = fields.filter(field=>value[field].length>0).length;

  useEffect(()=>{
    const element=dialog.current;
    if(panel && !element?.open)element?.showModal();
    if(!panel && element?.open)element.close();
  },[panel]);

  function open(field:Field|"all"){
    setDraft(value);
    setQuery("");
    setPanel(field);
  }

  function options(field:Field){
    if(field==="trust")return trustOptions;
    if(field==="terms")return tradeTerms.map(term=>({value:term,label:term}));
    const search=query.trim().toLowerCase();
    return countryOptions.filter(country=>[country.value,country.label].some(label=>label.toLowerCase().includes(search)));
  }

  return <>
    <div className="catalog-filter-actions" aria-label="Catalog filters">
      <button type="button" onClick={()=>open("all")}><SlidersHorizontal size={17}/> All filters{active? " · "+active:""}</button>
      {fields.map(field=><button type="button" key={field} onClick={()=>open(field)} aria-pressed={value[field].length>0}>{filterLabels[field]}{value[field].length>0&&" · "+value[field].length}</button>)}
      {active>0&&<button type="button" onClick={()=>onChange(emptySelection)}>Reset filters</button>}
    </div>
    <dialog className="catalog-filter-dialog" ref={dialog} aria-labelledby="catalog-filter-title" onCancel={event=>{event.preventDefault();setPanel(null);}}>
      <header><h2 id="catalog-filter-title">{panel&&panel!=="all"?filterLabels[panel]:"All filters"}</h2><button type="button" aria-label="Close filters" onClick={()=>setPanel(null)}><X size={20}/></button></header>
      {panel&&<div className="catalog-filter-content">
        {(panel==="all"||panel==="country"||panel==="markets")&&<input type="search" aria-label="Search countries" placeholder="Search countries" value={query} onChange={event=>setQuery(event.target.value)}/>}
        {(panel==="all"?fields:[panel]).map(field=><fieldset key={field}>
          <legend>{filterLabels[field]}</legend>
          {field==="trust"&&<small>Ratings are sample values for the demo catalog.</small>}
          <div className="catalog-filter-options">{options(field).length?options(field).map(option=><label key={option.value}>
            <input type={field==="trust"?"radio":"checkbox"} name={field} checked={draft[field].includes(option.value)} onChange={event=>{
              const checked=event.target.checked;
              setDraft(current=>({...current,[field]:field==="trust"?[option.value]:checked?[...current[field],option.value]:current[field].filter(item=>item!==option.value)}));
            }}/>
            {(field==="country"||field==="markets")&&<CountryFlag country={option.value} compact/>}
            {option.label}
          </label>):<p>No matching countries.</p>}</div>
        </fieldset>)}
      </div>}
      <footer>
        <button type="button" onClick={()=>setDraft(panel&&panel!=="all"?{...draft,[panel]:[]}:emptySelection)}>Clear</button>
        <button type="button" className="catalog-primary" onClick={()=>{onChange(draft);setPanel(null);}}>Apply filters</button>
      </footer>
    </dialog>
  </>;
}
