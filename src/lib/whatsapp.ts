import { resolveLocale } from '../i18n/config';
import { t } from '../i18n/translate';

const WHATSAPP_PHONE = '573204180598';

export type WhatsAppIntent = 'work' | 'advisory';

const MESSAGE_KEYS: Record<WhatsAppIntent, string> = {
  work: 'whatsapp.message.work',
  advisory: 'whatsapp.message.advisory',
};

export function getWhatsAppHref(
  intent: WhatsAppIntent = 'work',
  locale?: string,
): string {
  const code = resolveLocale(locale);
  const message = t(MESSAGE_KEYS[intent], undefined, code);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
