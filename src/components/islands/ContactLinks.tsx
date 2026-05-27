import { useState } from 'preact/hooks';

interface ContactItem {
  k: string;
  v: string;
  href: string | null;
  copy?: boolean;
}

const CONTACTS: ContactItem[] = [
  { k: "Email", v: "diegoandresrojas2000@gmail.com", href: "mailto:diegoandresrojas2000@gmail.com", copy: true },
  { k: "Teléfono", v: "+57 320 418 0598", href: "tel:+573204180598", copy: true },
  { k: "LinkedIn", v: "linkedin.com/in/diego-cabrera →", href: "https://linkedin.com/in/diego-cabrera" },
  { k: "GitHub", v: "github.com/diegocabrera →", href: "https://github.com/diegocabrera" },
  { k: "Ubicación", v: "Bogotá, Colombia · GMT-5", href: null },
];

export default function ContactLinks() {
  const [copied, setCopied] = useState("");

  const copy = (txt: string, label: string) => {
    navigator.clipboard?.writeText(txt);
    setCopied(label);
    setTimeout(() => setCopied(""), 1400);
  };

  return (
    <div class="contact-links">
      {CONTACTS.map((it) => (
        <a
          key={it.k}
          class="contact-link"
          href={it.href || "#"}
          target={it.href && it.href.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          onClick={(e) => {
            if (!it.href) { e.preventDefault(); return; }
            if (it.copy) {
              e.preventDefault();
              copy(it.v.replace(/[→\s]+$/, ""), it.k);
            }
          }}
        >
          <span class="k">{it.k}</span>
          <span class="v">{copied === it.k ? "✓ copiado al portapapeles" : it.v}</span>
        </a>
      ))}
    </div>
  );
}
