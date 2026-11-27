"use client";
import {CountryField} from "@/components/CountryFlag";
import {useEffect,useState} from "react";
import Link from "next/link";
import {MESSAGE_DRAFT_KEY,type SupplierMessageDraft} from "@/components/SupplierContactModal";
import {MessageSquare, Search, Building2, UserRound, ArrowLeft, Send, Package, ArrowRight, Plus, Trash2, ShieldCheck, ClipboardList, CheckCircle2} from "lucide-react";
type StoredRfq={product?:string;productId?:string;quantity?:number;unit?:string;targetPrice?:string;destinationCountry?:string;port?:string;incoterm?:string;paymentTerm?:string;shippingMethod?:string;preferredCountry?:string;leadTime?:string;documents?:string;company?:string;email?:string;message?:string;createdAt?:string;status?:string;attachmentNames?:string[];attributes?:{name:string;value:string}[]};
const KEY="sylution_demo_rfqs";
function readStored():StoredRfq[]{try{const value=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(value)?value:[]}catch{return []}}
export function MessagesPreview({onFind,onRequest}:{onFind:()=>void;onRequest:()=>void}){
 const [search,setSearch]=useState("");
 const [drafts,setDrafts]=useState<SupplierMessageDraft[]>([]);
 const [selected,setSelected]=useState<string|null>(null);
 const [composer,setComposer]=useState("");
 const [notice,setNotice]=useState("");
 const [mobileOpen,setMobileOpen]=useState(false);
 useEffect(()=>{
  const refresh=()=>{try{const v=JSON.parse(localStorage.getItem(MESSAGE_DRAFT_KEY)||"[]");setDrafts(Array.isArray(v)?v:[])}catch{setDrafts([])}};
  refresh();window.addEventListener("sylution-message-drafts-change",refresh);window.addEventListener("storage",refresh);
  return()=>{window.removeEventListener("sylution-message-drafts-change",refresh);window.removeEventListener("storage",refresh)}
 },[]);
 const groups=Array.from(drafts.reduce((map,d)=>{
  const key=d.supplier.trim().toLowerCase();
  const list=map.get(key)||[];list.push(d);map.set(key,list);return map;
 },new Map<string,SupplierMessageDraft[]>()).entries()).map(([key,records])=>({
  key,records:[...records].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)),
  last:[...records].sort((a,b)=>b.createdAt.localeCompare(a.createdAt))[0]
 })).sort((a,b)=>b.last.createdAt.localeCompare(a.last.createdAt));
 const visible=groups.filter(g=>[g.last.supplier,g.last.product,...g.records.map(x=>x.message)].join(" ").toLowerCase().includes(search.toLowerCase()));
 const active=visible.find(g=>g.key===selected)||visible[0];
 function addMessage(e:React.FormEvent){e.preventDefault();if(!active||!composer.trim())return;
  const last=active.last;
  const newDraft:SupplierMessageDraft={...last,id:globalThis.crypto?.randomUUID?.()||String(Date.now()),message:composer.trim(),createdAt:new Date().toISOString(),reply:undefined,repliedAt:undefined,status:"Draft · browser only"};
  try{const next=[newDraft,...drafts];localStorage.setItem(MESSAGE_DRAFT_KEY,JSON.stringify(next));setDrafts(next);setComposer("");setNotice("Saved on this device · Not sent");window.dispatchEvent(new Event("sylution-message-drafts-change"))}catch{setNotice("Unable to save draft on this device")}
 }
 const clock=(iso:string)=>{const d=new Date(iso);return Number.isNaN(d.getTime())?"":d.toLocaleDateString(undefined,{month:"short",day:"numeric"})};
 return <div className={"sy-inbox-shell sy-conversation-shell"+(mobileOpen?" sy-show-chat":"")}>
   <section className="sy-inbox-list" aria-label="Conversations">
    <div className="sy-conversation-list-head"><Link href="/account?tab=overview" className="sy-messages-mobile-back" aria-label="Back to account"><ArrowLeft size={22}/></Link><h2>Messages</h2><span className="sy-messages-mobile-count">{groups.length}</span><small>Local preview</small></div>
    <label className="sy-inbox-search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search people or messages" aria-label="Search people or messages"/></label>
    <div className="sy-conversation-filter">Conversations <span>{visible.length}</span></div>
    {visible.length?<div className="sy-conversation-list">{visible.map(g=><button key={g.key} type="button" className={"sy-conversation-row"+(active?.key===g.key?" active":"")} onClick={()=>{setSelected(g.key);setNotice("");setMobileOpen(true)}}>
      <span className="sy-conversation-avatar"><Building2 size={19}/></span>
      <span className="sy-conversation-summary"><strong>{g.last.supplier}</strong><small>{g.last.message}</small></span>
      <span className="sy-conversation-date">{clock(g.last.createdAt)}</span>
    </button>)}</div>:<div className="sy-inbox-none"><MessageSquare size={32}/><strong>No conversations yet</strong><p>Messages to suppliers will be organized here by company.</p><button className="sy-green-action" onClick={onFind}>Browse products</button></div>}
   </section>
   <section className="sy-inbox-content">{active?<div className="sy-conversation-detail">
     <header className="sy-conversation-chat-head">
       <button className="sy-conversation-back" onClick={()=>setMobileOpen(false)} aria-label="Back to messages"><ArrowLeft size={19}/></button>
       <span className="sy-conversation-avatar"><Building2 size={18}/></span>
       <div><strong>{active.last.supplier}</strong><small>{active.last.country} · Demo supplier</small></div>
       <Link className="sy-conversation-profile" href={"/suppliers/"+encodeURIComponent(active.last.supplier)}><UserRound size={15}/> Public profile</Link>
     </header>
     <div className="sy-conversation-product"><Package size={15}/><span>{active.last.product}</span></div>
     <div className="sy-conversation-messages">{[...active.records].reverse().map(d=><div key={d.id} className="sy-conversation-exchange"><div className="sy-chat-bubble buyer"><span>My message · Draft</span><p>{d.message}</p></div>{d.reply&&<div className="sy-chat-bubble seller"><span>Seller reply · Local preview</span><p>{d.reply}</p></div>}</div>)}</div>
     <form className="sy-chat-composer" onSubmit={addMessage}><label htmlFor="sy-chat-message">Message</label><div><textarea id="sy-chat-message" value={composer} onChange={e=>setComposer(e.target.value)} placeholder="Type your message..." maxLength={3000} rows={2}/><button className="sy-green-action" type="submit" aria-label="Save message draft" disabled={!composer.trim()}><Send size={17}/></button></div>{notice&&<small role="status">{notice}</small>}<small>Browser-only preview · Messages are not delivered.</small></form>
    </div>:<div className="sy-conversation-empty"><MessageSquare size={43}/><h2>Your conversations</h2><p>Select a supplier to view messages. Live messaging is not connected yet.</p><button className="sy-soft-action" onClick={onFind}>Find suppliers</button></div>}</section>
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
 const [expanded,setExpanded]=useState<number|null>(null);
 useEffect(()=>{
  const refresh=()=>{setRfqs(readStored());setExpanded(null);};
  refresh();
  window.addEventListener("sylution-rfq-change",refresh);
  window.addEventListener("storage",refresh);
  return ()=>{
   window.removeEventListener("sylution-rfq-change",refresh);
   window.removeEventListener("storage",refresh);
  };
 },[]);
 const visible=rfqs.map((request,index)=>({request,index})).filter(({request})=>
  [request.product,request.destinationCountry].some(value=>value?.toLowerCase().includes(query.trim().toLowerCase()))
 ).reverse();

 return (
  <section className="sy-manager">
   <div className="sy-manager-head">
    <div><h2>My Requests</h2><span>{rfqs.length} locally saved requests</span></div>
    <button className="sy-green-action" onClick={onCreate}><Plus size={16}/> New Request</button>
   </div>
   {rfqs.length>0&&<div className="sy-manager-filters"><Search size={17}/><input placeholder="Search products or destinations" aria-label="Search requests" value={query} onChange={e=>setQuery(e.target.value)}/></div>}
   {visible.length>0&&<table className="trade-requests">
    <thead><tr><th scope="col">Product</th><th scope="col">Quantity</th><th scope="col">Status</th><th scope="col">Saved</th><th scope="col">Actions</th></tr></thead>
    <tbody>{visible.map(({request,index})=><RequestRows key={index} request={request} index={index} expanded={expanded===index} onToggle={()=>setExpanded(expanded===index?null:index)} onDelete={()=>{
      if(!window.confirm("Delete this demo request?"))return;
      localStorage.setItem(KEY,JSON.stringify(rfqs.filter((_,i)=>i!==index)));
      window.dispatchEvent(new Event("sylution-rfq-change"));
    }}/>)}</tbody>
   </table>}
   {!visible.length&&<div className="sy-manager-empty"><Package size={30}/><strong>{rfqs.length?"No matching requests":"No saved requests yet"}</strong><p>{rfqs.length?"Try a different product or destination.":"Browse products and save a quote draft to find it here."}</p>{!rfqs.length&&<Link href="/#products">Browse Products <ArrowRight size={15}/></Link>}</div>}
   <small className="sy-manager-disclaimer">Demo drafts are saved in this browser.</small>
  </section>
 );
}

