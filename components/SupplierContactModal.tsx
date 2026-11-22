"use client";
import {useEffect,useId,useRef,useState} from "react";
import Link from "next/link";
import {ArrowRight,Building2,CheckCircle2,MessageSquare,Send,X} from "lucide-react";
import {CountryFlag} from "@/components/CountryFlag";
import type {Product} from "@/lib/catalog";

export const MESSAGE_DRAFT_KEY="sylution_supplier_message_drafts";
export type SupplierMessageDraft={
 id:string; supplier:string; country:string; product:string; productId:string;
 subject:string; message:string; createdAt:string; status:"Draft · browser only"; reply?:string; repliedAt?:string;
};
export function SupplierContactModal({product,onClose}:{product:Product;onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 const headingId=useId();
 const [message,setMessage]=useState("");
 const [error,setError]=useState("");
 const [saved,setSaved]=useState(false);
 useEffect(()=>{
  const el=dialog.current;
  el?.showModal();
  const previous=document.body.style.overflow;
  document.body.style.overflow="hidden";
  return ()=>{el?.close();document.body.style.overflow=previous};
 },[]);
 const suggestions=["Is this available?","What is your best price?","Can you deliver to my country?"];
 function save(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();
  if(message.trim().length<10){setError("Please write at least 10 characters before saving.");return;}
  const draft:SupplierMessageDraft={
   id:globalThis.crypto?.randomUUID?.()||String(Date.now()),
   supplier:product.supplier,country:product.country,product:product.name,productId:product.id,
   subject:"Message about "+product.name,message:message.trim(),
   createdAt:new Date().toISOString(),status:"Draft · browser only"
  };
  try{
   const value=JSON.parse(localStorage.getItem(MESSAGE_DRAFT_KEY)||"[]");
   const existing=Array.isArray(value)?value:[];
   localStorage.setItem(MESSAGE_DRAFT_KEY,JSON.stringify([draft,...existing]));
   window.dispatchEvent(new Event("sylution-message-drafts-change"));
   setSaved(true);setError("");
  }catch{setError("Browser storage is unavailable. The draft could not be saved.");}
 }
 return <dialog className="sy-contact-dialog" ref={dialog} aria-labelledby={headingId}
  onCancel={e=>{e.preventDefault();onClose();}}>
  <header className="sy-contact-head">
   <div className="sy-contact-eyebrow"><MessageSquare size={15}/> SYLUTION MESSAGES</div>
   <button type="button" className="sy-contact-close" aria-label="Close contact form" onClick={onClose}><X size={19}/></button>
  </header>
  <div className="sy-contact-supplier">
   <span className="sy-contact-avatar"><Building2 size={24}/></span>
   <div className="sy-contact-identity"><h2 id={headingId}>Message supplier</h2><strong>{product.supplier}</strong>
    <span><CountryFlag country={product.country} compact/>{product.country} · Example supplier</span></div>
  </div>
  <div className="sy-contact-item"><img src={product.image} alt="" onError={e=>{e.currentTarget.style.display="none"}}/>
   <div><small>ABOUT THIS PRODUCT</small><strong>{product.name}</strong><span>{product.price} / {product.unit}</span></div></div>
  {saved?<div className="sy-contact-success" role="status">
    <CheckCircle2 size={36}/><h3>Message draft saved</h3>
    <p>Your message is saved in this browser. It has <strong>not</strong> been delivered to the supplier because live messaging is not connected yet.</p>
    <Link href="/account?tab=messages" className="sy-contact-primary">View message drafts <ArrowRight size={17}/></Link>
    <button type="button" className="sy-contact-secondary" onClick={onClose}>Close</button>
   </div>:
   <form onSubmit={save} className="sy-contact-form">
    <label>Write your message <span className="sy-contact-req">*</span>
     <textarea rows={5} maxLength={3000} required minLength={10} value={message} onChange={e=>{setMessage(e.target.value);if(error)setError("");}} placeholder="Hello, I am interested in this product. Is it available?"/></label>
    <div className="sy-contact-templates"><span>Tap to add a question (optional)</span>
     {suggestions.map(text=><button key={text} type="button" onClick={()=>setMessage(current=>(current.trim()?current.trim()+"\n":"")+text)}>{text}</button>)}
    </div>
    {error&&<p className="sy-contact-error" role="alert">{error}</p>}
    <p className="sy-contact-privacy">Demo preview: your message is saved on this device, not sent to the supplier.</p>
    <button type="submit" className="sy-contact-primary"><Send size={17}/> Save message</button>
   </form>}
 </dialog>;
}
