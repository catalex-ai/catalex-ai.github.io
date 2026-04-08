# CatalEx Landing Page — Content Design

**Date:** 2026-04-08
**Status:** Approved (content), pending implementation plan
**Scope:** Full content rewrite of `index.html` (homepage section). No changes to forms, vision page, or backend.

---

## 1. Goals

The landing page exists to do two things at once:
1. **Make a visitor curious** about what CatalEx is and what it does.
2. **Make a visitor feel** that CatalEx is built for someone like them.

It must drive two CTAs of equal weight:
- **Book a Demo** (sales-led, enterprise motion)
- **Try CatalEx** (self-serve, console access)

## 2. Audience

- **Primary:** Product leaders (Head of Product / VP Product) and CEOs/founders at product-led mid-market companies (200–2,000 employees). They feel the pilot-to-production gap and own the AI-native mandate.
- **Secondary:** Builders — PMs, eng leads, ops leads who would actually deploy the first agent. They care about "in minutes, not weeks" and tool fit.

Every line is written *to* the primary audience, with proof points the secondary audience can latch onto.

## 3. Narrative Spine

**The agent that actually ships** — wrapped in a **one-stop solution for every AI need** frame.

CatalEx is the central platform for any way a company wants to use AI: embedded in their product, talked to directly, or working alongside humans as virtual employees. The page leads with the product, supports it with how it works, and only late in the page invokes the "95% of AI fails" contrast as a *why we exist* moment — never as the page's thesis.

## 4. Voice

- **Dominant register:** editorial and considered — short paragraphs with rhythm and a point of view (Stripe / Notion-grade).
- **Headline register:** confident and declarative (Linear / Vercel-grade).
- **Punctuation moments:** manifesto-like opinion at §7 (the contrast beat).
- **Constraint:** keep prose tight. Never write a wall of text. Each section is one headline + a short lede + small structural elements.

## 5. Proof Posture

Vision-led with marked placeholder slots. We have a 20+ pre-built role catalogue we can list as ambient texture (never as a customer logo wall). All metric numbers shown in mock cards are clearly placeholder; spec marks every slot the marketing team can later fill with real data.

## 6. Visual Treatment (cross-section)

A signature ambient layer of **conversation-style mock UI cards** drifts behind the hero, the modes section, and the virtual-employees section. Cards are:
- Low opacity (8–14%)
- Slightly blurred at the edges
- Drifting slowly (subtle parallax or CSS keyframes)
- Never positioned where they compete with type

Cards include: a Slack-style thread, an agent reply, a "task completed" toast, a metrics tile, a post-meeting follow-up card. Mock data uses real-feeling names (Rina, Joe, Cindy — never Alex/John/Sarah).

The current style system (Fraunces display, IBM Plex Mono accents, Inter body, ink/paper/teal palette, hairline editorial frame) is preserved as-is.

The typewriter animation in the hero is preserved as-is.

---

## 7. Section Architecture

```
1.  Hero
2.  Tool strip ("lives in your tools")
3.  Three ways to deploy an agent
4.  Virtual Employees
5.  Why CatalEx agents actually ship
6.  Built to scale. Built to save.
7.  Why most AI never reaches production (contrast beat)
8.  Trust & governance
9.  Closing CTA
```

---

## §1 — Hero

**Eyebrow (mono):** `CATALEX  /  THE AI AGENT PLATFORM`

**Headline:**
> One agent platform.
> Every way your company *needs to use AI.*

The italic line is the typewriter slot. Rotation:
- *needs to use AI.*
- *talks to its tools.*
- *gets work done.*

**Subheading:**
> CatalEx is the one place to build, deploy and run AI agents — embedded in your product, talking to your team, or working alongside them as virtual employees. Connected to your knowledge, your tools, and your business.

**CTAs:** `Book a Demo` (primary, ink) · `Try CatalEx` (secondary, hairline)

**Visual:** 3–4 conversation-mock cards drifting at low opacity behind the type.

---

## §2 — Tool Strip

**Caption (mono, small, no header):** `LIVES IN THE TOOLS YOU ALREADY USE`

**Logos (grayscale, hairline-spaced):** Slack · Google Drive · Microsoft Teams · Notion · Jira · GitHub · Confluence

One line. No section frame. A quiet trust band, then the page moves on.

