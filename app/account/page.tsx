import {Suspense} from "react";
import {TradeNavigation} from "@/components/TradeNavigation";
import { DemoAccountPage, DemoAccountMenu } from "@/components/DemoAccount";
export default function AccountPage(){return <><header className="sy-account-header"><a href="/" className="sy-account-logo"><b>S</b><span><strong>SYLUTION</strong><small>Global B2B Marketplace</small></span></a><div className="trade-header-actions"><TradeNavigation/><DemoAccountMenu/></div></header><Suspense fallback={<main className="sy-account-page">Loading workspace…</main>}><DemoAccountPage/></Suspense></>}
