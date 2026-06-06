---
title: "Llevar un RAG a producción sin perder la cabeza"
excerpt: "Lecciones del agente conversacional que construimos sobre LangChain + Weaviate: chunking, citas verificables, evaluaciones y la parte aburrida que nadie cuenta."
category: "IA Aplicada"
tags: ["RAG", "LangChain", "Weaviate"]
pubDate: 2026-05-12
displayDate: "12 May 2026"
readMin: 9
featured: true
cover: rag
heroImage: ../../../assets/images/posts/rag-en-produccion.jpg
heroImageAlt:
  es: "Diagrama del pipeline RAG en producción"
  en: "RAG pipeline diagram in production"
---

Construir un RAG en una notebook es fácil. Construirlo en producción, con usuarios reales preguntando lo impredecible, con documentos que cambian cada semana y con auditoría detrás, es otra cosa.

## Lo que importa antes del modelo

Antes de elegir un modelo o una vector store, decide cómo se ve una buena respuesta. ¿Necesita citas? ¿Debe rechazar cuando no sabe? ¿Cuál es el costo aceptable por consulta?

> Un RAG sin evaluaciones es un demo. Con evaluaciones, es un producto.

## Chunking: el detalle que decide todo

El chunking dicta el 60% de la calidad. Nosotros combinamos chunking semántico con un overlap calibrado y enriquecemos cada chunk con metadata estructurada (sección, fuente, fecha).

```python
def chunk(doc):
    sections = split_by_headings(doc)
    return [
        Chunk(
            text=sec.text,
            meta={
                'source': doc.source,
                'section': sec.title,
                'updated': doc.updated_at,
            },
        )
        for sec in sections
    ]
```

## Citas, no alucinaciones

Cada respuesta del agente trae citas con enlace a la fuente original. Si el modelo no encuentra evidencia, responde 'no tengo información suficiente' antes que inventar. Suena obvio; muy pocos lo hacen bien.

## Evaluación continua

Tenemos un golden set de ~150 preguntas reales. Cada cambio del prompt, del retriever o del modelo se evalúa antes de promover. Sin eso, cualquier cambio es una apuesta.
