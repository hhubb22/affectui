"use client";

import { type ReactNode } from "react";

/*
 * task-details (Classic) – a self-contained React 19 component.
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
  | "pause"
  | "repeat"
  | "calendar"
  | "shield"
  | "chart"
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
  | "unpin"
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
  pause: (
    <>
      <rect x="7" y="5" width="3.5" height="14" rx="1" />
      <rect x="13.5" y="5" width="3.5" height="14" rx="1" />
    </>
  ),
  repeat: (
    <>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M8 2v4M16 2v4M3 10h18" />
    </>
  ),
  shield: <path d="M12 3 5 6v6c0 4.5 3 7.8 7 9 4-1.2 7-4.5 7-9V6Z" />,
  chart: (
    <>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
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
  pin: (
    <g strokeWidth="1.9">
      <path d="M3 21L8 16" />
      <path d="M13.2585 18.8714C9.51516 18.0215 5.97844 14.4848 5.12853 10.7415C4.99399 10.1489 4.92672 9.85266 5.12161 9.37197C5.3165 8.89129 5.55457 8.74255 6.03071 8.44509C7.10705 7.77265 8.27254 7.55888 9.48209 7.66586C11.1793 7.81598 12.0279 7.89104 12.4512 7.67048C12.8746 7.44991 13.1622 6.93417 13.7376 5.90269L14.4664 4.59604C14.9465 3.73528 15.1866 3.3049 15.7513 3.10202C16.316 2.89913 16.6558 3.02199 17.3355 3.26771C18.9249 3.84236 20.1576 5.07505 20.7323 6.66449C20.978 7.34417 21.1009 7.68401 20.898 8.2487C20.6951 8.8134 20.2647 9.05346 19.4039 9.53358L18.0672 10.2792C17.0376 10.8534 16.5229 11.1406 16.3024 11.568C16.0819 11.9955 16.162 12.8256 16.3221 14.4859C16.4399 15.7068 16.2369 16.88 15.5555 17.9697C15.2577 18.4458 15.1088 18.6839 14.6283 18.8786C14.1477 19.0733 13.8513 19.006 13.2585 18.8714Z" />
    </g>
  ),
  unpin: (
    <g strokeWidth="1.9">
      <path d="M7.5 8C6.95863 8.1281 6.49932 8.14239 5.99268 8.45891C5.07234 9.03388 4.85108 9.71674 5.08821 10.7612C5.94028 14.5139 9.48599 18.0596 13.2388 18.9117C14.2834 19.1489 14.9661 18.928 15.5416 18.0077C15.8411 17.5288 15.8716 17.0081 16 16.5" />
      <path d="M12 7.79915C12.1776 7.77794 12.3182 7.74034 12.4295 7.68235C13.3997 7.17686 13.9291 5.53361 14.4498 4.60009C14.9311 3.73715 15.1718 3.30567 15.7379 3.10227C16.3041 2.89888 16.6448 3.02205 17.3262 3.26839C18.9197 3.8445 20.1555 5.08032 20.7316 6.6738C20.9779 7.35521 21.1011 7.69591 20.8977 8.26204C20.6943 8.82817 20.2628 9.06884 19.3999 9.55018C18.4608 10.074 16.7954 10.6108 16.2905 11.5898C16.2345 11.6983 16.1978 11.8327 16.1769 12" />
      <path d="M3 21L8 16" />
      <path d="M3 3L21 21" />
    </g>
  ),
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

export type ThreadTask = {
  id: string;
  title: string;
  status: string;
  steps?: { done: number; total: number };
  done?: boolean;
  tone?: "active" | "waiting" | "done" | "error";
};
const defaultThreadTaskCardLabels = {
  open: "Open",
  steps: (done: number, total: number) => `${done} of ${total} steps`,
  openTask: (title: string, status: string, steps: string) => `Open ${title} – ${status}${steps ? `, ${steps}` : ""}`,
};
export type ThreadTaskCardLabels = typeof defaultThreadTaskCardLabels;
export type ThreadTaskCardProps = {
  task: ThreadTask;
  onOpen?: (id: string) => void;
  labels?: Partial<ThreadTaskCardLabels>;
  className?: string;
};

/** A compact task mention; opening it keeps the conversation in place. */
export function ThreadTaskCard({ task, onOpen, labels: labelsProp, className }: ThreadTaskCardProps) {
  const labels = { ...defaultThreadTaskCardLabels, ...labelsProp };
  const tone = task.done
    ? "done"
    : ["active", "waiting", "done", "error"].includes(task.tone ?? "")
      ? task.tone
      : "waiting";
  const total = Math.max(0, safeNumber(task.steps?.total, 0));
  const done = clamp(safeNumber(task.steps?.done, 0), 0, total);
  return (
    <div className={["ui-tk", className].filter(Boolean).join(" ")} data-tone={tone}>
      <style href="ui-task-details" precedence="default">
        {css}
      </style>
      <span className="ui-tk__mark" aria-hidden="true">
        {tone === "done" ? (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" />
            <circle cx="8" cy="8" r="4.5" fill="currentColor" />
          </svg>
        ) : tone === "error" ? (
          <Icon name="warning" size={14} />
        ) : (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" />
            <path d="M8 3v5l-2.5 4.3A5 5 0 0 0 8 3Z" fill="currentColor" />
          </svg>
        )}
      </span>
      <span className="ui-tk__text">
        <strong dir="auto" title={task.title}>
          {task.title}
        </strong>
        <small dir="auto" title={task.status}>
          {task.status}
        </small>
      </span>
      {task.steps && (
        <span className="ui-tk__count" aria-label={labels.steps(done, total)}>
          {done}/{total}
        </span>
      )}
      <button
        type="button"
        disabled={!onOpen}
        onClick={() => onOpen?.(task.id)}
        aria-label={labels.openTask(task.title, task.status, task.steps ? labels.steps(done, total) : "")}
      >
        {labels.open}
      </button>
    </div>
  );
}

