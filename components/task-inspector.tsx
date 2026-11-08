"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

/*
 * task-inspector (Classic) – a self-contained React 19 component.
 * Inline SVGs and scoped styles are included; no other local files or packages are required.
 * Maintained in scripts/chat-rail; run npm run generate after changes.
 */

type IconName =
  | "terminal"
  | "image"
  | "inbox"
  | "memory"
  | "video"
  | "chat"
  | "tasks"
  | "play"
  | "folder"
  | "folder-open"
  | "plug"
  | "bell"
  | "settings"
  | "search"
  | "compose"
  | "chevron"
  | "check"
  | "close"
  | "plus"
  | "more"
  | "pin"
  | "panel"
  | "mic"
  | "send"
  | "hand"
  | "globe"
  | "table"
  | "document"
  | "undo"
  | "redo"
  | "bold"
  | "italic"
  | "underline"
  | "link"
  | "sort"
  | "row"
  | "column"
  | "trash"
  | "copy"
  | "download"
  | "arrow"
  | "stop"
  | "warning"
  | "spark";

const iconPaths: Record<IconName, ReactNode> = {
  chat: (
    <>
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-1 1v-8.5A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M8 11h.01M12 11h.01M16 11h.01" />
    </>
  ),
  tasks: (
    <>
      <path d="m3 6 1.5 1.5L8 4M11 6h10M3 13l1.5 1.5L8 11M11 13h10M4 20h3M11 20h10" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m10 8 6 4-6 4Z" />
    </>
  ),
  folder: <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />,
  "folder-open": (
    <>
      <path d="M3 10V7a2 2 0 0 1 2-2h5l2 2h7v3M3 12h18l-3 9H2Z" />
    </>
  ),
  plug: (
    <>
      <path d="M8 3v5M16 3v5M6 8h12v4a6 6 0 0 1-12 0ZM12 18v4" />
    </>
  ),
  bell: (
    <>
      <path d="M5 16h14l-2-3V9a5 5 0 0 0-10 0v4ZM9 20a3 3 0 0 0 6 0" />
    </>
  ),
  settings: (
    <>
      <path d="m10 3-1 3-3 1-3 3 2 3v3l3 2 2 3h4l1-3 3-1 3-3-2-3V8l-3-2-2-3Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </>
  ),
  compose: (
    <>
      <path d="M12 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-7M9 15l1-5L18 2l4 4-8 8Z" />
    </>
  ),
  chevron: <path d="m8 10 4 4 4-4" />,
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  plus: <path d="M12 4v16M4 12h16" />,
  more: (
    <>
      <circle cx="5" cy="12" r=".7" />
      <circle cx="12" cy="12" r=".7" />
      <circle cx="19" cy="12" r=".7" />
    </>
  ),
  pin: <path d="m9 3 10 10-4 1-3 4-3-3-6 6M8 4l12 12M8 4l-2 7 7 7" />,
  panel: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M15 4v16M18 8v3" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="2" width="6" height="13" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v4M9 22h6" />
    </>
  ),
  send: <path d="M12 20V4m-7 7 7-7 7 7" />,
  hand: (
    <>
      <path d="M8 12V5a2 2 0 0 1 4 0v7M12 6a2 2 0 0 1 4 0v6M16 8a2 2 0 0 1 4 0v7a7 7 0 0 1-12 5l-5-6a2 2 0 0 1 3-3l2 2M8 8a2 2 0 0 0-4 0v5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3 12h18M5 7h14M5 17h14" />
    </>
  ),
  table: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M3 14h18M9 9v11M15 9v11" />
    </>
  ),
  inbox: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M3 12h5l2 3h4l2-3h5" />
    </>
  ),
  memory: (
    <>
      <path d="M12 4c-2-4-7-2-7 1-3 0-4 5-1 7-2 3 0 6 3 6v3h4V9M12 4c2-4 7-2 7 1 3 0 4 5 1 7 2 3 0 6-3 6v3h-4V9M7 6c4-1 5 3 2 4M17 6c-4-1-5 3-2 4M5 12c3-1 5 1 4 4M19 12c-3-1-5 1-4 4" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="5" width="12" height="14" rx="3" />
      <path d="m15 9 6-3v12l-6-3Z" />
    </>
  ),
  terminal: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m7 9 3 3-3 3M13 15h4" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8" cy="8" r="1.5" />
      <path d="m3 17 6-6 4 4 3-3 5 5" />
    </>
  ),
  document: (
    <>
      <path d="M6 3h8l5 5v13H6ZM14 3v5h5M9 12h7M9 16h5" />
    </>
  ),
  undo: <path d="M4 11a8 8 0 1 1 2 8M4 4v7h7" />,
  redo: <path d="M20 11a8 8 0 1 0-2 8M20 4v7h-7" />,
  bold: <path d="M7 3h6a5 5 0 0 1 0 9H7Zm0 9h7a5 5 0 0 1 0 9H7Z" />,
  italic: <path d="M10 3h10M4 21h10M15 3 9 21" />,
  underline: (
    <>
      <path d="M6 3v8a6 6 0 0 0 12 0V3M4 22h16" />
    </>
  ),
  link: (
    <>
      <path
        d="m10 14 4-4M8 16l-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0M16 8l2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0"
        transform="translate(2 0) scale(.83 1)"
      />
    </>
  ),
  sort: <path d="M7 3v18m-4-4 4 4 4-4M14 5h7M14 10h5M14 15h3" />,
  row: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M12 5v2m-1-1h2" />
    </>
  ),
  column: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18M15 3v18M5 12h2m-1-1v2" />
    </>
  ),
  trash: <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" />,
  copy: (
    <>
      <rect x="8" y="8" width="13" height="13" rx="2" />
      <path d="M16 8V3H3v13h5" />
    </>
  ),
  download: <path d="M12 3v13m-5-5 5 5 5-5M4 18v4h16v-4" />,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  stop: <rect x="6" y="6" width="12" height="12" rx="2" />,
  warning: (
    <>
      <path d="m12 3 10 18H2ZM12 9v5M12 17h.01" />
    </>
  ),
  spark: <path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" />,
};

