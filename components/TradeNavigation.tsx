import Link from "next/link";
import {ClipboardList, MessageSquare, Search, UserRound} from "lucide-react";

const destinations = [
  {label: "Browse", href: "/#products", Icon: Search},
  {label: "Requests", href: "/account?tab=requests", Icon: ClipboardList},
  {label: "Messages", href: "/account?tab=messages", Icon: MessageSquare},
  {label: "Account", href: "/account?tab=overview", Icon: UserRound},
];

export function TradeNavigation({mobile = false}: {mobile?: boolean}) {
  return (
    <nav className={mobile ? "trade-bottom-nav" : "trade-desktop-nav"} aria-label="Marketplace navigation">
      {destinations.map(({label, href, Icon}) => (
        <Link key={label} href={href}><Icon size={19} aria-hidden="true"/><span>{label}</span></Link>
      ))}
    </nav>
  );
}
