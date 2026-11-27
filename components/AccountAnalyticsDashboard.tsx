"use client";
import {useEffect,useMemo,useState} from "react";
import {Activity,ArrowRight,BarChart3,Bell,Box,CalendarDays,CheckCircle2,ChevronDown,ClipboardList,FileCheck,FileText,Globe2,Heart,MessageSquare,Package,Search,ShieldCheck,ShoppingBag,Store,TrendingUp,Users,Wallet, type LucideIcon} from "lucide-react";
import {CountryFlag} from "@/components/CountryFlag";

type Profile={name:string;email:string;company:string;country:string;role:"buyer"|"supplier"};
type Entry={id?:string;name?:string;product?:string;buyer?:string;status?:string;currency?:string;total?:number;quantity?:number;createdAt?:string;savedAt?:string;category?:string};
type ActivityItem={name:string;subtitle:string;status:string;date:string;onClick:()=>void};
const periods=[7,30,90] as const;
type Period=typeof periods[number];
function readEntries(key:string):Entry[]{try{const value:unknown=JSON.parse(localStorage.getItem(key)||"[]");return Array.isArray(value)?value.filter((item):item is Entry=>item!==null&&typeof item==="object"):[]}catch{return []}}
function inRange(date:string|undefined,days:number){if(!date)return false;const time=new Date(date).getTime();return Number.isFinite(time)&&time<=Date.now()&&Date.now()-time<=days*86400000}
function relativeDay(date:string|undefined){if(!date)return"Local draft";const d=new Date(date);return Number.isNaN(d.getTime())?"Local draft":d.toLocaleDateString("en",{month:"short",day:"numeric"})}
function sparkData(data:number[],max:number){const width=480,height=146;return data.map((value,i)=>`${(i*width/(data.length-1)).toFixed(1)},${(height-(value/max)*112-12).toFixed(1)}`).join(" ")}
function Stat({label,value,Icon,featured,tone,onClick,caption}:{label:string;value:string|number;Icon:LucideIcon;featured?:boolean;tone?:"error"|"warning"|"info"|"neutral";onClick:()=>void;caption:string}){
 return <button type="button" onClick={onClick} className={"sy-analytics-stat"+(featured?" sy-analytics-featured":"")} data-tone={tone||"neutral"}><span className="sy-analytics-stat-head"><span className="sy-analytics-icon"><Icon size={19}/></span><span>{label}</span><ArrowRight size={14} className="sy-analytics-arrow"/></span><strong>{value}</strong><small>{caption}</small></button>;
}
export function AccountAnalyticsDashboard({profile,onNavigate,savedCount,rfqs}:{profile:Profile;onNavigate:(name:"overview"|"supplier"|"products"|"requests"|"post-rfq"|"messages"|"profile"|"favorites"|"verification"|"my-products"|"quotations"|"orders"|"add-product"|"notifications")=>void;savedCount:number;rfqs:Entry[]}){
 const seller=profile.role==="supplier";
 const [period,setPeriod]=useState<Period>(30);
 const [section,setSection]=useState<"overview"|"trade"|"products">("overview");
 const [records,setRecords]=useState({quotes:[] as Entry[],orders:[] as Entry[],drafts:[] as Entry[]});
 useEffect(()=>{const refresh=()=>setRecords({quotes:readEntries("sylution_demo_trade_quotes"),orders:readEntries("sylution_demo_trade_orders"),drafts:readEntries("sylution_supplier_product_drafts:"+profile.email.toLowerCase())});refresh();window.addEventListener("storage",refresh);return()=>window.removeEventListener("storage",refresh)},[profile.email]);
 const rfqPeriod=rfqs.filter(r=>inRange(r.createdAt,period));
 const quotesPeriod=records.quotes.filter(q=>inRange(q.createdAt,period));
 const ordersPeriod=records.orders.filter(o=>inRange(o.createdAt,period));
 const activeDrafts=records.drafts.filter(d=>inRange(d.savedAt,period));
 const now=new Date();
 const bucketNames=Array.from({length:6},(_,i)=>{const d=new Date(now.getFullYear(),now.getMonth()-5+i,1);return d.toLocaleDateString("en",{month:"short"})});
 const buckets=useMemo(()=>{
  return Array.from({length:6},(_,i)=>{
   const month=new Date(now.getFullYear(),now.getMonth()-5+i,1);
   const matches=(entries:Entry[],key:"createdAt"|"savedAt")=>entries.filter(e=>{const date=e[key];if(!date)return false;const d=new Date(date);return d.getFullYear()===month.getFullYear()&&d.getMonth()===month.getMonth()}).length;
   return {rfq:matches(rfqs,"createdAt"),quote:matches(records.quotes,"createdAt"),order:matches(records.orders,"createdAt"),draft:matches(records.drafts,"savedAt")};
  })
 },[rfqs,records.quotes,records.orders,records.drafts,now.getFullYear(),now.getMonth()]);
 const trend=buckets.map(x=>seller?x.draft:x.rfq);
 const maxTrend=Math.max(1,...trend);
 const maxBars=Math.max(1,...buckets.map(b=>Math.max(b.rfq,b.quote)));
 const line=sparkData(trend,maxTrend);
 const activity:ActivityItem[]=[
  ...rfqPeriod.map(r=>({name:r.product||"Buying request",subtitle:"Buying request · "+(r.status||"Local draft"),status:"Draft",date:r.createdAt||"",onClick:()=>onNavigate("requests")})),
  ...quotesPeriod.map(q=>({name:q.product||"Quotation",subtitle:"Quotation · "+(q.buyer||"Buyer not set"),status:q.status||"Draft",date:q.createdAt||"",onClick:()=>onNavigate("quotations")})),
  ...ordersPeriod.map(o=>({name:o.product||"Order",subtitle:"Order · "+(o.buyer||"Buyer not set"),status:o.status||"Agreed",date:o.createdAt||"",onClick:()=>onNavigate("orders")})),
  ...activeDrafts.map(d=>({name:d.name||"Product",subtitle:"Product listing · Local draft",status:"Draft",date:d.savedAt||"",onClick:()=>onNavigate("my-products")}))
 ].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,6);
 return <section className="sy-analytics" aria-label="SYLUTION Trade dashboard overview">
  <div className="sy-analytics-toolbar"><div className="sy-analytics-title"><span className="sy-analytics-eyebrow">GLOBAL B2B MARKETPLACE · {seller?"SELLER":"BUYER"} WORKSPACE</span><h2>Dashboard <span>Overview</span></h2><p>Your trade activity, all in one place.</p></div><label className="sy-analytics-period"><CalendarDays size={17}/><span>Period</span><select value={period} onChange={e=>setPeriod(Number(e.target.value) as Period)}><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option></select><ChevronDown size={14}/></label></div>
  <nav className="sy-analytics-tabs" aria-label="Dashboard sections">{(["overview","trade","products"] as const).map(tab=><button key={tab} onClick={()=>setSection(tab)} className={section===tab?"active":""}>{tab==="overview"?"Overview":tab==="trade"?"RFQs & Quotations":"Products & Store"}</button>)}</nav>
  <div className="sy-analytics-demo-strip"><ShieldCheck size={17}/><span>Interactive preview · Counts reflect records saved in this browser. No real transactions, payment analytics or verified traffic data are connected.</span></div>
  <div className="sy-analytics-kpis">
   <Stat label={seller?"Product drafts":"Buying requests"} tone="warning" value={seller?records.drafts.length:rfqPeriod.length} Icon={Package} caption={seller?"Local product drafts":"Created in selected period"} onClick={()=>onNavigate(seller?"my-products":"requests")}/>
   <Stat label="Quotations" value={quotesPeriod.length} Icon={FileText} caption="Local quotation records" onClick={()=>onNavigate("quotations")}/>
   <Stat label="Orders" value={ordersPeriod.length} Icon={ShoppingBag} caption="Demo order agreements" onClick={()=>onNavigate("orders")}/>
   <Stat label={seller?"Published listings":"Saved products"} value={seller?"0":savedCount} Icon={seller?Store:Heart} caption={seller?"No live publishing yet":"Your local shortlist"} onClick={()=>onNavigate(seller?"my-products":"favorites")}/>
   <Stat featured label={seller?"Selling activity":"Sourcing activity"} value={seller?activeDrafts.length:rfqPeriod.length} Icon={TrendingUp} caption={"Records in past "+period+" days"} onClick={()=>onNavigate(seller?"my-products":"requests")}/>
   <Stat label="Messages" value="—" Icon={MessageSquare} caption="Live chat not connected" onClick={()=>onNavigate("messages")}/>
   <Stat label="Store visits" value="—" Icon={Users} caption="Real analytics unavailable" onClick={()=>onNavigate("profile")}/>
   <Stat label="Business verification" value="Unverified" tone="error" Icon={ShieldCheck} caption="No verified status issued" onClick={()=>onNavigate("verification")}/>
  </div>
  {section==="products"&&<div className="sy-analytics-inline-actions"><button onClick={()=>onNavigate(seller?"add-product":"products")}><Package size={16}/>{seller?"Add product draft":"Browse products"}<ArrowRight size={15}/></button><button onClick={()=>onNavigate("profile")}><Store size={16}/>Company profile<ArrowRight size={15}/></button><button onClick={()=>onNavigate("verification")}><ShieldCheck size={16}/>Verification<ArrowRight size={15}/></button></div>}
  {section==="trade"&&<div className="sy-analytics-inline-actions"><button onClick={()=>onNavigate(seller?"quotations":"post-rfq")}><ClipboardList size={16}/>{seller?"Create quotation":"Post buying request"}<ArrowRight size={15}/></button><button onClick={()=>onNavigate("orders")}><ShoppingBag size={16}/>View orders<ArrowRight size={15}/></button></div>}
  <div className="sy-analytics-charts">
   <article className="sy-analytics-panel sy-analytics-trend"><header><div><span className="sy-analytics-card-overline">LOCAL ACTIVITY</span><h3>{seller?"Product draft trend":"Buying request trend"}</h3><p>Last six calendar months · saved browser records</p></div><BarChart3 size={19}/></header>
    <div className="sy-analytics-chart-number"><strong>{seller?records.drafts.length:rfqs.length}</strong><small>Total local records</small></div>
    <div className="sy-analytics-line-chart"><svg viewBox="0 0 520 190" role="img" aria-label={"Monthly activity counts: "+trend.join(", ")} preserveAspectRatio="none"><defs><linearGradient id="sy-analytics-chart-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FF4747" stopOpacity=".25"/><stop offset="100%" stopColor="#FF4747" stopOpacity=".015"/></linearGradient></defs>{[30,66,102,138].map(y=><line key={y} x1="20" y1={y} x2="500" y2={y} stroke="#EBEBEB" strokeWidth="1"/>)}<g transform="translate(20,10)"><polygon points={`0,160 ${line} 480,160`} fill="url(#sy-analytics-chart-gradient)"/><polyline points={line} fill="none" stroke="#E03B3B" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/>{line.split(" ").map((pt,i)=>{const [x,y]=pt.split(",").map(Number);return <circle key={i} cx={x} cy={y} r="4" fill="#fff" stroke="#E03B3B" strokeWidth="2.5"/>})}</g></svg></div>
    <div className="sy-analytics-month-labels">{bucketNames.map((m,i)=><span key={i}>{m}</span>)}</div>
   </article>
   <article className="sy-analytics-panel sy-analytics-snapshot"><header><div><span className="sy-analytics-card-overline">WORKSPACE STATUS</span><h3>Trade snapshot</h3><p>Real figures from local demo activity</p></div><Globe2 size={19}/></header>
    <div className="sy-analytics-ring-wrap"><div className="sy-analytics-donut" style={{background: `conic-gradient(#FF4747 0 ${Math.round((rfqPeriod.length/(rfqPeriod.length+quotesPeriod.length+ordersPeriod.length||1))*100)}%, #FF9320 ${Math.round((rfqPeriod.length/(rfqPeriod.length+quotesPeriod.length+ordersPeriod.length||1))*100)}% ${Math.round(((rfqPeriod.length+quotesPeriod.length)/(rfqPeriod.length+quotesPeriod.length+ordersPeriod.length||1))*100)}%, #FFD0D0 0 100%)`}}><div><strong>{rfqPeriod.length+quotesPeriod.length+ordersPeriod.length}</strong><small>Trade records</small></div></div><div className="sy-analytics-legend"><span><i className="sy-legend-rfq"/> RFQs <b>{rfqPeriod.length}</b></span><span><i className="sy-legend-quote"/> Quotations <b>{quotesPeriod.length}</b></span><span><i className="sy-legend-order"/> Orders <b>{ordersPeriod.length}</b></span></div></div><p className="sy-analytics-disclaimer">Direct buyer–seller payment. SYLUTION does not hold purchase funds.</p>
   </article>
  </div>
  <div className="sy-analytics-bottom">
   <article className="sy-analytics-panel sy-analytics-bars"><header><div><span className="sy-analytics-card-overline">ACTIVITY COMPARISON</span><h3>RFQs & Quotations</h3><p>Drafts recorded in this browser · six months</p></div><div className="sy-analytics-bar-key"><span><i/>RFQs</span><span><i/>Quotes</span></div></header>
    <div className="sy-analytics-bars-grid">{buckets.map((b,i)=><div className="sy-analytics-bar-month" key={i}><div className="sy-analytics-bar-pair"><span title={b.rfq+" RFQs"} style={{height:Math.max(2,b.rfq/maxBars*100)+"%"}}/><span title={b.quote+" Quotations"} style={{height:Math.max(2,b.quote/maxBars*100)+"%"}}/></div><small>{bucketNames[i]}</small></div>)}</div>
   </article>
   <article className="sy-analytics-panel sy-analytics-recent"><header><div><span className="sy-analytics-card-overline">LATEST UPDATES</span><h3>Recent trade activity</h3></div><button className="sy-analytics-view-all" onClick={()=>onNavigate("notifications")}>View all <ArrowRight size={15}/></button></header>
    {activity.length?<div className="sy-analytics-activity-list">{activity.map((item,i)=><button key={i} onClick={item.onClick} className="sy-analytics-activity-item"><span className="sy-analytics-activity-icon"><Activity size={16}/></span><span className="sy-analytics-activity-name"><strong>{item.name}</strong><small>{item.subtitle}</small></span><span className="sy-analytics-activity-date">{relativeDay(item.date)}</span></button>)}</div>:<div className="sy-analytics-empty"><ClipboardList size={27}/><strong>No saved activity yet</strong><p>Create a product draft or buying request to see it here.</p><button onClick={()=>onNavigate(seller?"add-product":"post-rfq")}>{seller?"Add a product":"Post buying request"} <ArrowRight size={14}/></button></div>}
   </article>
  </div>
  <div className="sy-analytics-footer"><div><Store size={21}/><span><strong>Build your global business</strong><small>Complete your company details for a professional marketplace presence.</small></span></div><button onClick={()=>onNavigate("profile")}>Manage company <ArrowRight size={15}/></button></div>
 </section>;
}