function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {iconPaths[name] ?? iconPaths.document}
    </svg>
  );
}

function safeNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function agentTaskNeeds(task: AgentTask) {
  return task.done ? 0 : task.asks?.length ? task.asks.length : Math.max(0, Math.floor(safeNumber(task.needs, 0)));
}

function agentTaskAge(at: number, now: number) {
  const minutes = Math.max(0, Math.floor((now - safeNumber(at, now)) / 60000));
  if (minutes < 1) return { short: "now", long: "just now" };
  const value = minutes < 60 ? minutes : minutes < 1440 ? Math.floor(minutes / 60) : Math.floor(minutes / 1440);
  const unit = minutes < 60 ? "minute" : minutes < 1440 ? "hour" : "day";
  return {
    short: `${value}${minutes < 60 ? "m" : minutes < 1440 ? "h" : "d"}`,
    long: `${value} ${unit}${value === 1 ? "" : "s"} ago`,
  };
}

function agentTaskStatus(task: AgentTask, now: number) {
  if (task.statusText?.trim()) return task.statusText;
  if (task.done) {
    const days = Math.floor((now - safeNumber(task.updatedAt, now)) / 86400000);
    return `Done · ${days < 1 ? "Today" : days < 2 ? "Yesterday" : new Intl.DateTimeFormat("en", { weekday: "short", timeZone: "UTC" }).format(task.updatedAt)}`;
  }
  return agentTaskNeeds(task)
    ? "Waiting on you"
    : task.status === "planning"
      ? "Planning"
      : task.status === "paused"
        ? "Paused"
        : "Working";
}

export type AgentTaskStatus = "planning" | "running" | "paused";
export type AgentTaskAsk = { id: string; question: string; kind?: "decision" | "pick" | "approval" | "question" };
export type AgentTask = {
  id: string;
  title: string;
  project: string;
  status?: AgentTaskStatus;
  statusText?: string;
  steps?: { label: string; done?: boolean }[];
  artifacts?: string[];
  asks?: AgentTaskAsk[];
  needs?: number;
  updatedAt: number;
  done?: boolean;
  goal?: string;
  started?: string;
  history?: string[];
  decided?: { question: string; answer: string; at?: number }[];
};
export type TaskProgressRingProps = {
  value?: number;
  max?: number;
  status?: AgentTaskStatus;
  done?: boolean;
  needs?: boolean;
  size?: number;
  label?: string;
  className?: string;
};

