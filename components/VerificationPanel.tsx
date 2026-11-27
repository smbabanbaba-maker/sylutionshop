"use client";
import {useEffect,useState} from "react";
import {Check, CheckCircle2, CircleAlert, FileText, HelpCircle, Mail, Phone, ShieldCheck, UploadCloud, XCircle, LockKeyhole, Info, ArrowRight, Building2} from "lucide-react";
import {CountryField,getDialingCode,getCountry} from "@/components/CountryFlag";
type Status="verified"|"pending"|"unverified"|"rejected";
type FileKind="license"|"import"|"tax";
function VerificationStatus({status,text}:{status:Status;text?:string}){
 const label=text??({verified:"Verified",pending:"Pending review",unverified:"Unverified",rejected:"Rejected"} as const)[status];
 return <span className={"sv-status sv-status-"+status}>
 {status==="verified"?<CheckCircle2 size={16}/>:status==="rejected"?<XCircle size={16}/>:status==="pending"?<CircleAlert size={16}/>:<CircleAlert size={16}/>}
 {label}</span>;
}
const docs=[
 {id:"license" as const,title:"Business licence",description:"Official registration documentation confirming the legal identity of the business.",guide:"Examples include an issued corporate registration certificate or a valid local business licence."},
 {id:"import" as const,title:"Proof of prior import",description:"Evidence of previous international trade, if your business has imported goods.",guide:"Examples include commercial invoices, bills of lading or import declarations. Do not provide these in the demo."},
 {id:"tax" as const,title:"Tax certificate",description:"Tax registration or compliance document issued by an appropriate authority.",guide:"Only an authorized verification process should collect tax documents."}
];
export function VerificationPanel({country="",onProfile}:{country?:string;onProfile:()=>void}){
 const [phoneCountry,setPhoneCountry]=useState(country);
 useEffect(()=>{setPhoneCountry(country)},[country]);
 const [workEmail,setWorkEmail]=useState("");
 const [selected,setSelected]=useState<Partial<Record<FileKind,{name:string;size:number}>>>({});
 const [guides,setGuides]=useState<FileKind[]>([]);
 const [notice,setNotice]=useState("");
 const [phone,setPhone]=useState("");
 const [previewResult,setPreviewResult]=useState(false);
 function chooseDoc(id:FileKind,file?:File){
  if(!file)return;
  if(file.size>10*1024*1024){setNotice("File exceeds 10 MB. Choose a smaller file.");return}
  const types=["application/pdf","image/jpeg","image/png","image/webp"];
  const ext=file.name.toLowerCase().split(".").pop();
  if(!types.includes(file.type)||!["pdf","jpg","jpeg","png","webp"].includes(ext||"")){setNotice("Use PDF, JPG, PNG or WEBP (max 10 MB).");return}
  setSelected(old=>({...old,[id]:{name:file.name,size:file.size}}));
  setNotice("File selected locally. No document has been uploaded or stored by SYLUTION.");
 }
 const prepared=Object.keys(selected).length;
 return <div className="sv-page">
  <div className="sv-topline"><div><span className="sv-eyebrow">SYLUTION TRUST CENTER</span><h2>Business Verification</h2><p>Build a trustworthy company profile with clear, verifiable credentials.</p></div><span className="sv-demo-label"><LockKeyhole size={14}/> Preview only</span></div>
  <div className="sv-progress"><div><ShieldCheck size={18}/><strong>Verification progress</strong><span>{prepared}/3 document types selected locally</span></div><div className="sv-progress-track"><div style={{width:(prepared/3*100)+"%"}}/></div><p>Files and contact details on this page are not sent to a server. Verification remains inactive until a secure backend is connected.</p></div>
  <section className="sv-card">
   <header className="sv-section-header"><div className="sv-title-with-icon"><span className="sv-icon sv-phone"><Phone size={20}/></span><div><h3>Verify phone number</h3><p>Allow suppliers to reach a verified business phone after confirmation.</p></div></div><VerificationStatus status="unverified"/></header>
   <div className="sv-global-phone-row">
    <label className="sv-global-country"><span>Phone country / region</span><CountryField value={phoneCountry} onChange={value=>{setPhoneCountry(value);setPhone("");setNotice("");}} label="Phone country or region"/></label>
    <label className="sv-global-dial"><span>Dialling code</span><output>{phoneCountry?(getDialingCode(phoneCountry)||"Not listed"):"Select country"}</output></label>
    <label className="sv-global-number"><span>Business phone number</span><input type="tel" inputMode="tel" autoComplete="tel-national" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Local phone number" aria-label="Business phone number"/></label>
    <button type="button" className="sv-global-phone-action" onClick={()=>setNotice(!getCountry(phoneCountry)?"Select a valid country or region first.":!phone.trim()?"Enter a business phone number first.":"SMS/OTP verification requires the secure backend. No message has been sent.")}>Verify phone</button>
   </div>
   <p className="sv-field-hint">Select any supported country or territory. Dialling codes follow international telephone data. The selected phone country can differ from the company's registration country.</p>
   <p className="sv-field-hint">No SMS or OTP is sent in demo mode. Never enter a one-time code into this preview.</p>
  </section>
  <section className="sv-card">
   <header className="sv-section-header"><div className="sv-title-with-icon"><span className="sv-icon sv-doc"><FileText size={20}/></span><div><h3>Verify business documents</h3><p>Prepare evidence of your company registration and trading history.</p></div></div><VerificationStatus status="unverified"/></header>
   <div className="sv-doc-grid">{docs.map(doc=><article className="sv-doc-card" key={doc.id}>
    <div className="sv-doc-title"><h4>{doc.title}</h4><VerificationStatus status="unverified" text="Not submitted"/></div>
    <p>{doc.description}</p>
    <button className="sv-guide-toggle" type="button" aria-expanded={guides.includes(doc.id)} onClick={()=>setGuides(old=>old.includes(doc.id)?old.filter(x=>x!==doc.id):[...old,doc.id])}><HelpCircle size={15}/> {guides.includes(doc.id)?"Hide document guide":"View document guide"}</button>
    {guides.includes(doc.id)&&<div className="sv-document-guide">{doc.guide}</div>}
    <label className="sv-upload-zone"><UploadCloud size={21}/><strong>{selected[doc.id]?.name??"Choose file (demo preview)"}</strong><small>PDF, JPG, PNG, WEBP · Max 10 MB</small><input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={e=>{chooseDoc(doc.id,e.target.files?.[0]);e.target.value=""}}/></label>
    {selected[doc.id]&&<div className="sv-selected"><Check size={15}/> Selected locally · Not uploaded</div>}
   </article>)}</div>
   <p className="sv-private-note"><LockKeyhole size={16}/> For safety, SYLUTION does not upload or save sensitive identity documents in this demonstration.</p>
  </section>
  <section className="sv-card">
   <header className="sv-section-header"><div className="sv-title-with-icon"><span className="sv-icon sv-mail"><Mail size={20}/></span><div><h3>Verify work email</h3><p>Use an email associated with your company to build buyer confidence.</p></div></div><VerificationStatus status="unverified"/></header>
   <div className="sv-inline-field sv-email-field"><Mail size={18}/><input type="email" value={workEmail} onChange={e=>setWorkEmail(e.target.value)} placeholder="name@yourcompany.com" aria-label="Work email address"/><button type="button" onClick={()=>{setPreviewResult(true);setNotice("Email verification is not connected. No verification link has been sent.")}}>Verify email</button></div>
   {previewResult&&<p className="sv-field-hint">No verification email has been sent. This requires authentication and an email service.</p>}
  </section>
  <section className="sv-card sv-identity-card"><div className="sv-title-with-icon"><span className="sv-icon sv-identity"><Building2 size={20}/></span><div><h3>Company identity review</h3><p>Registration data, company address and ownership checks.</p></div></div><VerificationStatus status="unverified" text="Not started"/><button type="button" onClick={onProfile}>Complete company profile <ArrowRight size={16}/></button></section>
  <div className="sv-legend"><strong>Status color guide</strong><div><VerificationStatus status="verified"/><span>Confirmed by a real verification process</span></div><div><VerificationStatus status="pending"/><span>Submitted and awaiting review</span></div><div><VerificationStatus status="unverified"/><span>No valid confirmation yet</span></div><div><VerificationStatus status="rejected"/><span>Rejected after review</span></div></div>
  {notice&&<div className={"sv-feedback "+(/exceeds|use pdf|choose a smaller|invalid|failed|error/i.test(notice)?"sy-status-error":/selected locally/i.test(notice)?"sy-status-info":"sy-status-warning")} role="status"><Info size={16}/>{notice}</div>}
 </div>
}
