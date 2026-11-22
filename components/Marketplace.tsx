"use client";
import Link from "next/link";
import {CatalogFilters,emptySelection} from "@/components/CatalogFilters";
import {previewListing} from "@/lib/catalog-preview";
import {TradeNavigation} from "@/components/TradeNavigation";
import { DemoAccountMenu } from "@/components/DemoAccount";
import { CountryFlag, COUNTRIES } from "@/components/CountryFlag";
import {InquiryModal} from "@/components/InquiryModal";
import {SupplierContactModal} from "@/components/SupplierContactModal";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp, FaTelegramPlane, FaPinterestP, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useEffect, useMemo, useState } from "react";
import { Search, Heart, MessageSquare, Globe2, Menu, ArrowLeft, Send, X, ClipboardList, Package, Building2, ShieldCheck, ChevronDown, Share2, Copy, ChevronLeft, ChevronRight, FileText, SlidersHorizontal, Grid2X2, ListFilter, BadgeCheck, MapPin, Bell } from "lucide-react";
import { categories, categoryGroups, products, type Category, type Product } from "@/lib/catalog";

function Header({search,setSearch}:{search?:string;setSearch?:(value:string)=>void}) {
  const [mobile,setMobile]=useState(false);
  return <><header className="site-header">
    <div className="header-inner">
      <Link className="brand" href="/"><span className="brand-mark"><span className="sy-brand-letter">S</span><i className="sy-brand-orbit"/></span><span><strong>SYLUTION</strong><small>Global B2B Marketplace</small></span></Link>
      {setSearch&&<div className="header-search"><input aria-label="Search products" placeholder="Search products and suppliers..." value={search??""} onChange={e=>setSearch?.(e.target.value)} /><button className="search-submit" aria-label="Search marketplace" onClick={()=>document.getElementById("products")?.scrollIntoView({behavior:"smooth"})}><Search size={18}/> Search</button></div>}
      <div className="header-actions"><TradeNavigation/><DemoAccountMenu/></div>
      <button type="button" aria-label={mobile?"Close navigation menu":"Open navigation menu"} aria-expanded={mobile} aria-controls="sy-mobile-navigation" className="menu-toggle" onClick={()=>setMobile(!mobile)}>{mobile?<X size={23}/>:<Menu size={23}/>}</button>
    </div>
  </header>
  {mobile&&<div id="sy-mobile-navigation" className="mobile-menu"><Link href="/" onClick={()=>setMobile(false)}>Home</Link><Link href="/#products" onClick={()=>setMobile(false)}>Products</Link><Link href="/account?tab=post-rfq" onClick={()=>setMobile(false)}>Post Buying Request</Link><Link href="/account?tab=requests" onClick={()=>setMobile(false)}>My Requests</Link><Link href="/account" onClick={()=>setMobile(false)}>My Account</Link></div>}
  </>;
}
const cash = (s:string)=>s;
export function ProductCard({product,onInquiry,preview}:{product:Product;onInquiry:(p:Product)=>void;preview?:ReturnType<typeof previewListing>}){
 const [liked,setLiked]=useState(false);
 useEffect(()=>{const sync=()=>{try{const saved=JSON.parse(localStorage.getItem("sylution_saved_products")||"[]") as string[];setLiked(saved.includes(product.slug));}catch{}};sync();window.addEventListener("sylution-shortlist-change",sync);window.addEventListener("storage",sync);return()=>{window.removeEventListener("sylution-shortlist-change",sync);window.removeEventListener("storage",sync)};},[product.slug]);
 function toggleFavorite(){const next=!liked;setLiked(next);try{const stored=JSON.parse(localStorage.getItem("sylution_saved_products")||"[]") as string[];localStorage.setItem("sylution_saved_products",JSON.stringify(next?[...new Set([...stored,product.slug])]:stored.filter(s=>s!==product.slug)));window.dispatchEvent(new Event("sylution-shortlist-change"));}catch{}}
 return <article className="product-card"><Link href={"/products/"+product.slug} className="product-image"><span className="image-fallback" aria-hidden="true">{product.category==="Agriculture"?"🌾":product.category==="Electronics"?"🔌":product.category==="Energy"?"☀️":product.category==="Industrial"?"⚙️":"📦"}</span><img src={product.image} alt={product.name} loading="lazy" decoding="async" onError={e=>{e.currentTarget.style.display="none";}}/><span className="new-chip">{preview?.recent?"New · Demo":"Sample"}</span></Link><button className={"favorite"+(liked?" active":"")} aria-label={liked?"Remove from favorites":"Save to favorites"} aria-pressed={liked} onClick={toggleFavorite}><Heart size={18} fill={liked?"currentColor":"none"}/></button>
 <div className="card-body"><Link href={"/products/"+product.slug} className="product-name">{product.name}</Link><div className="product-price">{cash(product.price)} <span>/ {product.unit}</span></div><p className="product-moq">Min. order: {product.moq}</p><div className="supplier-name">{product.supplier}</div><div className="country"><CountryFlag country={product.country} compact/> {product.country} <span className="sample-pill">Demo</span></div>{preview&&<div className="catalog-card-meta">{preview.rating>0&&<span>★ {preview.rating.toFixed(1)} sample</span>}<span>{preview.terms.join(" · ")}</span>{preview.deal&&<span>Sample deal</span>}</div>}<div className="card-bottom"><button onClick={()=>onInquiry(product)} className="inquiry-btn"><MessageSquare size={15}/> Request Quote</button><Link className="chat-link" href={"/products/"+product.slug} aria-label="See product details"><Package size={17}/></Link></div></div>
 </article>;
}
const listings = products.map((product,index)=>({product,...previewListing(product,index)}));

