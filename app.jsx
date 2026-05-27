// Root app — single-page with scroll spy + tweaks + modals
const { useState: useStateA, useEffect: useEffectA, useCallback: useCallbackA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentHue": 264,
  "accentChroma": 0.24,
  "accentLight": 0.62,
  "theme": "light",
  "lang": "es"
}/*EDITMODE-END*/;

function App() {
  const [activeProject, setActiveProject] = useStateA(null);
  const [activePost, setActivePost] = useStateA(null);
  const [activeSection, setActiveSection] = useStateA("home");
  const [tweaks, setTweaksState] = useStateA(TWEAK_DEFAULTS);
  const [editMode, setEditMode] = useStateA(false);

  // Apply theme + accent
  useEffectA(() => {
    document.documentElement.dataset.theme = tweaks.theme;
    const accent = `oklch(${tweaks.accentLight} ${tweaks.accentChroma} ${tweaks.accentHue})`;
    document.documentElement.style.setProperty("--accent", accent);
  }, [tweaks.theme, tweaks.accentHue, tweaks.accentChroma, tweaks.accentLight]);

  // Apply lang
  useEffectA(() => {
    document.documentElement.lang = tweaks.lang || "es";
    window.__lang = tweaks.lang || "es";
    window.dispatchEvent(new CustomEvent("langchange", { detail: tweaks.lang }));
  }, [tweaks.lang]);

  // Edit mode wiring
  useEffectA(() => {
    const onMsg = (e) => {
      if (e.data?.type === "__activate_edit_mode") setEditMode(true);
      if (e.data?.type === "__deactivate_edit_mode") setEditMode(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const setTweak = (k, v) => {
    setTweaksState((s) => ({ ...s, [k]: v }));
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [k]: v } }, "*");
  };

  // Scroll spy (only when on home view)
  useEffectA(() => {
    if (activePost) return;
    const ids = ["home", "about", "projects", "blog", "contact"];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [activePost]);

  const scrollTo = useCallbackA((id) => {
    if (activePost) {
      // Coming from a post — go home first, then scroll
      setActivePost(null);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 50);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [activePost]);

  const openProject = (id) => setActiveProject(id);
  const openPost = (id) => {
    setActivePost(id);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const closePost = () => {
    setActivePost(null);
    setTimeout(() => {
      const blog = document.getElementById("blog");
      if (blog) {
        const top = blog.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "instant" });
      }
    }, 50);
  };

  const project = activeProject ? PROJECTS.find((p) => p.id === activeProject) : null;
  const post = activePost ? POSTS.find((p) => p.id === activePost) : null;

  return (
    <>
      <DotGridBg />
      <div className="app">
        <Nav active={post ? "blog" : activeSection} scrollTo={scrollTo} theme={tweaks.theme} setTheme={(t) => setTweak("theme", t)} lang={tweaks.lang} setLang={(l) => setTweak("lang", l)} onHome={() => { setActivePost(null); window.scrollTo({ top: 0, behavior: "smooth" }); }} />

        {!post && (
          <>
            <HeroSection scrollTo={scrollTo} />
            <AboutSection />
            <ProjectsSection openProject={openProject} />
            <AskSection />
            <BlogSection openPost={openPost} />
            <ContactSection />
          </>
        )}

        {post && (
          <PostPage post={post} onBack={closePost} openPost={openPost} />
        )}

        <Footer />
      </div>

      {project && <ProjectModal project={project} onClose={() => setActiveProject(null)} />}

      {editMode && (
        <TweaksPanel onClose={() => setEditMode(false)} title="Tweaks">
          <TweakSection title="Apariencia">
            <TweakRadio
              label="Tema"
              value={tweaks.theme}
              onChange={(v) => setTweak("theme", v)}
              options={[{ value: "light", label: "Claro" }, { value: "dark", label: "Oscuro" }]}
            />
            <TweakRadio
              label="Idioma / Language"
              value={tweaks.lang || "es"}
              onChange={(v) => setTweak("lang", v)}
              options={[{ value: "es", label: "Español" }, { value: "en", label: "English" }]}
            />
          </TweakSection>
          <TweakSection title="Acento">
            <TweakRadio
              label="Paleta"
              value={String(tweaks.accentHue)}
              onChange={(v) => setTweak("accentHue", Number(v))}
              options={[
                { value: "264", label: "Azul" },
                { value: "138", label: "Verde" },
                { value: "60", label: "Ámbar" },
                { value: "10", label: "Coral" },
              ]}
            />
            <TweakSlider label="Tono" min={0} max={360} step={5} value={tweaks.accentHue} onChange={(v) => setTweak("accentHue", v)} suffix="°"/>
            <TweakSlider label="Saturación" min={0} max={0.4} step={0.01} value={tweaks.accentChroma} onChange={(v) => setTweak("accentChroma", v)} />
            <TweakSlider label="Luminosidad" min={0.4} max={0.9} step={0.02} value={tweaks.accentLight} onChange={(v) => setTweak("accentLight", v)} />
          </TweakSection>
          <TweakSection title="Ir a sección">
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6}}>
              {["home","about","projects","blog","contact"].map(v => (
                <TweakButton key={v} onClick={() => scrollTo(v)} label={v} />
              ))}
            </div>
          </TweakSection>
        </TweaksPanel>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
