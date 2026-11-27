"use client";
import {DirectTradeNotice} from "@/components/DirectTradeNotice";
import {CountryField} from "@/components/CountryFlag";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {MESSAGE_DRAFT_KEY,type SupplierMessageDraft} from "@/components/SupplierContactModal";
import {products} from "@/lib/catalog";
import {MessageSquare, Search, Building2, Store, Smile, Paperclip, ImagePlus, X, UserRound, ArrowLeft, Send, Package, ArrowRight, Plus, Trash2, ShieldCheck, ClipboardList, CheckCircle2} from "lucide-react";
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
 const [emojiOpen,setEmojiOpen]=useState(false);
 const [showProductCard,setShowProductCard]=useState(false);
 const attachmentInput=useRef<HTMLInputElement>(null);
 useEffect(()=>{
  const refresh=()=>{try{const v=JSON.parse(localStorage.getItem(MESSAGE_DRAFT_KEY)||"[]");setDrafts(Array.isArray(v)?v:[])}catch{setDrafts([])}};
  refresh();
  // Open the newest existing conversation immediately when Messages is selected.
  try{const saved=JSON.parse(localStorage.getItem(MESSAGE_DRAFT_KEY)||"[]");if(Array.isArray(saved)&&saved.length>0)setMobileOpen(true)}catch{}window.addEventListener("sylution-message-drafts-change",refresh);window.addEventListener("storage",refresh);
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
 const linkedProduct=active?products.find(p=>p.id===active.last.productId):undefined;
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
    
    {visible.length?<div className="sy-conversation-list">{visible.map(g=><button key={g.key} type="button" className={"sy-conversation-row"+(active?.key===g.key?" active":"")} onClick={()=>{setSelected(g.key);setShowProductCard(false);setNotice("");setMobileOpen(true)}}>
      <span className="sy-conversation-avatar"><Building2 size={19}/></span>
      <span className="sy-conversation-summary"><strong>{g.last.supplier}</strong><small>{g.last.message}</small></span>
      <span className="sy-conversation-date">{clock(g.last.createdAt)}</span>
    </button>)}</div>:<div className="sy-inbox-none"><MessageSquare size={32}/><strong>No messages yet</strong><button className="sy-green-action" onClick={onFind}>Find sellers</button></div>}
   </section>
   <section className="sy-inbox-content">{active?<div className="sy-conversation-detail">
     <header className="sy-conversation-chat-head">
       <button className="sy-conversation-back" onClick={()=>setMobileOpen(false)} aria-label="Back to messages"><ArrowLeft size={19}/></button>
       <span className="sy-conversation-avatar"><Building2 size={18}/></span>
       <div><strong>{active.last.supplier}</strong><small>{active.last.country} · Demo supplier</small></div>
       <Link className="sy-conversation-profile" href={"/suppliers/"+encodeURIComponent(active.last.supplier)+"?product="+encodeURIComponent(active.last.productId)} title="Open seller shop" aria-label="Open seller shop"><Store size={21}/><span>Shop</span></Link>
     </header>
     <div className="sy-conversation-product"><Package size={15}/><span>{active.last.product}</span>{linkedProduct&&<button type="button" onClick={()=>setShowProductCard(v=>!v)}>{showProductCard?"Hide product":"Show product"}</button>}</div>
     <div className="sy-conversation-messages">{[...active.records].reverse().map(d=><div key={d.id} className="sy-conversation-exchange"><div className="sy-chat-bubble buyer"><span>My message · Draft</span><p>{d.message}</p></div>{d.reply&&<div className="sy-chat-bubble seller"><span>Seller reply · Local preview</span><p>{d.reply}</p></div>}</div>)}</div>
     <form className="sy-chat-composer sy-chat-interactive" onSubmit={addMessage}>{linkedProduct&&showProductCard&&<div className="sy-chat-product-preview"><Link href={"/products/"+linkedProduct.slug}><img src={linkedProduct.image} alt=""/><span><strong>{linkedProduct.name}</strong><b>{linkedProduct.price}</b></span></Link><button type="button" aria-label="Dismiss product preview" onClick={()=>setShowProductCard(false)}><X size={17}/></button></div>}<label htmlFor="sy-chat-message">Message</label>
      {emojiOpen&&<div className="sy-emoji-panel" role="group" aria-label="Select an emoji">{["😀","😊","👍","❤️","🙏","🤝","🔥","✅","👋","🎉","📦","💬"].map(e=><button key={e} type="button" aria-label={"Insert "+e} onClick={()=>{setComposer(old=>old+e);setEmojiOpen(false)}}>{e}</button>)}</div>}
      <div className="sy-chat-input-row"><textarea id="sy-chat-message" value={composer} onChange={e=>setComposer(e.target.value)} placeholder="Type your message here" maxLength={3000} rows={1}/>
      <button className="sy-chat-tool" type="button" aria-label={emojiOpen?"Close emoji picker":"Add emoji"} title="Emoji" onClick={()=>setEmojiOpen(v=>!v)}>{emojiOpen?<X size={21}/>:<Smile size={22}/>}</button>
      <button className="sy-chat-tool" type="button" aria-label="Attach a file to draft" title="Attach file (local demo)" onClick={()=>attachmentInput.current?.click()}><Paperclip size={21}/></button>
      <input ref={attachmentInput} hidden type="file" accept="image/*,.pdf,.txt,.doc,.docx" onChange={e=>{const file=e.target.files?.[0];if(file){if(file.size>10*1024*1024){setNotice("File must be smaller than 10 MB.");}else{setComposer(current=>(current.trim()?current+"\n":"")+"[File to attach: "+file.name+"]");setNotice("Filename added to local draft. File is not uploaded.");}e.target.value=""}}}/>
      <button className="sy-green-action sy-chat-send" type="submit" aria-label="Save message draft" disabled={!composer.trim()}><Send size={18}/></button></div>
      {notice&&<small className={/unable|failed|error|smaller/i.test(notice)?"sy-status-error":"sy-status-info"} role="status">{notice}</small>}<small className="sy-chat-demo-note">Demo · Messages and files are not sent.</small>
     </form>
    </div>:<div className="sy-conversation-empty"><MessageSquare size={43}/><h2>No messages yet</h2><button className="sy-soft-action" onClick={onFind}>Find sellers</button></div>}</section>
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
 const [rfqImages,setRfqImages]=useState<File[]>([]);
 const [rfqImageUrls,setRfqImageUrls]=useState<string[]>([]);
 const [notice,setNotice]=useState("");
 useEffect(()=>{const urls=rfqImages.map(file=>URL.createObjectURL(file));setRfqImageUrls(urls);return()=>urls.forEach(url=>URL.revokeObjectURL(url));},[rfqImages]);
 function chooseRfqImages(files:FileList|null){
  if(!files)return;
  const picked=Array.from(files);
  if(picked.length>5||picked.some(file=>!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>5*1024*1024)){setNotice("Choose up to 5 JPG, PNG or WebP images, 5 MB maximum per image.");return}
  setRfqImages(picked);setNotice("");
 }

 function save(e:React.FormEvent){e.preventDefault();if(!product.trim()||!Number(quantity)||Number(quantity)<=0||!port.trim()){setNotice("Complete the product, quantity and destination fields.");return}
 const rfq:StoredRfq={product:product.trim(),quantity:Number(quantity),unit,targetPrice:price?currency+" "+price:"",destinationCountry:preferred.trim(),port:port.trim(),incoterm:trade,paymentTerm:payment,shippingMethod:shipping,preferredCountry:preferred,leadTime:lead,documents:docs,message:notes,attachmentNames:rfqImages.map(file=>file.name),attributes:attributes.filter(a=>a.name.trim()&&a.value.trim()),createdAt:new Date().toISOString(),status:"Draft · browser only"};
 try{const records=readStored();localStorage.setItem(KEY,JSON.stringify([...records,rfq]));window.dispatchEvent(new Event("sylution-rfq-change"));setNotice("Demo buying request saved. No supplier has been contacted.");onSaved()}catch{setNotice("Could not save. Your browser may have blocked local storage.")}}
 return <div className="sy-post-rfq">
   <div className="sy-rfq-top"><span className="sy-mini-overline">SYLUTION SOURCING</span><h2>Post a buying request</h2><p>Describe exactly what you need. Use structured requirements to compare supplier quotations later.</p><span className="sy-rfq-demo-tag">Demo · Saves only to this browser</span></div>
   <form className="sy-rfq-builder" onSubmit={save}>
     <label className="sy-rfq-full">What product are you sourcing? <span>*</span><input value={product} onChange={e=>setProduct(e.target.value)} required placeholder="e.g. Export-grade Nigerian ginger"/></label>
     <div className="sy-rfq-image-field">
       <div className="sy-rfq-image-heading"><strong>Product reference images <span>(optional)</span></strong><small>Help suppliers understand what you need</small></div>
       <label className="sy-rfq-image-upload"><ImagePlus size={24}/><strong>Add product photos</strong><small>JPG, PNG, WebP · Up to 5 images · 5 MB each</small><input aria-label="Choose product reference photos" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e=>{chooseRfqImages(e.target.files);e.target.value="";}}/></label>
       {rfqImageUrls.length>0&&<div className="sy-rfq-image-grid">{rfqImageUrls.map((url,i)=><div className="sy-rfq-image-tile" key={url}><img src={url} alt={"Reference product photo "+(i+1)}/><button type="button" aria-label={"Remove photo "+(i+1)} onClick={()=>setRfqImages(prev=>prev.filter((_,j)=>j!==i))}><X size={14}/></button></div>)}</div>}
       <small className="sy-rfq-image-disclaimer">Demo: photos are previewed here but not uploaded. Only their filenames are saved with your local request draft.</small>
     </div>
     <div className="sy-rfq-attrs"><div><strong>Custom attributes</strong><small>Grade, packaging, origin, specifications...</small></div>{attributes.map((a,i)=><div className="sy-rfq-attr-row" key={i}><input aria-label={"Attribute name "+(i+1)} placeholder="Attribute name" value={a.name} onChange={e=>setAttributes(items=>items.map((x,j)=>i===j?{...x,name:e.target.value}:x))}/><input aria-label={"Attribute value "+(i+1)} placeholder="Value" value={a.value} onChange={e=>setAttributes(items=>items.map((x,j)=>i===j?{...x,value:e.target.value}:x))}/><button type="button" onClick={()=>setAttributes(items=>items.filter((_,j)=>j!==i))} aria-label="Remove attribute"><Trash2 size={16}/></button></div>)}<button type="button" className="sy-attr-add" onClick={()=>setAttributes(items=>[...items,{name:"",value:""}])}><Plus size={16}/> Add custom attribute</button></div>
     <div className="sy-rfq-fields">
       <label>Quantity <span>*</span><div className="sy-quantity-control"><input required type="number" min=".01" step="any" value={quantity} onChange={e=>setQuantity(e.target.value)} placeholder="100"/><select value={unit} aria-label="Quantity unit" onChange={e=>setUnit(e.target.value)}>{["MT","KG","Tons","Pieces","Sets","Containers","Litres","Bags"].map(x=><option key={x}>{x}</option>)}</select></div></label>
       <label>Target price (optional)<div className="sy-quantity-control"><select value={currency} aria-label="Price currency" onChange={e=>setCurrency(e.target.value)}><option>USD</option><option>NGN</option><option>EUR</option></select><input type="number" min="0" value={price} onChange={e=>setPrice(e.target.value)} placeholder="Budget"/></div></label>
       <label>Trade term<select value={trade} onChange={e=>setTrade(e.target.value)}>{["FOB","CIF","EXW","FCA","DAP","DDP","Flexible"].map(x=><option key={x}>{x}</option>)}</select></label>
       <label>Payment term<select value={payment} onChange={e=>setPayment(e.target.value)}>{["Bank transfer","Letter of credit","Independent escrow (external)","Negotiable"].map(x=><option key={x}>{x}</option>)}</select></label>
       <label>Destination city / port <span>*</span><input value={port} required onChange={e=>setPort(e.target.value)} placeholder="e.g. Lagos Apapa Port"/></label>
       <label>Shipping method<select value={shipping} onChange={e=>setShipping(e.target.value)}><option>Sea freight</option><option>Air freight</option><option>Road freight</option><option>Flexible</option></select></label>
       <label>Preferred supplier country<CountryField value={preferred} onChange={setPreferred} includeAny label="Preferred supplier country"/></label>
       <label>Required lead time (days)<input type="number" min="1" value={lead} onChange={e=>setLead(e.target.value)} placeholder="30"/></label>
       <label className="sy-rfq-full">Required documents<input value={docs} onChange={e=>setDocs(e.target.value)} placeholder="Certificate of origin, test report, etc."/></label>
       <label className="sy-rfq-full">Additional requirements<textarea rows={4} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Quality, packaging, specifications, delivery expectations..."/></label>
     </div>
     <DirectTradeNotice compact/>
     <div className="sy-rfq-save-note"><ShieldCheck size={18}/><span>This is a local preview. Smart matching, publication and supplier responses are not yet active.</span></div>
     <button className="sy-green-action sy-post-submit" type="submit">Save demo buying request <ArrowRight size={17}/></button>{notice&&<p className={"sy-rfq-notice "+(/could not|complete the/i.test(notice)?"sy-status-error":"sy-status-info")} role={/could not|complete the/i.test(notice)?"alert":"status"}>{notice}</p>}
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
