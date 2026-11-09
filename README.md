<p align="center">
  <a href="https://www.affectui.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./.github/assets/banner-dark.png">
      <source media="(prefers-color-scheme: light)" srcset="./.github/assets/banner-light.png">
      <img alt="affectUI: UI for AI agents. React components for what agents do, and for the rest of your app." src="./.github/assets/banner-light.png" width="100%">
    </picture>
  </a>
</p>

<p align="center">
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-111111?style=flat-square"></a>
  <a href="https://www.affectui.com/docs"><img alt="shadcn registry" src="https://img.shields.io/badge/shadcn-registry-111111?style=flat-square"></a>
  <img alt="React 19" src="https://img.shields.io/badge/React-19-111111?style=flat-square">
  <img alt="40 free items" src="https://img.shields.io/badge/free%20items-40-2f6bff?style=flat-square">
  <a href="https://github.com/flohoeller/affectui/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/flohoeller/affectui?style=flat-square&color=111111"></a>
</p>

<p align="center">
  <a href="https://www.affectui.com"><b>Website</b></a>
  &nbsp;·&nbsp;
  <a href="https://www.affectui.com/components"><b>Browse components</b></a>
  &nbsp;·&nbsp;
  <a href="https://www.affectui.com/docs"><b>Docs</b></a>
  &nbsp;·&nbsp;
  <a href="#install"><b>Install</b></a>
  &nbsp;·&nbsp;
  <a href="https://www.affectui.com/pricing"><b>Pro</b></a>
</p>

**UI for AI agents.** affectUI is a library of React components for what agents do – runs, tool calls, traces, handoffs, approvals and context – and for the rest of your app: inputs, menus, charts, screens, illustrations and motion. Every item is **one `.tsx` file with its styles inside**: no Tailwind, no CSS setup, no animation library. Install it with the shadcn CLI, or let Claude Code, Cursor or Codex add it through the MCP server, and it is source you own.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./.github/assets/trust-dark.png">
    <img alt="Used by developers at Teamworks, RedNote, Cloudforce, Moonshot AI, Terminal49, Meitu and Beacons" src="./.github/assets/trust-light.png" width="100%">
  </picture>
</p>

## Fork: caller-owned chat state

This fork's chat components are copied from `components/` or `screens/`; the
website registry links below still install the upstream release. Classic and
Clean expose matching APIs. Edit `scripts/chat-rail/*.part`, then run
`npm run generate`; do not edit generated TSX files directly.

`AgentThread`, `ChatComposer` and `DecisionDock` accept `managed` (default
`false`). Existing unmanaged previews keep their local/demo behavior.
With `managed`:

- Callbacks emit user intent, not success. Messages, decisions and connection
  come from the caller; omitted thread/dock business data is empty, even when
  `simulate` or sample defaults are supplied.
- Sending does not append a sent message or clear draft/attachments. Answering
  does not remove a decision or append an approval. Stopping does not mark tools
  stopped. Callback Promise completion is **not** business confirmation.
- There is no internal queue/replay, automatic reconnect, simulation, upload or
  transcription. Manual reconnect still emits intent. Built-in voice recording
  is disabled; use a caller-owned toolbar/composer and `ThreadUploads` callbacks.
- Set `busy`/`sendDisabled`, decision `status`/`disabled`, and thread `stopping`
  from application state while waiting. The application owns request deduplication,
  errors and late-event handling.

