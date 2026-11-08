# Agent / Inbox

Recreates the visible layout and interactions of [Agent / Inbox](https://www.affectui.com/screens/inbox), inspected and recorded with the sibling `anim-recorder` project. The implementation follows [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md).

Run `npm run dev` and open `/?screen=inbox`. Add `&style=classic`, `&theme=dark`, `&layout=flat`, `&tab=done`, or `&item=queue`. An item deep link opens its own Open/Done list and opens the reading view on phones.

```tsx
import { InboxScreen } from "./screens/inbox-clean";

export default function Page() {
  return (
    <div style={{ height: "100dvh" }}>
      <InboxScreen
        workspace="Fieldwork"
        onDecide={(id, answer) => submitAnswer(id, answer)}
        onNavigate={(label) => navigate(label)}
      />
    </div>
  );
}
```

Use `inbox.tsx` for Classic. Both files export the same `InboxScreen` and Props. Every distributed file imports only React, includes its own inline SVGs and scoped CSS, and supports React 19 style hoisting, dark mode, container queries and reduced motion. Preview fonts are optional and remain in `examples/`.

## Components

Each component has a Classic `.tsx` and Clean `-clean.tsx` file and a standalone preview at `?component=<file-name>`.

| File                 | Exports                                | Role                                                                                                                     |
| -------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `inbox-list`         | `InboxList`                            | Open/Done tabs, pending count, unread dots, selected rows, roving focus and queue collapse                               |
| `inbox-options`      | `InboxOptions`, `InboxWireframe`       | Recommended options, expanding pros/cons, visual variants and keyboard radio selection                                   |
| `inbox-item-view`    | `InboxItemView`                        | Decision, pick, approval and question forms; combined option/text answers; answered recap, history, artifacts and Reopen |
| `inbox-feedback`     | `InboxConfirmation`, `InboxEmptyState` | Check draw, sent answer, caught-up state and View tasks                                                                  |
| `inbox-task-context` | `InboxTaskContext`                     | Task goal, properties, progress steps, artifacts and related answered questions                                          |
| `app-shell`          | `AppShell`                             | Workspace navigation, command search, resizing, account/theme controls and independent mobile drawers                    |
| `artifact-workspace` | `ArtifactWorkspace`                    | Editable document, CSV, code, folder and image tabs                                                                      |
| `workspace-start`    | `WorkspaceStart`, `WorkspaceTool`      | New-tab search, suggested artifacts and tool surfaces                                                                    |

The desktop layout has a 272px sidebar, 320px Inbox list and a 410px initial task panel. Selecting a question changes the task context while keeping artifact tabs, edits and the panel's visibility. A closed task tab stays closed across question changes. Closing every work-area tab folds the panel; reopening starts with the current task alone.

## Data and callbacks

`createDefaultInboxItems(now?)`, `defaultInboxTasks`, `defaultInboxFiles`, `defaultInboxOpenArtifacts` and `defaultInboxSources` supply the recorded examples: five open questions and three answered ones. Pass `items={[]}` to start empty.

```tsx
const [items, setItems] = useState<InboxItem[]>(initialItems);
const [files, setFiles] = useState<ArtifactFile[]>(initialFiles);

<InboxScreen
  items={items}
  onItemsChange={setItems}
  files={files}
  onFilesChange={setFiles}
  tasks={tasksByName}
  onDecide={(id, answer) => saveAnswer(id, answer)}
  onOpenArtifact={(task, name) => recordFileOpen(task, name)}
  onArtifactChange={(name, file) => saveFile(name, file)}
/>;
```

`InboxItem` has `id`, `kind` (`decision`, `pick`, `approval`, `question`), `question`, `task` and a millisecond `at` timestamp. Optional fields are `context`, `unread`, `options`, `facts`, `suggestions` and `done`.

`onDecide(id, answer)` fires once when the user sends. The answer is `{ option?: string; text?: string }`, `"approve"` or `"decline"`. An option and custom text can be sent together. The screen shows confirmation, collapses the old row and proposes the completed item through `onItemsChange`. The next item receives focus; the last one leads to the caught-up heading. A snapshot keeps confirmation stable if the application updates or removes items immediately.

`onLater(id)` moves the item to the end of Open and preserves its draft. `onReopen(id)` moves an answered item to the start of Open and resets its draft to the recommended option. `onSelect(id | null)` reports a changed selection and `null` when the list empties. `done` contains `answer`, `at`, an optional display `label`, optional `history` lines and optional artifact names.

| Controlled state | Initial state                               | Change callback      |
| ---------------- | ------------------------------------------- | -------------------- |
| `items`          | `defaultItems`                              | `onItemsChange`      |
| `tab`            | `defaultTab`                                | `onTabChange`        |
| `selected`       | `defaultSelected`                           | `onSelectedChange`   |
| `drafts`         | `defaultDrafts`                             | `onDraftsChange`     |
| `files`          | `defaultFiles`                              | `onFilesChange`      |
| `openFiles`      | `defaultOpenFiles` / `defaultOpenArtifacts` | `onOpenFilesChange`  |
| `activeFile`     | `defaultActiveFile`                         | `onActiveFileChange` |
| `panelOpen`      | `defaultPanelOpen`                          | `onPanelOpenChange`  |

`tasks` is keyed by task name. Values provide `goal`, `project`, `status`, `started`, `steps` and artifact names. `files` uses the repository's `ArtifactFile[]` union, shared with the other screens. Folder opens preserve the artifact's owning task even after selecting another question. `onArtifactChange` receives the whole changed file. Persistence, answer submission and terminal/browser integrations belong to the application; use `onOpenTool`, `renderTool` and `onOpenUrl` to connect them. CSV cells preserve formula text, following the existing workspace editor.

`labels` replaces visible Inbox labels, task labels, caught-up text and `running(count)` text. `running` defaults to three tasks. Shell Props such as workspace, account, layout, theme, sidebar state and panel width remain available.

## Keyboard and motion

- J/K moves between questions; arrows and Home/End navigate the list with one Tab stop.
- 1–3 selects an option. Option arrows/Home/End select and focus; Enter on an option selects and sends it.
- Enter sends from the reading view or reply field. Shift+Enter creates a line in a free answer; IME composition is preserved.
- L defers the item. R or `/` focuses its reply field. Escape leaves the field; on phones, Escape or Inbox returns to the list.
- Open/Done tabs support arrows and Home/End. Work-area tabs, editors, menus and drawers retain their existing keyboard behavior.

Below 640px of Inbox container width, the list and reading view alternate. Below 900px of shell container width, navigation and task context use separate drawers. Opening a question keeps the task drawer closed until requested.

The recorded motion is retained: 320ms option expansion, 240ms confirmation fade, 420ms ring/check animation with a 160ms check delay, 360ms answer text rise, 280ms row collapse and 420ms next-question glide. Reduced motion removes these animations and displays the finished check.

Run `npm run build` and `npm test` for generated-file consistency, type contracts, production bundling, browser behavior and standalone server rendering. Implementation fragments live in `scripts/chat-rail/inbox*.part`; run `npm run generate` after editing them.
