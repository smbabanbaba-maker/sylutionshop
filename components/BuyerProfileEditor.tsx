"use client";
import {useEffect,useMemo,useState} from "react";
import {Building2,Check,CheckCircle2,ChevronRight,FileText,Globe2,LockKeyhole,Pencil,Save,Settings2,ShieldCheck,UserRound} from "lucide-react";
import {CountryFlag,CountryField,getDialingCode} from "@/components/CountryFlag";

type Profile={name:string;email:string;company:string;country:string;role:"buyer"|"supplier";joined:string};
type Details={
 businessType:string;registration:string;website:string;phone:string;established:string;employees:string;
 revenue:string;address:string;categories:string;importHistory:string;description:string;logoUrl:string;coverUrl:string;
 platforms:string;sourcingProducts:string;sourcingMarkets:string;sourcingFrequency:string;sourcingBudget:string;
 contactSharing:boolean;
};
const KEY="sylution_demo_company_details";
const MAIN="sylution_demo_profile";
const empty:Details={businessType:"Buying Office",registration:"",website:"",phone:"",established:"",employees:"",revenue:"",address:"",categories:"",importHistory:"",description:"",logoUrl:"",coverUrl:"",platforms:"",sourcingProducts:"",sourcingMarkets:"",sourcingFrequency:"",sourcingBudget:"",contactSharing:false};
const companyKeys:(keyof Details)[]=["businessType","registration","website","phone","established","employees","revenue","address","categories","importHistory","description","logoUrl","coverUrl","platforms"];
const sourcingKeys:(keyof Details)[]=["sourcingProducts","sourcingMarkets","sourcingFrequency","sourcingBudget"];
const labelMap:Record<string,string>={businessType:"Business type",registration:"Business registration ID",website:"Company website",phone:"Company phone number",established:"Year established",employees:"Number of employees",revenue:"Annual sales revenue",address:"Company address",categories:"Categories",importHistory:"Import history",description:"Company description",logoUrl:"Company logo URL",coverUrl:"Store cover image URL",platforms:"Platforms I sell on",sourcingProducts:"Products you source",sourcingMarkets:"Preferred sourcing markets",sourcingFrequency:"Buying frequency",sourcingBudget:"Typical order budget"};