| Component | Extension contract |
| --- | --- |
| `DecisionDock` | `ThreadDecision.options` is complete and authoritative, including `kind: "approval"`; selecting returns `{ option: originalId }`. Only approval without `options` retains legacy `"approve"`/`"decline"`. No truncation; keys 1–9 select the first nine rows, arrow/Home/End navigation and pointer access reach all rows. |
| `ThreadDecision` | `allowCustomAnswer` defaults to true. `status` is `awaiting` (default), `submitting`, `answered` or `expired`. `submitting`, `expired`, `answered` and `disabled` prevent answers; the caller restores `awaiting` with `error` to retry, or supplies `answered`/`answer` to confirm. |
| `AgentThread` | `stopping` disables Stop and Escape without claiming stopped. `renderMessageContent(message, defaultContent)` replaces the entire body, including parts/tools/attachments; return `defaultContent` to delegate or `null` to hide. The message row ID, role, status, log and scroll ownership remain intact. No Markdown engine is added. |
| `AgentThread.timeline` | Replaces the **entire message timeline** so an existing virtualized list, scrolling provider or anchored Review can retain ownership. `undefined` keeps the default; `null` hides it. The caller owns message rendering, IDs, log/live-region semantics, scrolling, unread markers and jump controls, including End. Thread still reads `messages` for streaming/Stop and retains the connection banner, decision dock and composer. Both screen wrappers forward this slot. |
| `ChatComposer` | `toolbar` replaces **all** built-in controls, menus and Enter-send handling; `undefined` preserves them and `null` hides them. `overlay` sits above the textarea. `textareaProps` merges refs, ARIA, paste/drop and keyboard handlers, but excludes `value`, `defaultValue`, `onChange`; use the existing controlled API. External `onKeyDown` runs first and `preventDefault()` cancels internal Enter. Internal disabled/readOnly cannot be overridden with false. |
| Attachments | `ChatComposerAttachment.size` is optional. An opaque native path can be `id` with `name`, without inventing a `File` or size; browser `File` attachments continue working. |
| `AppShell` | `sidebar` replaces navigation-column content but retains rail/aside/resizer/drawer behavior. `undefined` preserves default navigation, `null` renders no column content. `header` spans above main and panel; null/undefined adds no row. |
| Labels and time | Per-component `labels` cover fixed copy, ARIA and live announcements; dynamic strings use functions. Thread labels contain nested `decisions`, `connection`, `uploads`, `voice`, `away`, `tools`, `task` labels. `formatTime(timestamp)` also formats embedded away summaries; defaults stay English/UTC. No global i18n runtime is required. |
| Screens | `AgentThreadScreen` explicitly forwards thread APIs; `labels` configures Shell and `threadLabels` configures Thread. Its existing `onSend(text, attachments)` signature is unchanged. `AgentChatRailScreen` forwards managed/stopping/content/time/composer APIs and uses the same labels split. |

For example, keep the draft until an application/server event confirms delivery:

```tsx
<AgentThread
  managed
  messages={messages}
  decisions={decisions}
  connection={connection}
  stopping={stopping}
  onSend={requestSend}
  onStop={requestStop}
  onDecide={requestAnswer}
  composerProps={{
    value: draft,
    onValueChange: setDraft,
    attachments,
    onAttachmentsChange: setAttachments,
    busy: sendPending,
  }}
  renderMessageContent={(message, fallback) =>
    messageBodies.get(message.id) ?? fallback
  }
/>
```

Preview caller-owned transitions with `npm run dev` and
`?component=managed-thread&style=clean` (also `managed-dock`, `managed-composer`,
`managed-shell`, `managed-screen`, `managed-rail`, `managed-timeline`; `style=classic`, `theme=dark`).
Fixture controls separate transport completion from Confirm/Fail actions. Run
`npm test` and `npm run build` for the generated, type and browser contracts.

## Showcase

