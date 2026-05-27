import { useState } from 'preact/hooks';

const PRESETS: Record<string, string> = {
  "¿Quién es Diego?":
    "Tech Lead con 7+ años construyendo soluciones full-stack para gobierno y privado. Hoy lidero la estrategia de IA en SASOFTCO: agentes RAG, Spec-Driven Development y MCP.",
  "¿Qué stack maneja en IA?":
    "Python · LangChain · Weaviate · MCP · Claude Code · Cursor. Para el código que sirve a los agentes: TypeScript, .NET Core y Java Spring Boot.",
  "¿Está disponible?":
    "Sí — disponible para colaboraciones desde Q3 2026, idealmente sobre IA aplicada, arquitecturas escalables o plataformas internas.",
  "Muéstrame un proyecto":
    "Agente RAG conversacional sobre LangChain + Weaviate. En producción interna, redujo el tiempo de respuesta a consultas técnicas en ~85% y todas las respuestas incluyen citas a la fuente original.",
};

export default function AskAI() {
  const [q, setQ] = useState("");
  const [a, setA] = useState("Pregunta lo que quieras saber. Las respuestas vienen de la base de conocimiento personal de Diego (CV, proyectos, posts).");
  const [src, setSrc] = useState("fuentes: 12 documentos · cv.pdf · proyectos.md · posts/*");

  const ask = (text: string) => {
    setQ(text);
    setA("…");
    setTimeout(() => {
      const matched = Object.keys(PRESETS).find((k) => k.toLowerCase() === text.toLowerCase().trim()) || Object.keys(PRESETS)[0];
      setA(PRESETS[matched]);
      setSrc("fuentes: cv_diego_cabrera.pdf · proyectos.md · posts/" + (matched.includes("RAG") || matched.includes("stack") ? "rag-en-produccion.md" : "perfil.md"));
    }, 420);
  };

  return (
    <div class="ask">
      <div>
        <div class="ask-eyebrow">/ ask diego — agente rag</div>
        <h2>Pregúntame lo que <em>realmente</em> hago.</h2>
        <p>
          Esta caja es un mini-RAG sobre mi CV, proyectos y posts. Es la misma idea que llevo a producción para mis clientes.
        </p>
        <div class="ask-input-row">
          <input
            class="ask-input"
            placeholder="Escribe una pregunta…"
            value={q}
            onInput={(e) => setQ((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => { if (e.key === "Enter" && q.trim()) ask(q); }}
          />
          <button class="ask-send" onClick={() => q.trim() && ask(q)}>Preguntar</button>
        </div>
        <div class="ask-suggestions">
          {Object.keys(PRESETS).map((p) => (
            <button key={p} class="ask-sug" onClick={() => ask(p)}>{p}</button>
          ))}
        </div>
      </div>
      <div class="ask-output">
        <div>{a}</div>
        <div class="src">{src}</div>
      </div>
    </div>
  );
}
