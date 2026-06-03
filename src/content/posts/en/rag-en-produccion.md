---
title: "Bringing a RAG to production without losing your mind"
excerpt: "Lessons from the conversational agent we built on LangChain + Weaviate: chunking, verifiable citations, evaluations and the boring part nobody talks about."
category: "Applied AI"
tags: ["RAG", "LangChain", "Weaviate"]
pubDate: 2026-05-12
displayDate: "May 12, 2026"
readMin: 9
featured: true
cover: rag
---

Building a RAG in a notebook is easy. Building it in production, with real users asking the unpredictable, with documents that change every week and audit behind, is something else.

## What matters before the model

Before you choose a model or a vector store, decide what a good answer looks like. Does it need citations? Should it refuse when it doesn't know? What's the acceptable cost per query?

> A RAG without evaluations is a demo. With evaluations, it's a product.

## Chunking: the detail that decides everything

Chunking dictates 60% of quality. We combine semantic chunking with calibrated overlap and enrich each chunk with structured metadata (section, source, date).

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

## Citations, not hallucinations

Every answer from the agent comes with citations linked to the original source. If the model finds no evidence, it answers "I don't have enough information" rather than making things up. Sounds obvious; very few do it well.

## Continuous evaluation

We have a golden set of ~150 real questions. Every prompt, retriever or model change is evaluated before being promoted. Without that, any change is a bet.