Agent components, recorded live from [affectui.com](https://www.affectui.com). Items marked <sup>Pro</sup> are part of [affectUI Pro](https://www.affectui.com/pricing) and are not in this repository; everything else installs from here for free.

<table>
<tr>
<td width="50%" valign="top">
<a href="https://www.affectui.com/components/agent-tree"><picture>
<source media="(prefers-color-scheme: dark)" srcset="./.github/assets/showcase/agent-tree-dark.webp">
<img alt="Agent Tree: Who started whom – an orchestrator and its sub-agents as a live tree, with status, cost and time on every card, costs rolling up each branch, and branches that fold to one line" src="./.github/assets/showcase/agent-tree-light.webp" width="100%">
</picture></a>
<br><a href="https://www.affectui.com/components/agent-tree"><b>Agent Tree</b></a> <sup><a href="https://www.affectui.com/pricing">Pro</a></sup><br>
<sub>Who started whom</sub>
</td>
<td width="50%" valign="top">
<a href="https://www.affectui.com/components/tool-call-card"><picture>
<source media="(prefers-color-scheme: dark)" srcset="./.github/assets/showcase/tool-call-card-dark.webp">
<img alt="Tool Call Card: An agent's tool call in one line – live timer, status and summary, folds open to highlighted arguments and result with copy, retry on errors and a group that sums them up" src="./.github/assets/showcase/tool-call-card-light.webp" width="100%">
</picture></a>
<br><a href="https://www.affectui.com/components/tool-call-card"><b>Tool Call Card</b></a><br>
<sub>An agent's tool call in one line</sub>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<a href="https://www.affectui.com/components/trace-waterfall"><picture>
<source media="(prefers-color-scheme: dark)" srcset="./.github/assets/showcase/trace-waterfall-dark.webp">
<img alt="Trace Waterfall: Where the time and money of an agent run go – every LLM call, tool call and sub-agent as a bar on a live timeline, with tokens and cost per step, the slowest call marked and branches that fold into their parent" src="./.github/assets/showcase/trace-waterfall-light.webp" width="100%">
</picture></a>
<br><a href="https://www.affectui.com/components/trace-waterfall"><b>Trace Waterfall</b></a> <sup><a href="https://www.affectui.com/pricing">Pro</a></sup><br>
<sub>Where the time and money of an agent run go</sub>
</td>
<td width="50%" valign="top">
<a href="https://www.affectui.com/components/decision-inbox"><picture>
<source media="(prefers-color-scheme: dark)" srcset="./.github/assets/showcase/decision-inbox-dark.webp">
<img alt="Decision Inbox: Open decisions with two quick answers each – answered ones confirm and fold away" src="./.github/assets/showcase/decision-inbox-light.webp" width="100%">
</picture></a>
<br><a href="https://www.affectui.com/components/decision-inbox"><b>Decision Inbox</b></a><br>
<sub>Open decisions with two quick answers each</sub>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<a href="https://www.affectui.com/components/agent-inbox"><picture>
<source media="(prefers-color-scheme: dark)" srcset="./.github/assets/showcase/agent-inbox-dark.webp">
<img alt="Agent Inbox: All your background agent tasks in one calm list – live clocks and status tags, filter tabs with rolling counts, rows that unfold to the last steps with Approve, Reject, Retry or Open, and glide to their new place" src="./.github/assets/showcase/agent-inbox-light.webp" width="100%">
</picture></a>
<br><a href="https://www.affectui.com/components/agent-inbox"><b>Agent Inbox</b></a> <sup><a href="https://www.affectui.com/pricing">Pro</a></sup><br>
<sub>All your background agent tasks in one calm list</sub>
</td>
<td width="50%" valign="top">
<a href="https://www.affectui.com/components/thinking-loader"><picture>
<source media="(prefers-color-scheme: dark)" srcset="./.github/assets/showcase/thinking-loader-dark.webp">
<img alt="Thinking Loader: A small working pill for AI replies – an eight-ray spinner and a shimmering label that rolls through phases and settles on a check" src="./.github/assets/showcase/thinking-loader-light.webp" width="100%">
</picture></a>
<br><a href="https://www.affectui.com/components/thinking-loader"><b>Thinking Loader</b></a><br>
<sub>A small working pill for AI replies</sub>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<a href="https://www.affectui.com/components/context-map"><picture>
<source media="(prefers-color-scheme: dark)" srcset="./.github/assets/showcase/context-map-dark.webp">
<img alt="Context Map: What fills an agent's context window, as a living treemap – system prompt, tools, memory, every file, the chat and tool results as tiles that glide as it grows, the free space dashed, and compaction squeezing old turns into a summary" src="./.github/assets/showcase/context-map-light.webp" width="100%">
</picture></a>
<br><a href="https://www.affectui.com/components/context-map"><b>Context Map</b></a> <sup><a href="https://www.affectui.com/pricing">Pro</a></sup><br>
<sub>What fills an agent's context window, as a living treemap</sub>
</td>
<td width="50%" valign="top">
<a href="https://www.affectui.com/components/agent-handoff"><picture>
<source media="(prefers-color-scheme: dark)" srcset="./.github/assets/showcase/agent-handoff-dark.webp">
<img alt="Agent Handoff: A task passed from agent to agent like a relay – at every handoff what went along to the next one, and what got lost on the way" src="./.github/assets/showcase/agent-handoff-light.webp" width="100%">
</picture></a>
<br><a href="https://www.affectui.com/components/agent-handoff"><b>Agent Handoff</b></a> <sup><a href="https://www.affectui.com/pricing">Pro</a></sup><br>
<sub>A task passed from agent to agent like a relay</sub>
</td>
</tr>
</table>

## Contents

- [Local double-sidebar chat screen](./screens/README.md) — Classic and Clean recreations, independently copyable components, a local preview and browser checks.
- [Local Agent / Thread screen](./screens/agent-thread.md) — Orchestrator conversation, decisions, task details, offline recovery, uploads and away summaries, with Classic and Clean components.
- [Local Agent / Tasks screen](./screens/agent-tasks.md) — Project groups, keyboard task navigation, inline creation, task inspection and editable artifact tabs, with Classic and Clean components.
- [Local Agent / Inbox screen](./screens/inbox.md) — Decision queue, visual picks, approvals, free answers, sent feedback and task/artifact context, with Classic and Clean components.
- [Local AI Chat / Overview screen](./screens/assistant-overview.md) — Start page with composer, activity grid, recent chats, usage, files made and monthly trends, with Classic and Clean components.
- [Why affectUI](#why-affectui)
- [Choose the UI for your workflow](#choose-the-ui-for-your-workflow)
- [Install](#install)
- [Usage](#usage)
- [Use it with AI tools](#use-it-with-ai-tools)
- [Components](#components)
- [Blocks](#blocks)
- [Illustrations](#illustrations)
- [Motion](#motion)
- [affectUI Pro](#affectui-pro)
- [Contributing](#contributing)
- [License](#license)

## Why affectUI

- **Made for agents.** Components for what agents actually do: trees of sub-agents, tool calls, traces with cost per step, handoffs, approvals and the context window – live states, not static mockups.
- **Agent-ready.** An MCP server and `llms.txt` let Claude Code, Cursor, Codex or v0 find and add items for you.
- **One file each.** Every component is a single `.tsx` file with its styles inside. Nothing to configure, no CSS framework required.
- **Motion that feels finished.** Morphs, staggered reveals, rolling numbers and smooth state changes, and all of it respects `prefers-reduced-motion`.
- **Dark mode built in.** Each item switches when an ancestor has the class `dark` or `data-theme="dark"`.
- **Accessible by default.** Real buttons, labels, keyboard support and live regions where they matter.
- **Responsive.** Container queries, so items adapt to the space they get, not just the window.

## Choose the UI for your workflow

affectUI is the presentation layer of an AI product. Your application supplies runtime data, connects tools and enforces permissions; the components render that state and expose callbacks for your actions.

- **Agent UI:** task plans, run progress, decisions and outcomes for delegated work. Start with the [Agent UI guide](https://www.affectui.com/guides/agent-ui-react) or the [agent dashboard guide](https://www.affectui.com/guides/agent-dashboard-react).
- **AI chat UI:** composers, streaming answers, citations and reply actions. Read [React components for AI chat](https://www.affectui.com/guides/ai-chat-ui-components-react).
- **Human in the loop:** review a proposed action and its target before the backend executes it. Read [approvals and permissions](https://www.affectui.com/guides/human-in-the-loop-ui).
- **Tool-call UI:** make tool activity, results and failures readable. Read [tool calls in an agent UI](https://www.affectui.com/guides/tool-calls-agent-ui).
- **MCP UI:** present tools connected through MCP. The protocol connection and the finished interface are separate concerns; see the [MCP UI guide](https://www.affectui.com/guides/mcp-ui-react). The affectUI MCP server below helps coding assistants discover and install components.
- **Generative UI:** map model-selected tools and validated data to known React views. Read [generative UI in React](https://www.affectui.com/guides/generative-ui-react), including fallback states and why this does not require executing arbitrary generated code.

Browse all [guides](https://www.affectui.com/guides), follow the [AI setup docs](https://www.affectui.com/docs/ai), or [compare UI libraries](https://www.affectui.com/compare) to choose the pieces that fit your application.

## Install

### Requirements

- **React 19**, with or without TypeScript
- Any React setup: Next.js, Vite, Remix or plain React
- The `@/*` import alias if you use the shadcn CLI (Next.js and shadcn set it up by default)

### With the shadcn CLI

Every item has its own registry URL. Run the command from its page on [affectui.com](https://www.affectui.com) or from the tables below:

```bash
npx shadcn@latest add https://www.affectui.com/r/reaction-bar.json
```

The file lands in `components/ui`, ready to import.

Prefer short names? Register the namespace once in `components.json`:

```json
{
  "registries": {
    "@affectui": "https://www.affectui.com/r/{name}.json"
  }
}
```

```bash
npx shadcn@latest add @affectui/reaction-bar
```

### Copy and paste

Open the item's folder in this repository (`components/`, `illustrations/` or `motion/`), copy the file into your project and import it. That's all it takes.

## Usage

```tsx
import { ReactionBar } from "@/components/ui/reaction-bar";

export function PostActions({ post }) {
  return (
    <ReactionBar
      reactions={{ like: { count: post.likes, active: post.liked }, comment: { count: post.comments } }}
      onReact={(key, state) => api.react(post.id, key, state.active)}
    />
  );
}
```

Props, keyboard support and accessibility notes for every item are on its page, e.g. [Reaction Bar](https://www.affectui.com/components/reaction-bar).

## Use it with AI tools

affectUI is agent-ready. Connect the **MCP server** once and Claude Code, Cursor, VS Code or Codex can search every item, read its docs and add it for you:

```bash
claude mcp add --transport http affectui https://www.affectui.com/api/mcp
```

Other clients: add `{ "mcpServers": { "affectui": { "url": "https://www.affectui.com/api/mcp" } } }` to their MCP config. Without any setup, point your assistant at [`llms.txt`](https://www.affectui.com/llms.txt) or [`llms-full.txt`](https://www.affectui.com/llms-full.txt). Every page on affectui.com also has a **Copy prompt** bar for Claude, ChatGPT / Codex, Cursor and v0. Setup details: [Using with AI](https://www.affectui.com/docs/ai).

## Components

| Name | What it is | Install |
| --- | --- | --- |
| [Button](https://www.affectui.com/components/button) | Primary, secondary, ghost and destructive buttons with icons, sizes and a shimmering loading state | `npx shadcn@latest add https://www.affectui.com/r/button-clean.json`<br><sub>Classic style: `npx shadcn@latest add https://www.affectui.com/r/button.json`</sub> |
| [Change Summary](https://www.affectui.com/components/change-summary) | What moved since last time | `npx shadcn@latest add https://www.affectui.com/r/change-summary-clean.json`<br><sub>Classic style: `npx shadcn@latest add https://www.affectui.com/r/change-summary.json`</sub> |
| [Comment Thread](https://www.affectui.com/components/comment-thread) | One comment with replies | `npx shadcn@latest add https://www.affectui.com/r/comment-thread-clean.json`<br><sub>Classic style: `npx shadcn@latest add https://www.affectui.com/r/comment-thread.json`</sub> |
| [Decision Inbox](https://www.affectui.com/components/decision-inbox) | Open decisions with two quick answers each | `npx shadcn@latest add https://www.affectui.com/r/decision-inbox-clean.json`<br><sub>Classic style: `npx shadcn@latest add https://www.affectui.com/r/decision-inbox.json`</sub> |
| [Email Draft](https://www.affectui.com/components/email-draft) | Agent-written email for review | `npx shadcn@latest add https://www.affectui.com/r/email-draft-clean.json`<br><sub>Classic style: `npx shadcn@latest add https://www.affectui.com/r/email-draft.json`</sub> |
| [Filter Menu](https://www.affectui.com/components/filter-menu) | Grouped filters with removable chips, collapsible checkbox groups, Clear all and full keyboard control | `npx shadcn@latest add https://www.affectui.com/r/filter-menu-clean.json`<br><sub>Classic style: `npx shadcn@latest add https://www.affectui.com/r/filter-menu.json`</sub> |
| [Message Actions](https://www.affectui.com/components/message-actions) | The quiet bar under an AI message | `npx shadcn@latest add https://www.affectui.com/r/message-actions-clean.json`<br><sub>Classic style: `npx shadcn@latest add https://www.affectui.com/r/message-actions.json`</sub> |
| [Notification Stack](https://www.affectui.com/components/notification-stack) | Notice cards stacked behind each other | `npx shadcn@latest add https://www.affectui.com/r/notification-stack-clean.json`<br><sub>Classic style: `npx shadcn@latest add https://www.affectui.com/r/notification-stack.json`</sub> |
| [OTP Input](https://www.affectui.com/components/otp-input) | The verification code field done right | `npx shadcn@latest add https://www.affectui.com/r/otp-input-clean.json`<br><sub>Classic style: `npx shadcn@latest add https://www.affectui.com/r/otp-input.json`</sub> |
| [Profile Menu](https://www.affectui.com/components/profile-menu) | Account card with the signed-in user, menu actions and profile setup progress | `npx shadcn@latest add https://www.affectui.com/r/profile-menu-clean.json`<br><sub>Classic style: `npx shadcn@latest add https://www.affectui.com/r/profile-menu.json`</sub> |
| [Progress Tracker](https://www.affectui.com/components/progress-tracker) | Onboarding checklist with an animated progress bar, ticks that draw themselves and auto play | `npx shadcn@latest add https://www.affectui.com/r/progress-tracker-clean.json`<br><sub>Classic style: `npx shadcn@latest add https://www.affectui.com/r/progress-tracker.json`</sub> |
| [Reaction Bar](https://www.affectui.com/components/reaction-bar) | Like, comment, repost and share in one pill | `npx shadcn@latest add https://www.affectui.com/r/reaction-bar-clean.json`<br><sub>Classic style: `npx shadcn@latest add https://www.affectui.com/r/reaction-bar.json`</sub> |
| [Segmented Control](https://www.affectui.com/components/segmented-control) | Switch between two to six options | `npx shadcn@latest add https://www.affectui.com/r/segmented-control-clean.json`<br><sub>Classic style: `npx shadcn@latest add https://www.affectui.com/r/segmented-control.json`</sub> |
| [Smart Recommendation](https://www.affectui.com/components/smart-recommendation) | Suggestion card with a confidence signal, alternatives to switch to and accept with undo | `npx shadcn@latest add https://www.affectui.com/r/smart-recommendation-clean.json`<br><sub>Classic style: `npx shadcn@latest add https://www.affectui.com/r/smart-recommendation.json`</sub> |
| [Thinking Loader](https://www.affectui.com/components/thinking-loader) | A small working pill for AI replies | `npx shadcn@latest add https://www.affectui.com/r/thinking-loader-clean.json`<br><sub>Classic style: `npx shadcn@latest add https://www.affectui.com/r/thinking-loader.json`</sub> |
| [Tips Panel](https://www.affectui.com/components/tips-panel) | Grid of short tips with one action each | `npx shadcn@latest add https://www.affectui.com/r/tips-panel-clean.json`<br><sub>Classic style: `npx shadcn@latest add https://www.affectui.com/r/tips-panel.json`</sub> |
| [Tool Call Card](https://www.affectui.com/components/tool-call-card) | An agent's tool call in one line | `npx shadcn@latest add https://www.affectui.com/r/tool-call-card-clean.json`<br><sub>Classic style: `npx shadcn@latest add https://www.affectui.com/r/tool-call-card.json`</sub> |

## Blocks

| Name | What it is | Install |
| --- | --- | --- |
| [Logo Marquee](https://www.affectui.com/blocks/logo-marquee) | The endless “Trusted by” strip | `npx shadcn@latest add https://www.affectui.com/r/logo-marquee-clean.json`<br><sub>Classic style: `npx shadcn@latest add https://www.affectui.com/r/logo-marquee.json`</sub> |
| [Testimonial Wall](https://www.affectui.com/blocks/testimonial-wall) | The landing-page wall of quotes | `npx shadcn@latest add https://www.affectui.com/r/testimonial-wall-clean.json`<br><sub>Classic style: `npx shadcn@latest add https://www.affectui.com/r/testimonial-wall.json`</sub> |

## Illustrations

| Name | What it is | Install |
| --- | --- | --- |
| [Agent Team](https://www.affectui.com/illustrations/agent-team) | A prompt types itself and branches out into three agents, each with a role and overlapping tool logos | `npx shadcn@latest add https://www.affectui.com/r/agent-team.json` |
| [Cover Flow](https://www.affectui.com/illustrations/cover-flow) | Browse covers in 3D | `npx shadcn@latest add https://www.affectui.com/r/cover-flow.json` |
| [DACH Region](https://www.affectui.com/illustrations/region-dach) | DACH map with fading neighbours and a pastel band along the border, switchable to the US, China, India, Brazil or Japan | `npx shadcn@latest add https://www.affectui.com/r/region-dach.json` |
| [Empty Calendar](https://www.affectui.com/illustrations/empty-calendar) | Stack of calendar cards marked empty, fanning out on hover | `npx shadcn@latest add https://www.affectui.com/r/empty-calendar.json` |
| [Enrichment Orbit](https://www.affectui.com/illustrations/enrichment-orbit) | Grok tile inside two rings with comets and data nodes orbiting around it | `npx shadcn@latest add https://www.affectui.com/r/enrichment-orbit.json` |
| [Frost Cloud](https://www.affectui.com/illustrations/frost-cloud) | A frosted white cloud with eyes cut out of it, on a blue or red-orange sky | `npx shadcn@latest add https://www.affectui.com/r/frost-cloud.json` |
| [Ghosted Chat](https://www.affectui.com/illustrations/ghosted-chat) | Unanswered chat messages marked as read, with a thumbs-down reply on hover | `npx shadcn@latest add https://www.affectui.com/r/ghosted-chat.json` |
| [Glow Cloud](https://www.affectui.com/illustrations/glow-cloud) | A glowing cloud with eyes in red-orange or blue | `npx shadcn@latest add https://www.affectui.com/r/glow-cloud.json` |
| [Integration Beam](https://www.affectui.com/illustrations/integration-beam) | Your product between the tools it connects | `npx shadcn@latest add https://www.affectui.com/r/integration-beam.json` |
| [Integration Grid](https://www.affectui.com/illustrations/integration-grid) | Honeycomb-like wall of integration logos around a bright centre tile with your product mark, fading out toward the edges | `npx shadcn@latest add https://www.affectui.com/r/integration-grid.json` |
| [Layer Stack](https://www.affectui.com/illustrations/layer-stack) | Isometric stack of five layers with a list beside it | `npx shadcn@latest add https://www.affectui.com/r/layer-stack.json` |
| [Lead Sourcing](https://www.affectui.com/illustrations/lead-sourcing) | ChatGPT tile linked to Gmail and Grok, with a shine running along the connection | `npx shadcn@latest add https://www.affectui.com/r/lead-sourcing.json` |
| [Logo Cluster](https://www.affectui.com/illustrations/logo-cluster) | Your mark on a white disc in the middle | `npx shadcn@latest add https://www.affectui.com/r/logo-cluster.json` |
| [Model Wheel](https://www.affectui.com/illustrations/model-wheel) | AI model names on a turning drum | `npx shadcn@latest add https://www.affectui.com/r/model-wheel.json` |
| [Side Folder](https://www.affectui.com/illustrations/side-folder) | Glassy blue folder on its side, documents sliding out to the right as the pocket swings open on hover | `npx shadcn@latest add https://www.affectui.com/r/side-folder.json` |
| [Tab Overload](https://www.affectui.com/illustrations/tab-overload) | Overlapping browser windows where the highlight follows the hovered tab | `npx shadcn@latest add https://www.affectui.com/r/tab-overload.json` |
| [Team Invite](https://www.affectui.com/illustrations/team-invite) | Connected teammates | `npx shadcn@latest add https://www.affectui.com/r/team-invite.json` |

## Motion

| Name | What it is | Install |
| --- | --- | --- |
| [Grid Background](https://www.affectui.com/motion/grid-background) | A fine line grid that drifts slowly behind your content and fades out towards the edges | `npx shadcn@latest add https://www.affectui.com/r/grid-background.json` |
| [Number Ticker](https://www.affectui.com/motion/number-ticker) | Odometer-style numbers | `npx shadcn@latest add https://www.affectui.com/r/number-ticker.json` |
| [Shimmer Loader](https://www.affectui.com/motion/shimmer-loader) | Skeleton blocks that share one soft light sweep, plus shimmering text for “Thinking…” states | `npx shadcn@latest add https://www.affectui.com/r/shimmer-loader.json` |
| [Text Reveal](https://www.affectui.com/motion/text-reveal) | Text that arrives word by word or letter by letter | `npx shadcn@latest add https://www.affectui.com/r/text-reveal.json` |

## affectUI Pro

119 more components, screens, blocks and illustrations, including the agent components above (Agent Tree, Agent Inbox, Trace Waterfall, Context Map, Agent Handoff and more), full app screens and blocks, are part of [affectUI Pro](https://www.affectui.com/pricing): a one-time purchase with lifetime updates. Their source is not in this repository.

## Contributing

Found a bug or missing a component? [Open an issue](https://github.com/flohoeller/affectui/issues/new/choose). The files here are synced from the affectUI source on every release, so fixes land through issues rather than pull requests. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

Everything in this repository is released under the [MIT license](./LICENSE). Use it in personal and commercial projects.
Logos shown in previews belong to their owners and are only sample content.

---

<div align="center">

If affectUI saves you time, a ⭐ helps others find it.

Made by [Flo](https://x.com/flohoeller)

</div>
