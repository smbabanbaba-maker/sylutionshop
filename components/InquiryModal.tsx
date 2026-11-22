"use client";

import Link from "next/link";
import {useEffect, useId, useRef, useState} from "react";
import {ArrowRight, Check, ChevronDown, Search, X, Plus, Paperclip, ShieldCheck, Package, Send, Trash2} from "lucide-react";
import {COUNTRIES, CountryFlag} from "@/components/CountryFlag";
import type {Product} from "@/lib/catalog";

const units = ["MT", "KG", "Tons", "Pieces", "Sets", "Containers", "Litres", "Bags", "Unit"];
const countryDisplay = new Intl.DisplayNames(["en"], {type: "region"});
const destinations = COUNTRIES.map(country => ({
  ...country,
  label: country.code === "ae" ? "United Arab Emirates" : country.code === "us" ? "United States" : country.name,
})).sort((a, b) => a.label.localeCompare(b.label));

export function InquiryModal({product, close}: {product: Product; close: () => void}) {
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState(product.unit);
  const [country, setCountry] = useState("");
  const [search, setSearch] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [port, setPort] = useState("");
  const [tradeTerm, setTradeTerm] = useState("Flexible");
  const [paymentTerm, setPaymentTerm] = useState("Negotiable");
  const [specifications, setSpecifications] = useState<{name:string;value:string}[]>(() => product.specifications.slice(0,2).map(([name,value])=>({name,value})));
  const [requirements, setRequirements] = useState<string[]>([]);
  const [attachmentNames, setAttachmentNames] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const titleId = useId();
  const countryId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const confirmation = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
    };
  }, []);

  useEffect(() => {
    if (saved) confirmation.current?.focus();
  }, [saved]);

  const selected = destinations.find(destination => destination.name === country);
  const query = search.trim().toLowerCase();
  const matches = countryOpen ? destinations.filter(destination =>
    [destination.label, destination.name, destination.code, countryDisplay.of(destination.code.toUpperCase())]
      .some(value => value?.toLowerCase().includes(query))
  ) : [];

  function selectCountry(value: string) {
    setCountry(value);
    setCountryOpen(false);
    setSearch("");
    setError("");
    trigger.current?.focus();
  }

  function saveRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(quantity);
    if (!Number.isFinite(amount) || amount <= 0 || !selected) {
      setError("Enter a quantity greater than zero and choose a destination country.");
      if (!selected) trigger.current?.focus();
      return;
    }

    const request = {
      product: product.name,
      productId: product.id,
      quantity: amount,
      unit,
      destinationCountry: selected.label,
      port: port.trim(),
      incoterm: tradeTerm,
      paymentTerm,
      attributes: specifications.filter(item=>item.name.trim()&&item.value.trim()),
      documents: requirements.join(", "),
      message: message.trim(),
      attachmentNames,
      createdAt: new Date().toISOString(),
      status: "Draft · browser only",
    };

    try {
      const value = JSON.parse(localStorage.getItem("sylution_demo_rfqs") || "[]");
      const requests = Array.isArray(value) ? value : [];
      localStorage.setItem("sylution_demo_rfqs", JSON.stringify([...requests, request]));
      window.dispatchEvent(new Event("sylution-rfq-change"));
      setSaved(true);
    } catch {
      setError("Browser storage is unavailable. Your draft could not be saved.");
    }
  }

  const quickRequirements=["Certifications & compliance","Packaging details","Target price & MOQ","Lead time"];
  return (
    <dialog className="si-quote si-quote-premium" ref={dialog} aria-labelledby={titleId}
      onCancel={event=>{event.preventDefault();if(countryOpen){setCountryOpen(false);trigger.current?.focus();}else close();}}>
      <header className="si-premium-heading">
        <div><span className="si-premium-eyebrow"><ShieldCheck size={14}/> SYLUTION TRADE · SOURCING</span>
          <h2 id={titleId}>Send an inquiry <span>to this supplier</span></h2>
          <p>Prepare your sourcing requirements and review the details.</p>
        </div>
        <button className="si-close" type="button" aria-label="Close quote request" onClick={close}><X size={20}/></button>
      </header>
      <div className="si-premium-layout">
        <aside className="si-product-panel" aria-label="Product summary">
          <div className="si-product-picture"><img src={product.image} alt={product.name} onError={e=>{e.currentTarget.style.display="none"}} /></div>
          <div className="si-product-info">
            <span className="si-product-kicker"><Package size={13}/> PRODUCT OVERVIEW</span>
            <strong className="si-product-title">{product.name}</strong>
            <b className="si-product-price">{product.price}<small> / {product.unit}</small></b>
            <p>Minimum order: <strong>{product.moq}</strong></p>
            <div className="si-product-supplier">{product.supplier}<span><CountryFlag country={product.country} compact/>{product.country}</span></div>
          </div>
          <p className="si-product-disclaimer">Demo listing. Prices and supplier information are illustrative, not independently verified.</p>
        </aside>
        {saved ? (
          <div className="si-premium-success" role="status">
            <span className="si-success-icon"><Check size={28}/></span>
            <h3 ref={confirmation} tabIndex={-1}>Inquiry draft saved</h3>
            <p>Your inquiry is saved on this device. No supplier has received it because live messaging has not been connected.</p>
            <Link className="si-submit" href="/account?tab=requests">View My Requests <ArrowRight size={17}/></Link>
          </div>
        ) : (
          <form className="si-quote-form si-premium-form" onSubmit={saveRequest}>
            <div className="si-quote-body">
              <section className="si-premium-section">
                <div className="si-section-label"><span>01</span> Order details</div>
                <div className="si-fields si-order-grid">
                  <div className="si-field"><label htmlFor={titleId+"-quantity"}>Quantity <em>*</em></label>
                    <div className="si-number-unit"><input id={titleId+"-quantity"} type="number" step="any" min="0.001" required value={quantity} onChange={e=>setQuantity(e.target.value)} placeholder="Enter quantity"/>
                      <select aria-label="Quantity unit" value={unit} onChange={e=>setUnit(e.target.value)}>{[...new Set([product.unit,...units])].map(option=><option key={option}>{option}</option>)}</select>
                    </div>
                  </div>
                  <div className="si-field"><label>Ship to <em>*</em></label>
                    <button ref={trigger} className="si-country-trigger" type="button" aria-expanded={countryOpen} aria-controls={countryId} aria-label={selected?"Ship to "+selected.label:"Choose shipping country"} onClick={()=>{setSearch("");setCountryOpen(v=>!v)}}>
                      {selected&&<CountryFlag country={selected.name} compact/>}<span>{selected?.label||"Choose country"}</span><ChevronDown size={16}/>
                    </button>
                  </div>
                  <label className="si-field">Destination port <span className="si-field-optional">Optional</span><input value={port} onChange={e=>setPort(e.target.value)} placeholder="City or port"/></label>
                </div>
                {countryOpen&&<div id={countryId} className="si-quote-countries">
                  <div className="si-country-search"><Search size={16}/><input autoFocus type="search" aria-label="Search shipping countries" placeholder="Search countries" value={search} onChange={e=>setSearch(e.target.value)}/></div>
                  <div className="si-country-options">{matches.length?matches.map(d=><button key={d.code} type="button" onClick={()=>selectCountry(d.name)}><CountryFlag country={d.name} compact/>{d.label}{country===d.name&&<Check size={15}/>}</button>):<p>No matching countries.</p>}</div>
                </div>}
              </section>
              <section className="si-premium-section">
                <div className="si-section-label"><span>02</span> Specifications <small>Optional</small></div>
                <div className="si-spec-grid">{specifications.map((item,index)=><div className="si-spec-item" key={index}>
                  <button type="button" aria-label={"Remove specification "+(index+1)} onClick={()=>setSpecifications(prev=>prev.filter((_,i)=>i!==index))}><X size={15}/></button>
                  <input aria-label={"Specification name "+(index+1)} placeholder="Specification" value={item.name} onChange={e=>setSpecifications(prev=>prev.map((x,i)=>i===index?{...x,name:e.target.value}:x))}/>
                  <input aria-label={"Specification value "+(index+1)} placeholder="Requirement" value={item.value} onChange={e=>setSpecifications(prev=>prev.map((x,i)=>i===index?{...x,value:e.target.value}:x))}/>
                </div>)}</div>
                <button className="si-add-spec" type="button" onClick={()=>setSpecifications(prev=>[...prev,{name:"",value:""}])}><Plus size={15}/> Add specification</button>
              </section>
              <section className="si-premium-section">
                <div className="si-section-label"><span>03</span> Trade terms <small>Optional</small></div>
                <div className="si-fields si-two">
                  <label className="si-field">Trade term<select value={tradeTerm} onChange={e=>setTradeTerm(e.target.value)}>{["Flexible","FOB","CIF","EXW","FCA","DAP","DDP"].map(x=><option key={x}>{x}</option>)}</select></label>
                  <label className="si-field">Payment term<select value={paymentTerm} onChange={e=>setPaymentTerm(e.target.value)}>{["Negotiable","Bank transfer","Letter of credit","Escrow preferred"].map(x=><option key={x}>{x}</option>)}</select></label>
                </div>
              </section>
              <section className="si-premium-section">
                <div className="si-section-label"><span>04</span> Additional requirements <small>Optional</small></div>
                <div className="si-requirement-chips">{quickRequirements.map(item=><button key={item} type="button" className={requirements.includes(item)?"is-selected":""} aria-pressed={requirements.includes(item)} onClick={()=>setRequirements(prev=>prev.includes(item)?prev.filter(x=>x!==item):[...prev,item])}>{requirements.includes(item)?<Check size={13}/>:<Plus size={13}/>} {item}</button>)}</div>
                <label className="si-field si-message-label">Your message<textarea className="si-message" rows={4} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Tell the supplier about product quality, packaging, target delivery date, or other requirements..."/></label>
                <label className="si-upload"><Paperclip size={17}/><span>Attach supporting files</span><input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={event=>{
                  const files=Array.from(event.target.files||[]);
                  if(files.length>5||files.some(file=>file.size>10*1024*1024||!/\.(pdf|png|jpe?g|webp)$/i.test(file.name))){event.target.value="";setAttachmentNames([]);setError("Choose up to five PDF or image files, 10 MB each.");return;}
                  setAttachmentNames(files.map(file=>file.name));setError("");
                }}/></label>
                {attachmentNames.length>0&&<p className="si-attachment-list">{attachmentNames.join(" · ")}</p>}
                <p className="si-upload-note">Demo: only filenames are saved. Files are not uploaded or sent.</p>
              </section>
              {error&&<p className="si-error" role="alert">{error}</p>}
            </div>
            <footer className="si-footer si-premium-footer">
              <span>Preview only · Saved to this browser. Not sent to supplier.</span>
              <button className="si-submit" type="submit"><Send size={17}/> Save inquiry draft <ArrowRight size={16}/></button>
            </footer>
          </form>
        )}
      </div>
    </dialog>
  );
}
