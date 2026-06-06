import { useState } from 'preact/hooks';
import type { FunctionComponent } from 'preact';
import { t } from '../../i18n/translate';
import { getCvHref } from '../../lib/cv';
import { getWhatsAppHref } from '../../lib/whatsapp';

interface ContactItem {
  /** Translation key for the label. */
  labelKey: string;
  v: string;
  href: string | null;
  copy?: boolean;
}

interface Props {
  /** Active locale code. */
  locale: string;
}

const getContacts = (locale: string): ContactItem[] => [
  { labelKey: 'contact.links.email',    v: 'diegoandresrojas2000@gmail.com',                  href: 'mailto:diegoandresrojas2000@gmail.com', copy: true },
  { labelKey: 'contact.links.phone',    v: '+57 320 418 0598',                                 href: 'tel:+573204180598',                       copy: true },
  { labelKey: 'contact.links.whatsapp', v: 'WhatsApp →',                                       href: getWhatsAppHref('work', locale) },
  { labelKey: 'contact.links.cv',       v: 'CV →',                                             href: getCvHref(locale) },
  { labelKey: 'contact.links.linkedin', v: 'linkedin.com/in/diego-andres-rojas →',             href: 'https://www.linkedin.com/in/diego-andres-rojas/' },
  { labelKey: 'contact.links.github',   v: 'github.com/darcdev →',                             href: 'https://github.com/darcdev' },
  { labelKey: 'contact.links.location', v: 'Bogotá, Colombia · GMT-5',                         href: null },
];

const ContactLinks: FunctionComponent<Props> = ({ locale }) => {
  const [copied, setCopied] = useState('');

  const copy = (txt: string, label: string) => {
    navigator.clipboard?.writeText(txt);
    setCopied(label);
    setTimeout(() => setCopied(''), 1400);
  };

  const copiedMsg = t('contact.links.copied', undefined, locale);

  return (
    <div class="contact-links">
      {getContacts(locale).map((it) => {
        const label = t(it.labelKey, undefined, locale);
        return (
          <a
            key={it.labelKey}
            class="contact-link"
            href={it.href || '#'}
            target={it.href && (it.href.startsWith('http') || it.href.endsWith('.pdf')) ? '_blank' : undefined}
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!it.href) { e.preventDefault(); return; }
              if (it.copy) {
                e.preventDefault();
                copy(it.v.replace(/[→\s]+$/, ''), it.labelKey);
              }
            }}
          >
            <span class="k">{label}</span>
            <span class="v">{copied === it.labelKey ? copiedMsg : it.v}</span>
          </a>
        );
      })}
    </div>
  );
};

export default ContactLinks;
