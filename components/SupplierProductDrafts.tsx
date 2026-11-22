"use client";

import {useEffect, useId, useState} from "react";
import {CountryField} from "@/components/CountryFlag";

type Draft = {name: string; country: string; minimum: string; price: string};

export function SupplierProductDrafts({country, email}: {country: string; email: string}) {
  const storageKey = "sylution_supplier_product_drafts:" + email.toLowerCase();
  const id = useId();
  const [destination, setDestination] = useState(country);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (Array.isArray(stored)) setDrafts(stored);
    } catch {}
  }, [storageKey]);

  return (
    <section className="sy-panel">
      <h3>Add Product</h3>
      <p>Prepare a listing draft in this browser. Publishing is unavailable in the demo.</p>
      <form className="trade-draft-form" onSubmit={event => {
        event.preventDefault();
        const form = event.currentTarget;
        const fields = new FormData(form);
        const draft = {
          name: String(fields.get("name")).trim(),
          minimum: String(fields.get("minimum")).trim(),
          price: String(fields.get("price")).trim(),
          country: destination,
        };
        if (!draft.name || !draft.minimum || !draft.country) {
          setNotice("Enter the product name, origin country and minimum order.");
          return;
        }
        try {
          const next = [...drafts, draft];
          localStorage.setItem(storageKey, JSON.stringify(next));
          setDrafts(next);
          form.reset();
          setNotice("Product draft saved.");
        } catch {
          setNotice("Browser storage is unavailable.");
        }
      }}>
        <label htmlFor={id + "-name"}>Product name<input id={id + "-name"} name="name" required maxLength={120}/></label>
        <label>Product origin<CountryField value={destination} onChange={setDestination} required label="Product origin"/></label>
        <label>Minimum order<input name="minimum" required maxLength={60} placeholder="e.g. 5 MT"/></label>
        <label>Indicative price (optional)<input name="price" maxLength={60} placeholder="e.g. USD 1,600 / MT"/></label>
        <button type="submit" className="sy-green-action">Save product draft</button>
      </form>
      <p role="status">{notice}</p>
      {drafts.length > 0 && <><h4>Saved product drafts</h4><ul>{drafts.map((draft, index) => (
        <li key={index}>{draft.name} · {draft.country} · {draft.minimum}{draft.price && " · " + draft.price}</li>
      ))}</ul></>}
    </section>
  );
}
