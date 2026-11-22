// schema.org Organization data for every page's JSON-LD (data for search engines, never run as code),
// built from company.json and site.js so the company's details stay in one place.
import { readFileSync } from "node:fs";
import site from "./site.js";

const company = JSON.parse(readFileSync(new URL("./company.json", import.meta.url), "utf8"));
const digits = (s) => s.replace(/\D/g, "");

export default {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  legalName: company.legalName,
  url: `${site.url}/`,
  logo: `${site.url}/apple-touch-icon.png`,
  email: company.email,
  telephone: company.phone,
  taxID: digits(company.abn),
  identifier: [
    { "@type": "PropertyValue", propertyID: "ABN", value: digits(company.abn) },
    { "@type": "PropertyValue", propertyID: "ACN", value: digits(company.acn) },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: company.locality,
    addressRegion: company.region,
    addressCountry: company.country,
  },
  sameAs: [site.github],
};
