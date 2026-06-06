import { type LocaleCode, defaultLocale, resolveLocale } from '../i18n/config';

const CV_HREF_BY_LOCALE: Record<LocaleCode, string> = {
  es: '/CV_Diego_Cabrera_ES.pdf',
  en: '/CV_Diego_Cabrera_EN.pdf',
};

export function getCvHref(locale?: string): string {
  const code = resolveLocale(locale);
  return CV_HREF_BY_LOCALE[code] ?? CV_HREF_BY_LOCALE[defaultLocale];
}
