# Agent / Thread

A recreation of the [Agent / Thread screen](https://www.affectui.com/screens/agent-thread), based on browser recordings made with the sibling `anim-recorder` project. It follows [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md).

## Preview and copy

Run `npm run dev`, then open `/?screen=agent-thread`. Add `&style=classic`, `&theme=dark`, or `&state=decision` to inspect a variant. The preview has eight states: `live`, `decision`, `scrolled`, `offline`, `uploading`, `dictating`, `away`, and `error`. Its state switcher is outside the distributed screen.

```tsx
import { AgentThreadScreen } from "./screens/agent-thread-clean";

export default function Page() {
  return (
    <div style={{ height: "100dvh" }}>
      <AgentThreadScreen workspace="Fieldwork" simulate="decision" />
    </div>
  );
}
```

Use `agent-thread.tsx` for Classic. Both files export the same component and types, import only React, and include every component, inline SVG, scoped style, dark token, and container query they need. Copying the screen does not require any other repository files. Inter is optional; the preview supplies it locally.

## Components

Each entry has a Classic `.tsx` and a Clean `-clean.tsx` file in `components/`. The new components also have standalone previews through `?component=<file-name>`.

| Export                              | File name            | Behavior                                                                                                                              |
| ----------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `AppShell`                          | `app-shell`          | Single workspace sidebar, search, navigation, account menu, collapse/expand, resizable task/artifact area and mobile drawers          |
| `AgentThread`                       | `agent-thread`       | Conversation log, streaming, ordered message parts, tool activity, scroll following, queued messages, errors and composer integration |
| `ThreadTaskCard`                    | `thread-task-card`   | Task status, completed/total steps and a named Open action                                                                            |
| `DecisionDock`                      | `decision-dock`      | Options, approval facts, visual picks, custom answer, pager, Later/Show and keyboard selection                                        |
| `ConnectionBanner`                  | `connection-banner`  | Floating connection feedback, retry countdown, manual retry and temporary Back online feedback                                        |
| `AwaySummary`                       | `away-summary`       | Completed tasks, pending decisions, unread boundary and Mark as read                                                                  |
| `ThreadUploads`, `ThreadVoiceInput` | `thread-uploads`     | Upload progress, cancellation, failures, retry, saved voice clips and dictation controls                                              |
| `TaskDetails`                       | `task-details`       | Goal, status, project, steps, history, artifacts, decided questions and return to a pending decision                                  |
| `ToolActivity`                      | `tool-activity`      | Independent tool completion and timers, then automatic folding into a summary                                                         |
| `ChatComposer`                      | `chat-composer`      | Prompt, file selection, approval mode, recording and Send/Stop integration; the thread omits model selection by default               |
| `ArtifactWorkspace`                 | `artifact-workspace` | Persistent file tabs plus one replaceable task tab, editable CSV/document/code files, copy and download                               |

The conversation, task cards, tools, decision dock, uploads and composer share a centered 680px column. The dock occupies layout space above the composer. The conversation shrinks as the dock opens, keeping the latest message and Jump button above it. Narrow containers use 12px sides and the shell's drawers.

## Connect application data

Supplying `messages` or `onSend` disables preview playback by default. Use `simulate={false}` explicitly in an application. User messages are appended through `onMessagesChange` before `onSend` runs. Append agent messages and update their parts as the runtime streams.

```tsx
const [messages, setMessages] = useState<AgentMessage[]>([]);
const [decisions, setDecisions] = useState<ThreadDecision[]>([]);

<AgentThreadScreen
  simulate={false}
  messages={messages}
  onMessagesChange={setMessages}
  decisions={decisions}
  onDecisionsChange={setDecisions}
  onSend={(text, attachments) => runAgent(text, attachments)}
  onStop={() => cancelRun()}
  onDecide={(id, answer) => answerDecision(id, answer)}
  upload={(file, reportProgress, signal) =>
    uploadFile(file, reportProgress, signal)
  }
  transcribe={(clip) => transcribeVoice(clip.file)}
/>;
```

`AgentThreadScreen.onSend` receives `(text, ThreadAttachment[])`. The standalone `AgentThread.onSend` retains the chat component's `(text, ChatComposerSendOptions)` interface, including model and approval settings.

`AgentMessage` supports the existing `text`, `tools`, and `files` fields plus ordered `parts`:

```tsx
const message: AgentMessage = {
  id: "ingest-update",
  role: "agent",
  at: Date.now(),
  streaming: false,
  parts: [
    {
      kind: "tools",
      id: "checks",
      tools: [
        {
          id: "cluster",
          label: "Checked staging",
          status: "done",
          duration: 2600,
        },
      ],
    },
    { kind: "text", text: "Staging is ready. Pick a queue before I deploy." },
    {
      kind: "task",
      task: {
        id: "ingest",
        title: "Ingest pipeline",
        status: "Picking a queue",
        steps: { done: 2, total: 4 },
      },
    },
    {
      kind: "decision",
      ask: { id: "queue", question: "Which queue?", task: "Ingest pipeline" },
    },
    { kind: "artifacts", names: ["deploy.yaml"] },
  ],
};
```

Put the full decision in `decisions`. Its inline message part is an Asked link. An answer removes the decision, appends a user message with its question as context, updates the local count and task history, and returns focus to the composer. `onDecide` receives `"approve"`, `"decline"`, `{ option: string }`, or `{ text: string }`. Pending Asked links reopen and focus the dock; answered links scroll to the answer. Task details use the same path.

State follows the repository's controlled/uncontrolled conventions:

| State                                                 | Initial state                                           | Callback                                                   |
| ----------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------- |
| `messages`, `decisions`, `uploads`, `tasks`           | Corresponding `default*` props                          | Corresponding `on*Change` callbacks                        |
| `folded`, `connection`, `lastSeen`                    | `defaultFolded`, `defaultConnection`, `defaultLastSeen` | `onFoldedChange`, `onConnectionChange`, `onLastSeenChange` |
| `files`, `openFiles`, `activeFile`                    | Corresponding `default*` props                          | Corresponding `on*Change` callbacks                        |
| `panelOpen`, `sidebarCollapsed`, panel/sidebar widths | Corresponding `default*` props                          | Corresponding `on*Change` callbacks                        |
| Composer draft and settings                           | Via `composerProps`                                     | Via `composerProps`                                        |

Without a controlled `connection`, browser online/offline events drive connection feedback. Retry delays increase from 5 to 10, 20 and 30 seconds. `onReconnect` can probe the application's service; rejecting keeps the connection offline. Outgoing messages wait while disconnected and are delivered once per mounted thread after reconnection. Canceling generation does not cancel queued sends. Persist the message array in the application to survive a reload.

An upload provider receives a `File`, a progress callback accepting 0–1, and an `AbortSignal`. Cancellation and disconnection abort its request; reconnection starts it again. Providers can implement resumable transfer behind this interface. Failed or incomplete files block Send while leaving the draft editable. Completed files are passed to `onSend`. Without a provider, the component uses local progress for files that the application can process on send.

Voice input requests microphone access only after clicking its button. With `transcribe`, disconnected clips wait above the composer and transcribe after reconnection. Failed transcription offers Retry. Without a transcription callback, recordings remain audio attachments. The Dictating preset and its transcript are preview data.

`lastSeen` is an epoch timestamp. The summary derives completed tasks and unanswered questions from later messages. Returning after `awayAfter` minutes (default 5) also creates this boundary. `onMarkRead` lets the application persist that acknowledgment. Data persistence, network delivery and destination pages for `onNavigate`/`onShowTask` belong to the application.

## Keyboard, motion and verification

- Decision rows: 1–5 shortcuts, arrows, Home/End and Enter. Escape postpones the decision. Custom answers are submitted inside the card.
- Conversation: End returns to the latest message; `/` focuses the composer. Shortcuts are scoped to the thread and skip editing fields.
- Composer: Enter sends, Shift+Enter inserts a line, and composition input is respected. Escape stops generation or discards dictation.
- Search, menus, file tabs, drawers and resize handles retain the existing shell/workspace keyboard behavior.

Tool rows settle independently before folding, messages rise in, the dock folds, and streamed text has a breathing caret. CSS and JavaScript animations respect `prefers-reduced-motion`. Dark mode follows the shell theme or an ancestor `.dark` / `data-theme="dark"`.

Maintain the fragments in `scripts/chat-rail/`, then run `npm run generate`. `npm run build` verifies generation freshness, strict TypeScript and identical Classic/Clean contracts. `npm test` covers both screens, including decision focus, task/file tabs, interrupted uploads, queued delivery, retry, away summaries, live tool completion, responsive drawers, standalone components and SSR. New screen screenshots are saved to `/tmp/affectui-thread-replica`.
