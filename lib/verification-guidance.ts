/** Illustrative KYC/KYB preparation hints, not authoritative legal requirements.
 * Jurisdiction-specific requirements MUST be verified with local authorities
 * and the selected verification provider before any real document collection.
 */
export type VerificationGuide={registrationLabel:string;registrationHelp:string;taxLabel:string;taxHelp:string;authorityNote:string};
const generic:VerificationGuide={
 registrationLabel:"Official business registration / licence",
 registrationHelp:"Prepare a government-issued business registration document applicable to your legal entity and jurisdiction.",
 taxLabel:"Tax registration or compliance document (where applicable)",
 taxHelp:"Tax registration and compliance evidence vary by country and entity type. Request only documents that are actually required.",
 authorityNote:"Requirements vary by jurisdiction, business structure and the verification provider. Check the relevant official registry."
};
const specific:Record<string,Partial<VerificationGuide>>={
 NG:{registrationHelp:"Nigeria: CAC-issued company/business registration evidence may apply. Verify the correct registration type with CAC.",authorityNote:"Confirm business details and document type through the Corporate Affairs Commission (CAC) and applicable authorities."},
 GB:{registrationHelp:"United Kingdom: Companies House registration evidence may apply to incorporated companies; sole traders differ.",authorityNote:"Check Companies House and the appropriate UK guidance for your business structure."},
 US:{registrationHelp:"United States: entity registration is typically determined at state level; requirements vary by state and entity type.",authorityNote:"Check the relevant state registry and applicable federal/state requirements."},
 IN:{registrationHelp:"India: a company may have an MCA corporate registration identifier; other business structures have different documentation.",authorityNote:"Check MCA and any applicable local regulators for the type of entity."},
 CN:{registrationHelp:"China: an official business licence and registered-entity details may be relevant to company verification.",authorityNote:"Check the applicable official company-registration authority."},
 AE:{registrationHelp:"United Arab Emirates: valid trade licence / entity registration evidence may be required depending on the emirate or free zone.",authorityNote:"Confirm the relevant emirate, economic department or free-zone registry."},
 DE:{registrationHelp:"Germany: commercial register evidence may apply to certain legal forms; small businesses can differ.",authorityNote:"Confirm the legal form and official German register applicable to the entity."},
 CA:{registrationHelp:"Canada: federal or provincial/territorial business-registration records may apply.",authorityNote:"Check the appropriate federal, provincial or territorial authority."},
 ZA:{registrationHelp:"South Africa: CIPC company registration records may apply to registered companies.",authorityNote:"Check CIPC and other relevant authorities for the business type."},
 GH:{registrationHelp:"Ghana: Office of the Registrar of Companies documentation may apply.",authorityNote:"Check the applicable Ghanaian business registry."}
};
export function verificationGuide(countryCode:string):VerificationGuide{
 const entry=specific[countryCode.toUpperCase()]||{};
 return {...generic,...entry};
}
