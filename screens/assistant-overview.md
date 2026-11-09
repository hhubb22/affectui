# AI Chat / Overview

Recreates [AI Chat / Overview](https://www.affectui.com/screens/assistant-overview), the start page of an AI workspace with your numbers under the composer. Layout, styles and the activity grid's interactions were recorded with the sibling `anim-recorder` project and compared against this implementation. The files follow [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md).

Run `npm run dev` and open `/?screen=assistant-overview`. Add `&style=classic`, `&theme=dark` or `&layout=flat`. The cards alone are at `/?component=overview-cards`.

```tsx
import { AssistantOverviewScreen } from "./screens/assistant-overview-clean";

export default function Page() {
  return (
    <div style={{ height: "100dvh" }}>
      <AssistantOverviewScreen
        workspace="Acme"
        user={{ name: "Alex Morgan" }}
        onSend={(text, options) => startChat(text, options)}
        onNavigate={(label) => navigate(label)}
      />
    </div>
  );
}
```

Use `assistant-overview.tsx` for Classic. Every file imports only React and embeds its SVGs and scoped CSS.

## Components

| File | Exports | Role |
| --- | --- | --- |
| `overview-cards` | `OverviewCards` | Activity grid with tip and keyboard, recent chats, usage meter, files made, this month with trends |
| `assistant-overview` | `AssistantOverviewScreen` | App shell, start heading, composer with folder/app tray, the cards and a work-area tab |
| `chat-composer` | `ChatComposer` | Input, model and permission menus; the tray is passed as its `footer` |
| `app-shell`, `artifact-workspace`, `workspace-start` | | Sidebar, search, resizing, drawers and the New tab work area |

## Data and callbacks

`AssistantOverviewScreen` accepts the Shell Props (workspace, user, theme, layout, sidebar and panel state) plus:

| Prop | Default | Description |
| --- | --- | --- |
| `overview` | recorded data | `OverviewCards` props: `activity` (chats per day, oldest first), `activityEnd`, `fileCount`, `automationCount`, `recent`, `recentMore`, `files`, `filesMore`, `usage`, `month`, `onOpenChat`, `onOpenFile`, `labels` |
| `onNavigate` | – | Sidebar labels, and Chat or Folders from card rows and “N more” when `onOpenChat`/`onOpenFile` are not given |
| `onSend` | – | `(text, options)` from the composer |
| `composerProps` | – | Other `ChatComposer` props, such as `models` or `placeholder` |
| `folder` / `defaultFolder` / `onFolderChange` | `""` | Folder chosen under Work in a folder; `folders` lists them |
| `connectedApps` / `defaultConnectedApps` / `onConnectedAppsChange` | `["gmail"]` | Ids from `apps` |
| `suggested`, `onOpenSource`, `onOpenTool`, `onOpenUrl` | | New tab sources and tools in the work area |
| `title` | affectUI mark | Start heading |

Usage over the limit turns the meter red and says so in the tip text and below the bar. Squares keep a level from 0 to 4 relative to the busiest day.

## Keyboard and accessibility

- Tab goes from the composer through the activity grid, each card's “N more” and its rows.
- In the grid, ← → move a week, ↑ ↓ a day, Home/End go to the first and last day, Escape hides the tip. Focusing the grid starts on the last day.
- The grid is one `img` labelled with its sum; the current day is announced through a polite live region. The usage bar is a `meter`; every trend is labelled “+12 on last month”.
- Long titles end in “…” before the time; file names keep their extension.

## Layout

The start column is 880px wide with a 672px composer. Under 640px of container width the cards use two columns (files move below usage and this month); under 420px they stack. The shell's own drawers take over below 900px.

## Validation

`out/assistant-overview` and `out/assistant-overview-local` in `anim-recorder` hold the original and local recordings of the same script (hover, keyboard walk, rows, more). All 393 elements of the cards match the original in box, color, background and font in light mode; frame tracks differ by under 3%. Dark mode uses this repository's shell card color (`#1c1c1e`) rather than the original's `#141416`.

Known differences: the sidebar uses `AppShell`'s navigation list (Pinned, Projects and Chats as sections with icons) and has no changelog card or Getting started checklist; app logos in the tray are letter marks; sending calls `onSend` and does not animate the page into a conversation.