---

## §3 — Three Ways to Deploy an Agent

**Section eyebrow (mono):** `§ 03  /  THREE MODES`

**Headline:**
> Pick the agent shape that fits the work.

### 01 / EMBED — *Agents inside your product.*
Call CatalEx agents from your code. They run at the edge of your application, scale with your traffic, and ship features your users feel. Built for engineering teams putting agents into production.

### 02 / CHAT — *Talk to your agents like they work for you.*
A natural-language interface to every agent in your company. Ask questions across your knowledge and tools, and reshape what an agent does mid-flight — extend its scope, hand it new instructions, retire a task — without touching code. Production agents that change as your business changes.

### 03 / VIRTUAL EMPLOYEE — *Make every person on your team the lead of their own AI assistants.*
Always-on agents that take a role, sit in the same tools your team uses, and learn from how each person actually works. They act proactively within your guardrails — turning every employee into a manager of AI, and your whole company into an AI-native one.

**Visual:** ambient conversation-mock cards drift behind cards 02 and 03 (an agent reply card, a "task assigned to @analyst-agent" card).

---

## §4 — Virtual Employees

**Section eyebrow (mono):** `§ 04  /  VIRTUAL EMPLOYEES`

**Headline:**
> Hire your first AI teammate before lunch.

**Lede:**
> Every person on your team gets their own AI assistants — pick from a library of pre-built roles, or shape your own. They live in the tools you already use, learn the way *you* actually work, and pick up where you left off.

### A library of roles, ready on day one.
A growing catalogue of pre-built employees — analyst, SDR, support, ops, researcher, recruiter, and more — each one shaped by best practices for the role. Or define a new one in plain language.

### They learn from the person they work for.
Your assistants watch how you write, decide, escalate, and close the loop. They sound like you, and act like a teammate who's been at your side for years. They keep learning as your business and your work evolve — supercharging every person's personal productivity.

### Proactive, never unsupervised.
They watch for signals across your knowledge and tools and step in before being asked. Every action runs inside guardrails you set — what they can do, what they need approval for, what they can never touch.

**Visual — ambient role chip cloud (low opacity, drifting):**
> Analyst · SDR · Support Lead · Recruiter · Researcher · Ops · Finance Analyst · Customer Success · QA · Onboarding Buddy · Pricing Analyst · Data Steward · Procurement · Legal Reviewer …

**Visual — ambient post-meeting card:**
> *Rina just left "Q3 planning sync."*
> Drafting follow-up notes · Filing 4 action items in Linear · Pinging Joe for the pricing input · Booking the next review for Thursday
> `[ Approve all ]   [ Review ]`

**Visual — second ambient assistant card:**
> *Cindy's assistant • 9:42*
> "Saw the support ticket spike from yesterday's release. Drafted a postmortem outline — want me to share it with the team?"

Cards are uncaptioned. The reader infers what's happening. Names: Rina, Joe, Cindy.

---

## §5 — Why CatalEx Agents Actually Ship

**Section eyebrow (mono):** `§ 05  /  THE PLATFORM UNDERNEATH`

**Headline:**
> Built so agents make it to production — and stay there.

**Lede:**
> The boring, hard parts of running agents in production — handled, so your agents don't break the day they meet real users.

### Memory that persists.
Every agent carries its own context — what it's done, what it knows, what it's been told. No more amnesiac chatbots restarting from zero on every turn.

### Self-correction in the loop.
Agents measure their own outputs against the outcome they were built for, catch their mistakes, and course-correct mid-run instead of confidently failing.

### Metrics the agent picks for itself.
When you create an agent, it reads its own purpose and chooses the business metrics it should track — claim pass rate, ticket deflection, lead conversion, whatever the role demands. The metrics evolve with the agent: tell it in chat to start tracking something new, and it does.

### Isolated by default.
Every agent runs in its own protected environment. No shared state, no collateral damage, no surprises in production.

**Visual — ambient business-metric card (clearly mock):**
> *@claims-agent · live*
> `claim pass rate · 84%` (`▲ 6 pts wow`)
> `avg resolution time · 2.1d` (`▼ 0.4d`)
> `escalations avoided · 312`

---

## §6 — Built to Scale. Built to Save.

**Section eyebrow (mono):** `§ 06  /  INFRASTRUCTURE`

