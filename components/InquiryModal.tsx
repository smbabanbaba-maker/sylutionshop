"use client";
import type {Product} from "@/lib/catalog";
import {SupplierContactModal} from "@/components/SupplierContactModal";

/** Marketplace inquiry now opens the same simple message composer as Contact Supplier.
 * Structured RFQs remain available separately in the buyer workspace.
 */
export function InquiryModal({product,close}:{product:Product;close:()=>void}){
 return <SupplierContactModal product={product} onClose={close}/>;
}
