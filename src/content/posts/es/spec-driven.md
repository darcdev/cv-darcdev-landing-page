---
title: "Spec-Driven Development: del prompt al producto"
excerpt: "Por qué especificar antes de pedirle código a un agente cambia totalmente el resultado — y cómo lo estamos integrando con MCP."
category: "Workflows con IA"
tags: ["Spec-Driven", "MCP", "DevEx"]
pubDate: 2026-04-28
displayDate: "28 Abr 2026"
readMin: 7
featured: true
cover: spec
---

Pedirle a un LLM 'haz tal feature' sin contexto es como contratar a un dev senior y no decirle ni el dominio del negocio. Va a producir algo. Probablemente no lo que necesitas.

## La spec como contrato

Trato la spec como el contrato entre humano y agente: requisitos, criterios de aceptación, ejemplos de input/output, ADRs relevantes, código a tocar.

## MCP como puente

MCP nos permite exponer la base de conocimiento del proyecto al agente. La spec ya no se pega manualmente en el chat — el agente la consulta cuando la necesita.

```ts
// servidor MCP que expone specs y ADRs
server.tool('get_spec', async ({ id }) => {
  return fs.readFile(`specs/${id}.md`);
});
```

## Human-in-the-loop, siempre

El agente propone. El humano aprueba. La velocidad sube; la responsabilidad no se delega.