export type ThreadTaskDetail = {
  goal?: string;
  project?: string;
  started?: string;
  steps?: { label: string; done?: boolean }[];
  history?: string[];
  artifacts?: string[];
  decided?: { question: string; answer: string; at?: number }[];
};
export type TaskDetailsProps = {
  task: ThreadTask;
  detail?: ThreadTaskDetail;
  decision?: { id: string; question: string };
  onDecide?: (id: string) => void;
  onOpenFile?: (name: string) => void;
  onShow?: (id: string) => void;
  className?: string;
};

/** The task tab in the work area: status, steps, history, artifacts and earlier decisions. */
export function TaskDetails({
  task,
  detail = {},
  decision,
  onDecide,
  onOpenFile,
  onShow,
  className,
}: TaskDetailsProps) {
  return (
    <section className={["ui-td", className].filter(Boolean).join(" ")} aria-label={task.title}>
      <style href="ui-task-details" precedence="default">
        {css}
      </style>
      <h2 className="ui-td__sr">{task.title}</h2>
      {detail.goal && (
        <p className="ui-td__goal" dir="auto">
          {detail.goal}
        </p>
      )}
      <dl className="ui-td__meta">
        <div>
          <dt>Status</dt>
          <dd>
            <span data-done={task.done || undefined}>
              <Icon name={task.done ? "check" : "play"} size={14} />
            </span>
            {task.status}
            {task.steps && (
              <small>
                {task.steps.done}/{task.steps.total}
              </small>
            )}
          </dd>
        </div>
        {detail.project && (
          <div>
            <dt>Project</dt>
            <dd>{detail.project}</dd>
          </div>
        )}
        {detail.started && (
          <div>
            <dt>Started</dt>
            <dd>{detail.started}</dd>
          </div>
        )}
      </dl>
      {decision && (
        <button type="button" className="ui-td__waiting" onClick={() => onDecide?.(decision.id)}>
          <span>Needs you</span>
          {decision.question}
          <Icon name="arrow" size={13} />
        </button>
      )}
      {detail.steps && detail.steps.length > 0 && (
        <section className="ui-td__section">
          <h3>Steps</h3>
          <ol className="ui-td__steps">
            {detail.steps.map((step, index) => (
              <li
                key={`${step.label}-${index}`}
                data-done={step.done || undefined}
                data-active={(!step.done && detail.steps?.findIndex((item) => !item.done) === index) || undefined}
              >
                <span aria-hidden="true">{step.done && <Icon name="check" size={10} />}</span>
                <span dir="auto">{step.label}</span>
                <span className="ui-td__sr">
                  {step.done
                    ? ", done"
                    : detail.steps?.findIndex((item) => !item.done) === index
                      ? ", in progress"
                      : ""}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}
      {detail.history && detail.history.length > 0 && (
        <section className="ui-td__section">
          <h3>What happened so far</h3>
          <ul className="ui-td__history">
            {detail.history.map((line, index) => (
              <li key={index} dir="auto">
                {line}
              </li>
            ))}
          </ul>
        </section>
      )}
      {detail.artifacts && detail.artifacts.length > 0 && (
        <section className="ui-td__section">
          <h3>Artifacts</h3>
          <div className="ui-td__files">
            {detail.artifacts.map((name) => (
              <button type="button" key={name} onClick={() => onOpenFile?.(name)}>
                <Icon name="document" size={13} />
                {name}
              </button>
            ))}
          </div>
        </section>
      )}
      {detail.decided && detail.decided.length > 0 && (
        <section className="ui-td__section">
          <h3>Decided</h3>
          {detail.decided.map((item, index) => (
            <div className="ui-td__answer" key={index}>
              <Icon name="check" size={13} />
              <span>
                <strong dir="auto">{item.question}</strong>
                <small dir="auto">{item.answer}</small>
              </span>
            </div>
          ))}
        </section>
      )}
      <footer>
        <button type="button" disabled={!onShow} onClick={() => onShow?.(task.id)}>
          Show in Tasks
          <Icon name="chevron" size={12} />
        </button>
      </footer>
    </section>
  );
}

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-tk {
  --ui-tk-card: #fff;
  --ui-tk-ink: rgba(0, 0, 0, 0.88);
  --ui-tk-muted: rgba(0, 0, 0, 0.45);
  --ui-tk-faint: rgba(0, 0, 0, 0.27);
  --ui-tk-line: rgba(0, 0, 0, 0.06);
  --ui-tk-fill: rgba(0, 0, 0, 0.025);
  --ui-tk-focus: rgba(0, 96, 226, 0.35);
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 52px;
  padding: 8px 12px;
  background: var(--ui-tk-card);
  border-radius: 12px;
  box-shadow: 0 0 0 0.5px var(--ui-tk-line);
  font:
    13px/1.45 "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-tk-ink);
  container-type: inline-size;
  -webkit-font-smoothing: antialiased;
  animation: ui-tk-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ui-tk,
.ui-tk *,
.ui-tk *::before,
.ui-tk *::after {
  box-sizing: border-box;
}
.ui-tk__mark {
  display: flex;
  flex: none;
  color: #e8a20c;
}
.ui-tk[data-tone="active"] .ui-tk__mark {
  color: #ff7c3c;
}
.ui-tk[data-tone="done"] .ui-tk__mark {
  color: #0095ff;
}
.ui-tk[data-tone="error"] .ui-tk__mark {
  color: #e5484d;
}
.ui-tk__text {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
}
.ui-tk__text strong {
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
}
.ui-tk__text small {
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-tk-muted);
}
.ui-tk__text > * {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-tk__count {
  font-size: 12px;
  color: var(--ui-tk-faint);
  font-variant-numeric: tabular-nums;
}
.ui-tk button {
  font: inherit;
  font-size: 12px;
  background: none;
  border: 0;
  border-radius: 6px;
  color: var(--ui-tk-muted);
  height: 28px;
  padding: 0 6px;
  cursor: pointer;
  flex: none;
}
.ui-tk button:hover {
  background: var(--ui-tk-fill);
  color: var(--ui-tk-ink);
}
.ui-tk button:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-tk button:focus-visible {
  outline: 2px solid var(--ui-tk-focus);
  outline-offset: 2px;
}
.ui-tk button:active:not(:disabled) {
  transform: scale(0.97);
}
@keyframes ui-tk-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
@container (max-width:320px) {
  .ui-tk__text small {
    font-size: 11px;
  }
  .ui-tk__count {
    display: none;
  }
}
@media (pointer: coarse) {
  .ui-tk {
    min-height: 56px;
  }
  .ui-tk button {
    height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-tk,
  .ui-tk * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-tk {
  --ui-tk-card: #1c1c1e;
  --ui-tk-ink: rgba(255, 255, 255, 0.9);
  --ui-tk-muted: rgba(255, 255, 255, 0.46);
  --ui-tk-faint: rgba(255, 255, 255, 0.3);
  --ui-tk-line: rgba(255, 255, 255, 0.08);
  --ui-tk-fill: rgba(255, 255, 255, 0.04);
  --ui-tk-focus: rgba(77, 141, 255, 0.5);
}

.ui-td {
  --ui-td-card: #fff;
  --ui-td-ink: rgba(0, 0, 0, 0.88);
  --ui-td-text: rgba(0, 0, 0, 0.61);
  --ui-td-muted: rgba(0, 0, 0, 0.45);
  --ui-td-faint: rgba(0, 0, 0, 0.27);
  --ui-td-line: rgba(0, 0, 0, 0.06);
  --ui-td-fill: rgba(0, 0, 0, 0.025);
  --ui-td-focus: rgba(0, 96, 226, 0.35);
  height: 100%;
  overflow: auto;
  padding: 18px;
  color: var(--ui-td-ink);
  font:
    13px/1.5 "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  container: ui-td / inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-td,
.ui-td *,
.ui-td *::before,
.ui-td *::after {
  box-sizing: border-box;
}
.ui-td button {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-td button:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-td button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-td button:focus-visible {
  outline: 2px solid var(--ui-td-focus);
  outline-offset: 2px;
}
.ui-td__goal {
  color: var(--ui-td-text);
  font-size: 13px;
  line-height: 1.6;
  margin: 0 0 22px;
  overflow-wrap: anywhere;
}
.ui-td__meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0 0 22px;
  font-size: 12px;
}
.ui-td__meta > div {
  display: flex;
  gap: 16px;
}
.ui-td__meta dt {
  width: 60px;
  flex: none;
  color: var(--ui-td-muted);
}
.ui-td__meta dd {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  min-width: 0;
}
.ui-td__meta dd > span {
  display: flex;
  color: #e8a20c;
}
.ui-td__meta dd > span[data-done] {
  color: #1a9a52;
}
.ui-td__meta small {
  font-size: 12px;
  color: var(--ui-td-faint);
  font-variant-numeric: tabular-nums;
}
.ui-td__section {
  margin: 0 0 22px;
}
.ui-td__section h3 {
  font-size: 12px;
  font-weight: 400;
  color: var(--ui-td-muted);
  margin: 0 0 8px;
}
.ui-td__steps {
  padding: 10px 0;
  margin: 0;
  list-style: none;
  background: var(--ui-td-fill);
  border-radius: 10px;
}
.ui-td__steps li {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  padding: 5px 0;
  color: var(--ui-td-muted);
  font-size: 12px;
  min-height: 28px;
}
.ui-td__steps li > span:first-child {
  display: grid;
  place-items: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid var(--ui-td-line);
  color: #fff;
  flex: none;
}
.ui-td__steps li[data-done] > span:first-child {
  background: #0095ff;
  border-color: #0095ff;
}
.ui-td__steps li[data-active] {
  color: var(--ui-td-ink);
}
.ui-td__steps li[data-active] > span:first-child {
  border-color: #0095ff;
  background: rgba(0, 149, 255, 0.13);
}
.ui-td__history {
  margin: 0;
  padding-left: 15px;
  font-size: 12px;
  line-height: 1.8;
  color: var(--ui-td-text);
}
.ui-td__history li::marker {
  color: var(--ui-td-faint);
}
.ui-td__history li:first-child {
  color: var(--ui-td-ink);
}
.ui-td__answer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 11px;
  box-shadow: 0 0 0 0.5px var(--ui-td-line);
  margin-bottom: 6px;
}
.ui-td__answer > svg {
  color: #1a9a52;
}
.ui-td__answer > span {
  display: flex;
  min-width: 0;
  flex-direction: column;
}
.ui-td__answer strong {
  font-size: 12px;
  font-weight: 400;
  overflow-wrap: anywhere;
}
.ui-td__answer small {
  font-size: 11px;
  color: var(--ui-td-muted);
}
.ui-td__files {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.ui-td__files button {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  padding: 5px 7px;
  background: var(--ui-td-fill);
  border-radius: 5px;
}
.ui-td > footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 0;
}
.ui-td > footer button {
  display: flex;
  align-items: center;
  gap: 5px;
  min-height: 28px;
  font-size: 12px;
  color: var(--ui-td-muted);
}
.ui-td > footer button svg {
  rotate: -90deg;
}
.ui-td__waiting {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px;
  text-align: left;
  background: var(--ui-td-fill) !important;
  border-radius: 9px;
  margin-bottom: 18px;
  font-size: 12px !important;
}
.ui-td__waiting > span {
  font-size: 10px;
  color: #b47a06;
  white-space: nowrap;
}
.ui-td__waiting > svg {
  margin-left: auto;
}
.ui-td__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  clip-path: inset(50%);
  overflow: hidden;
  white-space: nowrap;
}
@container ui-td (max-width:320px) {
  .ui-td__meta > div {
    gap: 8px;
  }
  .ui-td__meta dt {
    width: 52px;
  }
}
@media (pointer: coarse) {
  .ui-td button {
    min-height: 36px;
  }
  .ui-td__steps li {
    min-height: 34px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-td,
  .ui-td * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-td {
  --ui-td-card: #1c1c1e;
  --ui-td-ink: rgba(255, 255, 255, 0.9);
  --ui-td-text: rgba(255, 255, 255, 0.62);
  --ui-td-muted: rgba(255, 255, 255, 0.46);
  --ui-td-faint: rgba(255, 255, 255, 0.3);
  --ui-td-line: rgba(255, 255, 255, 0.08);
  --ui-td-fill: rgba(255, 255, 255, 0.04);
  --ui-td-focus: rgba(77, 141, 255, 0.5);
}
.ui-tk {
  --ui-tk-ink: #171717;
  --ui-tk-muted: #737373;
  --ui-tk-faint: #b5b5b5;
  --ui-tk-line: #e5e5e5;
  --ui-tk-fill: #f5f5f5;
  --ui-tk-focus: #2f6bff;
  min-height: 56px;
  border: 1px solid var(--ui-tk-line);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  border-radius: 14px;
}
.ui-tk button {
  height: 32px;
}
.ui-td {
  --ui-td-ink: #171717;
  --ui-td-text: #404040;
  --ui-td-muted: #737373;
  --ui-td-faint: #b5b5b5;
  --ui-td-line: #e5e5e5;
  --ui-td-fill: #f5f5f5;
  --ui-td-focus: #2f6bff;
  font-size: 14px;
}
:where(.dark, [data-theme="dark"]) .ui-tk {
  --ui-tk-card: #232326;
  --ui-tk-ink: #ededed;
  --ui-tk-muted: #8f8f8f;
  --ui-tk-line: rgba(255, 255, 255, 0.1);
  --ui-tk-fill: #2a2a2d;
}
:where(.dark, [data-theme="dark"]) .ui-td {
  --ui-td-card: #232326;
  --ui-td-ink: #ededed;
  --ui-td-text: #c4c4c4;
  --ui-td-muted: #8f8f8f;
  --ui-td-line: rgba(255, 255, 255, 0.1);
  --ui-td-fill: #2a2a2d;
}

`;
