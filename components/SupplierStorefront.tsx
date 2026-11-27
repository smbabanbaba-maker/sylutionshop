"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {ArrowLeft,Building2,Check,Grid2X2,Heart,MapPin,MessageCircle,Package,Search,ShieldAlert,Store} from "lucide-react";
import type {Product} from "@/lib/catalog";
import {SupplierContactModal} from "@/components/SupplierContactModal";

type Tab="home"|"items"|"categories"|"contact";
export function SupplierStorefront({company,country,items}:{company:string;country:string;items:Product[]}){
 const [tab,setTab]=useState<Tab>("items");
 const [query,setQuery]=useState("");
 const [category,setCategory]=useState("All");
 const [contact,setContact]=useState<Product|null>(null);
 const [followed,setFollowed]=useState(false);
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem("sylution_demo_followed_shops")||"[]");setFollowed(Array.isArray(saved)&&saved.includes(company))}catch{}},[company]);
 const categories=useMemo(()=>["All",...new Set(items.map(x=>x.category))], [items]);
 const matches=items.filter(x=>(category==="All"||x.category===category)&&[x.name,x.category,x.description].join(" ").toLowerCase().includes(query.trim().toLowerCase()));
 function follow(){try{const key="sylution_demo_followed_shops";const names=JSON.parse(localStorage.getItem(key)||"[]") as string[];const updated=followed?names.filter(x=>x!==company):[...new Set([...names,company])];localStorage.setItem(key,JSON.stringify(updated));setFollowed(!followed)}catch{}}
 return <main className="sy-store-page">
   <div className="sy-store-topbar"><Link href="/account?tab=messages" aria-label="Back to Messages"><ArrowLeft size={21}/></Link><div className="sy-store-search"><Search size={17}/><input value={query} onChange={e=>{setQuery(e.target.value);setTab("items")}} placeholder="Search this store..." aria-label="Search this store"/></div><span className="sy-store-toplogo"><Store size={20}/></span></div>
   <header className="sy-store-hero"><span className="sy-store-avatar"><Building2 size={27}/></span><div className="sy-store-hero-details"><small>SYLUTION TRADE · DEMO STORE</small><h1>{company}</h1><span><MapPin size={13}/> {country}</span></div><button className="sy-store-follow" onClick={follow} type="button">{followed?<Check size={17}/>:<Heart size={17}/>} {followed?"Following":"Follow"}</button></header>
   <div className="sy-store-meta"><span><strong>{items.length}</strong><small>Sample products</small></span><span><strong>{categories.length-1}</strong><small>Categories</small></span><span><strong>Unverified</strong><small><ShieldAlert size={12}/> Demo seller</small></span></div>
   <nav className="sy-store-tabs" aria-label="Store sections">{([{key:"home",label:"Home"},{key:"items",label:"All items"},{key:"categories",label:"Categories"},{key:"contact",label:"Contact"}] as {key:Tab;label:string}[]).map(t=><button type="button" className={tab===t.key?"active":""} key={t.key} onClick={()=>setTab(t.key)}>{t.label}</button>)}</nav>
   {(tab==="home"||tab==="items"||tab==="categories")&&<section className="sy-store-content">
    {tab==="home"&&<div className="sy-store-welcome"><h2>Welcome to {company}</h2><p>Explore the sample catalogue. Product availability, supplier identity and prices have not been independently confirmed.</p><button type="button" onClick={()=>setTab("items")}>View all products</button></div>}
    {tab==="categories"?<div className="sy-store-category-grid">{categories.filter(x=>x!=="All").map(x=><button key={x} type="button" onClick={()=>{setCategory(x);setTab("items")}}><Grid2X2 size={17}/>{x}<span>{items.filter(p=>p.category===x).length}</span></button>)}</div>:null}
    {tab!=="categories"&&<><div className="sy-store-results"><strong>{category==="All"?"All products":category}</strong><span>{matches.length} items</span></div><div className="sy-store-filters">{categories.map(c=><button type="button" className={category===c?"active":""} key={c} onClick={()=>setCategory(c)}>{c}</button>)}</div>
     <div className="sy-store-product-grid">{matches.map(p=><article key={p.id} className="sy-store-product"><Link href={"/products/"+p.slug} className="sy-store-product-photo"><img loading="lazy" src={p.image} alt={p.name}/></Link><Link className="sy-store-product-title" href={"/products/"+p.slug}>{p.name}</Link><strong>{p.price}</strong><small>MOQ: {p.moq}</small><button type="button" onClick={()=>setContact(p)}><MessageCircle size={14}/> Message seller</button></article>)}</div>
     {!matches.length&&<div className="sy-store-no-results"><Package size={30}/><p>No products match this search.</p><button onClick={()=>{setQuery("");setCategory("All")}}>Clear filters</button></div>}
    </>}
   </section>}
   {tab==="contact"&&<section className="sy-store-contact"><Building2 size={28}/><h2>Contact {company}</h2><p>Ask about a product directly. Messages are saved as local drafts in this demonstration.</p><button type="button" onClick={()=>setContact(items[0])}><MessageCircle size={18}/> Message seller</button><p><ShieldAlert size={15}/> This supplier profile is not verified.</p></section>}
   <nav className="sy-store-bottom" aria-label="Store quick navigation"><button className={tab==="home"?"active":""} onClick={()=>setTab("home")}><Store size={19}/>Home</button><button className={tab==="items"?"active":""} onClick={()=>setTab("items")}><Package size={19}/>Items</button><button className={tab==="categories"?"active":""} onClick={()=>setTab("categories")}><Grid2X2 size={19}/>Categories</button><button className={tab==="contact"?"active":""} onClick={()=>setTab("contact")}><MessageCircle size={19}/>Contact</button></nav>
   {contact&&<SupplierContactModal product={contact} onClose={()=>setContact(null)}/>}
 </main>;
}
