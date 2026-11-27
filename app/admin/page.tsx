import Link from "next/link";
import {SafetyCenter} from "@/components/SafetyCenter";
import {ShieldAlert,LockKeyhole} from "lucide-react";
export const metadata={title:"Operations Preview | SYLUTION"};
export default function AdminPreview(){
 return <main className="sy-admin-preview">
  <header><Link href="/" className="sy-admin-brand"><b>S</b><span>SYLUTION <small>Operations design preview</small></span></Link><Link href="/account?tab=safety">Safety Center</Link></header>
  <section className="sy-admin-guard"><LockKeyhole size={22}/><div><strong>Admin tools are not enabled</strong><p>This page is a UI demonstration only, not a secure admin dashboard. No live user records, KYC documents, orders or moderation data are exposed here. Admin access must be protected by server-side authentication and role checks before launch.</p></div></section>
  <div className="sy-admin-stat-grid"><div><strong>—</strong><span>Live users</span></div><div><strong>—</strong><span>Verified sellers</span></div><div><strong>—</strong><span>Published products</span></div><div><strong>—</strong><span>Reported cases</span></div></div>
  <SafetyCenter admin/>
  <footer><ShieldAlert size={15}/> Never use a client-only admin route for privileged operations.</footer>
 </main>;
}