/** A task's progress in a small ring; planning is dashed, waiting amber, running teal and done green. */
export function TaskProgressRing({
  value = 0,
  max = 0,
  status: rawStatus = "running",
  done = false,
  needs = false,
  size = 14,
  label,
  className,
}: TaskProgressRingProps) {
  const status = ["planning", "running", "paused"].includes(rawStatus) ? rawStatus : "planning";
  const progress = done ? 1 : max > 0 ? clamp(safeNumber(value, 0) / max, 0, 1) : 0.18;
  const tone = done
    ? "done"
    : status === "planning"
      ? "planning"
      : status === "paused" || (max > 0 && progress < 0.3)
        ? "paused"
        : max > 0
          ? progress < 0.6
            ? "waiting"
            : "running"
          : needs
            ? "waiting"
            : "running";
  return (
    <svg
      className={["ui-tpr", className].filter(Boolean).join(" ")}
      data-tone={tone}
      width={clamp(safeNumber(size, 14), 10, 64)}
      height={clamp(safeNumber(size, 14), 10, 64)}
      viewBox="0 0 16 16"
      fill="none"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={!label || undefined}
    >
      <style href="ui-task-inspector" precedence="default">
        {css}
      </style>
      <circle className="ui-tpr__track" cx="8" cy="8" r="6.1" />
      {status !== "planning" && (
        <circle
          className="ui-tpr__value"
          cx="8"
          cy="8"
          r="4.2"
          pathLength="100"
          strokeDasharray={`${progress * 100} 100`}
          transform="rotate(-90 8 8)"
        />
      )}
    </svg>
  );
}

export type TaskInspectorLabels = {
  needsYou?: string;
  decide?: string;
  decisionOne?: string;
  decisionMany?: string;
  happened?: string;
  showAgents?: string;
  status?: string;
  project?: string;
  started?: string;
  steps?: string;
  artifacts?: string;
  decided?: string;
  selectTask?: string;
};
export type TaskInspectorProps = {
  task?: AgentTask | null;
  onOpenInbox?: (taskId: string, itemId?: string) => void;
  onOpenArtifact?: (name: string) => void;
  onShowAgents?: (taskId: string) => void;
  labels?: TaskInspectorLabels;
  focusRequest?: number;
  now?: number;
  className?: string;
};

