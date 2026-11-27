"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {Bell,ClipboardList,FileText,PackageCheck,PackagePlus,ShieldAlert} from "lucide-react";
type Item={id:string;label:string;detail:string;date:string;href:string;Icon:typeof Bell};
function load(key:string):Record<string,unknown>[]{try{const x:unknown=JSON.parse(localStorage.getItem(key)||"[]");return Array.isArray(x)?x.filter(v=>!!v&&typeof v==="object") as Record<string,unknown>[]:[]}catch{return []}}
function str(v:unknown){return typeof v==="string"?v:""}
export function ActivityCenter({email}:{email:string}){
 const [events,setEvents]=useState<Item[]>([]);const [filter,setFilter]=useState<"all"|"trade"|"products">("all");
 useEffect(()=>{const items:Item[]=[];
  for(const q of load("sylution_demo_trade_quotes"))items.push({id:"q"+str(q.id),label:"Quotation · "+str(q.product),detail:str(q.status)+" · "+str(q.buyer),date:str(q.createdAt),href:"/account?tab=quotations",Icon:FileText});
  for(const o of load("sylution_demo_trade_orders"))items.push({id:"o"+str(o.id),label:"Order · "+str(o.product),detail:str(o.status)+" · "+str(o.buyer),date:str(o.createdAt),href:"/account?tab=orders",Icon:PackageCheck});
  for(const r of load("sylution_demo_rfqs"))items.push({id:"r"+str(r.createdAt),label:"Buying request · "+str(r.product),detail:"Saved on this device",date:str(r.createdAt),href:"/account?tab=requests",Icon:ClipboardList});
  for(const p of load("sylution_supplier_product_drafts:"+email.toLowerCase()))items.push({id:"p"+str(p.id),label:"Product draft · "+str(p.name),detail:"Not published",date:str(p.savedAt),href:"/account?tab=my-products",Icon:PackagePlus});
  setEvents(items.sort((a,b)=>b.date.localeCompare(a.date)).slice(0,60));
 },[email]);
 const visible=events.filter(e=>filter==="all"||filter==="products"?filter==="all"||e.href.includes("my-products"):!e.href.includes("my-products"));
 return <section className="sy-trade-workflow">
  <div className="sy-trade-workflow-head"><div><span className="sy-mini-overline">ACCOUNT / ACTIVITY</span><h2>Activity Center</h2><p>Local updates from your product drafts, enquiries, quotations and orders.</p></div><Bell color="#007B60" size={25}/></div>
  <div className="sy-activity-filter">{(["all","trade","products"] as const).map(t=><button key={t} className={filter===t?"active":""} onClick={()=>setFilter(t)}>{t==="all"?"All activity":t==="trade"?"Trade activity":"Products"}</button>)}</div>
  {visible.length?<div className="sy-activity-list">{visible.map((e,i)=><Link href={e.href} className="sy-activity-item" key={e.id+i}><span><e.Icon size={18}/></span><div><strong>{e.label}</strong><small>{e.detail}</small></div><time>{e.date?new Date(e.date).toLocaleDateString():"Draft"}</time></Link>)}</div>:<div className="sy-trade-empty"><Bell size={28}/><strong>No activity yet</strong><p>New local drafts and trade actions will be summarised here.</p></div>}
  <p className="sy-trade-demo-footnote"><ShieldAlert size={14}/> This is not a push-notification service. Events are collected from this browser only; no emails or device notifications are sent.</p>
 </section>;
}
