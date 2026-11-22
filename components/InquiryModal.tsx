"use client";

import Link from "next/link";
import {useEffect, useId, useRef, useState} from "react";
import {ArrowRight, Check, ChevronDown, Search, X} from "lucide-react";
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

  return (
    <dialog
      className="si-quote"
      ref={dialog}
      aria-labelledby={titleId}
      onCancel={event => {
        event.preventDefault();
        if (countryOpen) {
          setCountryOpen(false);
          trigger.current?.focus();
        } else {
          close();
        }
      }}
    >
      <header className="si-heading">
        <div>
          <h2 id={titleId}>Request a quote</h2>
          <p>{product.name} · Minimum order {product.moq}</p>
        </div>
        <button className="si-close" type="button" aria-label="Close quote request" onClick={close}><X size={21}/></button>
      </header>
      {saved ? (
        <div className="si-quote-body si-quote-success">
          <Check size={28} aria-hidden="true"/>
          <h3 ref={confirmation} tabIndex={-1}>Quote draft saved</h3>
          <p>You can find it under My Requests on this browser. Supplier delivery is unavailable in the demo.</p>
          <Link className="si-submit" href="/account?tab=requests">View My Requests <ArrowRight size={17}/></Link>
        </div>
      ) : (
        <form className="si-quote-form" onSubmit={saveRequest}>
          <div className="si-quote-body">
            <div className="si-fields si-two">
              <div className="si-field">
                <label htmlFor={titleId + "-quantity"}>Quantity</label>
                <div className="si-number-unit">
                  <input id={titleId + "-quantity"} type="number" step="any" min="0" required value={quantity} onChange={event => setQuantity(event.target.value)} placeholder="Enter quantity"/>
                  <select aria-label="Quantity unit" value={unit} onChange={event => setUnit(event.target.value)}>
                    {[...new Set([product.unit, ...units])].map(option => <option key={option}>{option}</option>)}
                  </select>
                </div>
              </div>
              <div className="si-field">
                <span>Ship to country</span>
                <button ref={trigger} className="si-country-trigger" type="button" aria-expanded={countryOpen} aria-controls={countryId} aria-label={selected ? "Ship to country, " + selected.label : "Ship to country"} onClick={() => {setSearch(""); setCountryOpen(open => !open);}}>
                  {selected && <CountryFlag country={selected.name} compact/>}
                  {selected?.label || "Choose country"}
                  <ChevronDown size={16}/>
                </button>
              </div>
            </div>
            {countryOpen && (
              <div id={countryId} className="si-quote-countries">
                <div className="si-country-search">
                  <Search size={16} aria-hidden="true"/>
                  <input autoFocus type="search" aria-label="Search countries" placeholder="Search countries" value={search} onChange={event => setSearch(event.target.value)}/>
                </div>
                <div className="si-country-options">
                  {matches.length ? matches.map(destination => (
                    <button type="button" key={destination.code} onClick={() => selectCountry(destination.name)}>
                      <CountryFlag country={destination.name} compact/>{destination.label}
                      {country === destination.name && <Check size={15} aria-hidden="true"/>}
                    </button>
                  )) : <p>No matching countries.</p>}
                </div>
              </div>
            )}
            <details className="si-quote-options">
              <summary>Add a message or attachments (optional)</summary>
              <label className="si-field">Message
                <textarea className="si-message" rows={3} value={message} onChange={event => setMessage(event.target.value)} placeholder="Packaging, delivery timing or other requirements"/>
              </label>
              <label className="si-field">Attachments
                <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={event => {
                  const files = Array.from(event.target.files || []);
                  if (files.length > 5 || files.some(file => file.size > 10 * 1024 * 1024 || !/\.(pdf|png|jpe?g|webp)$/i.test(file.name))) {
                    event.target.value = "";
                    setAttachmentNames([]);
                    setError("Choose up to five PDF or image files, 10 MB each.");
                    return;
                  }
                  setAttachmentNames(files.map(file => file.name));
                  setError("");
                }}/>
              </label>
              <small>Demo drafts keep file names only.</small>
            </details>
            {error && <p className="si-error" role="alert">{error}</p>}
          </div>
          <footer className="si-footer">
            <span>Demo · Saved in this browser</span>
            <button className="si-submit" type="submit">Save quote draft <ArrowRight size={17}/></button>
          </footer>
        </form>
      )}
    </dialog>
  );
}
