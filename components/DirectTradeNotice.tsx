import {ArrowLeftRight,ShieldAlert} from "lucide-react";

export function DirectTradeNotice({compact=false}:{compact?:boolean}){
 return <aside className={"sy-direct-trade-notice"+(compact?" is-compact":"")} aria-label="How payments work on SYLUTION TRADE">
  <span className="sy-direct-trade-icon"><ArrowLeftRight size={19}/></span>
  <div>
   <strong>Payment is arranged directly between buyer and seller</strong>
   <p>SYLUTION TRADE connects businesses for enquiries, quotations and trade discussions. We do not collect, hold or release payment for the goods.</p>
   {!compact&&<small><ShieldAlert size={14}/> Verify business details and agree on payment, shipping and refund terms before transferring funds. Direct payments are not protected by a SYLUTION escrow service.</small>}
  </div>
 </aside>;
}
