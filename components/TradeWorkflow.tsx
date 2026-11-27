"use client";
import {useEffect,useState} from "react";
import {ClipboardCheck,FileText,PackageCheck,Plus,Send,Truck,ShieldAlert,Trash2,CheckCircle2,Clock,Search} from "lucide-react";
import {DirectTradeNotice} from "@/components/DirectTradeNotice";
import {StatusNotice,type StatusTone} from "@/components/StatusUI";
import {TRADE_CURRENCIES,currencyLabel} from "@/lib/global-currencies";
import {useAccountDefaults} from "@/lib/account-defaults";
import {CountryFlag} from "@/components/CountryFlag";

type QuoteStatus="Draft"|"Sent (demo)"|"Accepted (demo)"|"Rejected (demo)";
type Quote={id:string;product:string;buyer:string;seller:string;quantity:number;unit:string;unitPrice:number;currency:string;shipping:string;terms:string;validUntil:string;notes:string;status:QuoteStatus;createdAt:string};
type OrderStatus="Agreed"|"Processing"|"Shipped"|"Delivered"|"Cancelled";
type Order={id:string;quoteId:string;product:string;buyer:string;seller:string;quantity:number;unit:string;total:number;currency:string;shipping:string;terms:string;status:OrderStatus;createdAt:string;tracking:string};
const QKEY="sylution_demo_trade_quotes";
const OKEY="sylution_demo_trade_orders";
function read<T>(key:string):T[]{try{const x:unknown=JSON.parse(localStorage.getItem(key)||"[]");return Array.isArray(x)?x as T[]:[]}catch{return []}}
function id(){return globalThis.crypto?.randomUUID?.()||String(Date.now())}
function money(value:number,currency:string){return new Intl.NumberFormat("en",{style:"currency",currency:currency||"USD",maximumFractionDigits:2}).format(value)}
function date(v:string){if(!v)return"Not specified";const d=new Date(v);return Number.isNaN(d.getTime())?v:d.toLocaleDateString()}
export function TradeWorkflow({view,role,company}:{view:"quotations"|"orders";role:"buyer"|"supplier";company:string}){
 const account=useAccountDefaults();
 const [currencyChanged,setCurrencyChanged]=useState(false);
 useEffect(()=>{if(account.country&&!currencyChanged)setDraft(v=>({...v,currency:account.currency}))},[account.country,account.currency,currencyChanged]);
 const [quotes,setQuotes]=useState<Quote[]>([]);const [orders,setOrders]=useState<Order[]>([]);
 const [form,setForm]=useState(false);const [notice,setNotice]=useState("");const [noticeTone,setNoticeTone]=useState<StatusTone>("info");const [search,setSearch]=useState("");
 function showNotice(message:string,tone:StatusTone="info"){setNoticeTone(tone);setNotice(message)}
 const [selected,setSelected]=useState<string|null>(null);
 const [draft,setDraft]=useState({product:"",buyer:"",quantity:"",unit:"Pieces",unitPrice:"",currency:"USD",shipping:"",terms:"Bank transfer arranged directly",validUntil:"",notes:""});
 useEffect(()=>{setQuotes(read<Quote>(QKEY));setOrders(read<Order>(OKEY))},[]);
 function updateQuotes(next:Quote[]){try{localStorage.setItem(QKEY,JSON.stringify(next));setQuotes(next);return true}catch{showNotice("Browser storage unavailable.","error");return false}}
 function updateOrders(next:Order[]){try{localStorage.setItem(OKEY,JSON.stringify(next));setOrders(next);return true}catch{showNotice("Browser storage unavailable.","error");return false}}
 function saveQuote(e:React.FormEvent){e.preventDefault();const q=Number(draft.quantity),p=Number(draft.unitPrice);
  if(!draft.product.trim()||!draft.buyer.trim()||!(q>0)||!(p>=0)||!Number.isFinite(p)){showNotice("Enter product, buyer, quantity and a valid price.","error");return}
  const quote:Quote={id:id(),product:draft.product.trim(),buyer:draft.buyer.trim(),seller:company||"Demo seller",quantity:q,unit:draft.unit,unitPrice:p,currency:draft.currency,shipping:draft.shipping.trim(),terms:draft.terms.trim(),validUntil:draft.validUntil,notes:draft.notes.trim(),status:"Draft",createdAt:new Date().toISOString()};
  if(updateQuotes([quote,...quotes])){setForm(false);showNotice("Quotation saved locally. It has not been sent to a real buyer.","info");setDraft({product:"",buyer:"",quantity:"",unit:"Pieces",unitPrice:"",currency:account.country?account.currency:"USD",shipping:"",terms:"Bank transfer arranged directly",validUntil:"",notes:""})}
 }
 function changeQuote(quote:Quote,status:QuoteStatus){const next=quotes.map(q=>q.id===quote.id?{...q,status}:q);if(!updateQuotes(next))return;showNotice(status==="Sent (demo)"?"Marked as sent for demonstration only; no buyer was notified.":"Quotation status changed in local demo.","info");}
 function accept(quote:Quote){if(orders.some(o=>o.quoteId===quote.id)){showNotice("This quotation already has an order.","warning");return}
  const order:Order={id:id(),quoteId:quote.id,product:quote.product,buyer:quote.buyer,seller:quote.seller,quantity:quote.quantity,unit:quote.unit,total:quote.unitPrice*quote.quantity,currency:quote.currency,shipping:quote.shipping,terms:quote.terms,status:"Agreed",createdAt:new Date().toISOString(),tracking:""};
  if(updateOrders([order,...orders])){changeQuote(quote,"Accepted (demo)");showNotice("Demo order created. No payment has been collected and no seller notified.","info");}
 }
 function advance(order:Order,next:OrderStatus){if(updateOrders(orders.map(o=>o.id===order.id?{...o,status:next}:o)))showNotice("Local order status updated. This is not proof of real shipment or payment.","warning");}
 const visibleQuotes=quotes.filter(q=>[q.product,q.buyer,q.seller,q.id].join(" ").toLowerCase().includes(search.toLowerCase()));
 const visibleOrders=orders.filter(o=>[o.product,o.buyer,o.seller,o.id].join(" ").toLowerCase().includes(search.toLowerCase()));
 return <section className="sy-trade-workflow">
  <div className="sy-trade-workflow-head"><div><span className="sy-mini-overline">SYLUTION / DIRECT TRADE</span><h2>{view==="quotations"?"Quotations":"Order Management"}</h2><p>{view==="quotations"?"Prepare and track quotations with buyers.":"Track trade agreements and delivery milestones without collecting payments."}</p></div>{view==="quotations"&&role==="supplier"&&<button className="sy-green-action" onClick={()=>setForm(!form)} type="button"><Plus size={16}/>{form?"Close form":"Create Quotation"}</button>}</div>
  {account.country&&<p className="sy-account-origin-hint"><CountryFlag country={account.country} compact/> <span>Account region: <strong>{account.country}</strong>. Currency defaults to {account.currency}; you may change it per quotation.</span></p>}
  <DirectTradeNotice/>
  {notice&&<StatusNotice tone={noticeTone}>{notice}</StatusNotice>}
  {view==="quotations"&&form&&role==="supplier"&&<form className="sy-trade-form" onSubmit={saveQuote}>
   <h3>New quotation <span>Local draft</span></h3>
   <div className="sy-trade-form-grid">
    <label className="wide">Product / service *<input required maxLength={120} value={draft.product} onChange={e=>setDraft(v=>({...v,product:e.target.value}))} placeholder="e.g. 5kW Hybrid Inverter"/></label>
    <label>Buyer / company *<input required maxLength={120} value={draft.buyer} onChange={e=>setDraft(v=>({...v,buyer:e.target.value}))} placeholder="Buyer company"/></label>
    <label>Currency<select value={draft.currency} onChange={e=>{setCurrencyChanged(true);setDraft(v=>({...v,currency:e.target.value}))}}>{TRADE_CURRENCIES.map(c=><option key={c} value={c}>{currencyLabel(c)}</option>)}</select></label>
    <label>Quantity *<input required type="number" min=".01" step="any" value={draft.quantity} onChange={e=>setDraft(v=>({...v,quantity:e.target.value}))}/></label>
    <label>Unit<select value={draft.unit} onChange={e=>setDraft(v=>({...v,unit:e.target.value}))}>{["Pieces","Sets","Cartons","Kilograms","Metric tons","Bags"].map(c=><option key={c}>{c}</option>)}</select></label>
    <label>Price per unit *<input required type="number" min="0" step="any" value={draft.unitPrice} onChange={e=>setDraft(v=>({...v,unitPrice:e.target.value}))}/></label>
    <label>Valid until<input type="date" value={draft.validUntil} onChange={e=>setDraft(v=>({...v,validUntil:e.target.value}))}/></label>
    <label className="wide">Shipping terms<input maxLength={250} value={draft.shipping} onChange={e=>setDraft(v=>({...v,shipping:e.target.value}))} placeholder="Delivery country, Incoterms, lead time"/></label>
    <label className="wide">Payment arrangement<input maxLength={250} value={draft.terms} onChange={e=>setDraft(v=>({...v,terms:e.target.value}))} placeholder="Agreed directly between buyer and seller"/></label>
    <label className="wide">Additional notes<textarea rows={3} maxLength={1000} value={draft.notes} onChange={e=>setDraft(v=>({...v,notes:e.target.value}))}/></label>
   </div>
   <div className="sy-trade-form-total"><span>Indicative total</span><strong>{money((Number(draft.unitPrice)||0)*(Number(draft.quantity)||0),draft.currency)}</strong></div>
   <button className="sy-green-action" type="submit"><FileText size={17}/>Save quotation draft</button>
  </form>}
  <div className="sy-trade-search"><Search size={17}/><input aria-label="Search transactions" placeholder="Search by product, company or ID" value={search} onChange={e=>setSearch(e.target.value)}/></div>
  {view==="quotations"?<div className="sy-trade-cards">{visibleQuotes.length?visibleQuotes.map(q=><article className="sy-trade-card" key={q.id}>
   <div className="sy-trade-card-top"><span className="sy-trade-card-icon"><FileText size={19}/></span><div><strong>{q.product}</strong><small>{q.buyer} · {date(q.createdAt)}</small></div><span className={"sy-trade-status "+(q.status.includes("Rejected")?"danger":q.status.includes("Accepted")||q.status.includes("Sent")?"info":"pending")}>{q.status}</span></div>
   <div className="sy-trade-metrics"><div><small>Quantity</small><strong>{q.quantity} {q.unit}</strong></div><div><small>Unit price</small><strong>{money(q.unitPrice,q.currency)}</strong></div><div><small>Quotation total</small><strong>{money(q.quantity*q.unitPrice,q.currency)}</strong></div></div>
   <div className="sy-trade-extra"><span>Valid until: {date(q.validUntil)}</span><span>Shipping: {q.shipping||"To agree"}</span><span>Payment: {q.terms||"Directly arranged"}</span>{q.notes&&<p>{q.notes}</p>}</div>
   <div className="sy-trade-actions">{role==="supplier"&&q.status==="Draft"&&<button onClick={()=>changeQuote(q,"Sent (demo)")}><Send size={15}/>Mark sent (demo)</button>}{role==="buyer"&&q.status==="Sent (demo)"&&<><button onClick={()=>accept(q)}><CheckCircle2 size={15}/>Accept & create demo order</button><button onClick={()=>changeQuote(q,"Rejected (demo)")}>Reject</button></>}{q.status==="Draft"&&<button className="danger-text" aria-label={"Delete "+q.product} onClick={()=>{if(window.confirm("Delete this quotation draft?"))updateQuotes(quotes.filter(x=>x.id!==q.id))}}><Trash2 size={15}/>Delete</button>}</div>
  </article>):<div className="sy-trade-empty"><ClipboardCheck size={32}/><strong>No quotations yet</strong><p>{role==="supplier"?"Create a quotation to start a local trade proposal.":"Quotations will appear here when connected to your buyer account."}</p></div>}</div>:
   <div className="sy-trade-cards">{visibleOrders.length?visibleOrders.map(o=><article className="sy-trade-card" key={o.id}>
    <div className="sy-trade-card-top"><span className="sy-trade-card-icon"><PackageCheck size={19}/></span><div><strong>{o.product}</strong><small>{o.buyer} · Order {o.id.slice(0,8)}</small></div><span className={"sy-trade-status "+(o.status==="Cancelled"?"danger":o.status==="Delivered"?"info":"pending")}>{o.status}</span></div>
    <div className="sy-trade-metrics"><div><small>Quantity</small><strong>{o.quantity} {o.unit}</strong></div><div><small>Agreed total</small><strong>{money(o.total,o.currency)}</strong></div><div><small>Created</small><strong>{date(o.createdAt)}</strong></div></div>
    <p className="sy-trade-order-note">Payment is settled outside SYLUTION. Order status is entered manually and does not verify payment or shipment.</p>
    <div className="sy-trade-actions">{o.status==="Agreed"&&<button onClick={()=>advance(o,"Processing")}><Clock size={15}/>Mark processing</button>}{o.status==="Processing"&&<button onClick={()=>advance(o,"Shipped")}><Truck size={15}/>Mark shipped</button>}{o.status==="Shipped"&&<button onClick={()=>advance(o,"Delivered")}><PackageCheck size={15}/>Mark delivered</button>}{!["Delivered","Cancelled"].includes(o.status)&&<button className="danger-text" onClick={()=>{if(window.confirm("Cancel this demo order?"))advance(o,"Cancelled")}}>Cancel order</button>}</div>
   </article>):<div className="sy-trade-empty"><PackageCheck size={32}/><strong>No orders yet</strong><p>Accepted quotations can create local demo orders. Real trade records need authenticated accounts and backend.</p></div>}</div>}
  <p className="sy-trade-demo-footnote"><ShieldAlert size={14}/> Demo workspace: data stays in this browser. No messages, quotations, orders or payments are transmitted between users.</p>
 </section>;
}
