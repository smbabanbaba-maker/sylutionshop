import type { Metadata } from "next";
import "./globals.css";
import "./styles/product.css";
import "./styles/dashboard.css";
import "./styles/brand.css";
import "./styles/workflows.css";
import "./styles/profile.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://sylutionshop.vercel.app"),
  title: {default:"SYLUTION | Global B2B Marketplace",template:"%s | SYLUTION"},
  description: "Explore international wholesale products, compare suppliers and prepare sourcing requests in the SYLUTION B2B Marketplace demo.",
  applicationName:"SYLUTION",
  openGraph:{title:"SYLUTION | Global B2B Marketplace",description:"Explore wholesale sourcing opportunities with SYLUTION.",type:"website",siteName:"SYLUTION"},
  robots:{index:false,follow:false}
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
