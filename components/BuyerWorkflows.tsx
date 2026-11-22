import {CountryField} from "@/components/CountryFlag";
"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {MessageSquare, Search, Settings, Send, Package, ArrowRight, Plus, Trash2, ShieldCheck, ClipboardList, CheckCircle2} from "lucide-react";
type StoredRfq={product?:string;productId?:string;quantity?:number;unit?:string;targetPrice?:string;destinationCountry?:string;port?:string;incoterm?:string;paymentTerm?:string;shippingMethod?:string;preferredCountry?:string;leadTime?:string;documents?:string;company?:string;email?:string;message?:string;createdAt?:string;status?:string;attributes?:{name:string;value:string}[]};
const KEY="sylution_demo_rfqs";
function readStored():StoredRfq[]{try{const value=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(value)?value:[]}catch{return []}}
export function MessagesPreview({onFind,onRequest}:{onFind:()=>void;onRequest:()=>void}){
 const [filter,setFilter]=useState<"All"|"Unread"|"Need reply">("All");
 const [search,setSearch]=useState("");
 return <div className="sy-inbox-shell">
   <section className="sy-inbox-list" aria-label="Message conversations">
    <div className="sy-inbox-actions"><div className="sy-inbox-tabs">{(["All","Unread","Need reply"] as const).map(t=><button className={filter===t?"active":""} onClick={()=>setFilter(t)} key={t} aria-pressed={filter===t}>{t}</button>)}</div><button aria-label="Messaging settings preview" title="Settings available when messaging launches" onClick={()=>setFilter("All")}><Settings size={18}/></button></div>
    <label className="sy-inbox-search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search conversations" aria-label="Search conversations"/></label>
    <div className="sy-inbox-none"><MessageSquare size={33}/><strong>No supplier conversations yet</strong><p>{search?"No messages match your search.":"Messages and quotations will appear here after real messaging is connected."}</p><button className="sy-green-action" onClick={onFind}>Find products</button><button className="sy-soft-action" onClick={onRequest}>Post a buying request</button></div>
   </section>
   <section className="sy-inbox-content"><div className="sy-inbox-illustration"><MessageSquare size={50}/><span className="sy-inbox-orb one"/><span className="sy-inbox-orb two"/></div><h2>Welcome to SYLUTION Messages</h2><p>Keep quotations, supplier conversations, and follow-ups organized in one workspace.</p><div className="sy-inbox-benefits"><span><ShieldCheck size={16}/> Private conversations</span><span><ClipboardList size={16}/> RFQ-linked messages</span><span><CheckCircle2 size={16}/> Easy follow-up</span></div><small>Preview only — no messages are sent or received yet.</small></section>
 </div>
}
export function PostBuyingRequest({onSaved}:{onSaved:()=>void}){
 const [product,setProduct]=useState("");
 const [quantity,setQuantity]=useState("");
 const [unit,setUnit]=useState("MT");
 const [price,setPrice]=useState("");
 const [currency,setCurrency]=useState("USD");
 const [trade,setTrade]=useState("FOB");
 const [payment,setPayment]=useState("Bank transfer");
 const [port,setPort]=useState("");
 const [shipping,setShipping]=useState("Sea freight");
 const [preferred,setPreferred]=useState("");
 const [lead,setLead]=useState("");
 const [docs,setDocs]=useState("");
 const [notes,setNotes]=useState("");
 const [attributes,setAttributes]=useState<{name:string;value:string}[]>([]);
 const [notice,setNotice]=useState("");
 function save(e:React.FormEvent){e.preventDefault();if(!product.trim()||!Number(quantity)||Number(quantity)<=0||!port.trim()){setNotice("Complete the product, quantity and destination fields.");return}
 const rfq:StoredRfq={product:product.trim(),quantity:Number(quantity),unit,targetPrice:price?currency+" "+price:"",destinationCountry:preferred.trim(),port:port.trim(),incoterm:trade,paymentTerm:payment,shippingMethod:shipping,preferredCountry:preferred,leadTime:lead,documents:docs,message:notes,attributes:attributes.filter(a=>a.name.trim()&&a.value.trim()),createdAt:new Date().toISOString(),status:"Draft · browser only"};
 try{const records=readStored();localStorage.setItem(KEY,JSON.stringify([...records,rfq]));window.dispatchEvent(new Event("sylution-rfq-change"));setNotice("Demo buying request saved. No supplier has been contacted.");onSaved()}catch{setNotice("Could not save. Your browser may have blocked local storage.")}}
 return <div className="sy-post-rfq">
   <div className="sy-rfq-top"><span className="sy-mini-overline">SYLUTION SOURCING</span><h2>Post a buying request</h2><p>Describe exactly what you need. Use structured requirements to compare supplier quotations later.</p><span className="sy-rfq-demo-tag">Demo · Saves only to this browser</span></div>
   <form className="sy-rfq-builder" onSubmit={save}>
     <label className="sy-rfq-full">What product are you sourcing? <span>*</span><input value={product} onChange={e=>setProduct(e.target.value)} required placeholder="e.g. Export-grade Nigerian ginger"/></label>
     <div className="sy-rfq-attrs"><div><strong>Custom attributes</strong><small>Grade, packaging, origin, specifications...</small></div>{attributes.map((a,i)=><div className="sy-rfq-attr-row" key={i}><input aria-label={"Attribute name "+(i+1)} placeholder="Attribute name" value={a.name} onChange={e=>setAttributes(items=>items.map((x,j)=>i===j?{...x,name:e.target.value}:x))}/><input aria-label={"Attribute value "+(i+1)} placeholder="Value" value={a.value} onChange={e=>setAttributes(items=>items.map((x,j)=>i===j?{...x,value:e.target.value}:x))}/><button type="button" onClick={()=>setAttributes(items=>items.filter((_,j)=>j!==i))} aria-label="Remove attribute"><Trash2 size={16}/></button></div>)}<button type="button" className="sy-attr-add" onClick={()=>setAttributes(items=>[...items,{name:"",value:""}])}><Plus size={16}/> Add custom attribute</button></div>
     <div className="sy-rfq-fields">
       <label>Quantity <span>*</span><div className="sy-quantity-control"><input required type="number" min=".01" step="any" value={quantity} onChange={e=>setQuantity(e.target.value)} placeholder="100"/><select value={unit} aria-label="Quantity unit" onChange={e=>setUnit(e.target.value)}>{["MT","KG","Tons","Pieces","Sets","Containers","Litres","Bags"].map(x=><option key={x}>{x}</option>)}</select></div></label>
       <label>Target price (optional)<div className="sy-quantity-control"><select value={currency} aria-label="Price currency" onChange={e=>setCurrency(e.target.value)}><option>USD</option><option>NGN</option><option>EUR</option></select><input type="number" min="0" value={price} onChange={e=>setPrice(e.target.value)} placeholder="Budget"/></div></label>
       <label>Trade term<select value={trade} onChange={e=>setTrade(e.target.value)}>{["FOB","CIF","EXW","FCA","DAP","DDP","Flexible"].map(x=><option key={x}>{x}</option>)}</select></label>
       <label>Payment term<select value={payment} onChange={e=>setPayment(e.target.value)}>{["Bank transfer","Letter of credit","Escrow preferred","Negotiable"].map(x=><option key={x}>{x}</option>)}</select></label>
       <label>Destination city / port <span>*</span><input value={port} required onChange={e=>setPort(e.target.value)} placeholder="e.g. Lagos Apapa Port"/></label>
       <label>Shipping method<select value={shipping} onChange={e=>setShipping(e.target.value)}><option>Sea freight</option><option>Air freight</option><option>Road freight</option><option>Flexible</option></select></label>
       <label>Preferred supplier country<CountryField value={preferred} onChange={setPreferred} includeAny label="Preferred supplier country"/></label>
       <label>Required lead time (days)<input type="number" min="1" value={lead} onChange={e=>setLead(e.target.value)} placeholder="30"/></label>
       <label className="sy-rfq-full">Required documents<input value={docs} onChange={e=>setDocs(e.target.value)} placeholder="Certificate of origin, test report, etc."/></label>
       <label className="sy-rfq-full">Additional requirements<textarea rows={4} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Quality, packaging, specifications, delivery expectations..."/></label>
     </div>
     <div className="sy-rfq-save-note"><ShieldCheck size={18}/><span>This is a local preview. Smart matching, publication and supplier responses are not yet active.</span></div>
     <button className="sy-green-action sy-post-submit" type="submit">Save demo buying request <ArrowRight size={17}/></button>{notice&&<p className="sy-rfq-notice" role="status">{notice}</p>}
   </form>
   <div className="sy-rfq-how"><h3>How sourcing will work</h3><div>{[{n:"01",t:"Describe your need",d:"Add product requirements and commercial terms."},{n:"02",t:"Match suppliers",d:"Supplier matching launches with the backend."},{n:"03",t:"Compare quotations",d:"Assess price, MOQ, quality and lead time."}].map(step=><div key={step.n}><span>{step.n}</span><strong>{step.t}</strong><small>{step.d}</small></div>)}</div></div>
 </div>;
}
export function RequestManager({onCreate}:{onCreate:()=>void}){
 const [rfqs,setRfqs]=useState<StoredRfq[]>([]);
 const [query,setQuery]=useState("");
 const [state,setState]=useState("All requests");
 useEffect(()=>{const refresh=()=>setRfqs(readStored());refresh();window.addEventListener("sylution-rfq-change",refresh);return()=>window.removeEventListener("sylution-rfq-change",refresh)},[]);
 const visible=rfqs.map((r,i)=>({r,i})).filter(({r})=>(r.product||"").toLowerCase().includes(query.toLowerCase())&&(state==="All requests"||(r.status||"Draft · browser only").includes("Draft"))).reverse();
 return <div className="sy-manager"><div className="sy-manager-head"><div><h2>Buying Requests</h2><span>{rfqs.length} locally saved requests</span></div><button className="sy-green-action" onClick={onCreate}><Plus size={16}/> Post Buying Request</button></div><div className="sy-manager-filters"><Search size={17}/><input placeholder="Search buying requests" aria-label="Search buying requests" value={query} onChange={e=>setQuery(e.target.value)}/><select aria-label="Filter buying requests" value={state} onChange={e=>setState(e.target.value)}><option>All requests</option><option>Draft only</option></select></div><div className="sy-manager-scroll"><table><thead><tr><th>Buying request</th><th>Quantity</th><th>Status</th><th>Posted</th><th>Actions</th></tr></thead><tbody>{visible.map(({r,i})=><tr key={i}><td><strong>{r.product||"Unnamed product"}</strong><small>{r.port||r.destinationCountry||"Location not provided"}</small></td><td>{r.quantity||"—"} {r.unit||""}</td><td><span className="sy-request-draft">{r.status||"Demo draft"}</span></td><td>{r.createdAt?new Date(r.createdAt).toLocaleDateString():"—"}</td><td><button aria-label={"Delete "+r.product} onClick={()=>{if(!window.confirm("Delete this demo request?"))return;const next=rfqs.filter((_,j)=>j!==i);localStorage.setItem(KEY,JSON.stringify(next));setRfqs(next);window.dispatchEvent(new Event("sylution-rfq-change"));}}><Trash2 size={16}/></button></td></tr>)}</tbody></table></div>{!visible.length&&<div className="sy-manager-empty"><Package size={34}/><strong>No matching buying requests</strong><p>Create your first request or change the search filters.</p><button className="sy-green-action" onClick={onCreate}>Create request <ArrowRight size={15}/></button></div>}<small className="sy-manager-disclaimer">Prototype — no request is publicly posted and no supplier can respond yet.</small></div>
}