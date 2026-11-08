# Agent / Tasks

A recreation of the [Agent / Tasks screen](https://www.affectui.com/screens/agent-tasks), based on its visible interface and interactions recorded with the sibling `anim-recorder` project. The files follow [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md).

## Preview and copy

Run `npm run dev` and open `/?screen=agent-tasks`. Add `&style=classic`, `&theme=dark`, `&layout=flat`, `&tab=done`, or `&selected=auth` to inspect a variant. `&selected=none` starts without a selected task. The root preview continues to show the double-sidebar chat; the thread remains at `/?screen=agent-thread`.

```tsx
import { AgentTasksScreen } from "./screens/agent-tasks-clean";

export default function Page() {
  return (
    <div style={{ height: "100dvh" }}>
      <AgentTasksScreen
        workspace="Fieldwork"
        onNavigate={(label) => navigate(label)}
        onOpenInbox={(taskId, itemId) => openInbox(itemId, taskId)}
      />
    </div>
  );
}
```

Use `agent-tasks.tsx` for Classic. Both versions export the same component and types. Each screen file imports only React and contains its components, inline SVGs, scoped CSS, dark tokens and responsive rules. Copying one file does not require the other component files, preview fonts, an icon library or an animation library.

The default data has nine active tasks and four completed tasks across Northwind, Platform and Evalkit. The desktop sidebar is 272px wide, the task work area starts at 410px, and Clean list rows are 40px high. The row's title and status share space while steps, artifact counts and update times stay aligned.

## Component breakdown

Each entry has Classic `.tsx` and Clean `-clean.tsx` files in `components/`. The new components have standalone previews using `?component=<file-name>`.

| Export                            | File name            | Responsibility                                                                                                         |
| --------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `TaskProgressRing`                | `task-progress-ring` | Dashed planning state, progress segments, paused state and completion; also exports the `AgentTask` data model         |
| `TaskList`                        | `task-list`          | Active/Done header, grouped task tree, collapse state, one roving Tab stop, row metadata and pointer shortcut to Inbox |
| `TaskCreate`                      | `task-create`        | Inline multiline draft, project menu, repeated creation with Enter and Escape to close                                 |
| `TaskInspector`                   | `task-inspector`     | Goal, pending decision, task properties, steps, history, artifacts, earlier decisions and Show agents                  |
| `ArtifactFolder`                  | `artifact-folder`    | Search, list/icon views, sorting, selection, keyboard opening and file context actions                                 |
| `ArtifactImageViewer`             | `artifact-image`     | Image preview, zoom, fit, download and load-failure fallback                                                           |
| `WorkspaceStart`, `WorkspaceTool` | `workspace-start`    | New-tab search, tools, suggested artifacts and frontend tool surfaces                                                  |
| `AppShell`                        | `app-shell`          | Workspace navigation, search, account menu, sidebar collapse, resize handles and separate mobile drawers               |
| `ArtifactWorkspace`               | `artifact-workspace` | One replaceable task tab alongside persistent document, CSV, code, folder, image and tool tabs                         |

Selecting a task replaces the task tab while keeping file tabs. The task's pending question opens the Inbox through a callback. Decisions are answered in the Inbox. Closing the final tab folds the panel; selecting a task opens it again.

## Application data

```tsx
const [tasks, setTasks] = useState<AgentTask[]>([]);
const [files, setFiles] = useState<ArtifactFile[]>([]);

<AgentTasksScreen
  tasks={tasks}
  onTasksChange={setTasks}
  files={files}
  onFilesChange={setFiles}
  defaultSelected={null}
  onCreate={(task) => saveTask(task)}
  onSelect={(id) => rememberSelectedTask(id)}
  onOpenInbox={(taskId, itemId) => openInbox(itemId, taskId)}
  onOpenArtifact={(taskId, name) => recordArtifactOpen(taskId, name)}
  onArtifactChange={(name, file) => saveArtifact(name, file)}
/>;
```

`onTasksChange` proposes the task array before `onCreate` receives the new task. New tasks start in planning, appear at the top of their project, open in the inspector and leave the draft ready for another task. A collapsed project unfolds when a fresh task is added. Passing stable state arrays lets external task updates refresh the list, inspector and Inbox count together.

```tsx
const task: AgentTask = {
  id: "ingest",
  title: "Ingest pipeline",
  project: "Northwind",
  status: "running",
  statusText: "Picking a queue",
  updatedAt: Date.now(),
  goal: "Keep a day of order events to replay after a bad deploy.",
  steps: [
    { label: "Draft the schema", done: true },
    { label: "Load test", done: true },
    { label: "Pick a queue" },
    { label: "Deploy to staging" },
  ],
  asks: [
    { id: "queue", question: "Which queue should we use?", kind: "decision" },
  ],
  artifacts: ["ingest-design.md", "load-test-results.csv", "staging"],
  history: ["Load test passed at 20k events a minute"],
  decided: [
    { question: "Which event format?", answer: "JSON", at: Date.now() },
  ],
};
```

`asks` determines the Needs you count; `needs` supplies a count when the task has no listed asks. Done tasks do not add to Inbox. `statusText` is shown as provided, with a fallback derived from task status. Times and decision timestamps use epoch milliseconds. Completed steps fill the ring and provide its `2/4` text; `done` moves the task to the Done list.

`onOpenInbox(taskId, itemId?)` is called by the row badge, the inspector's Decide and the waiting step. Without it, the screen calls `onNavigate("Inbox")`. Show agents calls `onNavigate("Agent Orchestration")`.

Main controlled/uncontrolled pairs:

| State                                       | Initial state                  | Callback                                              |
| ------------------------------------------- | ------------------------------ | ----------------------------------------------------- |
| `tasks`                                     | `defaultTasks`                 | `onTasksChange`                                       |
| `tab`                                       | `defaultTab` (`"active"`)      | `onTabChange`                                         |
| `selected`                                  | `defaultSelected` (`"ingest"`) | `onSelectedChange`; `onSelect` reports an opened task |
| `createOpen`                                | `defaultCreateOpen`            | `onCreateOpenChange`                                  |
| New-task `project`                          | `defaultProject`               | `onProjectChange`                                     |
| `collapsedProjects`                         | `defaultCollapsedProjects`     | `onCollapsedProjectsChange`                           |
| `files`, `openFiles`, `activeFile`          | Corresponding `default*` props | Corresponding `on*Change` callbacks                   |
| `panelOpen`, shell widths and sidebar state | Corresponding `default*` props | Corresponding `on*Change` callbacks                   |

`projects` sets group and picker order. `labels` translates header, creation and inspector labels. `TaskCreate` also supports controlled `value` and `project`; the folder supports controlled entries, selection, query, view and sort; image zoom follows the same convention.

Artifacts use the repository's `ArtifactFile` union: editable documents, tables and code, plus folders with entries and images with `src`/`alt`. Changes remain in component state and flow through `onFilesChange` and `onArtifactChange`. CSV editing retains the existing workspace's formatting, paste, undo/redo and column resizing. Folder entries can be searched, sorted, renamed, duplicated and removed. Image assets supplied by the application stay external to the component; the sample chart is an inline SVG data URL.

`suggested` provides sources for new tabs. `onOpenTool` reports launches, and `renderTool` can replace a tool tab with an application-owned terminal, browser or notes runtime. The default frontend terminal handles `help`, `pwd`, `ls`, `echo` and `clear` locally; it does not execute shell commands. The browser surface passes an address to `onOpenUrl`, or opens a valid HTTP(S) URL in a new browser tab. Notes persist across tab changes. Network requests, real tool runtimes, permissions and persistence belong to the application.

## Keyboard and responsive behavior

- **J/K:** move row focus without selecting; Enter or Space opens the focused task.
- **Ctrl/Cmd+K:** search current tasks and workspace navigation. The shell's `commands` prop can supply application-specific groups.
- **Tree:** Up/Down, Home/End traverse visible group heads and rows. Left folds a group or returns to a row's group head. Right unfolds a group or enters its first row. Enter/Space on a group toggles it.
- **C/N:** open the creation line. Enter creates, Shift+Enter adds a line, and Escape closes and restores focus to New task. Input composition is respected. Shortcuts skip editable fields and menus.
- **Active/Done:** Left/Right and Home/End select a list.
- **Task/file tabs:** Left/Right, Home/End and Delete. Closing a focused tab moves focus to a remaining tab; closing the last tab returns to the list.
- **Folder:** arrows, Home/End, Enter, F2, Delete, Ctrl/Cmd+A and Shift+F10; menus support arrows and Escape.

Below 900px of container width, the page starts on the list and a task opens in the shell's right drawer. Sidebar and task drawers contain focus independently. Below 560px, task rows become two lines, metadata columns make room, and controls stay on the shell's header centerline. Touch controls grow and shortcut hints hide. These rules use container queries rather than viewport breakpoints.

The new-task line drops in, fresh rows grow into the top of their project, and group chevrons turn as sections fold. CSS and JavaScript respect `prefers-reduced-motion`. Dark mode follows the shell theme or an ancestor `.dark` / `data-theme="dark"`.

## Maintenance and verification

Edit `scripts/chat-rail/*.part`, then run `npm run generate` to synchronize standalone files and their embedded copies. `npm run build` checks generation freshness, strict TypeScript and Classic/Clean interface equality. `npm test` covers all three screens. Task tests cover tree navigation, repeated creation, project selection, external updates, task/file tabs, edited artifacts, folders, tool tabs, mobile drawers, dark mode, reduced motion and standalone/SSR rendering. Screenshots are written to `/tmp/affectui-tasks-replica`.
