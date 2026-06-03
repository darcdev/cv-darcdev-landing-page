---
title: "Monolith → microservices migration: 7 lessons"
excerpt: "What I learned leading the Jackcore migration. Spoiler: the technical part is the easy part."
category: "Architecture"
tags: ["Microservicios", "Arquitectura", ".NET Core"]
pubDate: 2026-03-18
displayDate: "Mar 18, 2026"
readMin: 11
featured: false
cover: arch
---

Migrating a monolith is not just about splitting code. It's about splitting a business, a team and a set of habits.

## 1. Start with capabilities, not services

Identify what your system does that other systems would reuse. Those are your first cross-cutting capabilities.

## 2. Contracts-first

Define contracts before touching code. If contracts are unstable, everything else will be too.

## 3. Centralized authentication, early

It's the piece that touches everything. If you don't centralize it early, every service reinvents the wheel badly.
