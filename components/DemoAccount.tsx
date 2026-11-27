"use client";
import {DirectTradeNotice} from "@/components/DirectTradeNotice";
import {TradeWorkflow} from "@/components/TradeWorkflow";
import {SellerProducts} from "@/components/SellerProducts";
import {SafetyCenter} from "@/components/SafetyCenter";
import {ActivityCenter} from "@/components/ActivityCenter";
import {AccountAnalyticsDashboard} from "@/components/AccountAnalyticsDashboard";
import Link from "next/link";
import {createPortal} from "react-dom";
import {SupplierProductDrafts} from "@/components/SupplierProductDrafts";
import {SupplierInboxPreview} from "@/components/SupplierInboxPreview";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserRound, ChevronDown, LayoutDashboard, Search, MessageSquare, Send, ClipboardList, UsersRound, PenSquare, Heart, LockKeyhole, LogOut, Store, Settings, ShieldCheck, X, Mail, Building2, Package, Globe2, Menu, Bell, CheckCircle, ArrowRight, Trash2 } from "lucide-react";
import {products} from "@/lib/catalog";
import {responsiveImage,imageSrcSet} from "@/lib/image-quality";
import { CountryFlag, CountryField, getCountry } from "@/components/CountryFlag";
import {MessagesPreview,PostBuyingRequest,RequestManager} from "@/components/BuyerWorkflows";
import {BuyerProfileEditor} from "@/components/BuyerProfileEditor";
import {VerificationPanel} from "@/components/VerificationPanel";

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
 {id:"requests",name:"My Requests",Icon:ClipboardList},
 {id:"contacts",name:"My contacts",Icon:UsersRound},
 {id:"profile",name:"Profile",Icon:PenSquare},
 {id:"favorites",name:"Favorites",Icon:Heart},
 {id:"verification",name:"Verification",Icon:ShieldCheck},
 {id:"report",name:"Report",Icon:LayoutDashboard},
 {id:"security",name:"Account security",Icon:LockKeyhole},
 {id:"my-products",name:"My Products",Icon:Package},
 {id:"quotations",name:"Quotations",Icon:ClipboardList},
 {id:"orders",name:"Orders",Icon:CheckCircle},
 {id:"notifications",name:"Activity Center",Icon:Bell},
 {id:"safety",name:"Report & Safety",Icon:ShieldCheck},
 {id:"add-product",name:"Add Product",Icon:Package},
 {id:"incoming",name:"Incoming Requests",Icon:ClipboardList},
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
 const [country,setCountry]=useState("");
 const [role,setRole]=useState<"buyer"|"supplier">("buyer");
 const [error,setError]=useState("");
 useEffect(()=>{setProfile(readProfile());const sync=()=>setProfile(readProfile());window.addEventListener("sylution-profile-change",sync);return()=>window.removeEventListener("sylution-profile-change",sync)},[]);
 function saveProfile(e:React.FormEvent){
  e.preventDefault();setError("");
  if(!name.trim()||!email.includes("@")){setError("Enter your name and a valid email address.");return}
  if(!getCountry(country)){setError("Select your real country or region before continuing.");return}
  const newProfile={name:name.trim(),email:email.trim().toLowerCase(),company:company.trim(),country,role,joined:new Date().toISOString()};
  try{localStorage.setItem(PROFILE_KEY,JSON.stringify(newProfile));setProfile(newProfile);window.dispatchEvent(new Event("sylution-profile-change"));setModal(null);setMenu(false)}catch{setError("Browser storage is unavailable.")}
 }
 function begin(mode:"login"|"register"){setModal(mode);setError("");setMenu(false);setName("");setEmail("");setCompany("");setCountry("");setRole("buyer")}
 function logout(){localStorage.removeItem(PROFILE_KEY);setProfile(null);setMenu(false);window.dispatchEvent(new Event("sylution-profile-change"))}
 return <div className="sy-account-wrap">
  {!profile?<div className="sy-auth-actions"><button onClick={()=>begin("login")}>Try demo</button><button className="sy-signup-action" onClick={()=>begin("register")}>Sign up</button></div>:
   <><button className="sy-account-trigger" onClick={()=>setMenu(v=>!v)} aria-expanded={menu} aria-label="Open account menu"><span className="sy-avatar"><UserRound size={18}/></span><span className="sy-user-name">{profile.name}</span><span className="sy-account-flag" title={"Account country: "+profile.country}><CountryFlag country={profile.country} compact/></span><ChevronDown size={15}/></button>
   {menu&&<><button className="sy-account-backdrop" aria-label="Close account menu" onClick={()=>setMenu(false)}/><div className="sy-account-dropdown">
    <div className="sy-account-card"><span className="sy-avatar sy-avatar-large"><UserRound size={23}/></span><div><strong>{profile.name}</strong><span>{profile.email} · <CountryFlag country={profile.country} compact/> {profile.country}</span><small><ShieldCheck size={12}/> Demo account · Not verified</small></div></div>
    <div className="sy-menu-links">{sections.filter(s=>profile.role==="supplier"||!["add-product","my-products","incoming"].includes(s.id)).map(({id,name,Icon})=><Link key={id} onClick={()=>setMenu(false)} href={"/account?tab="+id}><Icon size={16}/>{name}</Link>)}</div>
    <button className="sy-logout-action" onClick={logout}><LogOut size={16}/> Sign out of demo</button>
   </div></>}</>}
  {modal&&createPortal(<div className="sy-auth-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(null)}}><form className="sy-auth-modal" onSubmit={saveProfile}>
    <button type="button" className="sy-close" onClick={()=>setModal(null)} aria-label="Close"><X size={18}/></button>
    <span className="sy-mini-overline">SYLUTION ACCOUNT PREVIEW</span>
    <h2>{modal==="register"?"Create a demo account":"Explore a demo account"}</h2>
    <p>This is a browser-only preview. It does not create a real login or verify your identity.</p>
    <label>Full name<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label>
    <label>Email address<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com"/></label>
    <label>Company name<input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Your business"/></label>
    <div className="sy-auth-pair"><label>Country<CountryField value={country} onChange={setCountry} required label="Your country"/></label><label>Account type<select value={role} onChange={e=>setRole(e.target.value as "buyer"|"supplier")}><option value="buyer">Buyer</option><option value="supplier">Supplier</option></select></label></div>
    {error&&<p className="sy-error" role="alert">{error}</p>}
    <button className="sy-green-action" type="submit">{modal==="register"?"Create demo account":"Continue in demo mode"} <ArrowRight size={16}/></button>
    <small>No passwords or real authentication are used in this prototype.</small>
   </form></div>,document.body)}
 </div>;
}
export function DemoAccountPage(){
 const router=useRouter();
 const searchParams=useSearchParams();
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
  const p=readProfile();setProfile(p);setName(p?.name||"");setCompany(p?.company||"");setCountry(p?.country||"");
  setRfqs(getRfqs());setSaved(getSaves());
  const sync=()=>{const next=readProfile();setProfile(next);setRfqs(getRfqs());setSaved(getSaves())};
  window.addEventListener("sylution-profile-change",sync);window.addEventListener("sylution-shortlist-change",sync);window.addEventListener("sylution-rfq-change",sync);window.addEventListener("storage",sync);return()=>{window.removeEventListener("sylution-profile-change",sync);window.removeEventListener("sylution-shortlist-change",sync);window.removeEventListener("sylution-rfq-change",sync);window.removeEventListener("storage",sync)}
 },[]);
 useEffect(()=>{
  const active=searchParams.get("tab");
  if(active==="overview"&&profile?.role==="supplier")setSection("supplier");
  else if(sections.some(s=>s.id===active))setSection(active as Section);
  else setSection(readProfile()?.role==="supplier"?"supplier":"overview");
 },[searchParams,profile?.role]);
 function switchTo(id:Section){setSection(id);setNotice("");router.replace("/account?tab="+id,{scroll:false})}
 function saveDetails(e:React.FormEvent){e.preventDefault();if(!profile)return;const next={...profile,name:name.trim(),company:company.trim(),country:country.trim()};localStorage.setItem(PROFILE_KEY,JSON.stringify(next));setProfile(next);window.dispatchEvent(new Event("sylution-profile-change"));setNotice("Demo profile updated in this browser.")}
 function deleteRfq(index:number){const next=rfqs.filter((_,i)=>i!==index);localStorage.setItem(RFQ_KEY,JSON.stringify(next));setRfqs(next)}
 function unsave(slug:string){const next=saved.filter(s=>s!==slug);localStorage.setItem(SAVE_KEY,JSON.stringify(next));setSaved(next);window.dispatchEvent(new Event("sylution-shortlist-change"))}
 const favoriteProducts=products.filter(p=>saved.includes(p.slug));
 const completeness=[!!profile?.name,!!profile?.email,!!profile?.company,!!profile?.country,!!profile?.role].filter(Boolean).length*20;
 const recentRfqs=rfqs.filter(r=>r.createdAt&&Date.now()-new Date(r.createdAt).getTime()<=range*86400000).length;
 return <main className={"sy-account-page "+((section==="supplier"||profile?.role==="supplier")?"sy-supplier-theme":"sy-buyer-theme")+((section==="messages"||section==="incoming")?" sy-messages-page":"")+((["post-rfq","add-product","verification","security"].includes(section))?" sy-focus-page":"")}>
  <div className="sy-account-banner"><span className="sy-mini-overline">{profile?.role==="supplier"?"SYLUTION SELLER WORKSPACE":"SYLUTION BUYER WORKSPACE"}</span>{profile?.country&&<div className="sy-account-region"><CountryFlag country={profile.country} compact/><span>{profile.country} · Your registered region</span></div>}<h1>{profile?"Welcome back, "+profile.name:"Your SYLUTION workspace"}</h1><p>Manage sourcing, saved products and business information from one place.</p><div className="sy-demo-alert"><ShieldCheck size={16}/> Interactive preview: records stay in this browser. No live authentication, messaging or supplier verification yet.</div></div>
  {!profile&&section==="messages"?<MessagesPreview onFind={()=>router.push("/#products")} onRequest={()=>router.push("/#products")}/>:!profile&&section==="requests"?<RequestManager onCreate={()=>window.location.assign("/#products")}/>:!profile?<div className="sy-account-empty"><UserRound size={36}/><h2>Explore the SYLUTION member dashboard</h2><p>Use the Log in or Sign up control above to create a local demo profile and unlock the preview.</p><Link href="/#products">Browse products <ArrowRight size={16}/></Link></div>:
  <div className="sy-account-layout">
   <nav className="sy-account-sidebar" aria-label="Account navigation"><div className="sy-account-identity"><span className="sy-avatar sy-avatar-large"><UserRound size={22}/></span><div><strong>{profile.name}</strong><small><CountryFlag country={profile.country} compact/> {profile.country} · {profile.company||"Member account"}</small></div></div><div className="sy-dashboard-side-brand"><span className="sy-side-mark">S</span><span><strong>SYLUTION</strong><small>TRADE WORKSPACE</small></span></div><button className="sy-sidebar-primary" onClick={()=>switchTo(profile.role==="supplier"?"add-product":"post-rfq")}><span className="sy-plus-sign">＋</span> {profile.role==="supplier"?"Add Product":"Post Buying Request"}</button>{sections.filter(s=>profile.role==="supplier"||!["add-product","my-products","incoming"].includes(s.id)).map(({id,name,Icon})=><button key={id} className={section===id?"active":""} onClick={()=>switchTo(id)}><Icon size={17}/>{name}</button>)}</nav>
   <div className="sy-dashboard-content">
    <div className="sy-content-topline"><div><span className="sy-mini-overline">ACCOUNT / {section.toUpperCase().replace("-"," ")}</span><h2>{sections.find(s=>s.id===section)?.name}</h2></div><span className="sy-preview-tag">Demo workspace</span></div>
    {section==="overview"&&<AccountAnalyticsDashboard profile={profile} onNavigate={switchTo} savedCount={saved.length} rfqs={rfqs}/>}
    {section==="products"&&<div className="sy-panel sy-promo-panel"><Search size={30}/><h3>Find wholesale products</h3><p>Search the sample catalog by industry, origin or product type.</p><Link className="sy-green-action" href="/#products">Browse 48 sample listings <ArrowRight size={16}/></Link></div>}
    {section==="messages"&&(profile.role==="supplier"?<SupplierInboxPreview company={profile.company}/>:<MessagesPreview onFind={()=>switchTo("products")} onRequest={()=>switchTo("post-rfq")}/>)}
    {section==="post-rfq"&&<PostBuyingRequest onSaved={()=>{setRfqs(getRfqs());setNotice("Saved to Buying Requests");}}/>}
    {section==="requests"&&<RequestManager onCreate={()=>switchTo("post-rfq")}/>}
    {section==="contacts"&&<div className="sy-panel sy-promo-panel"><UsersRound size={29}/><h3>My supplier contacts</h3><p>There are no confirmed business contacts. Once suppliers can respond to RFQs, your supplier relationships will appear here.</p><Link href="/#products">Discover sample suppliers <ArrowRight size={16}/></Link></div>}
    {section==="profile"&&<BuyerProfileEditor profile={profile} onUpdate={setProfile}/>}
    {section==="favorites"&&<div className="sy-panel"><h3>Saved products <span className="sy-count">{favoriteProducts.length}</span></h3>{favoriteProducts.length?<div className="sy-fav-grid">{favoriteProducts.map(p=><div className="sy-fav-card" key={p.slug}><Link href={"/products/"+p.slug}><img src={responsiveImage(p.image,640)} srcSet={imageSrcSet(p.image,[320,640,960])} sizes="(max-width:720px) 46vw,22vw" alt="" loading="lazy" decoding="async"/><strong>{p.name}</strong><small><CountryFlag country={p.country} compact/> {p.country} · {p.price}</small></Link><button onClick={()=>unsave(p.slug)}>Remove from shortlist</button></div>)}</div>:<p className="sy-empty-msg">Your shortlist is empty. Save products from their detail pages to see them here.</p>}</div>}
    {section==="verification"&&<VerificationPanel country={profile.country} role={profile.role} onProfile={()=>switchTo("profile")}/>}
    {section==="report"&&<div className="sy-panel sy-promo-panel"><LayoutDashboard size={30}/><h3>Sourcing reports</h3><p>No live traffic, messages or supplier analytics have been collected yet. After connecting Supabase and product analytics, you will see your verified sourcing history here.</p><div className="sy-supplier-teaser"><div><ClipboardList size={20}/><strong>{rfqs.length} demo RFQs</strong><small>Saved in this browser</small></div><div><Heart size={20}/><strong>{saved.length} favorites</strong><small>Local shortlist</small></div><div><MessageSquare size={20}/><strong>0 conversations</strong><small>Not connected</small></div></div></div>}
    {section==="security"&&<div className="sy-panel sy-promo-panel"><LockKeyhole size={29}/><h3>Account security</h3><p>This demonstration does not store passwords or provide real sign-in protection. Do not enter real credentials here.</p><div className="sy-demo-alert">Production: Supabase Auth, email verification, password reset, secure sessions and role-based access.</div></div>}
    {profile.role==="supplier"&&section==="my-products"&&<SellerProducts email={profile.email}/>}
    {section==="quotations"&&<TradeWorkflow view="quotations" role={profile.role} company={profile.company}/>}
    {section==="orders"&&<TradeWorkflow view="orders" role={profile.role} company={profile.company}/>}
    {section==="safety"&&<SafetyCenter/>}
    {section==="notifications"&&<ActivityCenter email={profile.email}/>}
    {profile.role==="supplier"&&section==="add-product"&&<SupplierProductDrafts key={profile.email} country={profile.country} email={profile.email}/>}
    {profile.role==="supplier"&&section==="incoming"&&<SupplierInboxPreview company={profile.company}/>}
    {section==="supplier"&&<AccountAnalyticsDashboard profile={profile} onNavigate={switchTo} savedCount={saved.length} rfqs={rfqs}/>}
   </div>
  </div>}
 </main>;
}
