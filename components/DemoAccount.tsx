"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserRound, ChevronDown, LayoutDashboard, Search, MessageSquare, Send, ClipboardList, UsersRound, PenSquare, Heart, LockKeyhole, LogOut, Store, Settings, ShieldCheck, X, Mail, Building2, Package, Globe2, Menu, Bell, CheckCircle, ArrowRight, Trash2 } from "lucide-react";
import {products} from "@/lib/catalog";

type DemoProfile={name:string;email:string;company:string;country:string;role:"buyer"|"supplier";joined:string};
type Rfq={product?:string;company?:string;quantity?:number;unit?:string;destinationCountry?:string;createdAt?:string;email?:string};
const PROFILE_KEY="sylution_demo_profile";
const RFQ_KEY="sylution_demo_rfqs";
const SAVE_KEY="sylution_saved_products";
const sections=[
 {id:"overview",name:"Dashboard",Icon:LayoutDashboard},
 {id:"products",name:"Find products",Icon:Search},
 {id:"messages",name:"Messages",Icon:MessageSquare},
 {id:"post-rfq",name:"Post buying request",Icon:Send},
 {id:"requests",name:"Buying Request",Icon:ClipboardList},
 {id:"contacts",name:"My contacts",Icon:UsersRound},
 {id:"profile",name:"Profile",Icon:PenSquare},
 {id:"favorites",name:"Favorites",Icon:Heart},
 {id:"verification",name:"Verification",Icon:ShieldCheck},
 {id:"report",name:"Report",Icon:LayoutDashboard},
 {id:"security",name:"Account security",Icon:LockKeyhole},
 {id:"supplier",name:"Go to supplier site",Icon:Store},
] as const;
type Section=typeof sections[number]["id"];
function readProfile():DemoProfile|null{
 try{const raw=localStorage.getItem(PROFILE_KEY);return raw?JSON.parse(raw) as DemoProfile:null;}catch{return null}
}
function getRfqs():Rfq[]{try{return JSON.parse(localStorage.getItem(RFQ_KEY)||"[]") as Rfq[]}catch{return []}}
function getSaves():string[]{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||"[]") as string[]}catch{return []}}
export function DemoAccountMenu(){
 const [profile,setProfile]=useState<DemoProfile|null>(null);
 const [menu,setMenu]=useState(false);
 const [modal,setModal]=useState<"login"|"register"|null>(null);
 const [name,setName]=useState("");
 const [email,setEmail]=useState("");
 const [company,setCompany]=useState("");
 const [country,setCountry]=useState("Nigeria");
 const [role,setRole]=useState<"buyer"|"supplier">("buyer");
 const [error,setError]=useState("");
 useEffect(()=>{setProfile(readProfile());const sync=()=>setProfile(readProfile());window.addEventListener("sylution-profile-change",sync);return()=>window.removeEventListener("sylution-profile-change",sync)},[]);
 function saveProfile(e:React.FormEvent){
  e.preventDefault();setError("");
  if(!name.trim()||!email.includes("@")){setError("Enter your name and a valid email address.");return}
  const newProfile={name:name.trim(),email:email.trim().toLowerCase(),company:company.trim(),country,role,joined:new Date().toISOString()};
  try{localStorage.setItem(PROFILE_KEY,JSON.stringify(newProfile));setProfile(newProfile);window.dispatchEvent(new Event("sylution-profile-change"));setModal(null);setMenu(false)}catch{setError("Browser storage is unavailable.")}
 }
 function begin(mode:"login"|"register"){setModal(mode);setError("");setMenu(false)}
 function logout(){localStorage.removeItem(PROFILE_KEY);setProfile(null);setMenu(false);window.dispatchEvent(new Event("sylution-profile-change"))}
 return <div className="sy-account-wrap">
  {!profile?<div className="sy-auth-actions"><button onClick={()=>begin("login")}>Log in</button><button className="sy-signup-action" onClick={()=>begin("register")}>Sign up</button></div>:
   <><button className="sy-account-trigger" onClick={()=>setMenu(v=>!v)} aria-expanded={menu} aria-label="Open account menu"><span className="sy-avatar"><UserRound size={18}/></span><span className="sy-user-name">{profile.name}</span><ChevronDown size={15}/></button>
   {menu&&<><button className="sy-account-backdrop" aria-label="Close account menu" onClick={()=>setMenu(false)}/><div className="sy-account-dropdown">
    <div className="sy-account-card"><span className="sy-avatar sy-avatar-large"><UserRound size={23}/></span><div><strong>{profile.name}</strong><span>{profile.email}</span><small><ShieldCheck size={12}/> Demo account · Not verified</small></div></div>
    <div className="sy-menu-links">{sections.map(({id,name,Icon})=><Link key={id} onClick={()=>setMenu(false)} href={"/account?tab="+id}><Icon size={16}/>{name}</Link>)}</div>
    <button className="sy-logout-action" onClick={logout}><LogOut size={16}/> Sign out of demo</button>
   </div></>}</>}
  {modal&&<div className="sy-auth-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(null)}}><form className="sy-auth-modal" onSubmit={saveProfile}>
    <button type="button" className="sy-close" onClick={()=>setModal(null)} aria-label="Close"><X size={18}/></button>
    <span className="sy-mini-overline">SYLUTION ACCOUNT PREVIEW</span>
    <h2>{modal==="register"?"Create a demo account":"Explore your buyer account"}</h2>
    <p>This is a browser-only preview. It does not create a real login or verify your identity.</p>
    <label>Full name<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label>
    <label>Email address<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com"/></label>
    <label>Company name<input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Your business"/></label>
    <div className="sy-auth-pair"><label>Country<input value={country} onChange={e=>setCountry(e.target.value)}/></label><label>Account type<select value={role} onChange={e=>setRole(e.target.value as "buyer"|"supplier")}><option value="buyer">Buyer</option><option value="supplier">Supplier</option></select></label></div>
    {error&&<p className="sy-error" role="alert">{error}</p>}
    <button className="sy-green-action" type="submit">{modal==="register"?"Create demo account":"Continue in demo mode"} <ArrowRight size={16}/></button>
    <small>No passwords or real authentication are used in this prototype.</small>
   </form></div>}
 </div>;
}
export function DemoAccountPage(){
 const router=useRouter();
 const [profile,setProfile]=useState<DemoProfile|null>(null);
 const [section,setSection]=useState<Section>("overview");
 const [rfqs,setRfqs]=useState<Rfq[]>([]);
 const [saved,setSaved]=useState<string[]>([]);
 const [name,setName]=useState("");
 const [company,setCompany]=useState("");
 const [country,setCountry]=useState("");
 const [notice,setNotice]=useState("");
 const [range,setRange]=useState<7|30|90>(7);
 useEffect(()=>{
  const active=new URLSearchParams(window.location.search).get("tab");
  if(sections.some(s=>s.id===active))setSection(active as Section);
  const p=readProfile();setProfile(p);setName(p?.name||"");setCompany(p?.company||"");setCountry(p?.country||"Nigeria");
  setRfqs(getRfqs());setSaved(getSaves());
  const sync=()=>{const next=readProfile();setProfile(next);setRfqs(getRfqs());setSaved(getSaves())};
  window.addEventListener("sylution-profile-change",sync);return()=>window.removeEventListener("sylution-profile-change",sync)
 },[]);
 function switchTo(id:Section){setSection(id);setNotice("");router.replace("/account?tab="+id,{scroll:false})}
 function saveDetails(e:React.FormEvent){e.preventDefault();if(!profile)return;const next={...profile,name:name.trim(),company:company.trim(),country:country.trim()};localStorage.setItem(PROFILE_KEY,JSON.stringify(next));setProfile(next);window.dispatchEvent(new Event("sylution-profile-change"));setNotice("Demo profile updated in this browser.")}
 function deleteRfq(index:number){const next=rfqs.filter((_,i)=>i!==index);localStorage.setItem(RFQ_KEY,JSON.stringify(next));setRfqs(next)}
 function unsave(slug:string){const next=saved.filter(s=>s!==slug);localStorage.setItem(SAVE_KEY,JSON.stringify(next));setSaved(next)}
 const favoriteProducts=products.filter(p=>saved.includes(p.slug));
 const completeness=[!!profile?.name,!!profile?.email,!!profile?.company,!!profile?.country,!!profile?.role].filter(Boolean).length*20;
 const recentRfqs=rfqs.filter(r=>r.createdAt&&Date.now()-new Date(r.createdAt).getTime()<=range*86400000).length;
 return <main className="sy-account-page">
  <div className="sy-account-banner"><span className="sy-mini-overline">SYLUTION BUYER WORKSPACE</span><h1>{profile?"Welcome back, "+profile.name:"Your SYLUTION workspace"}</h1><p>Manage sourcing, saved products and business information from one place.</p><div className="sy-demo-alert"><ShieldCheck size={16}/> Interactive preview: records stay in this browser. No live authentication, messaging or supplier verification yet.</div></div>
  {!profile?<div className="sy-account-empty"><UserRound size={36}/><h2>Explore the SYLUTION member dashboard</h2><p>Use the Log in or Sign up control above to create a local demo profile and unlock the preview.</p><Link href="/#products">Browse products <ArrowRight size={16}/></Link></div>:
  <div className="sy-account-layout">
   <nav className="sy-account-sidebar" aria-label="Account navigation"><div className="sy-account-identity"><span className="sy-avatar sy-avatar-large"><UserRound size={22}/></span><div><strong>{profile.name}</strong><small>{profile.company||"Member account"}</small></div></div>{sections.map(({id,name,Icon})=><button key={id} className={section===id?"active":""} onClick={()=>switchTo(id)}><Icon size={17}/>{name}</button>)}</nav>
   <div className="sy-dashboard-content">
    <div className="sy-content-topline"><div><span className="sy-mini-overline">ACCOUNT / {section.toUpperCase().replace("-"," ")}</span><h2>{sections.find(s=>s.id===section)?.name}</h2></div><span className="sy-preview-tag">Demo workspace</span></div>
    {section==="overview"&&<>
     <div className="sy-profile-nudge"><div className="sy-nudge-symbol"><Package size={23}/></div><div><strong>Update your profile to get better supplier matches.</strong><p>Tell us what you source so suppliers can match you with suitable offers and respond faster.</p></div><button onClick={()=>switchTo("profile")}>Update Profile <ArrowRight size={15}/></button></div>
     <div className="sy-workspace-heading"><div><span className="sy-mini-overline">BUYER WORKSPACE / HOME</span><h2>Your sourcing performance</h2><p>Track buying activities and supplier engagement from your account.</p></div><label>Choose time range <select value={range} onChange={e=>setRange(Number(e.target.value) as 7|30|90)}><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option></select></label></div>
     <div className="sy-performance-grid">
       <div><span>Impressions</span><strong>0</strong><button onClick={()=>switchTo("profile")}>Improve visibility <ArrowRight size={14}/></button></div>
       <div><span>Supplier visits</span><strong>0</strong><Link href="/#products">Explore suppliers <ArrowRight size={14}/></Link></div>
       <div><span>Quotations received</span><strong>0</strong><button onClick={()=>switchTo("messages")}>View quotations <ArrowRight size={14}/></button></div>
       <div><span>Unreplied messages</span><strong>0</strong><button onClick={()=>switchTo("messages")}>Open messages <ArrowRight size={14}/></button></div>
     </div>
     <div className="sy-premium-data">
       {["Traffic sources","Top countries","Inquiries sent","First response time"].map(name=><div key={name}><h3>{name}</h3><span className="sy-data-preview"><LockKeyhole size={19}/> Connect analytics to activate</span><small>No real analytics data is connected.</small></div>)}
     </div>
     <div className="sy-account-performance-note"><div><ShieldCheck size={22}/><span>More detailed sourcing analytics and identity verification will become available after the live backend is connected.</span></div><button onClick={()=>switchTo("verification")}>Verification status <ArrowRight size={15}/></button></div>
     <div className="sy-recommended-heading"><div><span className="sy-mini-overline">SELECTED FOR YOUR SOURCING</span><h2>Recommended products for you</h2><p>Sample recommendations based on available listings, not a personalized AI match.</p></div><Link href="/#products">View all <ArrowRight size={15}/></Link></div>
     <div className="sy-recommended-products">{products.slice(0,6).map(p=><Link href={"/products/"+p.slug} className="sy-recommended-card" key={p.slug}><div className="sy-recommended-photo"><img src={p.image} alt={p.name} loading="lazy" onError={e=>{e.currentTarget.style.display="none"}}/><span>New</span></div><strong>{p.name}</strong><b>{p.price} <small>/ {p.unit}</small></b><small>Min. order: {p.moq}</small><span className="sy-recommended-country">{p.flag} {p.country} <em>Demo listing</em></span></Link>)}</div>
     <div className="sy-dashboard-bottom"><div className="sy-panel"><h3>Recent buying requests <span className="sy-count">{recentRfqs}</span></h3>{recentRfqs?rfqs.filter(r=>r.createdAt&&Date.now()-new Date(r.createdAt).getTime()<=range*86400000).slice(-3).reverse().map((r,i)=><p key={i} className="sy-list-line"><Package size={16}/>{r.product||"Buying request"} <span>{r.destinationCountry||"Destination not specified"}</span></p>):<p className="sy-empty-msg">No RFQs saved during this period.</p>}<button onClick={()=>switchTo("requests")}>Manage requests</button></div><div className="sy-panel"><h3>Your profile completion</h3><div className="sy-profile-meter"><div style={{width:completeness+"%"}}/></div><strong>{completeness}% complete</strong><p>Complete your company details and describe what you source. Identity verification remains separate.</p><button onClick={()=>switchTo("profile")}>Complete profile</button></div></div>
    </>}
    {section==="products"&&<div className="sy-panel sy-promo-panel"><Search size={30}/><h3>Find wholesale products</h3><p>Search the sample catalog by industry, origin or product type.</p><Link className="sy-green-action" href="/#products">Browse 48 sample listings <ArrowRight size={16}/></Link></div>}
    {section==="messages"&&<div className="sy-panel sy-promo-panel"><MessageSquare size={30}/><h3>Supplier inbox</h3><p>No messages yet. Real-time buyer/supplier chat will be connected after Supabase authentication is ready.</p><div className="sy-chat-preview"><span className="sy-chat-avatar"><UsersRound size={19}/></span><div><strong>Your conversations appear here</strong><small>Search threads · Attach quotations · Follow up with suppliers</small></div></div></div>}
    {section==="post-rfq"&&<div className="sy-panel sy-promo-panel"><Send size={29}/><h3>Post a buying request</h3><p>Select a sample product to create a structured demo RFQ with quantity, location, trade terms and requirements. Requests are saved to this browser.</p><div className="sy-product-shortcuts">{products.slice(0,8).map(p=><Link href={"/products/"+p.slug} key={p.id}><Package size={15}/>{p.name}</Link>)}</div></div>}
    {section==="requests"&&<div className="sy-panel"><h3>My buying requests <span className="sy-count">{rfqs.length}</span></h3>{rfqs.length?rfqs.slice().reverse().map((r,i)=><div className="sy-request-row" key={i}><div><strong>{r.product||"Wholesale request"}</strong><small>Qty: {r.quantity||"—"} {r.unit||""} · Destination: {r.destinationCountry||"Not specified"}</small><small>{r.createdAt?new Date(r.createdAt).toLocaleDateString():"Demo request"} · Saved locally</small></div><button aria-label="Delete request" title="Delete demo request" onClick={()=>deleteRfq(rfqs.length-1-i)}><Trash2 size={17}/></button></div>):<p className="sy-empty-msg">No requests saved yet. Open a product and choose Request for Quotation.</p>}</div>}
    {section==="contacts"&&<div className="sy-panel sy-promo-panel"><UsersRound size={29}/><h3>My supplier contacts</h3><p>There are no confirmed business contacts. Once suppliers can respond to RFQs, your supplier relationships will appear here.</p><Link href="/#products">Discover sample suppliers <ArrowRight size={16}/></Link></div>}
    {section==="profile"&&<form className="sy-panel sy-profile-form" onSubmit={saveDetails}><h3>Buyer profile</h3><label>Full name<input value={name} required onChange={e=>setName(e.target.value)}/></label><label>Company<input value={company} onChange={e=>setCompany(e.target.value)}/></label><label>Country<input value={country} onChange={e=>setCountry(e.target.value)}/></label><label>Email address<input value={profile.email} readOnly title="Demo email cannot be changed in this preview"/></label><div className="sy-demo-alert">Profile updates are stored locally. Email and identity verification are not implemented.</div><button className="sy-green-action" type="submit"><CheckCircle size={16}/> Save changes</button>{notice&&<p className="sy-saved-notice" role="status">{notice}</p>}</form>}
    {section==="favorites"&&<div className="sy-panel"><h3>Saved products <span className="sy-count">{favoriteProducts.length}</span></h3>{favoriteProducts.length?<div className="sy-fav-grid">{favoriteProducts.map(p=><div className="sy-fav-card" key={p.slug}><Link href={"/products/"+p.slug}><img src={p.image} alt="" loading="lazy"/><strong>{p.name}</strong><small>{p.flag} {p.country} · {p.price}</small></Link><button onClick={()=>unsave(p.slug)}>Remove from shortlist</button></div>)}</div>:<p className="sy-empty-msg">Your shortlist is empty. Save products from their detail pages to see them here.</p>}</div>}
    {section==="verification"&&<div className="sy-panel sy-promo-panel"><ShieldCheck size={30}/><h3>Business verification</h3><p>Your demo account is not verified. This preview shows where business documents, phone, email and company checks will appear once Supabase and a verification workflow are connected.</p><div className="sy-verification-grid"><span>Business documents <b>Not submitted</b></span><span>Phone number <b>Not confirmed</b></span><span>Account email <b>Not confirmed</b></span><span>Business registration <b>Not reviewed</b></span></div><button className="sy-green-action" onClick={()=>switchTo("profile")}>Review business profile</button></div>}
    {section==="report"&&<div className="sy-panel sy-promo-panel"><LayoutDashboard size={30}/><h3>Sourcing reports</h3><p>No live traffic, messages or supplier analytics have been collected yet. After connecting Supabase and product analytics, you will see your verified sourcing history here.</p><div className="sy-supplier-teaser"><div><ClipboardList size={20}/><strong>{rfqs.length} demo RFQs</strong><small>Saved in this browser</small></div><div><Heart size={20}/><strong>{saved.length} favorites</strong><small>Local shortlist</small></div><div><MessageSquare size={20}/><strong>0 conversations</strong><small>Not connected</small></div></div></div>}
    {section==="security"&&<div className="sy-panel sy-promo-panel"><LockKeyhole size={29}/><h3>Account security</h3><p>This demonstration does not store passwords or provide real sign-in protection. Do not enter real credentials here.</p><div className="sy-demo-alert">Production: Supabase Auth, email verification, password reset, secure sessions and role-based access.</div></div>}
    {section==="supplier"&&<div className="sy-panel sy-promo-panel"><Store size={29}/><h3>Supplier workspace preview</h3><p>Supplier storefronts, product management, quotation replies and verification document uploads are planned for the connected backend. This page is a visual preview only.</p><div className="sy-supplier-teaser"><div><Package size={20}/><strong>Product listings</strong><small>Manage catalog</small></div><div><MessageSquare size={20}/><strong>Incoming RFQs</strong><small>Respond to buyers</small></div><div><ShieldCheck size={20}/><strong>Business verification</strong><small>Submit documents</small></div></div></div>}
   </div>
  </div>}
 </main>;
}
