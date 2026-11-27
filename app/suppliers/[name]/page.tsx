import {products} from "@/lib/catalog";
import {SupplierStorefront} from "@/components/SupplierStorefront";

export default async function SupplierPublicPage({
 params,
 searchParams
}:{
 params:Promise<{name:string}>;
 searchParams:Promise<{product?:string}>;
}){
 const {name}=await params;
 const {product:productId}=await searchParams;
 const requestedName=name.trim();
 const canonical=productId?products.find(p=>p.id===productId):undefined;
 // Supplier names may come from a local draft or a demo catalogue item.
 // Never return a generic 404 merely because the seller has not listed in
 // the server-side sample catalogue yet.
 const matchedByName=products.filter(p=>p.supplier.trim().toLocaleLowerCase()===requestedName.toLocaleLowerCase());
 const company=canonical?.supplier??matchedByName[0]?.supplier??requestedName;
 const items=products.filter(p=>p.supplier.trim().toLocaleLowerCase()===company.toLocaleLowerCase());
 const country=items[0]?.country??"";
 return <SupplierStorefront company={company} country={country} items={items}/>;
}
