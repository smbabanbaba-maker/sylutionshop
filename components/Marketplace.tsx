"use client";
import Link from "next/link";
import {TradeNavigation} from "@/components/TradeNavigation";
import { DemoAccountMenu } from "@/components/DemoAccount";
import { CountryFlag, COUNTRIES } from "@/components/CountryFlag";
import {InquiryModal} from "@/components/InquiryModal";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp, FaTelegramPlane, FaPinterestP, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useEffect, useMemo, useState } from "react";
import { Search, Heart, MessageSquare, Globe2, Menu, ArrowLeft, Send, X, ClipboardList, Package, Building2, ShieldCheck, ChevronDown, Share2, Copy, ChevronLeft, ChevronRight, FileText, SlidersHorizontal, Grid2X2, ListFilter, BadgeCheck, MapPin, Bell } from "lucide-react";
import { categories, products, type Product } from "@/lib/catalog";

function Header({search,setSearch}:{search?:string;setSearch?:(value:string)=>void}) {
  const [mobile,setMobile]=useState(false);
  return <><header className="site-header">
    <div className="header-inner">
      <Link className="brand" href="/"><span className="brand-mark"><span className="sy-brand-letter">S</span><i className="sy-brand-orbit"/></span><span><strong>SYLUTION</strong><small>Global B2B Marketplace</small></span></Link>
      {setSearch&&<div className="header-search"><span className="search-category">All categories <ChevronDown size={13}/></span><input aria-label="Search products" placeholder="Search products and suppliers..." value={search??""} onChange={e=>setSearch?.(e.target.value)} /><button className="search-submit" aria-label="Search marketplace" onClick={()=>document.getElementById("products")?.scrollIntoView({behavior:"smooth"})}><Search size={18}/> Search</button></div>}
      <div className="header-actions"><TradeNavigation/><DemoAccountMenu/></div>
      <button type="button" aria-label={mobile?"Close navigation menu":"Open navigation menu"} aria-expanded={mobile} aria-controls="sy-mobile-navigation" className="menu-toggle" onClick={()=>setMobile(!mobile)}>{mobile?<X size={23}/>:<Menu size={23}/>}</button>
    </div>
  </header>
  {mobile&&<div id="sy-mobile-navigation" className="mobile-menu"><Link href="/" onClick={()=>setMobile(false)}>Home</Link><Link href="/#products" onClick={()=>setMobile(false)}>Products</Link><Link href="/account?tab=post-rfq" onClick={()=>setMobile(false)}>Post Buying Request</Link><Link href="/account?tab=requests" onClick={()=>setMobile(false)}>My Requests</Link><Link href="/account" onClick={()=>setMobile(false)}>My Account</Link></div>}
  </>;
}
const cash = (s:string)=>s;
export function ProductCard({product,onInquiry}:{product:Product;onInquiry:(p:Product)=>void}){
 const [liked,setLiked]=useState(false);
 useEffect(()=>{const sync=()=>{try{const saved=JSON.parse(localStorage.getItem("sylution_saved_products")||"[]") as string[];setLiked(saved.includes(product.slug));}catch{}};sync();window.addEventListener("sylution-shortlist-change",sync);window.addEventListener("storage",sync);return()=>{window.removeEventListener("sylution-shortlist-change",sync);window.removeEventListener("storage",sync)};},[product.slug]);
 function toggleFavorite(){const next=!liked;setLiked(next);try{const stored=JSON.parse(localStorage.getItem("sylution_saved_products")||"[]") as string[];localStorage.setItem("sylution_saved_products",JSON.stringify(next?[...new Set([...stored,product.slug])]:stored.filter(s=>s!==product.slug)));window.dispatchEvent(new Event("sylution-shortlist-change"));}catch{}}
 return <article className="product-card"><Link href={"/products/"+product.slug} className="product-image"><span className="image-fallback" aria-hidden="true">{product.category==="Agriculture"?"🌾":product.category==="Electronics"?"🔌":product.category==="Energy"?"☀️":product.category==="Industrial"?"⚙️":"📦"}</span><img src={product.image} alt={product.name} loading="lazy" decoding="async" onError={e=>{e.currentTarget.style.display="none";}}/><span className="new-chip">Sample</span></Link><button className={"favorite"+(liked?" active":"")} aria-label={liked?"Remove from favorites":"Save to favorites"} aria-pressed={liked} onClick={toggleFavorite}><Heart size={18} fill={liked?"currentColor":"none"}/></button>
 <div className="card-body"><Link href={"/products/"+product.slug} className="product-name">{product.name}</Link><div className="product-price">{cash(product.price)} <span>/ {product.unit}</span></div><p className="product-moq">Min. order: {product.moq}</p><div className="supplier-name">{product.supplier}</div><div className="country"><CountryFlag country={product.country} compact/> {product.country} <span className="sample-pill">Demo</span></div><div className="card-bottom"><button onClick={()=>onInquiry(product)} className="inquiry-btn"><MessageSquare size={15}/> Request Quote</button><Link className="chat-link" href={"/products/"+product.slug} aria-label="See product details"><Package size={17}/></Link></div></div>
 </article>;
}
export function HomePage(){
 const [query,setQuery]=useState("");
 const [category,setCategory]=useState("All Categories");
 const [selected,setSelected]=useState<Product|null>(null);
 const [searchMode,setSearchMode]=useState<"Products"|"Suppliers">("Products");
 const [showCategories,setShowCategories]=useState(false);
 const [sort,setSort]=useState<"featured"|"name">("featured");
 const [visibleCount,setVisibleCount]=useState(24);
 const [filtersOpen,setFiltersOpen]=useState(false);
 const [countryFilter,setCountryFilter]=useState("All Countries");
 const countryOptions=["All Countries",...COUNTRIES.map(c=>c.name)];
 const filtered=useMemo(()=>{
   const matched=products.filter(p=>(category==="All Categories"||p.category===category)&&(countryFilter==="All Countries"||p.country===countryFilter)&&([p.name,p.supplier,p.country,p.category].join(" ").toLowerCase().includes(query.trim().toLowerCase())));
   return sort==="name"?[...matched].sort((a,b)=>a.name.localeCompare(b.name)):matched;
 },[category,query,sort,countryFilter]);
 const goProducts=()=>document.getElementById("products")?.scrollIntoView({behavior:"smooth"});
 const quickSearch=(phrase:string)=>{setCategory("All Categories");setQuery(phrase);goProducts();};
 return <><Header search={query} setSearch={setQuery}/><main>
  <section className="fresh-hero reference-hero">
   <div className="fresh-hero-inner container">
     <span className="hero-eyebrow">SYLUTION / YOUR SOURCING COMMAND CENTER</span>
     <h1>{searchMode==="Products"?"Source globally. Decide confidently.":"Discover your next supplier connection"}</h1>
     <p className="hero-description">Explore cross-border sourcing with comparison tools, supplier profiles and structured wholesale requests.</p>
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
  <section className="quick-actions container"><strong>Build smarter trade relationships with SYLUTION</strong><div><Link href="/account?tab=post-rfq">Post Buying Request</Link><a href="#products">Top Products</a><a href="#category-explorer">Categories</a></div></section>
  <section className="container discovery-row" id="category-explorer">
    <div className="discovery-column category-directory"><h3>All Categories</h3>{categories.slice(1).map(c=><button key={c} onClick={()=>{setCategory(c);goProducts();}}><span>{c}</span><ChevronDown size={15}/></button>)}</div>
    <div className="discovery-column"><div className="discovery-heading"><h3>Frequently searched</h3><span>Agriculture</span></div><div className="discovery-feature"><img src="https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=550&q=80" alt="Wholesale seeds and agricultural commodities" loading="lazy"/><div><strong>Seeds & Grains</strong><button onClick={()=>quickSearch("Sesame")}>Explore products</button></div></div></div>
    <div className="discovery-column"><div className="discovery-heading"><h3>Frequently searched</h3><span>Food & Beverage</span></div><div className="discovery-feature"><img src="https://images.unsplash.com/photo-1615485500704-8e990f9900f0?w=550&q=80" alt="Agricultural food products" loading="lazy"/><div><strong>Food Commodities</strong><button onClick={()=>quickSearch("Ginger")}>Explore products</button></div></div></div>
    <div className="discovery-column"><div className="discovery-heading"><h3>Frequently searched</h3><span>Equipment</span></div><div className="discovery-feature"><img src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=550&q=80" alt="Solar and industrial equipment" loading="lazy"/><div><strong>Energy & Machinery</strong><button onClick={()=>{setCategory("Energy");goProducts();}}>Explore products</button></div></div></div>
    <div className="discovery-promo"><div className="promo-kicker">SOURCE SMARTER</div><h3>Connect with more business opportunities.</h3><p>Explore suppliers and request wholesale quotations in one place.</p><button onClick={goProducts}>Browse products <span>→</span></button></div>
  </section>
  <section className="container marketplace-layout" id="products"><div className="market-main">
    <div className="section-head"><div><h2>Explore the trade catalog</h2><p>Browse industries, compare origins and build your sourcing shortlist.</p></div><div className="result-count">{filtered.length} example products</div></div>
    <label className="trade-catalog-search"><Search size={18}/><input type="search" aria-label="Search catalog" placeholder="Search products and suppliers" value={query} onChange={event=>{setQuery(event.target.value);setVisibleCount(24);}}/></label>
    <div className="trade-catalog-layout">
    <div className={"trade-filters"+(filtersOpen?" is-open":"")}>
      <button className="trade-filter-toggle" type="button" aria-expanded={filtersOpen} aria-controls="catalog-filters" onClick={()=>setFiltersOpen(open=>!open)}><SlidersHorizontal size={17}/> Filters{(category!=="All Categories"||countryFilter!=="All Countries")?" · Active":""}</button>
      <div className="trade-filter-fields" id="catalog-filters">
        <label>Category <select value={category} onChange={e=>{setCategory(e.target.value);setVisibleCount(24);}}>{categories.map(c=><option key={c}>{c}</option>)}</select></label>
        <label>Supplier country <select value={countryFilter} onChange={e=>{setCountryFilter(e.target.value);setVisibleCount(24);}}>{countryOptions.map(c=><option key={c} value={c}>{c}</option>)}</select></label>
        <label>Sort products <select value={sort} onChange={e=>setSort(e.target.value as "featured"|"name")}><option value="featured">Featured</option><option value="name">Name A–Z</option></select></label>
      </div>
    </div>
    <div className="trade-catalog-results">
    <div className="product-grid">{filtered.slice(0,visibleCount).map(p=><ProductCard key={p.id} product={p} onInquiry={setSelected}/>)}</div>
    {filtered.length>visibleCount&&<div className="load-more-listings"><button onClick={()=>setVisibleCount(v=>v+24)}>Load more products <span>({filtered.length-visibleCount} remaining)</span></button></div>}
    {!filtered.length&&<div className="empty-state">No matching products yet. Try a different keyword or category. <button onClick={()=>{setQuery("");setCategory("All Categories");setCountryFilter("All Countries");setVisibleCount(24);}}>Clear search</button></div>}
  </div></div></div></section>
  <section className="container why-section" id="how-it-works"><div className="why-copy"><div className="why-label">WHY SYLUTION</div><h2>A simpler way to source and connect.</h2><p>Explore product opportunities, compare details and send structured requests for quotations.</p></div><div className="why-item"><Search size={24}/><strong>Discover</strong><span>Find products fast</span></div><div className="why-item"><MessageSquare size={24}/><strong>Enquire</strong><span>Send clear RFQs</span></div><div className="why-item"><Globe2 size={24}/><strong>Connect</strong><span>Explore global markets</span></div></section>
  </main><footer><div className="container footer-inner"><div><strong>SYLUTION</strong><p>Global B2B Marketplace</p></div><span>© 2026 SYLUTION • Demo marketplace</span></div></footer>
  {selected&&<InquiryModal product={selected} close={()=>setSelected(null)}/>}
 </>;
}
export function ProductDetail({product}:{product:Product}){
 const [selected,setSelected]=useState<Product|null>(null);
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
         <div className="detail-supplier-card"><div className="aside-heading"><h3>Contact this Supplier</h3><span className="demo-trust-badge"><ShieldCheck size={13}/> Verified L3 <sup>DEMO</sup></span></div><div className="aside-supplier-heading"><div className="supplier-avatar"><Building2 size={24}/></div><div><strong>{product.supplier}</strong><p><span className="supplier-country"><CountryFlag country={product.country} compact/> {product.country}</span></p></div></div><div className="aside-demo-rating"><span>4.3 <b>★</b> <small>Demo rating</small></span><span>Example supplier profile</span></div><div className="aside-attributes"><div><span>Company type</span><strong>Distributor / Wholesaler (demo)</strong></div><div><span>Location</span><strong>{product.country}</strong></div><div><span>Established</span><strong>2013 (demo)</strong></div></div><button className="aside-chat" onClick={()=>setSelected(product)}><MessageSquare size={17}/> Contact supplier</button><button className="detail-action-green" onClick={()=>setSelected(product)}><Send size={17}/> Request Quote</button></div>
         <div className="aside-products"><h3><span className="ad-label">Explore</span> Top Products</h3>{products.filter(p=>p.id!==product.id).slice(0,6).map(p=><Link className="aside-product-row" key={p.id} href={"/products/"+p.slug}><img src={p.image} alt="" loading="lazy" onError={e=>e.currentTarget.style.display="none"}/><div><strong>{p.name}</strong><b>{p.price}</b><small>Min. order: {p.moq}</small><span>{p.country}</span></div></Link>)}</div>
       </aside>
     </div>
   </div>
 <div className="detail-mobile-quote"><button className="detail-action-green" onClick={()=>setSelected(product)}><Send size={18}/> Request Quote</button></div></div><footer className="detail-footer"><div className="container footer-inner"><strong>SYLUTION</strong><span>Global B2B Marketplace · Demo product data</span></div></footer>{selected&&<InquiryModal product={selected} close={()=>setSelected(null)}/>}</>;
}