/** Task context and its outputs, with one direct route to what waits in the Inbox. */
export function TaskInspector({
  task,
  onOpenInbox,
  onOpenArtifact,
  onShowAgents,
  labels = {},
  focusRequest,
  now = Date.now(),
  className,
}: TaskInspectorProps) {
  const root = useRef<HTMLElement>(null),
    id = useId();
  useEffect(() => {
    if (!focusRequest) return;
    const frame = requestAnimationFrame(() => {
      const target = root.current?.querySelector<HTMLButtonElement>("[data-task-decide]");
      if (target) target.focus({ preventScroll: true });
      else root.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [focusRequest, task?.id]);
  if (!task)
    return (
      <section className={["ui-tin", className].filter(Boolean).join(" ")}>
        <style href="ui-task-inspector" precedence="default">
          {css}
        </style>
        <div className="ui-tin__empty">
          <Icon name="tasks" size={28} />
          <p>{labels.selectTask ?? "Select a task"}</p>
        </div>
      </section>
    );
  const steps = task.steps ?? [],
    done = steps.filter((step) => step.done).length,
    needs = agentTaskNeeds(task),
    first = steps.findIndex((step) => !step.done),
    status = agentTaskStatus(task, now),
    ask = task.asks?.[0];
  return (
    <section
      ref={root}
      className={["ui-tin", className].filter(Boolean).join(" ")}
      aria-labelledby={`${id}-title`}
      tabIndex={-1}
    >
      <style href="ui-task-inspector" precedence="default">
        {css}
      </style>
      <h2 className="ui-tin__sr" id={`${id}-title`}>
        {task.title}
      </h2>
      <div className="ui-tin__body">
        {task.goal && (
          <p className="ui-tin__goal" dir="auto">
            {task.goal}
          </p>
        )}
        {needs > 0 && (
          <div className="ui-tin__needs">
            <div className="ui-tin__needs-text">
              <div>
                <span className="ui-tin__badge">{labels.needsYou ?? "Needs you"}</span>
                <span className="ui-tin__waiting">
                  {needs === 1
                    ? (labels.decisionOne ?? "1 decision waiting")
                    : (labels.decisionMany ?? "{count} decisions waiting").replace("{count}", String(needs))}
                </span>
              </div>
              {ask?.question && (
                <span className="ui-tin__question" dir="auto">
                  {ask.question}
                </span>
              )}
            </div>
            <button
              type="button"
              data-task-decide=""
              className="ui-tin__decide"
              aria-label={`${labels.decide ?? "Decide"} in Inbox${ask?.question ? `: ${ask.question}` : ""}`}
              disabled={!onOpenInbox}
              onClick={() => onOpenInbox?.(task.id, ask?.id)}
            >
              {labels.decide ?? "Decide"}
            </button>
          </div>
        )}
        <dl className="ui-tin__props">
          <div>
            <dt>{labels.status ?? "Status"}</dt>
            <dd>
              <TaskProgressRing status={task.status} done={task.done} needs={!!needs} value={done} max={steps.length} />
              <span title={status} dir="auto">
                {status}
              </span>
              {steps.length > 0 && (
                <small>
                  {done}/{steps.length}
                </small>
              )}
            </dd>
          </div>
          <div>
            <dt>{labels.project ?? "Project"}</dt>
            <dd dir="auto">{task.project}</dd>
          </div>
          {task.started && (
            <div>
              <dt>{labels.started ?? "Started"}</dt>
              <dd>{task.started}</dd>
            </div>
          )}
        </dl>
        {steps.length > 0 && (
          <section className="ui-tin__section">
            <h3>{labels.steps ?? "Steps"}</h3>
            <ol className="ui-tin__steps">
              {steps.map((step, index) => {
                const state = step.done ? "done" : index === first ? (needs ? "you" : "now") : "later";
                return (
                  <li key={`${index}-${step.label}`} data-state={state}>
                    <span className="ui-tin__step-mark" aria-hidden="true">
                      {step.done && <Icon name="check" size={10} />}
                    </span>
                    <span className="ui-tin__step-label" title={step.label} dir="auto">
                      {step.label}
                    </span>
                    <span className="ui-tin__sr">
                      {state === "done"
                        ? ", done"
                        : state === "you"
                          ? ", waiting on you"
                          : state === "now"
                            ? ", in progress"
                            : ""}
                    </span>
                    {state === "you" && (
                      <button
                        type="button"
                        className="ui-tin__step-ask"
                        aria-label={`Open decision${ask?.question ? `: ${ask.question}` : ""}`}
                        onClick={() => onOpenInbox?.(task.id, ask?.id)}
                      >
                        <Icon name="warning" size={12} />
                      </button>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        )}
        {!!task.history?.length && (
          <section className="ui-tin__section">
            <h3>{labels.happened ?? "What happened so far"}</h3>
            <ul className="ui-tin__history">
              {task.history.map((line, index) => (
                <li key={index} dir="auto">
                  {line}
                </li>
              ))}
            </ul>
          </section>
        )}
        {!!task.artifacts?.length && (
          <section className="ui-tin__section">
            <h3>
              {labels.artifacts ?? "Artifacts"}
              <span>{task.artifacts.length}</span>
            </h3>
            <div className="ui-tin__files">
              {task.artifacts.map((name) => (
                <button type="button" key={name} title={name} onClick={() => onOpenArtifact?.(name)}>
                  <span
                    data-kind={
                      name.includes(".")
                        ? name.endsWith(".csv")
                          ? "table"
                          : /\.(json|ya?ml)$/.test(name)
                            ? "code"
                            : "document"
                        : "folder"
                    }
                  >
                    <Icon
                      name={name.includes(".") ? (name.endsWith(".csv") ? "table" : "document") : "folder"}
                      size={12}
                    />
                  </span>
                  <span dir="auto">{name}</span>
                </button>
              ))}
            </div>
          </section>
        )}
        {!!task.decided?.length && (
          <section className="ui-tin__section">
            <h3>{labels.decided ?? "Decided"}</h3>
            <ul className="ui-tin__decided">
              {task.decided.map((item, index) => (
                <li key={index}>
                  <Icon name="check" size={13} />
                  <span>
                    <strong title={item.question} dir="auto">
                      {item.question}
                    </strong>
                    <small title={item.answer} dir="auto">
                      {item.answer}
                      {item.at != null &&
                        ` · ${now - item.at >= 86400000 && now - item.at < 172800000 ? "yesterday" : agentTaskAge(item.at, now).long}`}
                    </small>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
        <footer>
          <button type="button" disabled={!onShowAgents} onClick={() => onShowAgents?.(task.id)}>
            {labels.showAgents ?? "Show agents"}
            <Icon name="chevron" size={12} />
          </button>
        </footer>
      </div>
    </section>
  );
}

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-tpr {
  --ui-tpr-muted: rgba(0, 0, 0, 0.27);
  --ui-tpr-running: #13b3a0;
  --ui-tpr-waiting: #e8b000;
  --ui-tpr-paused: #f28a2e;
  --ui-tpr-done: #5fc88a;
  display: block;
  flex: none;
  color: var(--ui-tpr-running);
  overflow: visible;
  -webkit-font-smoothing: antialiased;
}
.ui-tpr,
.ui-tpr * {
  box-sizing: border-box;
}
.ui-tpr[data-tone="planning"] {
  color: var(--ui-tpr-muted);
}
.ui-tpr[data-tone="waiting"] {
  color: var(--ui-tpr-waiting);
}
.ui-tpr[data-tone="paused"] {
  color: var(--ui-tpr-paused);
}
.ui-tpr[data-tone="done"] {
  color: var(--ui-tpr-done);
}
.ui-tpr__track {
  stroke: currentColor;
  stroke-width: 1.3;
}
.ui-tpr[data-tone="planning"] .ui-tpr__track {
  stroke-dasharray: 1.6 2;
}
.ui-tpr__value {
  stroke: currentColor;
  stroke-width: 2.8;
  stroke-linecap: butt;
  transition: stroke-dasharray 300ms cubic-bezier(0.22, 1, 0.36, 1);
}
@media (prefers-reduced-motion: reduce) {
  .ui-tpr * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-tpr {
  --ui-tpr-muted: rgba(255, 255, 255, 0.3);
  --ui-tpr-running: #4fc3b4;
  --ui-tpr-waiting: #e6c24d;
  --ui-tpr-paused: #f2a15c;
  --ui-tpr-done: #7dcf9f;
}

.ui-tin {
  --ui-tin-card: #fff;
  --ui-tin-ink: rgba(0, 0, 0, 0.88);
  --ui-tin-text: rgba(0, 0, 0, 0.61);
  --ui-tin-muted: rgba(0, 0, 0, 0.45);
  --ui-tin-faint: rgba(0, 0, 0, 0.27);
  --ui-tin-line: rgba(0, 0, 0, 0.06);
  --ui-tin-fill: rgba(0, 0, 0, 0.02);
  --ui-tin-focus: #0060e2;
  --ui-tin-blue: #0190fe;
  --ui-tin-orange: #f28a2e;
  --ui-tin-shadow: 0 0 0 0.5px var(--ui-tin-line), 0 1px 2px rgba(0, 0, 0, 0.025);
  height: 100%;
  width: 100%;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  padding: 18px 18px 16px;
  font:
    13px/20px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-tin-ink);
  container: ui-tin / inline-size;
  -webkit-font-smoothing: antialiased;
  outline: none;
}
.ui-tin,
.ui-tin *,
.ui-tin *::before,
.ui-tin *::after {
  box-sizing: border-box;
}
.ui-tin button {
  font: inherit;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
}
.ui-tin button:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-tin button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-tin button:focus-visible {
  outline: 2px solid var(--ui-tin-focus);
  outline-offset: -2px;
}
.ui-tin__body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}
.ui-tin__goal {
  margin: 0;
  white-space: pre-line;
  overflow-wrap: anywhere;
  color: var(--ui-tin-text);
}
.ui-tin__needs {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  margin: 0 -10px;
  padding: 8px 8px 8px 10px;
  border-radius: 10px;
  background: var(--ui-tin-card);
  box-shadow: var(--ui-tin-shadow);
}
.ui-tin__needs-text {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}
.ui-tin__needs-text > div {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ui-tin__badge {
  font-size: 11px;
  line-height: 18px;
  font-weight: 500;
  padding: 0 6px;
  border-radius: 4px;
  white-space: nowrap;
  background: rgba(255, 156, 0, 0.16);
  color: #cc4e00;
}
.ui-tin__waiting {
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-tin-muted);
  font-variant-numeric: tabular-nums;
}
.ui-tin__question {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: anywhere;
  line-height: 20px;
}
.ui-tin__decide {
  height: 28px;
  padding: 0 10px;
  border-radius: 6px;
  background: var(--ui-tin-ink) !important;
  color: var(--ui-tin-card) !important;
  font-weight: 500 !important;
  flex: none;
}
.ui-tin__props {
  display: grid;
  gap: 2px;
  margin: 0;
}
.ui-tin__props > div {
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  align-items: center;
  min-height: 28px;
}
.ui-tin__props dt {
  font-size: 12px;
  color: var(--ui-tin-muted);
}
.ui-tin__props dd {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  margin: 0;
}
.ui-tin__props dd > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-tin__props small {
  font-size: 12px;
  color: var(--ui-tin-faint);
  font-variant-numeric: tabular-nums;
}
.ui-tin__section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ui-tin__section h3 {
  display: flex;
  gap: 6px;
  margin: 0;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: var(--ui-tin-muted);
}
.ui-tin__section h3 > span {
  font-weight: 400;
  color: var(--ui-tin-faint);
  font-variant-numeric: tabular-nums;
}
.ui-tin__steps {
  display: grid;
  margin: 0 -10px;
  padding: 6px 10px;
  list-style: none;
  border-radius: 10px;
  background: var(--ui-tin-fill);
}
.ui-tin__steps li {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 28px;
}
.ui-tin__steps li:not(:last-child):after {
  content: "";
  position: absolute;
  top: 20px;
  bottom: -6px;
  left: 7px;
  width: 1px;
  background: var(--ui-tin-line);
}
.ui-tin__step-mark {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  flex: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1.2px var(--ui-tin-line);
  background: var(--ui-tin-card);
  color: var(--ui-tin-card);
}
.ui-tin__steps li[data-state="done"] .ui-tin__step-mark {
  background: var(--ui-tin-blue);
  box-shadow: none;
}
.ui-tin__steps li[data-state="you"] .ui-tin__step-mark {
  background: color-mix(in srgb, var(--ui-tin-orange) 18%, var(--ui-tin-card));
  box-shadow: inset 0 0 0 1.5px var(--ui-tin-orange);
}
.ui-tin__steps li[data-state="now"] .ui-tin__step-mark {
  background: color-mix(in srgb, var(--ui-tin-blue) 18%, var(--ui-tin-card));
  box-shadow: inset 0 0 0 1.5px var(--ui-tin-blue);
}
.ui-tin__step-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-tin__steps li:is([data-state="done"], [data-state="later"]) .ui-tin__step-label {
  color: var(--ui-tin-muted);
}
.ui-tin__step-ask {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  margin-left: auto;
  padding: 0;
  border-radius: 3px;
  background: rgba(255, 156, 0, 0.16) !important;
  color: #cc4e00 !important;
}
.ui-tin__history {
  display: grid;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--ui-tin-text);
}
.ui-tin__history li {
  position: relative;
  padding-left: 16px;
  overflow-wrap: anywhere;
}
.ui-tin__history li:before {
  content: "";
  position: absolute;
  top: 8px;
  left: 5px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--ui-tin-faint);
}
.ui-tin__history li:first-child {
  color: var(--ui-tin-ink);
}
.ui-tin__files {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.ui-tin__files > button {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  max-width: 100%;
  height: 26px;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 12px;
  background: var(--ui-tin-fill);
}
.ui-tin__files > button > span:first-child {
  display: flex;
  color: #2989df;
}
.ui-tin__files > button > span[data-kind="table"] {
  color: #44ad76;
}
.ui-tin__files > button > span[data-kind="code"] {
  color: #ed9540;
}
.ui-tin__files > button > span[data-kind="folder"] {
  color: #e8b000;
}
.ui-tin__files > button > span:last-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-tin__decided {
  display: grid;
  gap: 0;
  margin: 0 -10px;
  padding: 2px 10px;
  list-style: none;
  border-radius: 10px;
  background: var(--ui-tin-card);
  box-shadow: var(--ui-tin-shadow);
}
.ui-tin__decided li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}
.ui-tin__decided li + li {
  border-top: 0.5px solid var(--ui-tin-line);
}
.ui-tin__decided li > svg {
  color: #5fc88a;
  flex: none;
}
.ui-tin__decided li > span {
  display: grid;
  min-width: 0;
}
.ui-tin__decided strong {
  font-weight: 400;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-tin__decided small {
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-tin-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-tin footer {
  display: flex;
  justify-content: flex-end;
  min-height: 28px;
  margin: 0 -4px 0 -8px;
}
.ui-tin footer > button {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 12px;
  color: var(--ui-tin-faint);
}
.ui-tin footer > button:hover {
  background: var(--ui-tin-fill);
  color: var(--ui-tin-text);
}
.ui-tin footer > button svg {
  rotate: -90deg;
}
.ui-tin__empty {
  min-height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--ui-tin-muted);
}
.ui-tin__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
@container ui-tin (max-width:320px) {
  .ui-tin__props > div {
    grid-template-columns: 60px minmax(0, 1fr);
  }
  .ui-tin__needs {
    gap: 6px;
  }
  .ui-tin__waiting {
    font-size: 11px;
  }
}
@media (pointer: coarse) {
  .ui-tin button {
    min-height: 36px;
  }
  .ui-tin__steps li {
    min-height: 32px;
  }
  .ui-tin__step-ask {
    min-width: 32px;
  }
  .ui-tin__files > button {
    height: 32px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-tin,
  .ui-tin * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-tin {
  --ui-tin-card: #1c1c1e;
  --ui-tin-ink: rgba(255, 255, 255, 0.9);
  --ui-tin-text: rgba(255, 255, 255, 0.62);
  --ui-tin-muted: rgba(255, 255, 255, 0.46);
  --ui-tin-faint: rgba(255, 255, 255, 0.3);
  --ui-tin-line: rgba(255, 255, 255, 0.08);
  --ui-tin-fill: rgba(255, 255, 255, 0.025);
  --ui-tin-focus: #4d8dff;
  --ui-tin-blue: #4fb0fe;
  --ui-tin-orange: #f2a15c;
}
:where(.dark, [data-theme="dark"]) .ui-tin__badge,
:where(.dark, [data-theme="dark"]) .ui-tin__step-ask {
  background: rgba(251, 106, 0, 0.15) !important;
  color: #ffa057 !important;
}
.ui-tpr {
  --ui-tpr-muted: #b5b5b5;
}
.ui-tin {
  --ui-tin-ink: #171717;
  --ui-tin-text: #404040;
  --ui-tin-muted: #737373;
  --ui-tin-faint: #b5b5b5;
  --ui-tin-line: #e5e5e5;
  --ui-tin-fill: #fafafa;
  --ui-tin-focus: #2f6bff;
  font-size: 14px;
}
.ui-tin__needs,
.ui-tin__decided {
  border: 1px solid var(--ui-tin-line);
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
.ui-tin__decide {
  height: 32px;
  background: linear-gradient(#323137, #201e25) !important;
  color: #fff !important;
  box-shadow:
    0 0 0 1px #0d0d0d,
    inset 0 1px rgba(255, 255, 255, 0.12);
}
:where(.dark, [data-theme="dark"]) .ui-tin {
  --ui-tin-card: #232326;
  --ui-tin-ink: #ededed;
  --ui-tin-text: #c4c4c4;
  --ui-tin-muted: #8f8f8f;
  --ui-tin-faint: #6b6b70;
  --ui-tin-line: rgba(255, 255, 255, 0.1);
  --ui-tin-fill: #2a2a2d;
  --ui-tin-focus: #6b95ff;
}

`;
