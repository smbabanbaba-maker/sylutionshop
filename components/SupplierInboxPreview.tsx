"use client";
import {useEffect,useRef,useState} from "react";
import {MessageSquare,Search,Send,Package,ArrowLeft,Store,Smile,Paperclip,X} from "lucide-react";
import Link from "next/link";
import {MESSAGE_DRAFT_KEY,type SupplierMessageDraft} from "@/components/SupplierContactModal";

const load=():SupplierMessageDraft[]=>{try{const rows=JSON.parse(localStorage.getItem(MESSAGE_DRAFT_KEY)||"[]");return Array.isArray(rows)?rows:[]}catch{return []}};
export function SupplierInboxPreview({company}:{company:string}){
 const [messages,setMessages]=useState<SupplierMessageDraft[]>([]);
 const [selected,setSelected]=useState<string|null>(null);
 const [reply,setReply]=useState("");
 const [query,setQuery]=useState("");
 const [notice,setNotice]=useState("");
 const [mobileOpen,setMobileOpen]=useState(false);
 const [emojiOpen,setEmojiOpen]=useState(false);
 const fileInput=useRef<HTMLInputElement>(null);
 useEffect(()=>{
  const refresh=()=>setMessages(load());
  refresh();
  // Jump straight into the latest relevant buyer conversation when opening Messages.
  try{if(company.trim()){const companyKey=company.trim().toLowerCase();if(load().some(m=>m.supplier.trim().toLowerCase()===companyKey))setMobileOpen(true)}}catch{}
  window.addEventListener("sylution-message-drafts-change",refresh);window.addEventListener("storage",refresh);
  return()=>{window.removeEventListener("sylution-message-drafts-change",refresh);window.removeEventListener("storage",refresh)};
 },[company]);
 const normalized=company.trim().toLocaleLowerCase();
 // A locally switched buyer/supplier must not see another supplier's drafts.
 const inbox=normalized?messages.filter(m=>m.supplier.trim().toLocaleLowerCase()===normalized):[];
 const conversations=Array.from(inbox.reduce((map,m)=>{const key=m.productId||m.product;const items=map.get(key)||[];items.push(m);map.set(key,items);return map;},new Map<string,SupplierMessageDraft[]>()).entries()).map(([key,items])=>({key,records:[...items].sort((a,b)=>b.createdAt.localeCompare(a.createdAt))})).sort((a,b)=>b.records[0].createdAt.localeCompare(a.records[0].createdAt));
 const matching=conversations.filter(c=>c.records.some(m=>[m.product,m.message,m.subject].join(" ").toLowerCase().includes(query.toLowerCase())));
 const activeGroup=matching.find(c=>c.key===selected)||matching[0];
 const active=activeGroup?.records[0];
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
 return <section className="sy-supplier-inbox" aria-label="Supplier messages">
  <div className="sy-supplier-inbox-mobile-head"><Link href="/account?tab=supplier" aria-label="Back to supplier dashboard"><ArrowLeft size={22}/></Link><strong>Messages</strong></div>
  <div className="sy-supplier-inbox-header"><div><h2>Messages</h2></div><span className="sy-supplier-inbox-count">{conversations.length} conversations</span></div>
  <p className="sy-supplier-demo-warning">This is a local demonstration. A real buyer on another device cannot reach you until secure messaging is connected.</p>
  {!normalized?<div className="sy-supplier-inbox-empty"><MessageSquare size={32}/><strong>Set your supplier company name</strong></div>:
   <div className={"sy-supplier-inbox-layout sy-conversation-shell"+(mobileOpen?" sy-show-chat":"")}>
    <div className="sy-supplier-inbox-list">
      <label className="sy-inbox-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search conversations" aria-label="Search conversations"/></label>
      {matching.length?<div className="sy-conversation-list">{matching.map(c=><button key={c.key} onClick={()=>{setSelected(c.key);setReply("");setNotice("");setMobileOpen(true)}} type="button" className={"sy-conversation-row"+(activeGroup?.key===c.key?" active":"")}>
        <span className="sy-conversation-avatar"><Package size={18}/></span><span className="sy-conversation-summary"><strong>{c.records[0].product}</strong><small>{c.records[0].message}</small></span><span className="sy-conversation-date">{c.records.length} msg</span>
      </button>)}</div>:<div className="sy-supplier-inbox-empty"><MessageSquare size={30}/><strong>No messages yet</strong></div>}
    </div>
    <div className="sy-supplier-inbox-detail">
      {active&&activeGroup?<div className="sy-conversation-detail">
        <header className="sy-conversation-chat-head"><button className="sy-conversation-back" onClick={()=>setMobileOpen(false)} aria-label="Back to inbox"><ArrowLeft size={18}/></button><span className="sy-conversation-avatar"><Package size={18}/></span><div><strong>{active.product}</strong><small>Buyer enquiry · Demo conversation</small></div><Link className="sy-conversation-profile" href={"/suppliers/"+encodeURIComponent(company)} title="Open my demo shop" aria-label="Open my demo shop"><Store size={21}/><span>Shop</span></Link></header>
        <div className="sy-conversation-messages">{[...activeGroup.records].reverse().map(m=><div className="sy-conversation-exchange" key={m.id}><div className="sy-chat-bubble seller"><span>Buyer message · Local draft</span><p>{m.message}</p></div>{m.reply&&<div className="sy-chat-bubble buyer"><span>Your demo reply</span><p>{m.reply}</p></div>}</div>)}</div>
        <form className="sy-chat-composer sy-chat-interactive" onSubmit={e=>{e.preventDefault();saveReply()}}><label htmlFor="sy-supplier-reply">Reply to buyer</label>
        {emojiOpen&&<div className="sy-emoji-panel" role="group" aria-label="Select an emoji">{["😀","😊","👍","❤️","🙏","🤝","🔥","✅","👋","🎉","📦","💬"].map(e=><button key={e} type="button" onClick={()=>{setReply(v=>v+e);setEmojiOpen(false)}}>{e}</button>)}</div>}
        <div className="sy-chat-input-row"><textarea id="sy-supplier-reply" rows={1} value={reply} onChange={e=>setReply(e.target.value)} placeholder="Type your message here"/>
         <button type="button" className="sy-chat-tool" title="Emoji" aria-label="Emoji" onClick={()=>setEmojiOpen(v=>!v)}>{emojiOpen?<X size={21}/>:<Smile size={22}/>}</button>
         <button type="button" className="sy-chat-tool" title="Attach file (local demo)" aria-label="Attach file to draft" onClick={()=>fileInput.current?.click()}><Paperclip size={21}/></button>
         <input ref={fileInput} hidden type="file" accept="image/*,.pdf,.txt,.doc,.docx" onChange={e=>{const file=e.target.files?.[0];if(file){if(file.size>10*1024*1024){setNotice("File must be smaller than 10 MB.");}else{setReply(v=>(v.trim()?v+"\n":"")+"[File to attach: "+file.name+"]");setNotice("Filename added to demo reply, not uploaded.");}e.target.value=""}}}/>
         <button type="submit" className="sy-green-action sy-chat-send" disabled={!reply.trim()} aria-label="Save demo reply"><Send size={18}/></button>
        </div>{notice&&<small className={/blocked|smaller|unable|error/i.test(notice)?"sy-status-error":"sy-status-info"} role="status">{notice}</small>}<small className="sy-chat-demo-note">Demo · Messages and files are not delivered.</small></form>
      </div>:<div className="sy-supplier-inbox-empty"><MessageSquare size={30}/><strong>No messages yet</strong></div>}
    </div>
   </div>}
 </section>;
}