**Headline:**
> The infrastructure tax, paid for you.

**Lede:**
> Running agents in production is where most teams hit a wall — token bills that don't make sense, latency that ruins the demo, traffic that breaks on launch day. CatalEx absorbs all of it, so you ship without becoming an infra team.

### Built to scale.
From one agent to ten thousand, the runtime stretches with you. Concurrent execution, isolated workloads, no babysitting. Launch day looks like every other day.

### Built to save.
CatalEx watches your agents work and finds the parts worth caching. When an agent figures out *how* to do something — by writing code and running it — we cache that code, learn its parameters, and re-run it directly the next time. No context replay, no re-reasoning, no token bill. A smart router picks the right model for each action and caches that decision too. Most teams see token costs drop by up to 90% without changing a line.

**Visual:** an ambient cost-comparison strip — two thin horizontal bars labeled "naive setup" and "on CatalEx." Second bar visibly shorter. No exact numbers, just the shape of the gap.

---

## §7 — Why Most AI Never Reaches Production

**Section eyebrow (mono):** `§ 07  /  WHY WE EXIST`

**Headline:**
> 95% of AI projects never make it to production.

**Body (set wide and quiet, like a pull-quote):**
> They get stuck in pilots. They drift from the metric. They break the moment they meet real traffic. They never learn from the people they were built for.
>
> CatalEx is the platform that fixes the reasons — not the symptoms.

**Visual:** no card mocks. Generous whitespace. A single hairline rule above and below. The number `95%` set large in italic Fraunces as a subtle background watermark. The page breathes here — its only pause before the closing CTA.

---

## §8 — Trust & Governance

**Section eyebrow (mono):** `§ 08  /  TRUST`

**Headline:**
> Safe for the industries that can't afford mistakes.

**Lede:**
> Built for teams whose agents touch regulated data, customer money, or production systems.

**Four-up strip, mono labels, hairline rule between:**

- `ROLE-BASED ACCESS` — Every agent, every action, scoped to who's allowed to see and do what.
- `FULL AUDIT TRAIL` — Every decision, every tool call, every approval — recorded and queryable.
- `ON-PREM & IN-REGION` — Deploy in your cloud, your region, your VPC. Your data never leaves.
- `HUMAN-IN-THE-LOOP` — Define the actions that need approval. Agents wait, humans confirm.

**Visual:** none. Type on paper. Trust is communicated through restraint.

---

## §9 — Closing CTA

**Section eyebrow (mono):** `§ 09  /  START`

**Headline (large, italic Fraunces):**
> Become AI-native.
> Start this afternoon.

**Sub-line:**
> Book a 20-minute walkthrough, or spin up your first agent in the console right now.

**CTAs:** `Book a Demo` (primary, ink, with arrow) · `Try CatalEx` (secondary)

**Caption (mono, tiny):** `NO CARD REQUIRED  ·  FIRST AGENT IN MINUTES`

**Visual:** soft teal radial glow behind the headline — the page closes the way it opened.

---

## 8. Out of Scope

- Backend or routing changes
- The forms / get-started flow
- The vision page (deprecated, nav link already removed)
- New fonts or palette additions beyond the existing Fraunces / IBM Plex Mono / Inter system
- Real customer logos, real metrics, real testimonials — every numeric or attributable value on the page is a clearly marked placeholder

## 9. Implementation Notes (handoff to writing-plans)

The implementation plan should cover:

1. **HTML restructure** of the homepage section in `index.html` to match the 9-section spine. Existing IDs preserved where they map (`#use-cases` → §3, `#features` → §5 or §6).
2. **CSS additions** for: ambient mock cards (positioning, blur, opacity, drift animation), the role-chip cloud, the §7 watermark, the cost-comparison strip, the §9 closing glow.
3. **Mock card components** — small reusable HTML/CSS card primitives for: Slack-thread card, agent-reply card, post-meeting follow-up, assistant proactive nudge, business-metric tile, generic toast.
4. **Drift animation** — CSS-only, prefers-reduced-motion respected. No JS dependency.
5. **Content slot markers** — every placeholder number/role/name lives in a single `<span class="slot">` style class so the marketing team can find and replace them without hunting.
6. **No changes** to: typewriter script, demo modal, routing, forms, footer links, fonts loaded.
