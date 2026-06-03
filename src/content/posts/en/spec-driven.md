---
title: "Spec-Driven Development: from prompt to product"
excerpt: "Why writing specs before asking an agent for code totally changes the result — and how we're integrating it with MCP."
category: "AI Workflows"
tags: ["Spec-Driven", "MCP", "DevEx"]
pubDate: 2026-04-28
displayDate: "Apr 28, 2026"
readMin: 7
featured: true
cover: spec
---

Asking an LLM "build this feature" without context is like hiring a senior dev and not telling them the business domain. They'll produce something. Probably not what you need.

## The spec as a contract

I treat the spec as the contract between human and agent: requirements, acceptance criteria, input/output examples, relevant ADRs, code to touch.

## MCP as a bridge

MCP lets us expose the project's knowledge base to the agent. The spec is no longer pasted into chat manually — the agent fetches it when it needs it.

```ts
// MCP server exposing specs and ADRs
server.tool('get_spec', async ({ id }) => {
  return fs.readFile(`specs/${id}.md`);
});
```

## Human-in-the-loop, always

The agent proposes. The human approves. Speed goes up; responsibility is not delegated.
