"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, Heart, MessageSquare, Globe2, Menu, ArrowLeft, Send, X, ClipboardList, Package, Building2, ShieldCheck, ChevronDown, SlidersHorizontal, Grid2X2, ListFilter, BadgeCheck, MapPin, Bell } from "lucide-react";
import { categories, products, type Product } from "@/lib/catalog";

function Header({search,setSearch}:{search?:string;setSearch?:(value:string)=>void}) {
  const [mobile,setMobile]=useState(false);
  return <><header className="site-header">
    <div className="header-inner">
      <Link className="brand" href="/"><span className="brand-mark">S</span><span><strong>SYLUTION</strong><small>Global B2B Marketplace</small></span></Link>
      <div className="header-search"><span className="search-category">All categories <ChevronDown size={13}/></span><input aria-label="Search products" placeholder="Search products and suppliers..." value={search??""} onChange={e=>setSearch?.(e.target.value)} /><button className="search-submit" aria-label="Search marketplace" onClick={()=>document.getElementById("products")?.scrollIntoView({behavior:"smooth"})}><Search size={18}/> Search</button></div>
      <nav className="header-actions"><Link href="/#products">Find Products</Link><Link href="/#supplier-leads">Suppliers</Link><Link href="/#how-it-works">Post Buying Request</Link><span><Globe2 size={17}/> EN</span><Link href="/#supplier-leads" className="header-signin">Log in</Link><Link href="/#supplier-leads" className="header-signup">Sign up</Link></nav>
      <button aria-label="Toggle menu" className="menu-toggle" onClick={()=>setMobile(!mobile)}><Menu size={23}/></button>
    </div>
  </header>
  {mobile&&<div className="mobile-menu"><Link href="/">Home</Link><Link href="/#products">Products</Link><Link href="/#how-it-works">How It Works</Link></div>}
  </>;
}
const cash = (s:string)=>s;
export function InquiryModal({product,close}:{product:Product;close:()=>void}) {
  const [qty,setQty]=useState("");const [country,setCountry]=useState("");const [port,setPort]=useState("");const [incoterm,setIncoterm]=useState("FOB");const [email,setEmail]=useState("");const [company,setCompany]=useState("");const [message,setMessage]=useState("");const [submitted,setSubmitted]=useState(false);
  function submit(e:React.FormEvent){e.preventDefault();if(!Number(qty)||Number(qty)<=0)return;const data={product:product.name,productId:product.id,quantity:Number(qty),unit:product.unit,destinationCountry:country,port,incoterm,email,company,message,createdAt:new Date().toISOString()};try{const prev=JSON.parse(localStorage.getItem("sylution_demo_rfqs")||"[]");localStorage.setItem("sylution_demo_rfqs",JSON.stringify([...prev,data]));}catch{}setSubmitted(true);}
  useEffect(()=>{function onKey(e:KeyboardEvent){if(e.key==="Escape")close();}document.addEventListener("keydown",onKey);return()=>document.removeEventListener("keydown",onKey)},[close]);
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)close()}}><section className="rfq-modal" role="dialog" aria-modal="true" aria-label="Request for Quotation">
    <button aria-label="Close quotation" className="modal-close" onClick={close}><X size={22}/></button>
    {!submitted?<><div className="section-kicker"><ClipboardList size={16}/> REQUEST FOR QUOTATION</div><h2>Get a wholesale quotation</h2><p className="muted">For: <strong>{product.name}</strong></p>
      <form className="rfq-form" onSubmit={submit}>
        <div className="form-grid"><label>Quantity ({product.unit}) <input required type="number" min="0.01" step="any" value={qty} onChange={e=>setQty(e.target.value)} placeholder={"MOQ: "+product.moq}/></label><label>Destination country <input required value={country} onChange={e=>setCountry(e.target.value)} placeholder="e.g. Nigeria"/></label></div>
        <div className="form-grid"><label>Port / City <input value={port} onChange={e=>setPort(e.target.value)} placeholder="e.g. Lagos"/></label><label>Preferred Incoterm <select value={incoterm} onChange={e=>setIncoterm(e.target.value)}><option>FOB</option><option>CIF</option><option>EXW</option><option>FCA</option><option>DAP</option><option>DDP</option></select></label></div>
        <div className="form-grid"><label>Your company <input required value={company} onChange={e=>setCompany(e.target.value)} placeholder="Company name"/></label><label>Business email <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@company.com"/></label></div>
        <label>Additional requirements <textarea rows={4} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Quality, packaging, timeline or certification requirements"/></label>
        <div className="demo-notice"><ShieldCheck size={18}/> Demo mode: requests are saved only in this browser. They are not delivered to suppliers yet.</div>
        <button className="primary-btn full" type="submit"><Send size={17}/> Save demo RFQ</button>
      </form></>:<div className="success-view"><div className="success-icon">✓</div><h2>Demo RFQ saved</h2><p>Your request was saved locally in this browser. No supplier has been contacted.</p><button className="primary-btn" onClick={close}>Continue browsing</button></div>}
  </section></div>;
}
export function ProductCard({product,onInquiry}:{product:Product;onInquiry:(p:Product)=>void}){
 const [liked,setLiked]=useState(false);
 return <article className="product-card"><Link href={"/products/"+product.slug} className="product-image"><span className="image-fallback" aria-hidden="true">{product.category==="Agriculture"?"🌾":product.category==="Electronics"?"🔌":product.category==="Energy"?"☀️":product.category==="Industrial"?"⚙️":"📦"}</span><img src={product.image} alt={product.name} loading="lazy" onError={e=>{e.currentTarget.style.display="none";}}/><span className="new-chip">New</span></Link><button className={"favorite"+(liked?" active":"")} aria-label="Save favorite" onClick={()=>setLiked(!liked)}><Heart size={18} fill={liked?"currentColor":"none"}/></button>
 <div className="card-body"><Link href={"/products/"+product.slug} className="product-name">{product.name}</Link><div className="product-price">{cash(product.price)} <span>/ {product.unit}</span></div><p className="product-moq">Min. order: {product.moq}</p><div className="supplier-name">{product.supplier}</div><div className="country"><img className="country-flag" src={`https://flagcdn.com/w40/${({Nigeria:"ng",China:"cn",USA:"us",UAE:"ae",Türkiye:"tr"} as Record<string,string>)[product.country] || "un"}.png`} alt={`${product.country} flag`} onError={e=>{e.currentTarget.style.display="none";}}/> {product.country} <span className="sample-pill">Demo</span></div><div className="card-bottom"><button onClick={()=>onInquiry(product)} className="inquiry-btn"><MessageSquare size={15}/> Inquiry now</button><Link className="chat-link" href={"/products/"+product.slug} aria-label="See product details"><Package size={17}/></Link></div></div>
 </article>;
}
export function HomePage(){
 const [query,setQuery]=useState("");
 const [category,setCategory]=useState("All Categories");
 const [selected,setSelected]=useState<Product|null>(null);
 const [searchMode,setSearchMode]=useState<"Products"|"Suppliers">("Products");
 const [showCategories,setShowCategories]=useState(false);
 const [sort,setSort]=useState<"featured"|"name">("featured");
 const filtered=useMemo(()=>{
   const matched=products.filter(p=>(category==="All Categories"||p.category===category)&&([p.name,p.supplier,p.country,p.category].join(" ").toLowerCase().includes(query.trim().toLowerCase())));
   return sort==="name"?[...matched].sort((a,b)=>a.name.localeCompare(b.name)):matched;
 },[category,query,sort]);
 const goProducts=()=>document.getElementById("products")?.scrollIntoView({behavior:"smooth"});
 const quickSearch=(phrase:string)=>{setCategory("All Categories");setQuery(phrase);goProducts();};
 return <><Header search={query} setSearch={setQuery}/><main>
  <section className="fresh-hero reference-hero">
   <div className="fresh-hero-inner container">
     <span className="hero-eyebrow">SYLUTION • GLOBAL TRADE PLATFORM</span>
     <h1>{searchMode==="Products"?"Explore a world of wholesale opportunities":"Connect with suppliers worldwide"}</h1>
     <p className="hero-description">Discover products, source new opportunities and grow your business across borders.</p>
     <div className="hero-search-panel">
       <div className="hero-search">
         <div className="hero-search-category-wrap"><button className="hero-search-category" type="button" aria-expanded={showCategories} onClick={()=>setShowCategories(!showCategories)}>{searchMode==="Products"?"Find Products":"Find Suppliers"} <ChevronDown size={15}/></button>
           {showCategories&&<div className="hero-search-menu"><button onClick={()=>{setSearchMode("Products");setShowCategories(false);}}>Find Products</button><button onClick={()=>{setSearchMode("Suppliers");setShowCategories(false);}}>Find Suppliers</button></div>}
         </div>
         <div className="hero-search-input"><Search size={20}/><input aria-label="Search global wholesale products" placeholder={searchMode==="Products"?"What products are you looking for?":"Find suppliers, products or countries"} value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")goProducts();}}/></div>
         <button className="hero-search-button" onClick={goProducts}><Search size={18}/> Search</button>
       </div>
       <div className="popular-searches"><strong>Popular searches:</strong>{["Sesame Seeds","Ginger","Solar Pumps","Almonds","Electronics"].map(x=><button key={x} onClick={()=>quickSearch(x)}>{x}</button>)}</div>
     </div>
     <div className="hero-benefits"><span><Globe2 size={17}/> International sourcing</span><span><Building2 size={17}/> Business suppliers</span><span><MessageSquare size={17}/> Direct enquiries</span></div>
   </div>
  </section>
  <section className="quick-actions container"><strong>Welcome to SYLUTION</strong><div><a href="#how-it-works">Post Buying Request</a><a href="#products">Top Products</a><a href="#category-explorer">Categories</a></div></section>
  <section className="container discovery-row" id="category-explorer">
    <div className="discovery-column category-directory"><h3>All Categories</h3>{categories.slice(1).map(c=><button key={c} onClick={()=>{setCategory(c);goProducts();}}><span>{c}</span><ChevronDown size={15}/></button>)}</div>
    <div className="discovery-column"><div className="discovery-heading"><h3>Frequently searched</h3><span>Agriculture</span></div><div className="discovery-feature"><img src="https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=550&q=80" alt="Wholesale seeds and agricultural commodities" loading="lazy"/><div><strong>Seeds & Grains</strong><button onClick={()=>quickSearch("Sesame")}>Explore products</button></div></div></div>
    <div className="discovery-column"><div className="discovery-heading"><h3>Frequently searched</h3><span>Food & Beverage</span></div><div className="discovery-feature"><img src="https://images.unsplash.com/photo-1615485500704-8e990f9900f0?w=550&q=80" alt="Agricultural food products" loading="lazy"/><div><strong>Food Commodities</strong><button onClick={()=>quickSearch("Ginger")}>Explore products</button></div></div></div>
    <div className="discovery-column"><div className="discovery-heading"><h3>Frequently searched</h3><span>Equipment</span></div><div className="discovery-feature"><img src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=550&q=80" alt="Solar and industrial equipment" loading="lazy"/><div><strong>Energy & Machinery</strong><button onClick={()=>{setCategory("Energy");goProducts();}}>Explore products</button></div></div></div>
    <div className="discovery-promo"><div className="promo-kicker">SOURCE SMARTER</div><h3>Connect with more business opportunities.</h3><p>Explore suppliers and request wholesale quotations in one place.</p><button onClick={goProducts}>Browse products <span>→</span></button></div>
  </section>
  <section className="container marketplace-layout" id="products"><div className="market-main">
    <div className="section-head"><div><h2>Top Products</h2><p>Explore wholesale sourcing opportunities</p></div><div className="result-count">{filtered.length} example products</div></div>
    <div className="listing-toolbar"><div className="category-tabs">{categories.map(c=><button key={c} className={category===c?"selected":""} onClick={()=>setCategory(c)}>{c}</button>)}</div><select className="product-sort" aria-label="Sort products" value={sort} onChange={e=>setSort(e.target.value as "featured"|"name")}><option value="featured">Featured</option><option value="name">Name A–Z</option></select></div>
    <div className="product-grid">{filtered.map(p=><ProductCard key={p.id} product={p} onInquiry={setSelected}/>)}</div>
    {!filtered.length&&<div className="empty-state">No matching products yet. Try a different keyword or category. <button onClick={()=>{setQuery("");setCategory("All Categories");}}>Clear search</button></div>}
  </div></section>
  <section className="container why-section" id="how-it-works"><div className="why-copy"><div className="why-label">WHY SYLUTION</div><h2>A simpler way to source and connect.</h2><p>Explore product opportunities, compare details and send structured requests for quotations.</p></div><div className="why-item"><Search size={24}/><strong>Discover</strong><span>Find products fast</span></div><div className="why-item"><MessageSquare size={24}/><strong>Enquire</strong><span>Send clear RFQs</span></div><div className="why-item"><Globe2 size={24}/><strong>Connect</strong><span>Explore global markets</span></div></section>
  </main><footer><div className="container footer-inner"><div><strong>SYLUTION</strong><p>Global B2B Marketplace</p></div><span>© 2026 SYLUTION • Demo marketplace</span></div></footer>
  {selected&&<InquiryModal product={selected} close={()=>setSelected(null)}/>}
 </>;
}
export function ProductDetail({product}:{product:Product}){
 const [selected,setSelected]=useState<Product|null>(null);return <><Header/><main className="container detail-page"><Link href="/" className="back-link"><ArrowLeft size={16}/> Back to marketplace</Link><div className="detail-grid"><div className="detail-image"><span className="image-fallback" aria-hidden="true">📦</span><img src={product.image} alt={product.name} onError={e=>{e.currentTarget.style.display="none";}}/></div><div className="detail-summary"><div className="section-kicker">{product.category.toUpperCase()} • {product.country.toUpperCase()}</div><h1>{product.name}</h1><div className="product-price large">{product.price} <span>/ {product.unit}</span></div><div className="detail-facts"><div><span>Minimum order</span><strong>{product.moq}</strong></div><div><span>Country</span><strong>{product.flag} {product.country}</strong></div><div><span>Supplier</span><strong>{product.supplier}</strong></div><div><span>Verification</span><strong>Not verified — demo</strong></div></div><button className="primary-btn full" onClick={()=>setSelected(product)}><Send size={18}/> Request Quotation</button><p className="muted mini">This is a demonstration listing; prices and suppliers are illustrative.</p></div></div><div className="detail-extra"><h2>Product description</h2><p>{product.description}</p><h2>Specifications</h2><div className="spec-table">{product.specifications.map(([k,v])=><div key={k}><span>{k}</span><strong>{v}</strong></div>)}</div></div></main><footer><div className="container footer-inner">SYLUTION TRADE • Demo build</div></footer>{selected&&<InquiryModal product={selected} close={()=>setSelected(null)}/>}</>
}