export function HomePage(){
 const [query,setQuery]=useState("");
 const [category,setCategory]=useState("All Categories");
 const [selected,setSelected]=useState<Product|null>(null);
 const [mode,setMode]=useState<"Products"|"Suppliers">("Products");
 const [sort,setSort]=useState("suggested");
 const [collection,setCollection]=useState("all");
 const [filters,setFilters]=useState(emptySelection);
 const [limit,setLimit]=useState(24);
 const [categoryMenuOpen,setCategoryMenuOpen]=useState(false);
 const [categoryPreview,setCategoryPreview]=useState<Category>("Agriculture");
 const [categoryQuery,setCategoryQuery]=useState("");

 const filtered=useMemo(()=>{
  const keyword=query.trim().toLowerCase();
  const matches=listings.filter(({product,markets,terms,rating,featured,deal,recent})=>{
   const searchable=mode==="Suppliers"?[product.supplier,product.country,product.category]:[product.name,product.supplier,product.country,product.category];
   return searchable.join(" ").toLowerCase().includes(keyword)
    &&(category==="All Categories"||product.category===category)
    &&(!filters.country.length||filters.country.includes(product.country))
    &&(!filters.markets.length||filters.markets.some(market=>markets.includes(market)))
    &&(!filters.terms.length||filters.terms.some(term=>terms.includes(term)))
    &&(!filters.trust.length||(filters.trust[0]==="5"?rating===5:rating>Number(filters.trust[0])))
    &&(collection==="all"||(collection==="featured"&&featured)||(collection==="deals"&&deal)||(collection==="new"&&recent));
  });
  if(sort==="name")matches.sort((a,b)=>a.product.name.localeCompare(b.product.name));
  if(sort==="latest")matches.reverse();
  if(sort==="rating")matches.sort((a,b)=>b.rating-a.rating);
  return matches;
 },[category,query,sort,filters,mode,collection]);

 const suppliers=Object.values(filtered.reduce<Record<string,typeof filtered>>((groups,listing)=>{
  const key=listing.product.supplier+" · "+listing.product.country;
  (groups[key]??=[]).push(listing);
  return groups;
 },{}));
 const previewProducts=products.filter(product=>product.category===categoryPreview);
 const listedCategories=categories.slice(1).filter(option=>products.some(product=>product.category===option));
 const categoryTabs=["All Categories",...new Set([...listedCategories,...(category==="All Categories"?[]:[category])])];
 const spotlight=filtered.filter(listing=>listing.featured).slice(0,6);
 const goProducts=()=>document.getElementById("products")?.scrollIntoView({behavior:"smooth"});
 const setCollectionAndBrowse=(value:string)=>{setMode("Products");setCollection(value);setLimit(24);goProducts();};
 const setSearch=(value:string)=>{setQuery(value);setLimit(24);};
 const clear=()=>{setSearch("");setCategory("All Categories");setFilters(emptySelection);setCollection("all");};

 return <><Header search={query} setSearch={setSearch}/><main className="catalog-home" id="home-top">
  <section className="catalog-hero">
   <div className="container catalog-hero-content">
    <h1 className="catalog-visually-hidden">Find wholesale products and suppliers</h1>
    <div className="catalog-search-box" onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))setCategoryMenuOpen(false);}} onKeyDown={event=>{if(event.key==="Escape"&&categoryMenuOpen){setCategoryMenuOpen(false);event.currentTarget.querySelector<HTMLButtonElement>("#hero-categories-toggle")?.focus();}}}>
     <div className="catalog-mode" aria-label="Search type">{(["Products","Suppliers"] as const).map(option=><button type="button" key={option} aria-pressed={mode===option} onClick={()=>{setMode(option);setCollection("all");setLimit(24);setCategoryMenuOpen(false);}}>{option}</button>)}</div>
     <form className="catalog-search-form" onSubmit={event=>{event.preventDefault();setCategoryMenuOpen(false);goProducts();}}>
      <button id="hero-categories-toggle" className="catalog-category-trigger" type="button" aria-expanded={categoryMenuOpen} aria-controls="hero-category-menu" onClick={()=>{setCategoryQuery("");setCategoryMenuOpen(open=>!open);}}><Menu size={18}/><span>{category==="All Categories"?"All categories":category}</span><ChevronDown size={15}/></button>
      <input type="search" aria-label="Search catalog" placeholder={mode==="Products"?"Search products":"Search suppliers"} value={query} onFocus={()=>setCategoryMenuOpen(false)} onChange={event=>setSearch(event.target.value)}/>
      <button className="catalog-primary" type="submit" aria-label="Search"><Search size={18}/><span>Search</span></button>
     </form>
     {categoryMenuOpen&&<section id="hero-category-menu" className="catalog-category-menu-body" aria-label="Explore product categories">
      <nav className="catalog-menu-sections" aria-label="Product categories">
       <button type="button" onClick={()=>{clear();setMode("Products");setCategoryMenuOpen(false);goProducts();}}><Grid2X2 size={17} aria-hidden="true"/> All products</button>
       <input className="catalog-category-search" type="search" value={categoryQuery} onChange={event=>setCategoryQuery(event.target.value)} placeholder="Find a category" aria-label="Find a category"/>
       {categoryGroups.map(group=>{
        const matches=group.categories.filter(option=>(group.name+" "+option).toLowerCase().includes(categoryQuery.trim().toLowerCase()));
        if(!matches.length)return null;
        return <div className="catalog-menu-group" key={group.name}><h3>{group.name}</h3>{matches.map(option=><button type="button" key={option} aria-pressed={categoryPreview===option} onClick={()=>setCategoryPreview(option)}>
          <Package size={17} aria-hidden="true"/><span>{option}</span><ChevronRight size={15} aria-hidden="true"/>
        </button>)}</div>;
       })}
       {categoryQuery.trim()&&!categoryGroups.some(group=>group.categories.some(option=>(group.name+" "+option).toLowerCase().includes(categoryQuery.trim().toLowerCase())))&&<p>No matching categories.</p>}
      </nav>
      <div className="catalog-menu-preview">
       <header className="catalog-menu-heading">
        <div><h2>{categoryPreview}</h2><button type="button" onClick={()=>{clear();setMode("Products");setCategory(categoryPreview);setCategoryMenuOpen(false);goProducts();}}>Browse all {categoryPreview} <ChevronRight size={15} aria-hidden="true"/></button></div>
        <button type="button" className="catalog-menu-close" aria-label="Close categories" onClick={()=>{setCategoryMenuOpen(false);document.getElementById("hero-categories-toggle")?.focus();}}><X size={20}/></button>
       </header>
       <ul className="catalog-menu-products">
        {previewProducts.map(product=>(
         <li key={product.id}><Link href={"/products/"+product.slug}><span>{product.name}</span><small>{product.country} · Min. {product.moq}</small></Link></li>
        ))}
       </ul>
       {!previewProducts.length&&<p className="catalog-menu-empty">No listings in this category yet.</p>}
      </div>
     </section>}
    </div>
   </div>
  </section>
  <div className="container catalog-shortcuts" aria-label="Marketplace shortcuts">
   <Link href="/account?tab=profile">Update Profile</Link><Link href="/account?tab=post-rfq">Post Buying Request</Link>
   <button type="button" onClick={()=>setCollectionAndBrowse("deals")}>Good Deals</button><button type="button" onClick={()=>setCollectionAndBrowse("new")}>New Products</button><a href="#how-it-works">Help</a>
  </div>
  <section className="container catalog-listing" id="products">
   <div className="catalog-controls">
   <div className="catalog-category-row">
   <header className="catalog-results-head"><h2>{mode==="Suppliers"?"Supplier directory":collection==="deals"?"Good Deals":collection==="new"?"New Products":collection==="featured"?"Featured Products":"Suggested Products"}</h2><span aria-live="polite">{mode==="Suppliers"?suppliers.length:filtered.length} sample {mode.toLowerCase()}</span></header>
   <div className="catalog-categories" aria-label="Browse categories">{categoryTabs.map(option=><button type="button" key={option} aria-pressed={category===option} onClick={()=>{setCategory(option);setLimit(24);}}>{option==="All Categories"?"All":option} <small>{option==="All Categories"?products.length:products.filter(product=>product.category===option).length}</small></button>)}</div>
   </div>
   <div className="catalog-toolbar">
    <CatalogFilters value={filters} onChange={value=>{setFilters(value);setLimit(24);}}/>
    <label>Sort <select value={sort} onChange={event=>{setSort(event.target.value);setLimit(24);}}><option value="suggested">Suggested</option><option value="latest">Latest</option><option value="name">Name A–Z</option><option value="rating">Sample rating</option></select></label>
   </div>
   </div>
   {collection!=="all"&&<button className="catalog-text-button" type="button" onClick={()=>setCollectionAndBrowse("all")}>Back to all products</button>}
   {mode==="Products"&&collection==="all"&&!query.trim()&&category==="All Categories"&&!Object.values(filters).some(values=>values.length)&&spotlight.length>0&&<section className="catalog-feature">
    <header><h3>Featured Products</h3><button className="catalog-text-button" type="button" onClick={()=>setCollectionAndBrowse("featured")}>View all featured</button></header>
    <div className="product-grid">{spotlight.map(listing=><ProductCard key={listing.product.id} product={listing.product} preview={listing} onInquiry={setSelected}/>)}</div>
   </section>}
   {mode==="Suppliers"?<div className="catalog-supplier-grid">{suppliers.slice(0,limit).map(group=>{
    const {product,rating}=group[0];
    return <article key={product.supplier+" · "+product.country}><Building2 size={22}/><h3>{product.supplier}</h3><p><CountryFlag country={product.country} compact/> {product.country} · {group.length} sample {group.length===1?"listing":"listings"}</p>{rating>0&&<small>{rating} / 5 sample rating</small>}<div>{group.map(({product:item})=><Link key={item.id} href={"/products/"+item.slug}>{item.name} <ChevronRight size={15}/></Link>)}</div></article>;
   })}</div>:<div className="product-grid">{filtered.slice(0,limit).map(listing=><ProductCard key={listing.product.id} product={listing.product} preview={listing} onInquiry={setSelected}/>)}</div>}
   {(mode==="Suppliers"?suppliers.length:filtered.length)>limit&&<div className="load-more-listings"><button type="button" onClick={()=>setLimit(value=>value+24)}>Load more {mode.toLowerCase()}</button></div>}
   {!filtered.length&&<div className="empty-state">No matches. Try another search or clear your filters. <button type="button" onClick={clear}>Clear search and filters</button></div>}
   <p className="catalog-demo-note">Demo catalog. Prices, ratings, markets and trade terms are examples.</p>
  </section>
  <section className="container catalog-help" id="how-it-works"><h2>How it works</h2><p>Browse the catalog, open a product and select Request Quote. Your quote drafts are available in My Requests.</p><Link href="/account?tab=requests">Open My Requests</Link></section>
  <aside className="catalog-tools" aria-label="Quick links"><a href="#how-it-works">Help</a><Link href="/account?tab=post-rfq">RFQ</Link><Link href="/account?tab=messages">Messages</Link><a href="#home-top">Top</a></aside>
 </main><footer><div className="container footer-inner"><strong>SYLUTION</strong><span>Global B2B Marketplace · Demo</span></div></footer>
 {selected&&<InquiryModal product={selected} close={()=>setSelected(null)}/>}
 </>;
}
export function ProductDetail({product}:{product:Product}){
 const [selected,setSelected]=useState<Product|null>(null);
 const [contactOpen,setContactOpen]=useState(false);
 const [saved,setSaved]=useState(false);
 const [showSticky,setShowSticky]=useState(false);
 const [copied,setCopied]=useState(false);
 const [compareSlug,setCompareSlug]=useState("");
 const [toolkitOpen,setToolkitOpen]=useState(false);
 const [checked,setChecked]=useState<string[]>([]);
 const [saveNotice,setSaveNotice]=useState("");
 useEffect(()=>{try{const stored=JSON.parse(localStorage.getItem("sylution_saved_products")||"[]") as string[];setSaved(stored.includes(product.slug));}catch{}},[product.slug]);
 function toggleSaved(){
   const next=!saved;setSaved(next);
   try{const stored=JSON.parse(localStorage.getItem("sylution_saved_products")||"[]") as string[];
     localStorage.setItem("sylution_saved_products",JSON.stringify(next?[...new Set([...stored,product.slug])]:stored.filter((s:string)=>s!==product.slug)));
   }catch{}
   window.dispatchEvent(new Event("sylution-shortlist-change"));
   setSaveNotice(next?"Added to your local shortlist":"Removed from your local shortlist");
 }
 const checklist=[
   "Request current stock and lead time",
   "Confirm product grade, packaging and MOQ",
   "Request relevant test reports and certificates",
   "Agree Incoterms and destination port",
   "Verify supplier identity before payment"
 ];
 
 useEffect(()=>{
   const sync=()=>setShowSticky(window.scrollY>370);
   sync();window.addEventListener("scroll",sync,{passive:true});
   return()=>window.removeEventListener("scroll",sync);
 },[]);
 const related=products.filter(p=>p.id!==product.id&&(p.category===product.category||p.country===product.country)).slice(0,4);
 const alternatives=(related.length>=3?related:[...related,...products.filter(p=>p.id!==product.id&&!related.some(r=>r.id===p.id))]).slice(0,4);
 const supplierProducts=products.filter(p=>p.supplier===product.supplier).slice(0,5);
 const compared=products.find(p=>p.slug===compareSlug);
 const demoMarkets=[
  {code:"us",flag:"🇺🇸",name:"United States"},
  {code:"gb",flag:"🇬🇧",name:"United Kingdom"},
  {code:"au",flag:"🇦🇺",name:"Australia"},
  {code:"ca",flag:"🇨🇦",name:"Canada"},
  {code:"de",flag:"🇩🇪",name:"Germany"}
 ];
 const demoRegions=[
  {name:"Western Europe",pct:50},
  {name:"North America",pct:33},
  {name:"Oceania",pct:17}
 ];

 function share(){
   const url=window.location.href;
   if(navigator.share){navigator.share({title:product.name,url}).catch(()=>{});}
   else if(navigator.clipboard){navigator.clipboard.writeText(url).then(()=>{setCopied(true);window.setTimeout(()=>setCopied(false),2400);}).catch(()=>{});}
 }

 return <><Header/><div className="product-page">
   {showSticky&&<div className="product-sticky-bar">
     <div className="product-sticky-inner">
       <img src={product.image} alt="" onError={e=>{e.currentTarget.style.display="none";}}/>
       <div className="sticky-info"><strong>{product.price}<span> / {product.unit}</span></strong><p>{product.name} <span> · MOQ {product.moq}</span></p></div>
       <div className="sticky-actions"><button aria-label="Save this product" onClick={toggleSaved}><Heart size={18} fill={saved?"currentColor":"none"}/></button><button onClick={share}><Share2 size={18}/></button><button className="detail-action-green" onClick={()=>setSelected(product)}><Send size={17}/> Send Inquiry</button></div>
     </div>
   </div>}
   <div className="product-page-container">
     <div className="product-demo-banner"><strong>DEMO PREVIEW</strong><span>All supplier ratings, verification badges, export markets and activity figures on this page are illustrative until a real database is connected.</span></div><div className="product-breadcrumbs"><Link href="/">All Products</Link><ChevronDown size={14}/><span>{product.category}</span><ChevronDown size={14}/><span>{product.name}</span></div>
     <div className="product-content-layout">
       <div className="product-left-column">
         <section className="product-primary-card">
           <div className="product-gallery">
             <div className="gallery-image-wrap sy-single-image-gallery"><div className="gallery-image-main"><span className="gallery-placeholder">📦</span><img src={product.image} alt={product.name} loading="eager" decoding="async" onError={e=>{e.currentTarget.style.display="none";}}/></div><div className="gallery-count">Illustrative product photo</div></div>
             <div className="gallery-share brand-share-section">
               <span className="share-label">Share on</span>
               <div className="brand-share-icons">
                 <a className="brand-share-btn facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://sylutionshop.vercel.app/products/"+product.slug)}`} target="_blank" rel="noopener noreferrer" title="Share on Facebook" aria-label="Share on Facebook"><FaFacebookF/></a>
                 <a className="brand-share-btn x-twitter" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent("https://sylutionshop.vercel.app/products/"+product.slug)}&text=${encodeURIComponent(product.name)}`} target="_blank" rel="noopener noreferrer" title="Share on X" aria-label="Share on X"><FaXTwitter/></a>
                 <a className="brand-share-btn linkedin" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://sylutionshop.vercel.app/products/"+product.slug)}`} target="_blank" rel="noopener noreferrer" title="Share on LinkedIn" aria-label="Share on LinkedIn"><FaLinkedinIn/></a>
                 <a className="brand-share-btn whatsapp" href={`https://api.whatsapp.com/send?text=${encodeURIComponent(product.name+" https://sylutionshop.vercel.app/products/"+product.slug)}`} target="_blank" rel="noopener noreferrer" title="Share on WhatsApp" aria-label="Share on WhatsApp"><FaWhatsapp/></a>
                 <a className="brand-share-btn telegram" href={`https://t.me/share/url?url=${encodeURIComponent("https://sylutionshop.vercel.app/products/"+product.slug)}&text=${encodeURIComponent(product.name)}`} target="_blank" rel="noopener noreferrer" title="Share on Telegram" aria-label="Share on Telegram"><FaTelegramPlane/></a>
                 <a className="brand-share-btn pinterest" href={`https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent("https://sylutionshop.vercel.app/products/"+product.slug)}&media=${encodeURIComponent(product.image)}&description=${encodeURIComponent(product.name)}`} target="_blank" rel="noopener noreferrer" title="Share on Pinterest" aria-label="Share on Pinterest"><FaPinterestP/></a>
                 <a className="brand-share-btn email-share" href={`mailto:?subject=${encodeURIComponent(product.name+" | SYLUTION")}&body=${encodeURIComponent("View this product on SYLUTION: https://sylutionshop.vercel.app/products/"+product.slug)}`} title="Share by email" aria-label="Share by email"><FaEnvelope/></a>
                 <button type="button" className="brand-share-btn native-share" onClick={share} aria-label="More sharing options" title="More sharing options"><Share2 size={17}/></button>
                 <button className="brand-share-btn copy" onClick={()=>{navigator.clipboard?.writeText(window.location.href).then(()=>{setCopied(true);window.setTimeout(()=>setCopied(false),2500)}).catch(()=>{});}} aria-label="Copy product link" title="Copy product link"><Copy size={17}/></button>
               </div>
               {copied&&<small role="status">Link copied!</small>}
             </div>
           </div>
           <div className="product-offer">
             <div className="product-title-row"><div><span className="detail-eyebrow">{product.category} · {product.country}</span><h1>{product.name}</h1><p className="product-review-line">No reviews yet <span>•</span> Demo product listing</p></div><button onClick={toggleSaved} aria-label="Save product" className="save-product"><Heart size={20} fill={saved?"currentColor":"none"}/></button></div>
             <div className="buyer-value-strip">
               <span><ClipboardList size={16}/> Structured RFQs</span>
               <span><Heart size={16}/> Local shortlist</span>
               <span><ShieldCheck size={16}/> Verification-aware</span>
             </div>
             <div className="product-price-block"><div className="price-overline">Indicative wholesale price</div><div className="offer-price">{product.price}<span> / {product.unit}</span></div><p>Final price, availability and trade terms must be confirmed by quotation.</p></div>
             <div className="offer-information-grid">
               <div><Package size={17}/><span>Minimum order</span><strong>{product.moq}</strong></div>
               <div><MessageSquare size={17}/><span>Price terms</span><strong>Negotiable</strong></div>
               <div><MapPin size={17}/><span>Supplier country</span><strong>{product.country}</strong></div>
               <div><Globe2 size={17}/><span>Trade markets</span><strong>Ask supplier</strong></div>
             </div>
             <div className="trade-facts"><div><span>Product category</span><strong>{product.category}</strong></div><div><span>Trade terms</span><strong>On request</strong></div><div><span>Payment terms</span><strong>To be agreed</strong></div><div><span>Shipping port</span><strong>Not specified</strong></div></div>
             <div className="offer-bottom">
               <button className="detail-action-green" onClick={()=>setSelected(product)}><Send size={18}/> Request Quote</button>
               <div className="offer-quick-actions"><button onClick={toggleSaved}><Heart size={16} fill={saved?"currentColor":"none"}/>{saved?"Saved to shortlist":"Save to shortlist"}</button><button onClick={()=>setToolkitOpen(!toolkitOpen)}><ClipboardList size={16}/>{toolkitOpen?"Hide buyer toolkit":"Buyer toolkit"}</button></div>
               {saveNotice&&<p className="save-notice" role="status">{saveNotice}</p>}
               <p>Preview mode — demo RFQs are stored in this browser only.</p>
             </div>
           </div>
         </section>
         <section className="buyer-tools-panel detail-section">
           <div className="buyer-tools-heading"><div><span className="buyer-tools-kicker">SYLUTION SOURCING TOOLS</span><h2>Compare before you enquire</h2><p>Review sample listings side-by-side, then prepare your sourcing checklist.</p></div><span className="tools-demo-mark">Interactive demo</span></div>
           <div className="buyer-compare-controls"><label htmlFor="compare-product">Compare this product with</label><select id="compare-product" value={compareSlug} onChange={e=>setCompareSlug(e.target.value)}><option value="">Choose another product</option>{products.filter(p=>p.id!==product.id).map(p=><option key={p.slug} value={p.slug}>{p.name}</option>)}</select></div>
           {compared&&<div className="buyer-compare-table">
             <div className="comparison-row comparison-head"><span>Specification</span><strong>{product.name}</strong><strong>{compared.name}</strong></div>
             {[["Indicative price",product.price,compared.price],["Minimum order",product.moq,compared.moq],["Country",product.country,compared.country],["Category",product.category,compared.category],["Supplier",product.supplier,compared.supplier]].map(([label,a,b])=><div className="comparison-row" key={label}><span>{label}</span><strong>{a}</strong><strong>{b}</strong></div>)}
             <p>Prices and suppliers shown here are illustrative, not verified quotations.</p>
           </div>}
           <div className="buyer-toolkit-trigger"><div><strong>Wholesale buyer checklist</strong><p>Prepare the right questions before contacting a supplier.</p></div><button onClick={()=>setToolkitOpen(!toolkitOpen)} aria-expanded={toolkitOpen}>{toolkitOpen?"Hide checklist":"Open checklist"} <ChevronDown size={17}/></button></div>
           {toolkitOpen&&<div className="buyer-checklist">{checklist.map(item=><label key={item}><input type="checkbox" checked={checked.includes(item)} onChange={e=>setChecked(old=>e.target.checked?[...old,item]:old.filter(x=>x!==item))}/><span>{item}</span></label>)}<div className="checklist-progress">{checked.length} of {checklist.length} checks prepared</div><button onClick={()=>setSelected(product)}><Send size={16}/> Create demo RFQ</button></div>}
         </section>
         <section className="detail-section related-section"><div className="detail-section-title"><h2>Related products</h2><span>More sourcing options</span></div><div className="related-grid">{alternatives.map(p=><ProductCard key={p.id} product={p} onInquiry={setSelected}/>)}</div></section>
         <section className="detail-section"><h2>Product Specifications</h2><div className="detail-specifications">{[["Minimum Order Quantity",product.moq],["Product",product.name],["Trade Term","To be confirmed"],["Supplier Country",product.country],["Payment Term","By agreement"],...product.specifications].map(([k,v],i)=><div key={i}><span>{k}</span><strong>{v}</strong></div>)}</div></section>
         <section className="detail-section"><h2>Product Certificates</h2><div className="certificate-placeholder"><FileText size={28}/><strong>No certificates uploaded</strong><p>Certification claims will appear here only after documents have been reviewed.</p></div></section>
         <section className="supplier-profile-section">
  <div className="supplier-profile-header">
    <div className="supplier-avatar supplier-avatar-large"><Building2 size={28}/></div>
    <div className="supplier-heading-details">
      <h2>{product.supplier}</h2>
      <div className="supplier-subline">
        <span className="demo-trust-badge"><ShieldCheck size={14}/> Verified L3 <sup>DEMO</sup></span>
        <span className="demo-star-rating">4.3 <span>★</span> <small>DEMO</small></span>
        <span className="supplier-separator">•</span>
        <span className="supplier-country"><CountryFlag country={product.country} compact/>{product.country}</span>
        <span className="supplier-separator">•</span>
        <span>Distributor / Wholesaler · Trading Company (demo)</span>
      </div>
    </div>
    <span className="demo-supplier-mark">SAMPLE COMPANY</span>
  </div>
  <div className="supplier-profile-body">
    <div className="profile-section-heading"><h3>Activity signals</h3><span className="demo-data-note">Demo metrics · not real activity</span></div>
    <div className="supplier-stats">
      <div><span>Total inquiries received</span><strong>2</strong></div>
      <div><span>Last supplier active</span><strong>Just now</strong></div>
      <div><span>Year Established</span><strong>2013</strong></div>
      <div><span>Number of Employees</span><strong>11–50 employees</strong></div>
    </div>
    <div className="supplier-insights-grid">
      <div className="export-markets">
        <h3>Export Markets</h3>
        <p>Example distribution — illustrative data only.</p>
        <div className="demo-market-flags">
          {demoMarkets.map(m=><span key={m.code} className="demo-market-chip"><CountryFlag country={m.name} compact/> {m.name}</span>)}
        </div>
        <div className="demo-market-bars">
          {demoRegions.map(r=><div className="demo-market-bar" key={r.name}>
            <span>{r.name}</span>
            <div className="demo-bar-track"><div className="demo-bar-fill" style={{width:r.pct+"%"}}/></div>
            <strong>{r.pct}%</strong>
          </div>)}
        </div>
      </div>
      <div className="verification-information">
        <h3>Verification information</h3>
        <div className="verification-info-grid">
          <div>
            <h4>Verification information <small>(DEMO)</small></h4>
            <div className="verification-item"><span className="verify-icon demo-verified"><ShieldCheck size={15}/></span><span><strong>Verify business documents</strong><small>Demo verification system</small></span></div>
            <div className="verification-item"><span className="verify-icon demo-verified"><ShieldCheck size={15}/></span><span><strong>Verify phone number</strong><small>Demo verification team</small></span></div>
            <div className="verification-item"><span className="verify-icon demo-verified"><ShieldCheck size={15}/></span><span><strong>Verify account email</strong><small>SYLUTION demonstration</small></span></div>
            <div className="verification-item"><span className="verify-icon demo-unverified"><X size={14}/></span><span><strong>Verify work email</strong><small>Not verified (demo)</small></span></div>
          </div>
          <div>
            <h4>External Validation</h4>
            <div className="validation-line"><span>Company</span><strong>Demo confirmed</strong></div>
            <div className="validation-line"><span>Address</span><strong>Demo confirmed</strong></div>
            <p className="demo-validation-notice">Sample presentation only. No real company checks or certifications have been performed.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
 </section>
 <section className="detail-section reviews-section"><h2>Reviews of this Product</h2><div className="reviews-empty"><MessageSquare size={23}/><strong>No reviews yet</strong><p>Buyer reviews will appear here after verified transactions are supported.</p></div></section>
         <section className="detail-section"><h2>Product description from the supplier</h2><p className="long-description">{product.description}</p><p className="disclaimer">The current page uses example product data. SYLUTION has not independently verified supplier claims, pricing or availability.</p></section>
         <section className="detail-section"><div className="detail-section-title"><h2>Products of this Supplier</h2></div><div className="related-grid">{supplierProducts.map(p=><ProductCard key={p.id} product={p} onInquiry={setSelected}/>)}</div></section>
       </div>
       <aside className="product-detail-aside">
         <div className="detail-supplier-card"><div className="aside-heading"><h3>Contact this Supplier</h3><span className="sy-supplier-demo-badge">Demo supplier · Unverified</span></div><div className="aside-supplier-heading"><div className="supplier-avatar"><Building2 size={24}/></div><div><strong>{product.supplier}</strong><p><span className="supplier-country"><CountryFlag country={product.country} compact/> {product.country}</span></p></div></div><div className="aside-demo-rating"><span>4.3 <b>★</b> <small>Demo rating</small></span><span>Example supplier profile</span></div><div className="aside-attributes"><div><span>Company type</span><strong>Distributor / Wholesaler (demo)</strong></div><div><span>Location</span><strong>{product.country}</strong></div><div><span>Established</span><strong>Not independently confirmed</strong></div></div><button className="aside-chat" onClick={()=>setContactOpen(true)}><MessageSquare size={17}/> Message supplier</button><button className="detail-action-green" onClick={()=>setSelected(product)}><Send size={17}/> Request Quote</button></div>
         <div className="aside-products"><h3><span className="ad-label">Explore</span> Top Products</h3>{products.filter(p=>p.id!==product.id).slice(0,6).map(p=><Link className="aside-product-row" key={p.id} href={"/products/"+p.slug}><img src={p.image} alt="" loading="lazy" onError={e=>e.currentTarget.style.display="none"}/><div><strong>{p.name}</strong><b>{p.price}</b><small>Min. order: {p.moq}</small><span>{p.country}</span></div></Link>)}</div>
       </aside>
     </div>
   </div>
 <div className="detail-mobile-quote"><button className="detail-action-green" onClick={()=>setSelected(product)}><Send size={18}/> Request Quote</button></div></div><footer className="detail-footer"><div className="container footer-inner"><strong>SYLUTION</strong><span>Global B2B Marketplace · Demo product data</span></div></footer>{selected&&<InquiryModal product={selected} close={()=>setSelected(null)}/>}{contactOpen&&<SupplierContactModal product={product} onClose={()=>setContactOpen(false)}/>}</>;
}
