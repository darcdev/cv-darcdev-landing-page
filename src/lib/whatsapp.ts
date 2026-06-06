const WHATSAPP_PHONE = '573204180598';

export const WHATSAPP_DEFAULT_MESSAGE =
  'Hola Diego, me gustaria que trabajaramos en algo juntos';

export function getWhatsAppHref(message = WHATSAPP_DEFAULT_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
