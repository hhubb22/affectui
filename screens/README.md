# AI Chat / Double Sidebar

For the orchestrator screen, its component breakdown and runtime interfaces, see [Agent / Thread](./agent-thread.md).
For the grouped task list and task/artifact work area, see [Agent / Tasks](./agent-tasks.md).
For decisions, visual picks, approvals and free answers, see [Agent / Inbox](./inbox.md).
For the start page with workspace numbers under the composer, see [AI Chat / Overview](./assistant-overview.md).
For the orchestrator conversation with a campaign brief and generated ads, see [AI Chat / Agents](./agent-chat.md).

A local recreation of the [agent-chat-rail screen](https://www.affectui.com/screens/agent-chat-rail), implemented from its visible layout and recorded interactions. The implementation follows this repository's [design system](../DESIGN_SYSTEM.md).

## Preview

```sh
npm install
npm run dev
```

Open the URL printed by Vite. The default is the Clean screen. Preview variants with `?style=classic`, `?theme=dark` or `?layout=flat`. Each component also has a standalone preview, for example `?component=chat-composer` or `?component=artifact-workspace`.

## Copy one file

```tsx
import { AgentChatRailScreen } from "./screens/agent-chat-rail-clean";

export default function Page() {
  return (
    <div style={{ height: "100dvh" }}>
      <AgentChatRailScreen
        workspace="Fieldwork"
        user={{ name: "Alex Morgan", email: "alex@fieldwork.com" }}
        onNavigate={(label) => console.log(label)}
      />
    </div>
  );
}
```

The screen includes every component it needs in the same file. It imports only React, injects its own scoped CSS through React 19 style hoisting, and uses inline SVGs. It does not require the other component files, a CSS framework, an icon package or an animation package. Fonts in `examples/` are used only by the preview; consumers supply their own Inter font or use the system fallback.

Switch between Classic and Clean by changing the import path. Both versions export the same component names and Props types.

## Independent components

| File pair in `components/` | Export | Purpose |
| --- | --- | --- |
| `app-shell.tsx` / `app-shell-clean.tsx` | `AppShell` | Icon rail, project/chat sidebar, keyboard menus, command search, drawer focus management, resizable sidebar and panel slots |
| `agent-thread.tsx` / `agent-thread-clean.tsx` | `AgentThread` | Conversation log, tool activity, file chips, scroll following, Stop, built-in composer |
| `chat-composer.tsx` / `chat-composer-clean.tsx` | `ChatComposer` | Input, attachments, model and permission selection, plan mode, app selection, optional voice transcription |
| `command-menu.tsx` / `command-menu-clean.tsx` | `CommandMenu` | Grouped command search, keyboard selection, modal or inline rendering |
| `tool-activity.tsx` / `tool-activity-clean.tsx` | `ToolActivity` | Running timer, status, automatic settling, expandable tool steps and retry callback |
| `artifact-workspace.tsx` / `artifact-workspace-clean.tsx` | `ArtifactWorkspace` | File tabs, CSV grid, formula/reference bar, column resizing, text formatting, history and file creation |

Every file is independently copyable. Larger files embed the smaller components they use. Their CSS namespaces differ between Classic and Clean, so both can appear on one page.

## Application data

The screen starts with the recorded sample conversation and local demo responses. Connect your own runtime with `messages`, `onMessagesChange`, `onSend` and `onStop`; supplying `messages` or `onSend` disables demo playback by default. `simulate={false}` makes that choice explicit. Network requests, permission enforcement and persistence belong to the application.

```tsx
const [messages, setMessages] = useState<AgentMessage[]>([]);
const [files, setFiles] = useState<ArtifactFile[]>([]);

<AgentChatRailScreen
  messages={messages}
  onMessagesChange={setMessages}
  onSend={(text, options) => runAssistant(text, options)}
  onStop={() => cancelAssistant()}
  files={files}
  onFilesChange={setFiles}
  simulate={false}
/>
```

The thread proposes the appended user message through `onMessagesChange` before calling `onSend`. Append assistant responses through the controlled `messages` array. Set `streaming` on the current assistant message and update its `text` as your runtime streams. Tool steps use `running`, `done`, `failed` or `stopped` status, with `startedAt` and/or `duration` in milliseconds.

Main state pairs:

| Component | Controlled state | Uncontrolled initial state | Change callback |
| --- | --- | --- | --- |
| Screen / thread | `messages` | `defaultMessages` | `onMessagesChange` |
| Screen / shell | `chats` | `defaultChats` | `onChatsChange` |
| Screen / shell | `activeChat` | `defaultActiveChat` | `onOpenChat` |
| Screen / shell | `project` | `defaultProject` | `onProjectChange` |
| Screen / shell | `projects` | `defaultProjects` | `onProjectsChange` |
| Screen / shell | `sidebarWidth`, `panelWidth` | `defaultSidebarWidth`, `defaultPanelWidth` | `onSidebarWidthChange`, `onPanelWidthChange` |
| Screen / shell | `sidebarOpen`, `panelOpen` | `defaultSidebarOpen`, `defaultPanelOpen` | `onSidebarOpenChange`, `onPanelOpenChange` |
| Screen / workspace | `files`, `openFiles`, `activeFile` | `defaultFiles`, `defaultOpenFiles`, `defaultActiveFile` | `onFilesChange`, `onOpenFilesChange`, `onActiveFileChange` |
| Composer | `value`, `model`, `approval`, `planMode`, `attachments` | Corresponding `default*` props | Corresponding `on*Change` callbacks |
| Command menu / tool activity | `open` | `defaultOpen` | `onOpenChange` |

`onNavigate` receives section/menu labels. `onChatAction` exposes rename, pin, archive and other menu actions so the application can persist them or provide share/window navigation. `composerProps.onAction` receives the remaining Add menu actions. Menu permissions describe the requested mode; they do not grant backend access.

The composer requests microphone access only when Voice input is clicked. Supply `transcribe(blob, signal)` to insert a transcript; without it, a used recording becomes an audio attachment. File content changes flow through `onFilesChange`. The spreadsheet supports text/number formatting, cell editing, TSV paste, sorting, row/column insertion and deletion, and undo/redo; it does not evaluate spreadsheet formulas.

## Keyboard and responsive behavior

- `⌘K` / `Ctrl+K`: open search within the current shell.
- Menus: arrows, Home/End, Enter and Escape. Modal search and narrow-screen drawers contain focus and restore it when closed.
- Composer: Enter sends, Shift+Enter inserts a line, composition input is respected. Escape stops a response or discards an active recording.
- Grid: arrows, Home/End, Tab, Enter/F2 to edit, Escape to cancel, Delete to clear. Enter in the reference box moves to a cell.
- File tabs: arrows, Home/End and Delete. Separators and column resize handles also support arrow keys.

Below 900px of **container width**, the rail and chat sidebar become a single drawer, and the artifact panel becomes a separate drawer. This works inside narrow containers on wide screens. Dark mode follows `.dark` or `data-theme="dark"` ancestors, or the shell's controlled `theme` / `onThemeChange` pair. Motion respects `prefers-reduced-motion` in CSS and the button-width animations.

## Maintenance and verification

The readable distribution files are generated from `scripts/chat-rail/*.part`. Edit these fragments and run `npm run generate` to keep the standalone components and their embedded copies synchronized. Prettier is used only during generation. The generated files have no build-time dependency on this script.

```sh
npm run generate
npm run build
npm test
```

The build checks generation freshness, strict TypeScript and identical Classic/Clean Props before building the preview. Browser tests cover navigation, menus, edits, cancellation, resizing, controlled state, attachment callbacks, document sanitization, responsive containers, dark mode, reduced motion and standalone/SSR rendering. Browser screenshots are saved to `/tmp/affectui-replica`.

If Playwright's browser is not installed, run `npx playwright install chromium` before the tests.
