import { useState, useEffect, useRef } from 'preact/hooks';

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

const LANGS = [
  { code: "es", name: "Español", Flag: FlagES },
  { code: "en", name: "English", Flag: FlagEN },
];

const LABELS = {
  es: {
    home: "Inicio", about: "Sobre mí", projects: "Proyectos", blog: "Blog", contact: "Contacto",
    themeAria: "Cambiar tema", langAria: "Seleccionar idioma", menuAria: "Abrir menú", closeAria: "Cerrar menú"
  },
  en: {
    home: "Home", about: "About", projects: "Projects", blog: "Blog", contact: "Contact",
    themeAria: "Toggle theme", langAria: "Select language", menuAria: "Open menu", closeAria: "Close menu"
  }
};

export default function Nav() {
  const [active, setActive] = useState("home");
  const [theme, setTheme] = useState("light");
  const [lang, setLang] = useState<"es" | "en">("es");
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const L = LABELS[lang];
  const items = [
    { id: "home", label: L.home },
    { id: "about", label: L.about },
    { id: "projects", label: L.projects },
    { id: "blog", label: L.blog },
    { id: "contact", label: L.contact },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);

    const savedLang = localStorage.getItem("lang") as "es" | "en" | null;
    if (savedLang && (savedLang === "es" || savedLang === "en")) {
      setLang(savedLang);
    }
  }, []);

  useEffect(() => {
    const sectionIds = ["home", "about", "projects", "blog", "contact"];

    const updateActive = () => {
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
  }, []);

  // Close lang dropdown on outside click or escape
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

  // Close mobile menu on outside click or escape
  useEffect(() => {
    if (!menuOpen) return;
    
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      // Close if click is outside both the menu and the hamburger button
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
    
    // Prevent body scroll when menu is open
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

  const changeLang = (code: "es" | "en") => {
    setLang(code);
    localStorage.setItem("lang", code);
    setLangOpen(false);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    // Close mobile menu after navigation
    setMenuOpen(false);
  };

  const navigateToSection = (id: string) => {
    if (window.location.pathname === "/") {
      scrollTo(id);
      setActive(id);
      return;
    }

    window.location.href = id === "home" ? "/" : `/#${id}`;
  };

  const navigateToContact = () => navigateToSection("contact");

  const toggleMenu = () => {
    setMenuOpen((v) => !v);
  };

  const current = LANGS.find((l) => l.code === lang) || LANGS[0];

  return (
    <>
      <nav class="nav">
        <div class="nav-inner">
          <a class="nav-logo" href="/" onClick={(e) => { e.preventDefault(); navigateToSection("home"); }}>
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
                {it.label}
              </button>
            ))}
          </div>
          
          <span class="nav-divider hide-mobile"></span>
          
          <button
            class="nav-icon-btn theme-btn"
            onClick={toggleTheme}
            aria-label={L.themeAria}
            title={L.themeAria}
          >
            {theme === "light" ? <Icon.moon /> : <Icon.sun />}
          </button>
          
          {/* Language selector - hidden on mobile (moved to mobile menu) */}
          <div class={`nav-lang-wrap hide-mobile ${langOpen ? "open" : ""}`} ref={wrapRef}>
            <button
              type="button"
              class="nav-lang-btn"
              onClick={() => setLangOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label={L.langAria}
              title={L.langAria}
            >
              <current.Flag />
              <span class="nav-lang-name">{current.name}</span>
              <svg class="nav-lang-caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {langOpen && (
              <ul class="nav-lang-menu" role="listbox">
                {LANGS.map((l) => (
                  <li key={l.code} role="option" aria-selected={l.code === lang}>
                    <button
                      type="button"
                      class={`nav-lang-opt ${l.code === lang ? "active" : ""}`}
                      onClick={() => changeLang(l.code as "es" | "en")}
                    >
                      <l.Flag />
                      <span>{l.name}</span>
                      {l.code === lang && (
                        <svg class="nav-lang-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Hamburger button - visible on mobile only */}
          <button
            class="hamburger-btn show-mobile-flex"
            onClick={toggleMenu}
            aria-label={menuOpen ? L.closeAria : L.menuAria}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <Icon.close /> : <Icon.hamburger />}
          </button>
        </div>
      </nav>
      
      {/* Mobile menu overlay */}
      <div 
        class={`mobile-menu-overlay ${menuOpen ? "open" : ""}`} 
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      
      {/* Mobile menu panel */}
      <div 
        id="mobile-menu"
        class={`mobile-menu ${menuOpen ? "open" : ""}`}
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Close button */}
        <button
          class="mobile-menu-close"
          onClick={() => setMenuOpen(false)}
          aria-label={L.closeAria}
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
                {it.label}
              </button>
            ))}
          </div>
          
          {/* Language selector in mobile menu */}
          <div class="mobile-menu-footer">
            <div class="mobile-menu-lang">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  class={`mobile-lang-btn ${l.code === lang ? "active" : ""}`}
                  onClick={() => changeLang(l.code as "es" | "en")}
                >
                  <l.Flag />
                  <span>{l.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
