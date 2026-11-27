import {notFound} from "next/navigation";
import {products} from "@/lib/catalog";
import {SupplierStorefront} from "@/components/SupplierStorefront";
export default async function SupplierPublicPage({params}:{params:Promise<{name:string}>}){
 const {name}=await params;
 const company=name;
 const items=products.filter(p=>p.supplier.toLowerCase()===company.toLowerCase());
 if(!items.length)notFound();
 return <SupplierStorefront company={items[0].supplier} country={items[0].country} items={items}/>;
}
