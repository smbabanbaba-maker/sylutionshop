"use client";
import {useEffect,useId,useMemo,useRef,useState} from "react";
import {ArrowRight,Check,ChevronDown,ClipboardList,FileText,Heart,Info,Package,Plus,Search,Send,ShieldCheck,Trash2,UploadCloud,X} from "lucide-react";
import {COUNTRY_FLAGS,CountryFlag} from "@/components/CountryFlag";
import type {Product} from "@/lib/catalog";

type Spec={name:string;value:string};
const COUNTRY_NAMES=Object.keys(COUNTRY_FLAGS).sort((a,b)=>a.localeCompare(b));
const TERMS=["FOB","CIF","EXW","FCA","DAP","DDP"];
const PAYMENTS=["Bank transfer (T/T)","Letter of credit (L/C)","Escrow preferred","Negotiable"];
const UNIT_OPTIONS=["MT","KG","Tons","Pieces","Sets","Containers","Litres","Bags","Unit"];
const SUGGESTIONS=["Certifications & compliance","Packaging","Target price & MOQ","Lead time"];
const KEYS:Record<string,string>={"Certifications & compliance":"Please specify the required certificates and test reports.","Packaging":"Preferred packaging: ","Target price & MOQ":"Target budget and minimum order requirements: ","Lead time":"Required delivery lead time: "};
function CountrySelector({value,onChange}:{value:string;onChange:(country:string)=>void}){
 const [open,setOpen]=useState(false);
 const [term,setTerm]=useState("");
 const id=useId();
 const wrapper=useRef<HTMLDivElement>(null);
 useEffect(()=>{const close=(e:PointerEvent)=>{if(wrapper.current&&!wrapper.current.contains(e.target as Node))setOpen(false)};document.addEventListener("pointerdown",close);return()=>document.removeEventListener("pointerdown",close)},[]);
 const options=useMemo(()=>COUNTRY_NAMES.filter(c=>c.toLowerCase().includes(term.toLowerCase())),[term]);
 return <div className="si-country-picker" ref={wrapper}>
  <button type="button" className="si-country-trigger" aria-expanded={open} aria-controls={id} onClick={()=>setOpen(o=>!o)}>{value?<><CountryFlag country={value} compact/>{value}</>:<span>Choose country</span>}<ChevronDown size={16}/></button>
  {open&&<div id={id} className="si-country-menu"><label className="si-country-search"><Search size={16}/><input aria-label="Search destination countries" autoFocus value={term} placeholder="Search countries" onChange={e=>setTerm(e.target.value)}/></label><div className="si-country-options">{options.length?options.map(c=><button type="button" key={c} onClick={()=>{onChange(c);setOpen(false);setTerm("")}}><CountryFlag country={c} compact/>{c}{value===c&&<Check size={15}/>}</button>):<p>No matching country</p>}</div></div>}
 </div>
}
export function InquiryModal({product,close}:{product:Product;close:()=>void}){
 const [qty,setQty]=useState("1");
 const [unit,setUnit]=useState(product.unit);
 const [country,setCountry]=useState("Nigeria");
 const [port,setPort]=useState("");
 const [terms,setTerms]=useState<string[]>(["FOB"]);
 const [payments,setPayments]=useState<string[]>(["Bank transfer (T/T)"]);
 const [specs,setSpecs]=useState<Spec[]>(()=>product.specifications.slice(0,4).map(([name,value])=>({name,value})));
 const [message,setMessage]=useState("");
 const [email,setEmail]=useState("");
 const [company,setCompany]=useState("");
 const [attachments,setAttachments]=useState<{name:string;size:number}[]>([]);
 const [consent,setConsent]=useState(false);
 const [submitted,setSubmitted]=useState(false);
 const [error,setError]=useState("");
 const [saved,setSaved]=useState(false);
 const titleId=useId();
 const first=useRef<HTMLInputElement>(null);
 useEffect(()=>{
   try{const p=JSON.parse(localStorage.getItem("sylution_demo_profile")||"null");if(p){setCountry(COUNTRY_NAMES.includes(p.country)?p.country:"Nigeria");setEmail(p.email||"");setCompany(p.company||"");}}catch{}
 },[]);
 useEffect(()=>{
   const prior=document.body.style.overflow;document.body.style.overflow="hidden";
   const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape")close()};
   window.addEventListener("keydown",onKey);
   first.current?.focus();
   return()=>{document.body.style.overflow=prior;window.removeEventListener("keydown",onKey)};
 },[close]);
 function toggle(selected:string[],fn:(next:string[])=>void,value:string){fn(selected.includes(value)?selected.filter(t=>t!==value):[...selected,value])}
 function addFiles(files:FileList|null){
  if(!files)return;
  const valid=[...Array.from(files)].filter(f=>f.size<=10*1024*1024 && ["image/png","image/jpeg","image/webp","application/pdf"].includes(f.type));
  if(valid.length!==files.length)setError("Only PNG, JPG, WEBP and PDF files up to 10 MB can be selected.");
  setAttachments(old=>[...old,...valid.map(f=>({name:f.name,size:f.size}))].slice(0,5));
 }
 function submit(e:React.FormEvent){
  e.preventDefault();setError("");
  const quantity=Number(qty);
  if(!Number.isFinite(quantity)||quantity<=0||!country||!port.trim()||!email.includes("@")||!company.trim()||!consent){setError("Enter a valid quantity, destination, company, email and confirm the demo notice.");return}
  const data={product:product.name,productId:product.id,quantity,unit,destinationCountry:country,port:port.trim(),incoterm:terms.join(", "),paymentTerm:payments.join(", "),email:email.trim(),company:company.trim(),message,attributes:specs.filter(s=>s.name.trim()).map(s=>({name:s.name.trim(),value:s.value.trim()})),attachmentNames:attachments.map(f=>f.name),createdAt:new Date().toISOString(),status:"Draft · browser only"};
  try{const previous=JSON.parse(localStorage.getItem("sylution_demo_rfqs")||"[]");const list=Array.isArray(previous)?previous:[];localStorage.setItem("sylution_demo_rfqs",JSON.stringify([...list,data]));window.dispatchEvent(new Event("sylution-rfq-change"));setSubmitted(true)}catch{setError("Browser storage is unavailable. Your request was not saved.")}
 }
 function toggleFavorite(){
  try{const prior=JSON.parse(localStorage.getItem("sylution_saved_products")||"[]") as string[];const next=!prior.includes(product.slug);localStorage.setItem("sylution_saved_products",JSON.stringify(next?[...prior,product.slug]:prior.filter(s=>s!==product.slug)));setSaved(next);window.dispatchEvent(new Event("sylution-shortlist-change"))}catch{setError("Unable to update favorites in this browser.")}
 }
 return <div className="si-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)close()}}>
  <section className="si-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
   <aside className="si-product-sidebar">
    <div className="si-product-photo"><img src={product.image} alt={product.name} onError={e=>{e.currentTarget.style.display="none"}}/><button type="button" aria-label="Save product to shortlist" onClick={toggleFavorite}><Heart size={19} fill={saved?"currentColor":"none"}/></button></div>
    <strong className="si-product-name">{product.name}</strong><span className="si-price">{product.price} <small>/ {product.unit}</small></span>
    <span className="si-small-label">Minimum order: {product.moq}</span>
    <strong className="si-supplier">{product.supplier}</strong>
    <span className="si-origin"><CountryFlag country={product.country} compact/>{product.country}</span>
    <div className="si-supplier-status"><ShieldCheck size={15}/> Demo supplier · Not verified</div>
    <div className="si-spec-preview"><h4>Product details</h4>{product.specifications.slice(0,4).map(([key,val])=><p key={key}><span>{key}</span><strong>{val}</strong></p>)}</div>
   </aside>
   <div className="si-main">
    <header className="si-heading"><div><span className="si-overline">SYLUTION / WHOLESALE SOURCING</span><h2 id={titleId}>Send an inquiry</h2><p>Complete your sourcing details below. The Save button stays visible while you scroll.</p></div><button type="button" className="si-close" aria-label="Close inquiry" onClick={close}><X size={22}/></button></header>
    {submitted?<div className="si-confirmation"><div><Check size={33}/></div><h3>Demo inquiry saved</h3><p>Your RFQ is stored in this browser under Buying Requests. Nothing was sent to the supplier.</p><button className="si-submit" type="button" onClick={close}>Continue browsing <ArrowRight size={17}/></button></div>:
     <form onSubmit={submit} className="si-form">
      <div className="si-form-scroll"><div className="si-fields si-triple">
       <label>Quantity <b>*</b><div className="si-number-unit"><input ref={first} type="number" min="0.01" step="any" required value={qty} onChange={e=>setQty(e.target.value)}/><select aria-label="Quantity unit" value={unit} onChange={e=>setUnit(e.target.value)}>{[...new Set([product.unit,...UNIT_OPTIONS])].map(t=><option key={t}>{t}</option>)}</select></div></label>
       <div className="si-field"><span>Ship to <b>*</b></span><CountrySelector value={country} onChange={setCountry}/></div>
       <label>Destination port / city <b>*</b><input required value={port} onChange={e=>setPort(e.target.value)} placeholder="e.g. Lagos Apapa"/></label>
      </div>
      <div className="si-section-header"><h3>Specifications</h3><span>Customize your requirements</span></div>
      <div className="si-spec-grid">{specs.map((s,i)=><div className="si-spec-entry" key={i}><button type="button" aria-label={"Remove specification "+(i+1)} onClick={()=>setSpecs(old=>old.filter((_,j)=>i!==j))}><X size={15}/></button><input aria-label={"Specification name "+(i+1)} placeholder="Specification name" value={s.name} onChange={e=>setSpecs(old=>old.map((v,j)=>j===i?{...v,name:e.target.value}:v))}/><input aria-label={"Specification value "+(i+1)} placeholder="Value" value={s.value} onChange={e=>setSpecs(old=>old.map((v,j)=>j===i?{...v,value:e.target.value}:v))}/></div>)}</div>
      <button className="si-add" type="button" onClick={()=>setSpecs(old=>[...old,{name:"",value:""}])}><Plus size={15}/> Add specification</button>
      <div className="si-section-header"><h3>Trade & payment terms</h3><span>Optional · select multiple</span></div>
      <div className="si-terms"><div><strong>Trade terms</strong>{TERMS.map(t=><label key={t}><input type="checkbox" checked={terms.includes(t)} onChange={()=>toggle(terms,setTerms,t)}/>{t}</label>)}</div><div><strong>Payment terms</strong>{PAYMENTS.map(t=><label key={t}><input type="checkbox" checked={payments.includes(t)} onChange={()=>toggle(payments,setPayments,t)}/>{t}</label>)}</div></div>
      <div className="si-section-header"><h3>Additional requirements</h3></div>
      <div className="si-suggestions">{SUGGESTIONS.map(t=><button key={t} type="button" onClick={()=>setMessage(v=>v+(v?"\n":"")+KEYS[t])}><Plus size={14}/>{t}</button>)}</div>
      <textarea className="si-message" rows={3} aria-label="Additional requirements" placeholder="Describe packaging, product quality, lead time or testing requirements..." value={message} onChange={e=>setMessage(e.target.value)}/>
      <div className="si-fields si-two"><label>Your company <b>*</b><input required value={company} onChange={e=>setCompany(e.target.value)} placeholder="Company name"/></label><label>Business email <b>*</b><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@company.com"/></label></div>
      <div className="si-section-header"><h3>Attachments</h3><span>Optional · file names only</span></div>
      <div className="si-file-line"><label><UploadCloud size={19}/><span>Choose PDF or image</span><input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={e=>{addFiles(e.target.files);e.target.value=""}}/></label><small>Up to 5 files, 10 MB each. Actual file contents are not saved or uploaded.</small></div>
      {!!attachments.length&&<div className="si-file-chips">{attachments.map((f,i)=><span key={i}><FileText size={13}/>{f.name}<button type="button" aria-label={"Remove "+f.name} onClick={()=>setAttachments(old=>old.filter((_,j)=>i!==j))}><X size={13}/></button></span>)}</div>}
      <label className="si-consent"><input type="checkbox" required checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>I understand this is a <strong>demo RFQ</strong> saved only in this browser. No supplier will receive this request yet.</span></label>
      {error&&<div className="si-error" role="alert"><Info size={16}/>{error}</div>}
      </div>
      <footer className="si-footer"><div><ShieldCheck size={17}/> Saved in browser only</div><button className="si-submit" type="submit"><Send size={18}/> Save Inquiry & Create RFQ</button></footer>
     </form>}
   </div>
  </section>
 </div>;
}