function safeRead(){try{const x=JSON.parse(localStorage.getItem(KEY)||"{}");return x&&typeof x==="object"?x as Partial<Details>:{};}catch{return {}}}
function isFilled(value:unknown){return typeof value==="string"?value.trim().length>0:!!value}
export function BuyerProfileEditor({profile,onUpdate}:{profile:Profile;onUpdate:(p:Profile)=>void}){
 const [details,setDetails]=useState<Details>(empty);
 const [identity,setIdentity]=useState({name:profile.name,company:profile.company,country:profile.country});
 const [tab,setTab]=useState<"company"|"sourcing">("company");
 const [editing,setEditing]=useState(false);
 const [notice,setNotice]=useState("");
 useEffect(()=>{setDetails({...empty,...safeRead()})},[]);
 useEffect(()=>{setIdentity({name:profile.name,company:profile.company,country:profile.country})},[profile.name,profile.company,profile.country]);
 const accountFields=[identity.name,profile.email,identity.country];
 const companyValues=[...companyKeys.map(key=>details[key]),identity.company,identity.country];
 const companyCount=companyValues.filter(isFilled).length;
 const sourcingCount=sourcingKeys.filter(key=>isFilled(details[key])).length;
 const done=accountFields.filter(isFilled).length+companyCount+sourcingCount+(details.contactSharing?1:0);
 const total=accountFields.length+companyValues.length+sourcingKeys.length+1;
 const score=Math.round(done/total*100);
 const missing={account:accountFields.filter(x=>!isFilled(x)).length,company:companyValues.length-companyCount,sourcing:sourcingKeys.length-sourcingCount};
 function update<K extends keyof Details>(key:K,value:Details[K]){setDetails(old=>({...old,[key]:value}));setNotice("")}
 function save(e:React.FormEvent){e.preventDefault();try{
  const next={...profile,name:identity.name.trim(),company:identity.company.trim(),country:identity.country};
  localStorage.setItem(MAIN,JSON.stringify(next));localStorage.setItem(KEY,JSON.stringify(details));
  onUpdate(next);window.dispatchEvent(new Event("sylution-profile-change"));setNotice("Your demo profile was saved in this browser.");setEditing(false)
 }catch{setNotice("Could not save changes in this browser.")}}
 function field(key:keyof Details,placeholder="",options?:string[]){
  const value=String(details[key]??"");
  return <label className="sy-profile-field" key={key}><span>{labelMap[key]||key}</span>
    {options?<select disabled={!editing} value={value} onChange={e=>update(key,e.target.value)}>{options.map(o=><option key={o} value={o}>{o}</option>)}</select>:
     key==="description"?<textarea rows={3} disabled={!editing} value={value} placeholder={placeholder||"Not added"} onChange={e=>update(key,e.target.value)}/>:
     <input type={key==="website"||key==="logoUrl"?"url":"text"} disabled={!editing} value={value} placeholder={placeholder||"Not added"} onChange={e=>update(key,e.target.value)}/>}
   </label>;
 }
 return <form className="sy-profile-modern" onSubmit={save}>
  <div className="sy-profile-title"><div><span className="sy-mini-overline">SYLUTION / {profile.role==="supplier"?"SELLER":"BUYER"} WORKSPACE</span><h2>{profile.role==="supplier"?"Seller Store Profile":"My business profile"}</h2><p>{profile.role==="supplier"?"Present your wholesale company, store visuals and contact information.":"Present your sourcing business clearly and manage how suppliers may reach you."}</p></div><span className="sy-profile-preview-badge"><ShieldCheck size={14}/> Demo · Not verified</span></div>
  <div className="sy-account-origin-hint"><CountryFlag country={identity.country} compact/><span>Account country: <strong>{identity.country||"Not selected"}</strong>{getDialingCode(identity.country)?" · Calling code "+getDialingCode(identity.country):""}. Saved changes to your country will update related forms across this browser.</span></div>
  <div className="sy-profile-grid">
   <div className="sy-profile-main">
    <section className="sy-profile-summary-card">
     {profile.role==="supplier"&&<div className="sy-seller-cover-preview">{details.coverUrl?<img src={details.coverUrl} alt="Company shop cover" onError={e=>{e.currentTarget.style.display="none"}}/>:<div><Building2 size={26}/><span>Add a store cover image URL to personalise your shop</span></div>}</div>}
     <div className="sy-profile-photo">{details.logoUrl?<img src={details.logoUrl} alt="" onError={e=>{e.currentTarget.style.display="none"}}/>:<UserRound size={25}/>}</div>
     <div className="sy-profile-person"><strong>{identity.name||"Your name"}</strong><span><CountryFlag country={identity.country} compact/>{identity.country}<small className="sy-profile-pending">Identity not verified</small></span></div>
     <button className="sy-profile-edit-btn" type="button" onClick={()=>setEditing(v=>!v)} aria-pressed={editing}><Pencil size={17}/>{editing?"Finish editing":"Edit profile"}</button>
     <div className="sy-profile-basics"><div><span>Full name</span><strong>{identity.name||"Not added"}</strong></div><div><span>Country / region</span><strong><CountryFlag country={identity.country} compact/>{identity.country}</strong></div><div><span>Email address</span><strong>{profile.email}<small>Demo · Not verified</small></strong></div><div><span>Account type</span><strong>{profile.role==="supplier"?"Supplier":"Buyer"}</strong></div></div>
    </section>
    <div className="sy-profile-tabs" role="tablist" aria-label="Profile sections"><button type="button" role="tab" aria-selected={tab==="company"} className={tab==="company"?"active":""} onClick={()=>setTab("company")}>Company information <span>{companyValues.length-companyCount} missing</span></button><button type="button" role="tab" aria-selected={tab==="sourcing"} className={tab==="sourcing"?"active":""} onClick={()=>setTab("sourcing")}>Sourcing preferences <span>{sourcingKeys.length-sourcingCount} missing</span></button></div>
    {tab==="company"?<section className="sy-profile-detail-card">
     <div className="sy-profile-section-head"><h3>Company information</h3><span>{companyCount} / {companyValues.length} fields</span></div>
     <div className="sy-profile-field-grid">
      <label className="sy-profile-field"><span>Full name</span><input required disabled={!editing} value={identity.name} onChange={e=>setIdentity(v=>({...v,name:e.target.value}))}/></label>
      <label className="sy-profile-field"><span>Company name *</span><input disabled={!editing} value={identity.company} placeholder="Not added" onChange={e=>setIdentity(v=>({...v,company:e.target.value}))}/></label>
      <label className="sy-profile-field"><span>Country of registration *</span><CountryField value={identity.country} disabled={!editing} onChange={value=>setIdentity(v=>({...v,country:value}))} label="Country of registration"/></label>
      {field("businessType","",["Buying Office","Importer","Wholesaler","Distributor","Manufacturer","Retailer","Trading company","Other"])}
      {field("registration","Enter your official company registration ID")}
      {field("website","https://example.com")}
      {field("phone",getDialingCode(identity.country)?getDialingCode(identity.country)+" business phone number":"Business phone number")}
      {field("established","e.g. 2024")}
      {field("employees","",["","1–10","11–50","51–200","201–500","500+"])}
      {field("revenue","",["","Not disclosed","Below $100K","$100K–$1M","$1M–$10M","Above $10M"])}
      {field("address","Business address")}
      {field("categories","e.g. Tools, Instruments & Testing")}
      {field("importHistory","e.g. Nigeria, China, India")}
      {field("description","Describe your company")}
      {field("logoUrl","https://example.com/logo.png")}
      {profile.role==="supplier"&&field("coverUrl","https://example.com/store-cover.jpg")}
      {field("platforms","Website, marketplace, wholesale showroom")}
     </div>
    </section>:<section className="sy-profile-detail-card"><div className="sy-profile-section-head"><h3>Sourcing preferences</h3><span>{sourcingCount} / {sourcingKeys.length} fields</span></div><p className="sy-profile-help">Tell potential suppliers what your company sources. These details are stored only in your browser until the backend launches.</p><div className="sy-profile-field-grid">{field("sourcingProducts","e.g. Solar panels, sensors")}{field("sourcingMarkets","e.g. China, Nigeria")}{field("sourcingFrequency","",["","One-time","Weekly","Monthly","Quarterly","As needed"])}{field("sourcingBudget","e.g. $2,000–$10,000 per order")}</div></section>}
    <section className="sy-profile-detail-card sy-profile-settings"><div className="sy-profile-section-head"><h3>{profile.role==="supplier"?"Store profile settings":"Buyer profile settings"}</h3><Settings2 size={18}/></div><label className="sy-profile-toggle"><input type="checkbox" checked={details.contactSharing} disabled={!editing} onChange={e=>update("contactSharing",e.target.checked)}/><span><strong>Allow suppliers to see my contact details</strong><small>Preview preference only; no details are published or shared from this demo.</small></span></label><div className="sy-profile-security"><LockKeyhole size={16}/> Account deletion and password controls will be available with secure authentication.</div></section>
    <div className="sy-profile-save-bar"><span><ShieldCheck size={16}/> Profile information is saved locally, not publicly.</span><div>{!editing&&<button type="button" className="sy-profile-secondary" onClick={()=>setEditing(true)}><Pencil size={15}/> Edit details</button>}<button type="submit" className="sy-green-action" disabled={!editing}><Save size={15}/> Save changes</button></div></div>
    {notice&&<p className={"sy-profile-feedback "+(notice.startsWith("Could not")?"sy-status-error":"sy-status-info")} role="status">{notice}</p>}
   </div>
   <aside className="sy-profile-score-card"><h3>Profile Score</h3><p>Based on completed fields in this interactive preview.</p><div className="sy-profile-score-hero"><div className="sy-score-ring" style={{background:`conic-gradient(#0c9b80 ${score*3.6}deg,#e9eef1 0)`}}><span>{score}%</span></div><div><strong>{score>=80?"Strong":score>=50?"In progress":"Getting started"}</strong><small>Improve your profile to help future suppliers understand your business.</small></div></div><div className="sy-score-progress"><div style={{width:score+"%"}}/></div><div className="sy-profile-score-list"><div><span><CheckCircle2 size={17}/> Account information</span><strong>{missing.account?missing.account+" missing":"Complete"}</strong></div><div><span><Building2 size={17}/> Company information</span><strong>{missing.company?missing.company+" missing":"Complete"}</strong></div><div><span><Globe2 size={17}/> Sourcing preferences</span><strong>{missing.sourcing?missing.sourcing+" missing":"Complete"}</strong></div><div><span><Settings2 size={17}/> Contact settings</span><strong>{details.contactSharing?"Enabled":"Optional"}</strong></div></div><button type="button" onClick={()=>{setEditing(true);setTab(missing.company?"company":"sourcing")}}>Complete your profile <ChevronRight size={16}/></button><small className="sy-score-disclaimer">No increased impressions, quotations or verification status are promised by this demo score.</small></aside>
  </div>
 </form>
}
