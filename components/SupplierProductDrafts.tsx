"use client";

import {useEffect,useId,useState} from "react";
import {CountryField,CountryFlag} from "@/components/CountryFlag";
import {useAccountDefaults} from "@/lib/account-defaults";
import {categories} from "@/lib/catalog";
import {TRADE_CURRENCIES,currencyLabel} from "@/lib/global-currencies";
import {PackagePlus,Save,Trash2,UploadCloud,X} from "lucide-react";

type ProductDraft={
 id?:string;name:string;country:string;minimum:string;price:string;
 category?:string;description?:string;currency?:string;unit?:string;
 brand?:string;model?:string;stock?:string;leadTime?:string;
 material?:string;weight?:string;packaging?:string;shipping?:string;
 sampleAvailable?:boolean;customPackaging?:boolean;imageNames?:string[];
 savedAt?:string;
};
const units=["Piece","Set","Kilogram","Gram","Carton","Box","Pack","Bag","Litre","Metric ton","Container"];
const currencies=TRADE_CURRENCIES;
const makeId=()=>globalThis.crypto?.randomUUID?.()||String(Date.now());
const text=(v:FormDataEntryValue|null)=>String(v??"").trim();

export function SupplierProductDrafts({country,email}:{country:string;email:string}){
 const account=useAccountDefaults();
 const [currencyChanged,setCurrencyChanged]=useState(false);
 const storageKey="sylution_supplier_product_drafts:"+email.toLowerCase();
 const id=useId();
 const [origin,setOrigin]=useState(country);
 useEffect(()=>{if(country)setOrigin(current=>current||country)},[country]);
 const [drafts,setDrafts]=useState<ProductDraft[]>([]);
 const [notice,setNotice]=useState("");
 const [noticeError,setNoticeError]=useState(false);
 const [images,setImages]=useState<File[]>([]);
 const [imageUrls,setImageUrls]=useState<string[]>([]);
 const [editIndex,setEditIndex]=useState<number|null>(null);
 const [formKey,setFormKey]=useState(0);
 const [selection,setSelection]=useState<ProductDraft|null>(null);
 useEffect(()=>{try{const value:unknown=JSON.parse(localStorage.getItem(storageKey)||"[]");if(Array.isArray(value))setDrafts(value.filter((v):v is ProductDraft=>Boolean(v)&&typeof v==="object"&&typeof v.name==="string"));}catch{setDrafts([])}},[storageKey]);
 useEffect(()=>{const raw=new URLSearchParams(window.location.search).get("edit");if(raw===null)return;const index=Number(raw);if(!Number.isInteger(index)||index<0||index>=drafts.length)return;const chosen=drafts[index];setEditIndex(index);setSelection(chosen);setOrigin(chosen.country||country);setFormKey(v=>v+1);},[drafts,country]);
 useEffect(()=>{const urls=images.map(file=>URL.createObjectURL(file));setImageUrls(urls);return()=>urls.forEach(url=>URL.revokeObjectURL(url));},[images]);
 function reset(){const url=new URL(window.location.href);if(url.searchParams.has("edit")){url.searchParams.delete("edit");window.history.replaceState(null,"",url.pathname+url.search);}setEditIndex(null);setSelection(null);setImages([]);setOrigin(country);setFormKey(v=>v+1);}
 function saveDraft(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();
  const form=event.currentTarget;
  const fd=new FormData(form);
  const draft:ProductDraft={
   id:editIndex!==null?drafts[editIndex]?.id||makeId():makeId(),
   name:text(fd.get("name")),category:text(fd.get("category")),
   description:text(fd.get("description")),brand:text(fd.get("brand")),
   model:text(fd.get("model")),material:text(fd.get("material")),
   weight:text(fd.get("weight")),country:origin,stock:text(fd.get("stock")),
   minimum:text(fd.get("minimum")),price:text(fd.get("price")),
   currency:text(fd.get("currency")),unit:text(fd.get("unit")),
   leadTime:text(fd.get("leadTime")),packaging:text(fd.get("packaging")),
   shipping:text(fd.get("shipping")),sampleAvailable:fd.get("sampleAvailable")==="on",
   customPackaging:fd.get("customPackaging")==="on",
   imageNames:images.length?images.map(f=>f.name):(selection?.imageNames||[]),
   savedAt:new Date().toISOString()
  };
  if(!draft.name||!draft.category||!draft.minimum||!draft.country||!draft.price||!draft.description){
   setNoticeError(true);setNotice("Complete the required fields: name, category, description, country, price and minimum order.");return;
  }
  try{
   const next=editIndex===null?[draft,...drafts]:drafts.map((d,i)=>i===editIndex?draft:d);
   localStorage.setItem(storageKey,JSON.stringify(next));
   setDrafts(next);setNoticeError(false);
   setNotice("Product draft saved on this device. It is not published or uploaded.");
   reset();
  }catch{setNoticeError(true);setNotice("Could not save the draft. Check available browser storage.");}
 }
 function loadDraft(d:ProductDraft,index:number){
  setEditIndex(index);setSelection(d);setOrigin(d.country||country);setImages([]);setFormKey(v=>v+1);setNotice("");window.scrollTo({top:0,behavior:"smooth"});
 }
 function deleteDraft(index:number){
  const next=drafts.filter((_,i)=>i!==index);
  try{localStorage.setItem(storageKey,JSON.stringify(next));setDrafts(next);if(editIndex===index)reset();setNoticeError(false);setNotice("Draft removed from this device.");}catch{setNoticeError(true);setNotice("Could not remove draft.");}
 }
 const initial=selection;
 return <section className="sy-seller-product-page">
   <header className="sy-product-form-head">
    <div className="sy-product-form-heading"><span className="sy-product-form-kicker"><PackagePlus size={15}/> SELLER WORKSPACE</span><h2>{editIndex===null?"Add New Product":"Edit Product Draft"}</h2><p>Complete your product listing on one page. Fields marked * are required.</p></div>
    <span className="sy-product-form-status">Draft only</span>
   </header>
   {account.country&&<p className="sy-account-origin-hint"><CountryFlag country={account.country} compact/><span>Registered in <strong>{account.country}</strong>. Origin and currency are pre-filled from your profile; change them if this product comes from another country.</span></p>}
   <form key={formKey} className="sy-product-fullform" onSubmit={saveDraft}>
    <section className="sy-product-form-card">
     <div className="sy-product-form-section-title"><span>01</span><div><h3>Product photos</h3><p>Add clear photos. The first photo will be the main preview.</p></div></div>
     <label className="sy-product-photo-upload" htmlFor={id+"-photo"}><UploadCloud size={25}/><strong>Choose product images</strong><span>JPG, PNG or WebP · Up to 10 images · 5 MB each</span><input id={id+"-photo"} type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={e=>{const inputFiles=Array.from(e.target.files||[]);if(inputFiles.length>10||inputFiles.some(f=>f.size>5*1024*1024)){setNoticeError(true);setNotice("Select no more than 10 images, each under 5 MB.");e.target.value="";return;}setImages(inputFiles);setNotice("");}}/></label>
     {imageUrls.length>0?<div className="sy-product-image-previews">{imageUrls.map((url,i)=><div key={url} className="sy-product-image-preview"><img src={url} alt={"Product preview "+(i+1)}/>{i===0&&<span>Main</span>}</div>)}<button type="button" onClick={()=>setImages([])} className="sy-product-remove-photo"><X size={15}/> Clear</button></div>:initial?.imageNames?.length?<p className="sy-product-upload-note">Previously selected filenames: {initial.imageNames.join(", ")}. Choose images again to preview them.</p>:null}
     <p className="sy-product-upload-note">Demo mode: image previews are temporary; image files are not uploaded or stored with the draft.</p>
    </section>

    <section className="sy-product-form-card">
     <div className="sy-product-form-section-title"><span>02</span><div><h3>Basic information</h3><p>Help buyers identify your product quickly.</p></div></div>
     <div className="sy-product-field-grid">
      <label className="sy-product-field wide">Product name <b>*</b><input name="name" required maxLength={120} defaultValue={initial?.name||""} placeholder="e.g. 5kW Hybrid Solar Inverter"/></label>
      <label className="sy-product-field">Category <b>*</b><select name="category" required defaultValue={initial?.category||""}><option value="">Select category</option>{categories.filter(c=>c!=="All Categories").map(c=><option key={c} value={c}>{c}</option>)}</select></label>
      <label className="sy-product-field">Brand (optional)<input name="brand" maxLength={80} defaultValue={initial?.brand||""} placeholder="Brand / manufacturer"/></label>
      <label className="sy-product-field">Model / SKU<input name="model" maxLength={80} defaultValue={initial?.model||""} placeholder="Model number"/></label>
      <label className="sy-product-field">Material / type<input name="material" maxLength={80} defaultValue={initial?.material||""} placeholder="e.g. Stainless steel"/></label>
      <label className="sy-product-field wide">Product description <b>*</b><textarea name="description" required rows={4} minLength={15} maxLength={3000} defaultValue={initial?.description||""} placeholder="Describe what the product does, specifications, key features, and who it is for."/></label>
     </div>
    </section>

    <section className="sy-product-form-card">
     <div className="sy-product-form-section-title"><span>03</span><div><h3>Pricing & minimum order</h3><p>Make your wholesale offer easy to compare.</p></div></div>
     <div className="sy-product-field-grid">
      <label className="sy-product-field">Currency <b>*</b><select name="currency" defaultValue={initial?.currency||((account.country&&!currencyChanged)?account.currency:"USD")} onChange={()=>setCurrencyChanged(true)}>{currencies.map(c=><option key={c} value={c}>{currencyLabel(c)}</option>)}</select></label>
      <label className="sy-product-field">Unit price <b>*</b><input name="price" required type="number" min="0.01" step="any" inputMode="decimal" defaultValue={initial?.price||""} placeholder="250.00"/></label>
      <label className="sy-product-field">Minimum order (MOQ) <b>*</b><input name="minimum" required type="number" min="1" step="any" inputMode="decimal" defaultValue={initial?.minimum||""} placeholder="100"/></label>
      <label className="sy-product-field">Selling unit <b>*</b><select name="unit" defaultValue={initial?.unit||"Piece"}>{units.map(u=><option key={u} value={u}>{u}</option>)}</select></label>
      <label className="sy-product-field wide">Available stock (optional)<input name="stock" type="number" min="0" step="any" inputMode="decimal" defaultValue={initial?.stock||""} placeholder="Enter available quantity"/></label>
     </div>
    </section>

    <section className="sy-product-form-card">
     <div className="sy-product-form-section-title"><span>04</span><div><h3>Origin & shipping</h3><p>Give buyers an idea of fulfilment and supply terms.</p></div></div>
     <div className="sy-product-field-grid">
      <div className="sy-product-field"><span>Country of origin <b>*</b></span><CountryField value={origin} onChange={setOrigin} required label="Country of origin"/></div>
      <label className="sy-product-field">Lead time<select name="leadTime" defaultValue={initial?.leadTime||"7–15 days"}>{["Ready to ship","1–3 days","4–7 days","7–15 days","15–30 days","30+ days","Contact seller"].map(x=><option key={x} value={x}>{x}</option>)}</select></label>
      <label className="sy-product-field">Product weight (optional)<input name="weight" defaultValue={initial?.weight||""} maxLength={60} placeholder="e.g. 12 kg per carton"/></label>
      <label className="sy-product-field">Packaging (optional)<input name="packaging" defaultValue={initial?.packaging||""} maxLength={100} placeholder="e.g. Export carton"/></label>
      <label className="sy-product-field wide">Shipping / delivery notes<textarea name="shipping" rows={2} maxLength={500} defaultValue={initial?.shipping||""} placeholder="e.g. Shipping terms and dispatch location"/></label>
     </div>
     <div className="sy-product-options"><label><input type="checkbox" name="sampleAvailable" defaultChecked={initial?.sampleAvailable||false}/> Samples available</label><label><input type="checkbox" name="customPackaging" defaultChecked={initial?.customPackaging||false}/> Custom packaging available</label></div>
    </section>
    <div className="sy-product-form-actions"><div><strong>Ready to save?</strong><small>Your listing will remain a local draft; nothing is published.</small></div><button className="sy-green-action" type="submit"><Save size={17}/> {editIndex===null?"Save Product Draft":"Save Changes"}</button>{editIndex!==null&&<button className="sy-product-cancel" type="button" onClick={reset}>Cancel edit</button>}</div>
    {notice&&<p className={noticeError?"sy-status-error":"sy-status-info"} role={noticeError?"alert":"status"}>{notice}</p>}
   </form>
   {drafts.length>0&&<section className="sy-product-saved-drafts"><div className="sy-product-saved-head"><h3>Saved drafts <span>{drafts.length}</span></h3><p>Stored only on this device</p></div><div className="sy-product-saved-list">{drafts.map((d,index)=><article key={d.id||index} className="sy-product-saved-item"><div className="sy-product-saved-icon"><PackagePlus size={20}/></div><div className="sy-product-saved-copy"><strong>{d.name}</strong><small>{d.country} · {d.category||"Uncategorized"} · {d.currency||""} {d.price||"Price not set"}</small></div><button type="button" onClick={()=>loadDraft(d,index)}>Edit</button><button type="button" className="sy-product-draft-delete" aria-label={"Delete "+d.name} onClick={()=>deleteDraft(index)}><Trash2 size={16}/></button></article>)}</div></section>}
 </section>;
}
