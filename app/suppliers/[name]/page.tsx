import Link from "next/link";
import {notFound} from "next/navigation";
import {Building2,MapPin,Package,ArrowLeft} from "lucide-react";
import {products} from "@/lib/catalog";
export default async function SupplierPublicPage({params}:{params:Promise<{name:string}>}){
 const {name}=await params;
 const company=decodeURIComponent(name);
 const items=products.filter(p=>p.supplier.toLowerCase()===company.toLowerCase());
 if(!items.length)notFound();
 const supplier=items[0];
 return <main className="sy-public-profile">
  <div className="sy-public-profile-wrap">
   <Link href="/" className="sy-public-back"><ArrowLeft size={17}/> Back to marketplace</Link>
   <div className="sy-public-profile-hero">
    <span className="sy-public-avatar"><Building2 size={31}/></span>
    <div><span className="sy-public-eyebrow">PUBLIC SUPPLIER PROFILE · DEMO</span><h1>{supplier.supplier}</h1><p><MapPin size={16}/>{supplier.country}</p></div>
   </div>
   <div className="sy-public-profile-note">Illustrative public listing profile. This is not a private account and no supplier identity or credentials have been verified.</div>
   <h2>Products from this supplier</h2>
   <div className="sy-public-products">{items.map(p=><Link href={"/products/"+p.slug} key={p.id} className="sy-public-product"><img src={p.image} alt={p.name}/><strong>{p.name}</strong><span>{p.price} / {p.unit}</span><small><Package size={13}/> Min. order: {p.moq}</small></Link>)}</div>
  </div>
 </main>;
}
