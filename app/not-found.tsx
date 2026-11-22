import Link from "next/link";
import {SearchX,Home} from "lucide-react";
export default function NotFound(){return <main className="sy-state-page"><div className="sy-state-icon"><SearchX size={34}/></div><span>404 · PAGE NOT FOUND</span><h1>We couldn’t find that page.</h1><p>The link may be outdated, or the product may no longer be listed.</p><Link href="/"><Home size={17}/> Return to marketplace</Link></main>}
