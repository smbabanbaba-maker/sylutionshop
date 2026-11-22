"use client";
import {useEffect} from "react";
import Link from "next/link";
import {AlertTriangle,RefreshCcw,Home} from "lucide-react";
export default function Error({error,reset}:{error:Error & {digest?:string};reset:()=>void}){useEffect(()=>{console.error("SYLUTION page error",error)},[error]);return <main className="sy-state-page" role="alert"><div className="sy-state-icon sy-error-icon"><AlertTriangle size={32}/></div><h1>Something went wrong.</h1><p>This page could not be loaded. You can try again or return to the marketplace.</p><div className="sy-state-actions"><button onClick={reset}><RefreshCcw size={16}/> Try again</button><Link href="/"><Home size={16}/> Home</Link></div></main>}
