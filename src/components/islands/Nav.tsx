import { useState, useEffect, useRef } from 'preact/hooks';
import type { FunctionComponent } from 'preact';
import { locales, defaultLocale, isLocaleCode } from '../../i18n/config';
import { t } from '../../i18n/translate';

interface Props {
  /** Active locale code for this route. */
  locale: string;
  /** Server-resolved nav id for standalone routes (disables scroll-spy). */
  activeNav?: string;
}

const Icon = {
  sun: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  ),
  moon: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  hamburger: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  close: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

function FlagES() {
  return (
    <svg class="flag" viewBox="0 0 30 20" width="20" height="14" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="30" height="20" fill="#AA151B"/>
      <rect y="5" width="30" height="10" fill="#F1BF00"/>
      <g transform="translate(8.5,10)">
        <rect x="-1.4" y="-1.6" width="2.8" height="3.2" fill="#AA151B" stroke="#AD1519" strokeWidth="0.3"/>
        <rect x="-1.6" y="-0.4" width="3.2" height="0.5" fill="#F1BF00"/>
      </g>
    </svg>
  );
}

function FlagEN() {
  return (
    <svg class="flag" viewBox="0 0 60 30" width="20" height="14" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <clipPath id="ukclip"><rect width="60" height="30"/></clipPath>
      <g clipPath="url(#ukclip)">
        <rect width="60" height="30" fill="#012169"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
        <path d="M0,0 L60,30" stroke="#C8102E" strokeWidth="2"/>
        <path d="M60,0 L0,30" stroke="#C8102E" strokeWidth="2"/>
        <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10"/>
        <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6"/>
      </g>
    </svg>
  );
}

function FlagGeneric({ code }: { code: string }) {
  return (
    <svg class="flag" viewBox="0 0 30 20" width="20" height="14" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="30" height="20" fill="var(--ink)"/>
      <text x="15" y="14" textAnchor="middle" fill="var(--bg)" fontSize="10" fontFamily="monospace" fontWeight="700">
        {code.toUpperCase()}
      </text>
    </svg>
  );
}

function flagFor(code: string) {
  if (code === 'es') return FlagES;
  if (code === 'en') return FlagEN;
  return () => <FlagGeneric code={code} />;
}

/**
 * Compute the URL to navigate to when switching to `targetCode`.
 *
 * Strategy: replace the leading `/{lang}/...` segment of the current pathname
 * with `/{targetCode}/...`. If the current path doesn't start with a known
 * locale prefix, fall back to the target locale's home.
 */
function pathForLocale(targetCode: string): string {
  if (typeof window === 'undefined') return `/${targetCode}/`;
  const path = window.location.pathname || '/';
  const match = path.match(/^\/([a-z]{2})(\/.*)?$/);
  if (match && isLocaleCode(match[1])) {
    const rest = match[2] ?? '/';
    return `/${targetCode}${rest}`;
  }
  return `/${targetCode}/`;
}

function routeActiveId(pathname: string, lang: string): string | null {
  const blogPrefix = `/${lang}/blog`;
  if (pathname === blogPrefix || pathname.startsWith(`${blogPrefix}/`)) {
    return 'blog';
  }
  const homePath = `/${lang}/`;
  if (pathname === homePath || pathname === `/${lang}`) {
    return null;
  }
  return null;
}

