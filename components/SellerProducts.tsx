"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {Package,Plus,Search,Pencil,Trash2,ImageOff,ShieldAlert} from "lucide-react";
type Draft={id?:string;name:string;country:string;minimum:string;price:string;currency?:string;category?:string;description?:string;imageNames?:string[];savedAt?:string};
export function SellerProducts({email}:{email:string}){
 const key="sylution_supplier_product_drafts:"+email.toLowerCase();
 const [drafts,setDrafts]=useState<Draft[]>([]);const [query,setQuery]=useState("");const [notice,setNotice]=useState("");
 function refresh(){try{const x=JSON.parse(localStorage.getItem(key)||"[]");setDrafts(Array.isArray(x)?x.filter(v=>v&&typeof v.name==="string"):[])}catch{setDrafts([])}}
 useEffect(()=>{refresh()},[]);
 function remove(index:number){if(!window.confirm("Delete this local product draft?"))return;try{const next=drafts.filter((_,i)=>i!==index);localStorage.setItem(key,JSON.stringify(next));setDrafts(next);setNotice("Draft deleted from this browser.")}catch{setNotice("Unable to delete draft.")}}
 const shown=drafts.map((draft,index)=>({draft,index})).filter(({draft})=>[draft.name,draft.category,draft.country].join(" ").toLowerCase().includes(query.toLowerCase()));
 return <section className="sy-seller-products">
  <div className="sy-trade-workflow-head"><div><span className="sy-mini-overline">SELLER WORKSPACE / CATALOG</span><h2>My Products</h2><p>Organise the product drafts on this device. Nothing is publicly listed yet.</p></div><Link href="/account?tab=add-product" className="sy-green-action"><Plus size={16}/>Add New Product</Link></div>
  <div className="sy-seller-products-meta"><div><strong>{drafts.length}</strong><span>Saved drafts</span></div><div><strong>0</strong><span>Published products</span></div><div><strong>0</strong><span>Buyer enquiries received</span></div></div>
  <div className="sy-trade-search"><Search size={17}/><input aria-label="Search my products" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products by name or category"/></div>
  {notice&&<p className="sy-trade-feedback" role="status">{notice}</p>}
  <div className="sy-seller-products-grid">{shown.length?shown.map(({draft,index})=><article className="sy-seller-product-card" key={draft.id||index}>
    <div className="sy-seller-product-photo"><ImageOff size={27}/><span>Image not uploaded</span></div>
    <div className="sy-seller-product-copy"><span className="sy-trade-status pending">Draft · Local only</span><h3>{draft.name}</h3><p>{draft.category||"Uncategorised"} · {draft.country||"Origin not set"}</p><strong>{draft.currency||""} {draft.price||"Price not set"}</strong><small>MOQ: {draft.minimum||"Not set"}</small>{!!draft.imageNames?.length&&<small>{draft.imageNames.length} image filename(s) saved, images not uploaded</small>}</div>
    <div className="sy-seller-product-actions"><Link href="/account?tab=add-product"><Pencil size={15}/>Open form</Link><button type="button" onClick={()=>remove(index)}><Trash2 size={15}/>Delete</button></div>
   </article>):<div className="sy-trade-empty"><Package size={32}/><strong>{drafts.length?"No matching products":"No product drafts yet"}</strong><p>Use Add New Product to prepare your first wholesale listing.</p><Link href="/account?tab=add-product" className="sy-green-action"><Plus size={16}/>Add New Product</Link></div>}</div>
  <p className="sy-trade-demo-footnote"><ShieldAlert size={14}/> Draft filenames are saved, but actual photos and published listings require secure file storage and a database.</p>
 </section>;
}
