"use client";
import {useEffect,useState} from "react";
import {MessageSquare,Search,Send,Package} from "lucide-react";
import {MESSAGE_DRAFT_KEY,type SupplierMessageDraft} from "@/components/SupplierContactModal";

const load=():SupplierMessageDraft[]=>{try{const rows=JSON.parse(localStorage.getItem(MESSAGE_DRAFT_KEY)||"[]");return Array.isArray(rows)?rows:[]}catch{return []}};
export function SupplierInboxPreview({company}:{company:string}){
 const [messages,setMessages]=useState<SupplierMessageDraft[]>([]);
 const [selected,setSelected]=useState<string|null>(null);
 const [reply,setReply]=useState("");
 const [query,setQuery]=useState("");
 const [notice,setNotice]=useState("");
 useEffect(()=>{
  const refresh=()=>setMessages(load());
  refresh();window.addEventListener("sylution-message-drafts-change",refresh);window.addEventListener("storage",refresh);
  return()=>{window.removeEventListener("sylution-message-drafts-change",refresh);window.removeEventListener("storage",refresh)};
 },[]);
 const normalized=company.trim().toLocaleLowerCase();
 // A locally switched buyer/supplier must not see another supplier's drafts.
 const inbox=normalized?messages.filter(m=>m.supplier.trim().toLocaleLowerCase()===normalized):[];
 const matching=inbox.filter(m=>[m.product,m.message,m.subject].join(" ").toLowerCase().includes(query.toLowerCase()));
 const active=matching.find(m=>m.id===selected)||matching[0];
 function saveReply(){
  if(!active||reply.trim().length<2){setNotice("Write a reply first.");return;}
  try{
   const current=load();
   const next=current.map(m=>m.id===active.id&&m.supplier.trim().toLocaleLowerCase()===normalized?{...m,reply:reply.trim(),repliedAt:new Date().toISOString()}:m);
   localStorage.setItem(MESSAGE_DRAFT_KEY,JSON.stringify(next));
   window.dispatchEvent(new Event("sylution-message-drafts-change"));
   setMessages(next);setReply("");setNotice("Demo reply saved on this browser only. The buyer was not notified.");
  }catch{setNotice("Browser storage blocked this demo reply.");}
 }
 return <section className="sy-supplier-inbox" aria-label="Supplier message preview">
   <div className="sy-supplier-inbox-header"><div><span className="sy-mini-overline">SUPPLIER WORKSPACE / MESSAGES</span><h2>Buyer Messages</h2><p>Read buyer enquiries and prepare a reply in one place.</p></div><span className="sy-supplier-inbox-count">{inbox.length} local drafts</span></div>
   <p className="sy-supplier-demo-warning">Preview only: messages and replies are stored on this device. Buyers and sellers on different devices cannot exchange messages until secure accounts and a database are connected.</p>
   {!normalized?<div className="sy-supplier-inbox-empty"><MessageSquare size={32}/><strong>Add a company name to your supplier profile</strong><p>The demo matches messages using the supplier company name.</p></div>:
   <div className="sy-supplier-inbox-layout">
     <div className="sy-supplier-inbox-list">
       <label className="sy-inbox-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search buyer messages" aria-label="Search buyer messages"/></label>
       {matching.length?matching.map(m=><button key={m.id} onClick={()=>{setSelected(m.id);setReply("");setNotice("")}} type="button" className={"sy-supplier-message-row"+(active?.id===m.id?" active":"")}>
         <span><MessageSquare size={16}/><strong>{m.product}</strong></span><small>{m.reply?"Replied · Local demo":"New · Local demo"}</small><p>{m.message}</p>
       </button>):<div className="sy-supplier-inbox-empty"><MessageSquare size={30}/><strong>No buyer messages</strong><p>Messages addressed to <b>{company}</b> will appear here in this browser preview.</p></div>}
     </div>
     <div className="sy-supplier-inbox-detail">
       {active?<><span className="sy-mini-overline"><Package size={14}/> PRODUCT ENQUIRY</span><h3>{active.product}</h3>
       <div className="sy-supplier-buyer-bubble">{active.message}</div>
       {active.reply&&<div className="sy-supplier-own-bubble"><small>Your saved reply</small>{active.reply}</div>}
       <label>Reply to buyer<textarea rows={4} value={reply} onChange={e=>setReply(e.target.value)} placeholder="Hello, thank you for your interest. The product is available..."/></label>
       {notice&&<p role="status" className="sy-supplier-demo-warning">{notice}</p>}
       <button type="button" className="sy-green-action" onClick={saveReply}><Send size={16}/> Save demo reply</button></>:
       <div className="sy-supplier-inbox-empty"><MessageSquare size={30}/><strong>Select a message</strong><p>Your buyer conversations will appear here when messaging launches.</p></div>}
     </div>
   </div>}
 </section>;
}