const Nav: FunctionComponent<Props> = ({ locale, activeNav }) => {
  const lang = isLocaleCode(locale) ? locale : defaultLocale;

  const [active, setActive] = useState(activeNav ?? 'home');
  const [theme, setTheme] = useState("light");
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const items = [
    { id: "home",     key: "nav.home" },
    { id: "about",    key: "nav.about" },
    { id: "projects", key: "nav.projects" },
    { id: "blog",     key: "nav.blog" },
    { id: "contact",  key: "nav.contact" },
  ];

  const themeAria = t("nav.theme.aria", undefined, lang);
  const langAria  = t("nav.lang.aria", undefined, lang);
  const menuAria  = t("nav.menu.open", undefined, lang);
  const closeAria = t("nav.menu.close", undefined, lang);

  // ── Initial theme ──────────────────────────────────────────────────────────
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  useEffect(() => {
    if (activeNav) {
      setActive(activeNav);
    }
  }, [activeNav]);

  // ── Scroll-spy (homepage sections only) ────────────────────────────────────
  useEffect(() => {
    if (activeNav) return;

    const sectionIds = ["home", "about", "projects", "blog", "contact"];

    const updateActive = () => {
      const routeId = routeActiveId(window.location.pathname, lang);
      if (routeId) {
        setActive(routeId);
        return;
      }

      let currentId = "home";
      const y = window.scrollY + window.innerHeight * 0.45;
      const atPageBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;

      if (atPageBottom) {
        setActive("contact");
        return;
      }

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) currentId = id;
      }

      setActive(currentId);
    };

    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    updateActive();

    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [lang, activeNav]);

  // ── Lang dropdown outside-click / escape ───────────────────────────────────
  useEffect(() => {
    if (!langOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setLangOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [langOpen]);

  // ── Mobile menu outside-click / escape + body lock ─────────────────────────
  useEffect(() => {
    if (!menuOpen) return;

    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        if (!hamburgerBtn?.contains(target)) {
          setMenuOpen(false);
        }
      }
    };

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.body.style.overflow = 'hidden';

    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  /**
   * Navigation: if we're already on the locale-home (`/{lang}/`), scroll to
   * the section. Otherwise navigate to `/{lang}/#section` (or `/{lang}/` for
   * "home"), which lets the slug page bounce back to the landing.
   */
  const navigateToSection = (id: string) => {
    const homePath = `/${lang}/`;
    if (id === "blog") {
      setActive("blog");
      window.location.href = `/${lang}/blog`;
      setMenuOpen(false);
      return;
    }
    if (typeof window !== 'undefined' && window.location.pathname === homePath) {
      scrollTo(id);
      setActive(id);
      return;
    }
    window.location.href = id === "home" ? homePath : `${homePath}#${id}`;
  };

  const toggleMenu = () => {
    setMenuOpen((v) => !v);
  };

  const current = locales.find((l) => l.code === lang) || locales[0];
  const CurrentFlag = flagFor(current.code);

  return (
    <>
      <nav class="nav">
        <div class="nav-inner">
          <a class="nav-logo" href={`/${lang}/`} onClick={(e) => { e.preventDefault(); navigateToSection("home"); }}>
            <img
              class="nav-logo-img"
              src={theme === "dark" ? "/darcdev-black.png" : "/darcdev-light.png"}
              alt="Diego Cabrera"
              width="132"
              height="28"
            />
            <span class="nav-logo-name">Darcdev</span>
          </a>

          {/* Desktop nav links - hidden on mobile */}
          <div class="nav-links hide-mobile-flex">
            {items.map((it) => (
              <button
                key={it.id}
                class={`nav-link ${active === it.id ? "active" : ""}`}
                onClick={() => navigateToSection(it.id)}
              >
                {t(it.key, undefined, lang)}
              </button>
            ))}
          </div>

          <span class="nav-divider hide-mobile"></span>

          <button
            class="nav-icon-btn theme-btn"
            onClick={toggleTheme}
            aria-label={themeAria}
            title={themeAria}
          >
            {theme === "light" ? <Icon.moon /> : <Icon.sun />}
          </button>

          {/* Language selector - desktop */}
          <div class={`nav-lang-wrap hide-mobile ${langOpen ? "open" : ""}`} ref={wrapRef}>
            <button
              type="button"
              class="nav-lang-btn"
              onClick={() => setLangOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label={langAria}
              title={langAria}
            >
              <CurrentFlag />
              <span class="nav-lang-name">{current.label}</span>
              <svg class="nav-lang-caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {langOpen && (
              <ul class="nav-lang-menu" role="listbox">
                {locales.map((l) => {
                  const Flag = flagFor(l.code);
                  return (
                    <li key={l.code} role="option" aria-selected={l.code === lang}>
                      <a
                        href={pathForLocale(l.code)}
                        class={`nav-lang-opt ${l.code === lang ? "active" : ""}`}
                        hrefLang={l.code}
                      >
                        <Flag />
                        <span>{l.label}</span>
                        {l.code === lang && (
                          <svg class="nav-lang-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Hamburger - mobile only */}
          <button
            class="hamburger-btn show-mobile-flex"
            onClick={toggleMenu}
            aria-label={menuOpen ? closeAria : menuAria}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <Icon.close /> : <Icon.hamburger />}
          </button>
        </div>
      </nav>

      <div
        class={`mobile-menu-overlay ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <div
        id="mobile-menu"
        class={`mobile-menu ${menuOpen ? "open" : ""}`}
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label={menuAria}
      >
        <button
          class="mobile-menu-close"
          onClick={() => setMenuOpen(false)}
          aria-label={closeAria}
        >
          <Icon.close />
        </button>

        <div class="mobile-menu-inner">
          <div class="mobile-menu-links">
            {items.map((it) => (
              <button
                key={it.id}
                class={`mobile-menu-link ${active === it.id ? "active" : ""}`}
                onClick={() => navigateToSection(it.id)}
              >
                {t(it.key, undefined, lang)}
              </button>
            ))}
          </div>

          <div class="mobile-menu-footer">
            <div class="mobile-menu-lang" role="group" aria-label={langAria}>
              {locales.map((l) => {
                const Flag = flagFor(l.code);
                return (
                  <a
                    key={l.code}
                    href={pathForLocale(l.code)}
                    class={`mobile-lang-btn ${l.code === lang ? "active" : ""}`}
                    aria-pressed={l.code === lang}
                    hrefLang={l.code}
                  >
                    <Flag />
                    <span>{l.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;