function RequestRows({request,index,expanded,onToggle,onDelete}:{request:StoredRfq;index:number;expanded:boolean;onToggle:()=>void;onDelete:()=>void}){
 const detailId="request-details-"+index;
 return <>
  <tr className="trade-request-row">
   <td><strong>{request.product||"Unnamed product"}</strong><small>{[request.destinationCountry,request.port].filter(Boolean).join(" · ")||"Location not provided"}</small></td>
   <td><span className="trade-cell-label">Quantity </span>{request.quantity??"—"} {request.unit}</td>
   <td><span className="sy-request-draft">{request.status||"Demo draft"}</span></td>
   <td><span className="trade-cell-label">Saved </span>{request.createdAt?new Date(request.createdAt).toLocaleDateString():"—"}</td>
   <td className="trade-request-actions"><button type="button" aria-expanded={expanded} aria-controls={detailId} onClick={onToggle}>{expanded?"Hide Draft":"View Draft"}</button><button type="button" aria-label={"Delete "+(request.product||"draft")} onClick={onDelete}><Trash2 size={16}/></button></td>
  </tr>
  <tr className="trade-request-detail" id={detailId} hidden={!expanded}><td colSpan={5}>
   <strong>Message</strong><p>{request.message?.trim()||"No message added."}</p>
   {!!request.attachmentNames?.length&&<><strong>Attachment names</strong><ul>{request.attachmentNames.map((name,i)=><li key={i}>{name}</li>)}</ul></>}
   {request.incoterm&&<p>Trade terms: {request.incoterm}</p>}
   {request.paymentTerm&&<p>Payment terms: {request.paymentTerm}</p>}
   {!!request.attributes?.length&&<dl>{request.attributes.map(({name,value},i)=><div key={i}><dt>{name}</dt><dd>{value}</dd></div>)}</dl>}
  </td></tr>
 </>;
}
